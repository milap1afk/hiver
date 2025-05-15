
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import RoommateFinder from "./pages/RoommateFinder";
import CommonCart from "./pages/CommonCart";
import ItemRenting from "./pages/ItemRenting";
import AutoSharing from "./pages/AutoSharing";
import GamePartnerFinder from "./pages/GamePartnerFinder";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/roommate-finder" element={
                <ProtectedRoute>
                  <RoommateFinder />
                </ProtectedRoute>
              } />
              <Route path="/common-cart" element={
                <ProtectedRoute>
                  <CommonCart />
                </ProtectedRoute>
              } />
              <Route path="/item-renting" element={
                <ProtectedRoute>
                  <ItemRenting />
                </ProtectedRoute>
              } />
              <Route path="/auto-sharing" element={
                <ProtectedRoute>
                  <AutoSharing />
                </ProtectedRoute>
              } />
              <Route path="/game-partner" element={
                <ProtectedRoute>
                  <GamePartnerFinder />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
