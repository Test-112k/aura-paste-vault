
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Code, Users, Clock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import AdBanner from "@/components/AdBanner";

const Index = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("text");
  const [expiration, setExpiration] = useState("1day");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

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
    
    // Simulate paste creation - replace with actual Firebase integration
    setTimeout(() => {
      const pasteId = Math.random().toString(36).substring(2, 8);
      toast({
        title: "Paste Created!",
        description: `Your paste is available at: aurapaste.com/${pasteId}`,
      });
      setIsCreating(false);
      
      // Reset form
      setContent("");
      setTitle("");
      setPassword("");
    }, 1000);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const lineCount = content.split('\n').length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Header Ad Banner */}
        <AdBanner position="header" />
        
        <div className="container mx-auto px-4 py-8">
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
            <Card className="text-center hover-scale">
              <CardHeader>
                <Clock className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle>Flexible Expiration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Set custom expiration times from 10 minutes to never expire</p>
              </CardContent>
            </Card>

            <Card className="text-center hover-scale">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle>Password Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Secure your pastes with optional password protection</p>
              </CardContent>
            </Card>

            <Card className="text-center hover-scale">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle>User Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage all your pastes in one convenient location</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Paste Creation Form */}
          <Card className="max-w-4xl mx-auto">
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

              {/* Options Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Expiration */}
                <div className="space-y-2">
                  <Label htmlFor="expiration">Expiration</Label>
                  <Select value={expiration} onValueChange={setExpiration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10min">10 Minutes</SelectItem>
                      <SelectItem value="1hour">1 Hour</SelectItem>
                      <SelectItem value="1day">1 Day</SelectItem>
                      <SelectItem value="1week">1 Week</SelectItem>
                      <SelectItem value="1month">1 Month</SelectItem>
                      <SelectItem value="never">Never Expire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Visibility */}
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Password Protection */}
              <div className="space-y-2">
                <Label htmlFor="password">Password Protection (Optional)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password to protect this paste..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Create Button */}
              <Button 
                onClick={handleCreatePaste}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
              >
                {isCreating ? "Creating Paste..." : "Create Paste"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Ad */}
        <AdBanner position="footer" />
      </div>
    </div>
  );
};

export default Index;
