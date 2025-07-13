import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Eye, 
  User, 
  Calendar,
  ExternalLink,
  Copy,
  Code,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";
import { getRecentPublicPastes, type Paste } from "@/lib/pasteService";
import { useToast } from "@/hooks/use-toast";

const Recent = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [recentPastes, setRecentPastes] = useState<Paste[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add("dark");
    
    // SEO meta tags
    document.title = "Recent Public Pastes - Discover Latest Code Snippets | Aura Paste";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover the latest public code snippets and text pastes shared by the community. Find recent programming examples, tutorials, and more on Aura Paste.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover the latest public code snippets and text pastes shared by the community. Find recent programming examples, tutorials, and more on Aura Paste.';
      document.head.appendChild(meta);
    }

    loadRecentPastes();
  }, []);

  const loadRecentPastes = async () => {
    try {
      setLoading(true);
      const pastes = await getRecentPublicPastes();
      setRecentPastes(pastes);
    } catch (error) {
      console.error('Failed to load recent pastes:', error);
      toast({
        title: "Error",
        description: "Failed to load recent pastes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
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
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Less than an hour ago";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getLanguageIcon = (language: string) => {
    if (language === 'text') return FileText;
    return Code;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Recent Pastes
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover the latest code snippets, tutorials, and ideas shared by our community. Fresh content updated in real-time.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary">{recentPastes.length}</div>
                  <p className="text-sm text-muted-foreground">Recent Pastes</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary">
                    {new Set(recentPastes.map(p => p.language)).size}
                  </div>
                  <p className="text-sm text-muted-foreground">Languages</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary">
                    {recentPastes.reduce((sum, p) => sum + (p.viewCount || 0), 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Pastes List */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading recent pastes...</p>
                </div>
              ) : recentPastes.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Recent Pastes</h3>
                    <p className="text-muted-foreground mb-4">Be the first to share a public paste!</p>
                    <Link to="/">
                      <Button>Create Paste</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                recentPastes.map((paste) => {
                  const LanguageIcon = getLanguageIcon(paste.language);
                  return (
                    <Card key={paste.id} className="hover-scale animate-fade-in">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <LanguageIcon className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">{paste.title}</CardTitle>
                              <Badge variant="secondary">{paste.language}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground space-x-4">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {paste.authorName}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(paste.createdAt)}
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {paste.viewCount || 0} views
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyUrl(paste.url)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Link to={`/paste/${paste.id}`}>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <pre className="text-sm overflow-hidden">
                            <code className="font-mono">
                              {paste.content.length > 200 
                                ? paste.content.substring(0, 200) + '...'
                                : paste.content
                              }
                            </code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Sidebar with Ad */}
          <div className="lg:col-span-1">
            <AdBanner position="sidebar" />
          </div>
        </div>
      </div>

      {/* Footer Ad */}
      <AdBanner position="footer" />
      <Footer />
    </div>
  );
};

export default Recent;