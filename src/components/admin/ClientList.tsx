
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

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  role: string;
}

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      setLoading(true);
      
      // Fetch users with role 'cliente'
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'cliente');
      
      if (error) throw error;
      
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro ao buscar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Carregando...</div>;
  }

  return (
    <div className="rounded-md border border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-teal-700/30">
            <TableHead className="text-white">Nome</TableHead>
            <TableHead className="text-white">Data de Cadastro</TableHead>
            <TableHead className="text-white">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow key={client.id} className="hover:bg-teal-700/30">
                <TableCell className="font-medium text-white">
                  {`${client.first_name || ''} ${client.last_name || ''}`}
                </TableCell>
                <TableCell className="text-white/70">
                  {client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant="default">Ativo</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-white/70 py-8">
                Nenhum cliente cadastrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
