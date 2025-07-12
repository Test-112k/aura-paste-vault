
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Eye, Calendar, Globe, Lock, User, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPaste, downloadPaste, Paste } from "@/lib/pasteService";
import Navigation from "@/components/Navigation";
import AdBanner from "@/components/AdBanner";

const PasteView = () => {
  const { id } = useParams();
  const [paste, setPaste] = useState<Paste | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaste = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const pasteData = await getPaste(id);
        setPaste(pasteData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load paste.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id, toast]);

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

  const copyUrl = async () => {
    if (paste?.url) {
      try {
        await navigator.clipboard.writeText(paste.url);
        toast({
          title: "Copied!",
          description: "Paste URL copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy URL.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = () => {
    if (paste) {
      downloadPaste(paste);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen dark bg-background text-foreground">
        <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="min-h-screen dark bg-background text-foreground">
        <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Paste Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The paste you're looking for doesn't exist or has expired.
            </p>
            <Button onClick={() => window.location.href = '/'} className="hover-scale">
              Create New Paste
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const wordCount = paste.content.split(/\s+/).filter((word: string) => word.length > 0).length;
  const lineCount = paste.content.split('\n').length;

  return (
    <div className="min-h-screen dark bg-background text-foreground">
      <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto animate-fade-in">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="pulse-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">
                      {paste.title || `Paste ${paste.id}`}
                    </CardTitle>
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={selectAllText} className="hover-scale">
                        Select All
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-scale">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Text
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyUrl} className="hover-scale">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Copy URL
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload} className="hover-scale">
                        <Download className="h-4 w-4 mr-2" />
                        Download
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
              <Card className="animate-scale-in">
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
                    <span>{paste.authorName}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    {paste.visibility === 'public' ? (
                      <Globe className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 mr-2 text-orange-500" />
                    )}
                    <span className="capitalize">{paste.visibility}</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground break-all">
                    <span className="font-medium">URL:</span>
                    <br />
                    {paste.url}
                  </div>
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
  );
};

export default PasteView;
