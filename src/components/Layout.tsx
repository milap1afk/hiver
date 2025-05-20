
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, ShoppingCart, Package, Car, Gamepad2, Menu, X, LogOut, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { isDarkMode, toggleTheme, initializeTheme } from "@/utils/themeUtils";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(isDarkMode());

  // Initialize theme on component mount
  useEffect(() => {
    initializeTheme();
    setDarkMode(isDarkMode());
  }, []);

  const handleToggleDarkMode = () => {
    const newMode = toggleTheme();
    setDarkMode(newMode);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
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
      <header className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={() => handleNavigation("/")} 
            className="flex items-center space-x-2 font-bold text-2xl text-primary cursor-pointer"
          >
            HIVE
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <div
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer border",
                  location.pathname === item.path 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "text-foreground hover:bg-accent hover:text-accent-foreground border-transparent"
                )}
              >
                {item.icon}
                {item.name}
              </div>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleDarkMode}
              className="rounded-full border-2"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="hidden md:flex items-center border-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
            
            {/* Auth Button for non-authenticated users */}
            {!user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
                className="hidden md:flex items-center border-2"
              >
                Login / Register
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden border-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t dark:border-gray-600 border-gray-300">
            <div className="container mx-auto px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <div 
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer border",
                    location.pathname === item.path 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "text-foreground hover:bg-accent hover:text-accent-foreground border-transparent"
                  )}
                >
                  {item.icon}
                  {item.name}
                </div>
              ))}
              
              {/* Dark Mode Toggle in Mobile Menu */}
              <div 
                onClick={handleToggleDarkMode}
                className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium cursor-pointer border border-gray-300 dark:border-gray-600"
              >
                <div className="flex items-center">
                  {darkMode ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </div>
              </div>
              
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center border-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="w-full flex items-center justify-center border-2"
                >
                  Login / Register
                </Button>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-700 dark:text-gray-300">
          <p>© {new Date().getFullYear()} HIVE Community Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
