
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Package, Car, Gamepad2, Menu, X, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home className="w-5 h-5 mr-2" /> },
    { name: "Roommate Finder", path: "/roommate-finder", icon: <Home className="w-5 h-5 mr-2" /> },
    { name: "Common Cart", path: "/common-cart", icon: <ShoppingCart className="w-5 h-5 mr-2" /> },
    { name: "Item Renting", path: "/item-renting", icon: <Package className="w-5 h-5 mr-2" /> },
    { name: "Auto Sharing", path: "/auto-sharing", icon: <Car className="w-5 h-5 mr-2" /> },
    { name: "Game Partner Finder", path: "/game-partner", icon: <Gamepad2 className="w-5 h-5 mr-2" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 font-bold text-2xl text-primary">
            HIVE
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="hidden md:flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container mx-auto px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} HIVE Community Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
