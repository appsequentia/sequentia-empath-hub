
import React from "react";
import { UserRound, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMenuProps {
  user: any;
  signOut: () => Promise<void>;
}

export function UserMenu({ user, signOut }: UserMenuProps) {
  return (
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
  );
}
