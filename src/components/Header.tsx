
import { useState } from "react";
import { Logo } from "./header/Logo";
import { DesktopNavigation } from "./header/DesktopNavigation";
import { MobileNavigation } from "./header/MobileNavigation";
import { AuthButtons } from "./header/AuthButtons";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const isLoggedIn = !!user;
  
  return (
    <header className="w-full py-4 px-6 md:px-10 bg-teal-800/50 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <div className="ml-10">
            <DesktopNavigation />
          </div>
        </div>
        
        <div className="hidden md:block">
          {!isLoggedIn && <AuthButtons />}
        </div>
        
        <MobileNavigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
    </header>
  );
}
