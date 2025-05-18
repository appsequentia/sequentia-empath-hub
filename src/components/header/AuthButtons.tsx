
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function AuthButtons() {
  return <div className="flex items-center space-x-2">
      <Link to="/login-cliente">
        <Button variant="outline" className="bg-transparent border-lavender-400 text-white hover:bg-lavender-500/20 mx-1">
          Entrar
        </Button>
      </Link>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium mx-1">
            Criar Conta
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-teal-800 border-lavender-400/30 p-0 w-48">
          <div className="flex flex-col">
            <Link to="/register-cliente" className="text-white hover:bg-lavender-400/20 px-4 py-3 text-sm transition-colors">
              Criar conta como cliente
            </Link>
            <Link to="/register-terapeuta" className="text-white hover:bg-lavender-400/20 px-4 py-3 text-sm transition-colors">
              Criar conta como terapeuta
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>;
}
