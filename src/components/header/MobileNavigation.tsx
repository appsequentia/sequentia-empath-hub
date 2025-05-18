
import React from "react";
import { Link } from "react-router-dom";
import { Menu, UserRound, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MobileNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export function MobileNavigation({ isMenuOpen, setIsMenuOpen }: MobileNavigationProps) {
  const { user, signOut } = useAuth();
  const isLoggedIn = !!user;
  
  return (
    <div className="md:hidden">
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-teal-800 text-white border-lavender-400">
          <nav className="flex flex-col space-y-4 mt-8">
            <Link 
              to="/sobre" 
              className="text-lg p-2 hover:bg-lavender-400/20 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Como funciona
            </Link>
            <Link 
              to="/especialistas" 
              className="text-lg p-2 hover:bg-lavender-400/20 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Especialistas
            </Link>
            <Link 
              to="/terapias" 
              className="text-lg p-2 hover:bg-lavender-400/20 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Terapias
            </Link>
            <Link 
              to="/contato" 
              className="text-lg p-2 hover:bg-lavender-400/20 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>

            {isLoggedIn ? (
              <>
                <div className="text-lg p-2 border-t border-lavender-400/30 pt-4 mt-2 flex items-center">
                  <Avatar className="h-8 w-8 bg-lavender-400/20 border border-lavender-300/30 mr-3">
                    <AvatarFallback className="text-white bg-transparent">
                      <UserRound className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm overflow-hidden text-ellipsis">{user?.email}</span>
                </div>
                <button 
                  className="text-lg p-2 bg-red-500/20 text-white rounded-md flex items-center"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login-cliente" 
                  className="text-lg p-2 hover:bg-lavender-400/20 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar como cliente
                </Link>
                <Link 
                  to="/login-terapeuta" 
                  className="text-lg p-2 hover:bg-lavender-400/20 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar como terapeuta
                </Link>
                <Link 
                  to="/register-cliente" 
                  className="text-lg p-2 bg-lavender-400 text-teal-900 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastre-se como cliente
                </Link>
                <Link 
                  to="/register-terapeuta" 
                  className="text-lg p-2 border border-lavender-400 rounded-md mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastre-se como terapeuta
                </Link>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
