
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Users, Clock, Copy, Download, ExternalLink, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createPaste, downloadPaste } from "@/lib/pasteService";
import Navigation from "@/components/Navigation";
import AdBanner from "@/components/AdBanner";

const Index = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("text");
  const [visibility, setVisibility] = useState("public");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createdPaste, setCreatedPaste] = useState<any>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add("dark");
  }, []);

  const handleCreatePaste = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your paste.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const paste = await createPaste({
        title: title || "Untitled Paste",
        content,
        language,
        authorName: currentUser?.displayName || currentUser?.email || "Anonymous",
        visibility: visibility as "public" | "private"
      }, currentUser);

      setCreatedPaste(paste);
      
      toast({
        title: "Paste Created!",
        description: "Your paste has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create paste. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyUrl = async () => {
    if (createdPaste?.url) {
      try {
        await navigator.clipboard.writeText(createdPaste.url);
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

  const copyContent = async () => {
    if (createdPaste?.content) {
      try {
        await navigator.clipboard.writeText(createdPaste.content);
        toast({
          title: "Copied!",
          description: "Paste content copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy content.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = () => {
    if (createdPaste) {
      downloadPaste(createdPaste);
    }
  };

  const resetForm = () => {
    setCreatedPaste(null);
    setContent("");
    setTitle("");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const lineCount = content.split('\n').length;

  return (
    <div className="min-h-screen dark bg-background text-foreground transition-colors">
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Header Ad Banner */}
        <AdBanner position="header" />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Hero Section */}
              <div className="text-center mb-12 animate-fade-in">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 mr-3">
                    <Code className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Aura Paste
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Share your code, text, and ideas with the world. Fast, secure, and beautiful paste sharing for developers and creators.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="text-center hover-scale animate-scale-in">
                  <CardHeader>
                    <Code className="h-12 w-12 mx-auto text-primary mb-2" />
                    <CardTitle>Syntax Highlighting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Beautiful syntax highlighting for all major programming languages</p>
                  </CardContent>
                </Card>

                <Card className="text-center hover-scale animate-scale-in">
                  <CardHeader>
                    <Clock className="h-12 w-12 mx-auto text-primary mb-2" />
                    <CardTitle>Quick & Fast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Create and share pastes instantly with our lightning-fast platform</p>
                  </CardContent>
                </Card>

                <Card className="text-center hover-scale animate-scale-in">
                  <CardHeader>
                    <Users className="h-12 w-12 mx-auto text-primary mb-2" />
                    <CardTitle>User Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Manage all your pastes in one convenient location</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Paste Creation Form or Preview */}
              {!createdPaste ? (
                <Card className="max-w-4xl mx-auto animate-fade-in pulse-glow">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">Create New Paste</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title (Optional)</Label>
                      <Input
                        id="title"
                        placeholder="Give your paste a title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Plain Text</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="xml">XML</SelectItem>
                          <SelectItem value="sql">SQL</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="php">PHP</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                          <SelectItem value="c">C</SelectItem>
                          <SelectItem value="ruby">Ruby</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="rust">Rust</SelectItem>
                          <SelectItem value="swift">Swift</SelectItem>
                          <SelectItem value="kotlin">Kotlin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Visibility Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select value={visibility} onValueChange={setVisibility}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Content Textarea */}
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Paste your content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[300px] font-mono"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Lines: {lineCount}</span>
                        <span>Words: {wordCount}</span>
                        <span>Characters: {content.length}</span>
                      </div>
                    </div>

                    {/* Create Button */}
                    <Button 
                      onClick={handleCreatePaste}
                      disabled={isCreating}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 text-lg hover-scale"
                    >
                      {isCreating ? "Creating Paste..." : "Create Paste"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* Paste Preview */
                <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
                  <Card className="pulse-glow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-green-600">✓ Paste Created Successfully!</CardTitle>
                        <Button variant="outline" onClick={resetForm} className="hover-scale">
                          Create Another
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid lg:grid-cols-4 gap-6">
                        {/* Preview Content */}
                        <div className="lg:col-span-3">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">{createdPaste.title}</h3>
                              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                                {createdPaste.language}
                              </span>
                            </div>
                            
                            <div className="relative">
                              <textarea
                                readOnly
                                value={createdPaste.content}
                                className="w-full h-64 p-4 font-mono text-sm bg-muted/50 border rounded-lg resize-none"
                              />
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" onClick={copyContent} className="hover-scale">
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Text
                              </Button>
                              
                              <Button variant="outline" size="sm" onClick={copyUrl} className="hover-scale">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Copy URL
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => navigate(`/paste/${createdPaste.id}`)}
                                className="hover-scale"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Raw
                              </Button>
                              
                              <Button variant="outline" size="sm" onClick={handleDownload} className="hover-scale">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Paste Info */}
                        <div className="lg:col-span-1">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Paste Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">ID:</span>
                                <br />
                                <code className="text-xs bg-muted px-1 rounded">{createdPaste.id}</code>
                              </div>
                              
                              <div>
                                <span className="text-muted-foreground">Author:</span>
                                <br />
                                {createdPaste.authorName}
                              </div>
                              
                              <div>
                                <span className="text-muted-foreground">Visibility:</span>
                                <br />
                                <span className="capitalize">{createdPaste.visibility}</span>
                              </div>
                              
                              <div>
                                <span className="text-muted-foreground">Created:</span>
                                <br />
                                {new Date(createdPaste.createdAt).toLocaleString()}
                              </div>
                              
                              <div>
                                <span className="text-muted-foreground">URL:</span>
                                <br />
                                <code className="text-xs bg-muted px-1 rounded break-all">
                                  {createdPaste.url}
                                </code>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            
            {/* Sidebar with Ad */}
            <div className="lg:col-span-1">
              <AdBanner position="sidebar" />
            </div>
          </div>
        </div>

        {/* Footer Ad */}
        <AdBanner position="footer" />
      </div>
    </div>
  );
};

export default Index;
