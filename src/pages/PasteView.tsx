
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Eye, Calendar, Globe, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import AdBanner from "@/components/AdBanner";

const PasteView = () => {
  const { id } = useParams();
  const [paste, setPaste] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching paste data - replace with actual Firebase call
    const fetchPaste = async () => {
      setLoading(true);
      
      // Mock paste data
      setTimeout(() => {
        const mockPaste = {
          id: id,
          title: "Sample Code Snippet",
          content: `function greetUser(name) {
  console.log(\`Hello, \${name}! Welcome to Aura Paste.\`);
  return \`Welcome message sent to \${name}\`;
}

// Usage example
const message = greetUser("Developer");
console.log(message);

// This is a sample paste to demonstrate the viewer
// In a real implementation, this would be fetched from Firebase`,
          language: "javascript",
          visibility: "public",
          createdAt: new Date().toISOString(),
          viewCount: 42,
          author: "Anonymous",
          expiresAt: null,
          isPasswordProtected: false
        };
        
        setPaste(mockPaste);
        setIsPasswordProtected(mockPaste.isPasswordProtected);
        setLoading(false);
      }, 1000);
    };

    if (id) {
      fetchPaste();
    }
  }, [id]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const copyToClipboard = async () => {
    if (paste?.content) {
      try {
        await navigator.clipboard.writeText(paste.content);
        toast({
          title: "Copied!",
          description: "Paste content copied to clipboard.",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const selectAllText = () => {
    const textArea = document.getElementById("paste-content") as HTMLTextAreaElement;
    if (textArea) {
      textArea.select();
      textArea.setSelectionRange(0, 99999); // For mobile devices
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-background text-foreground">
          <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isPasswordProtected && !paste) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-background text-foreground">
          <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Password Protected
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    This paste is password protected. Please enter the password to view it.
                  </p>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button className="w-full">
                    View Paste
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paste) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-background text-foreground">
          <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Paste Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The paste you're looking for doesn't exist or has expired.
              </p>
              <Button>
                Create New Paste
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const wordCount = paste.content.split(/\s+/).filter((word: string) => word.length > 0).length;
  const lineCount = paste.content.split('\n').length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">
                        {paste.title || `Paste ${paste.id}`}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={selectAllText}>
                          Select All
                        </Button>
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <textarea
                        id="paste-content"
                        readOnly
                        value={paste.content}
                        className="w-full h-96 p-4 font-mono text-sm bg-muted/50 border rounded-lg resize-none focus:outline-none"
                      />
                      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur rounded px-2 py-1 text-xs">
                        {paste.language}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span>Lines: {lineCount}</span>
                        <span>Words: {wordCount}</span>
                        <span>Characters: {paste.content.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Paste Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Paste Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{paste.viewCount} views</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Created {new Date(paste.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{paste.author}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      {paste.visibility === 'public' ? (
                        <Globe className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 mr-2 text-orange-500" />
                      )}
                      <span className="capitalize">{paste.visibility}</span>
                    </div>
                    
                    {paste.expiresAt && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-red-500" />
                        <span>
                          Expires {new Date(paste.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Sidebar Ad */}
                <AdBanner position="sidebar" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Ad */}
        <AdBanner position="footer" />
      </div>
    </div>
  );
};

export default PasteView;
