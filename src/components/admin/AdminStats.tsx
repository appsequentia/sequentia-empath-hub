
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Calendar } from "lucide-react";

// Mock data - in a real app, this would come from your backend
const stats = {
  totalTherapists: 28,
  totalClients: 142,
  completedSessions: 357
};

export default function AdminStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Therapists */}
      <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-white">Total de Terapeutas</CardTitle>
          <Users className="h-5 w-5 text-lavender-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-lavender-300">{stats.totalTherapists}</div>
          <p className="text-sm text-white/50 mt-1">Profissionais cadastrados</p>
        </CardContent>
      </Card>

      {/* Total Clients */}
      <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-white">Total de Clientes</CardTitle>
          <UserCheck className="h-5 w-5 text-lavender-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-lavender-300">{stats.totalClients}</div>
          <p className="text-sm text-white/50 mt-1">Usuários ativos</p>
        </CardContent>
      </Card>

      {/* Completed Sessions */}
      <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-white">Sessões Realizadas</CardTitle>
          <Calendar className="h-5 w-5 text-lavender-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-lavender-300">{stats.completedSessions}</div>
          <p className="text-sm text-white/50 mt-1">Consultas concluídas</p>
        </CardContent>
      </Card>
    </div>
  );
}
