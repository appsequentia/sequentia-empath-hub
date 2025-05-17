
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
          <Link to="/about" className="text-white/90 hover:text-lavender-300 transition-colors">
            Como funciona
          </Link>
          <Link to="/specialists" className="text-white/90 hover:text-lavender-300 transition-colors">
            Especialistas
          </Link>
          <Link to="/therapies" className="text-white/90 hover:text-lavender-300 transition-colors">
            Terapias
          </Link>
          <Link to="/login-client">
            <Button variant="outline" className="bg-transparent border-lavender-400 text-white hover:bg-lavender-500/20">
              Entrar
            </Button>
          </Link>
          <Link to="/signup-client">
            <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium">
              Começar agora
            </Button>
          </Link>
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
                  to="/about" 
                  className="text-lg p-2 hover:bg-lavender-400/20 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Como funciona
                </Link>
                <Link 
                  to="/specialists" 
                  className="text-lg p-2 hover:bg-lavender-400/20 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Especialistas
                </Link>
                <Link 
                  to="/therapies" 
                  className="text-lg p-2 hover:bg-lavender-400/20 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Terapias
                </Link>
                <Link 
                  to="/login-client" 
                  className="text-lg p-2 hover:bg-lavender-400/20 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar como cliente
                </Link>
                <Link 
                  to="/login-therapist" 
                  className="text-lg p-2 hover:bg-lavender-400/20 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar como terapeuta
                </Link>
                <Link 
                  to="/signup-client" 
                  className="text-lg p-2 bg-lavender-400 text-teal-900 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastre-se como cliente
                </Link>
                <Link 
                  to="/signup-therapist" 
                  className="text-lg p-2 border border-lavender-400 rounded-md mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastre-se como terapeuta
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
