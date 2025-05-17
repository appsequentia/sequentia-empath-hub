
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const ClientProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";
  const email = user?.email || "";

  return (
    <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white text-xl">Meu Perfil</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="border-red-400/50 text-white hover:bg-red-500/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-white/60 text-sm">Nome completo:</span>
            <p className="text-white font-medium">{firstName} {lastName}</p>
          </div>
          <div>
            <span className="text-white/60 text-sm">E-mail:</span>
            <p className="text-white font-medium">{email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientProfile;
