
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "./UserMenu";

export function DesktopNavigation() {
  const { user, signOut } = useAuth();
  const isLoggedIn = !!user;
  
  return (
    <nav className="hidden md:flex items-center justify-center flex-1">
      <div className="flex items-center space-x-8">
        <Link to="/sobre" className="text-white/90 hover:text-lavender-300 transition-colors">
          Como funciona
        </Link>
        <Link to="/especialistas" className="text-white/90 hover:text-lavender-300 transition-colors">
          Especialistas
        </Link>
        <Link to="/terapias" className="text-white/90 hover:text-lavender-300 transition-colors">
          Terapias
        </Link>
        <Link to="/contato" className="text-white/90 hover:text-lavender-300 transition-colors">
          Contato
        </Link>
      </div>
      
      {isLoggedIn && <UserMenu user={user} signOut={signOut} />}
    </nav>
  );
}
