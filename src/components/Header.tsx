
import { useState } from "react";
import { Logo } from "./header/Logo";
import { DesktopNavigation } from "./header/DesktopNavigation";
import { MobileNavigation } from "./header/MobileNavigation";
import { AuthButtons } from "./header/AuthButtons";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user
  } = useAuth();
  const isLoggedIn = !!user;
  
  return <header className="w-full py-4 px-6 bg-teal-800/50 backdrop-blur-sm fixed top-0 z-50 md:px-[38px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo on the left */}
        <div className="flex-none">
          <Logo />
        </div>
        
        {/* Navigation in the center */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex flex-col items-center">
            <DesktopNavigation />
            
            {!isLoggedIn && 
              <div className="mt-0">
                <AuthButtons />
              </div>
            }
          </div>
        </div>
        
        {/* Mobile menu on the right */}
        <div className="flex-none">
          <MobileNavigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
      </div>
    </header>;
}
