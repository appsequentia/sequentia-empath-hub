
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, UserRound, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const isLoggedIn = !!user;
  
  return (
    <header className="w-full py-4 px-6 md:px-10 bg-teal-800/50 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">
            <span className="text-lavender-400">Se</span>quentia
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
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
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-9 w-9 bg-lavender-400/20 border border-lavender-300/30 hover:bg-lavender-400/30 transition-colors cursor-pointer">
                      <AvatarFallback className="text-white bg-transparent">
                        <UserRound className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent className="bg-teal-800 border-lavender-400/30 text-white">
                    <p>{user?.email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                variant="outline" 
                className="bg-transparent border-red-400/50 text-white hover:bg-red-500/20 flex items-center"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login-cliente">
                <Button variant="outline" className="bg-transparent border-lavender-400 text-white hover:bg-lavender-500/20">
                  Entrar
                </Button>
              </Link>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium">
                    Criar Conta
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-teal-800 border-lavender-400/30 p-0 w-48">
                  <div className="flex flex-col">
                    <Link 
                      to="/register-cliente" 
                      className="text-white hover:bg-lavender-400/20 px-4 py-3 text-sm transition-colors"
                    >
                      Criar conta como cliente
                    </Link>
                    <Link 
                      to="/register-terapeuta"
                      className="text-white hover:bg-lavender-400/20 px-4 py-3 text-sm transition-colors"
                    >
                      Criar conta como terapeuta
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
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
      </div>
    </header>
  );
}
