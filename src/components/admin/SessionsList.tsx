
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Session {
  id: string;
  therapist_name: string;
  client_name: string;
  service: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  value: number;
}

export function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      setLoading(true);
      
      // This is a simplified example. In a real implementation, you would:
      // 1. Query your appointments/sessions table
      // 2. Join with therapist and client tables to get names
      
      // For now, we'll create some mock data to demonstrate the UI
      const mockSessions: Session[] = [
        {
          id: '1',
          therapist_name: 'João Silva',
          client_name: 'Ana Oliveira',
          service: 'Consulta Individual',
          date: '2023-10-15',
          time: '14:00',
          status: 'completed',
          value: 150
        },
        {
          id: '2',
          therapist_name: 'Maria Souza',
          client_name: 'Pedro Santos',
          service: 'Terapia de Casal',
          date: '2023-10-18',
          time: '10:00',
          status: 'scheduled',
          value: 200
        },
        {
          id: '3',
          therapist_name: 'Carlos Ferreira',
          client_name: 'Júlia Costa',
          service: 'Consulta Individual',
          date: '2023-10-14',
          time: '16:30',
          status: 'cancelled',
          value: 150
        }
      ];
      
      setSessions(mockSessions);
      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Erro ao buscar sessões",
        description: "Não foi possível carregar a lista de sessões.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Carregando...</div>;
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Agendada</Badge>;
      case 'completed':
        return <Badge variant="default">Concluída</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  }

  return (
    <div className="rounded-md border border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-teal-700/30">
            <TableHead className="text-white">Terapeuta</TableHead>
            <TableHead className="text-white">Cliente</TableHead>
            <TableHead className="text-white">Serviço</TableHead>
            <TableHead className="text-white">Data e Hora</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <TableRow key={session.id} className="hover:bg-teal-700/30">
                <TableCell className="font-medium text-white">
                  {session.therapist_name}
                </TableCell>
                <TableCell className="text-white/70">{session.client_name}</TableCell>
                <TableCell className="text-white/70">{session.service}</TableCell>
                <TableCell className="text-white/70">
                  {new Date(session.date).toLocaleDateString('pt-BR')} às {session.time}
                </TableCell>
                <TableCell>
                  {getStatusBadge(session.status)}
                </TableCell>
                <TableCell className="text-right text-white">
                  R$ {session.value.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-white/70 py-8">
                Nenhuma sessão encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
