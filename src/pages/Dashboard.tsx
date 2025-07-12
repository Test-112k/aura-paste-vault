
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Calendar, 
  Globe, 
  Lock, 
  Search, 
  Trash2, 
  Edit, 
  Plus,
  FileText,
  TrendingUp
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import AdBanner from "@/components/AdBanner";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPastes, type Paste } from "@/lib/pasteService";

const Dashboard = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  if (!authLoading && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const fetchUserPastes = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        const userPastes = await getUserPastes(currentUser.uid);
        setPastes(userPastes);
      } catch (error) {
        console.error("Error fetching user pastes:", error);
        setPastes([]);
      }
      setLoading(false);
    };

    fetchUserPastes();
  }, [currentUser]);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  const handleDeletePaste = (pasteId: string) => {
    setPastes(pastes.filter(paste => paste.id !== pasteId));
  };

  const filteredPastes = pastes.filter(paste => 
    paste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paste.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'private':
        return <Lock className="h-4 w-4 text-red-500" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'private':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <Navigation isDarkMode={true} toggleDarkMode={toggleDarkMode} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your pastes and view analytics
            </p>
          </div>
          <Link to="/">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              New Paste
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pastes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pastes.length}</div>
              <p className="text-xs text-muted-foreground">
                All your pastes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pastes.reduce((sum, paste) => sum + paste.viewCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total views across all pastes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Public Pastes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pastes.filter(paste => paste.visibility === 'public').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Publicly visible
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search your pastes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Pastes List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPastes.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pastes found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? "No pastes match your search." : "You haven't created any pastes yet."}
                  </p>
                  <Link to="/">
                    <Button>Create Your First Paste</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPastes.map((paste) => (
                  <Card key={paste.id} className="hover-scale">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">
                              {paste.title || `Paste ${paste.id}`}
                            </h3>
                            <Badge variant="secondary" className={getVisibilityColor(paste.visibility)}>
                              <div className="flex items-center gap-1">
                                {getVisibilityIcon(paste.visibility)}
                                <span className="capitalize">{paste.visibility}</span>
                              </div>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(paste.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {paste.viewCount} views
                            </span>
                            <Badge variant="outline">{paste.language}</Badge>
                          </div>
                          
                          <div className="bg-muted/50 rounded p-3 font-mono text-sm overflow-hidden">
                            <div className="line-clamp-3">
                              {paste.content.substring(0, 200)}
                              {paste.content.length > 200 && "..."}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Created by: {paste.authorName}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Link to={`/paste/${paste.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeletePaste(paste.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdBanner position="sidebar" />
          </div>
        </div>
      </div>

      {/* Footer Ad */}
      <AdBanner position="footer" />
    </div>
  );
};

export default Dashboard;
