
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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

interface Therapist {
  id: string;
  name: string;
  email: string;
  is_approved: boolean;
  created_at: string;
  profile_status: 'complete' | 'incomplete';
}

export function TherapistList() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTherapists();
  }, []);

  async function fetchTherapists() {
    try {
      setLoading(true);
      
      // Fetch therapist profiles
      const { data: therapistProfiles, error: profileError } = await supabase
        .from('therapist_profiles')
        .select('*');
      
      if (profileError) throw profileError;

      // Fetch users to get emails
      const { data: profiles, error: usersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');
      
      if (usersError) throw usersError;
      
      // Combine data
      const combinedData = therapistProfiles.map((profile) => {
        const userProfile = profiles.find(u => u.id === profile.id);
        
        return {
          id: profile.id,
          name: profile.name || `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`,
          email: '', // We don't have direct access to emails through RLS
          is_approved: profile.is_approved,
          created_at: profile.created_at,
          // Determine if profile is complete based on required fields
          profile_status: profile.name && profile.bio && profile.specialty ? 'complete' : 'incomplete'
        };
      });
      
      setTherapists(combinedData);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast({
        title: "Erro ao buscar terapeutas",
        description: "Não foi possível carregar a lista de terapeutas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function toggleApproval(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('therapist_profiles')
        .update({ is_approved: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setTherapists(prevTherapists => 
        prevTherapists.map(therapist => 
          therapist.id === id 
            ? { ...therapist, is_approved: !currentStatus } 
            : therapist
        )
      );
      
      toast({
        title: `Terapeuta ${!currentStatus ? 'aprovado' : 'desaprovado'}`,
        description: `O status do terapeuta foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error toggling approval:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do terapeuta.",
        variant: "destructive",
      });
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
            <TableHead className="text-white">Status do Perfil</TableHead>
            <TableHead className="text-white">Data de Cadastro</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {therapists.length > 0 ? (
            therapists.map((therapist) => (
              <TableRow key={therapist.id} className="hover:bg-teal-700/30">
                <TableCell className="font-medium text-white">
                  {therapist.name || "Nome não definido"}
                </TableCell>
                <TableCell>
                  <Badge variant={therapist.profile_status === 'complete' ? 'default' : 'outline'}>
                    {therapist.profile_status === 'complete' ? 'Completo' : 'Incompleto'}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/70">
                  {new Date(therapist.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Badge variant={therapist.is_approved ? 'default' : 'destructive'}>
                    {therapist.is_approved ? 'Aprovado' : 'Não aprovado'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={therapist.is_approved ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleApproval(therapist.id, therapist.is_approved)}
                  >
                    {therapist.is_approved ? (
                      <>
                        <X className="mr-1 h-4 w-4" /> Desaprovar
                      </>
                    ) : (
                      <>
                        <Check className="mr-1 h-4 w-4" /> Aprovar
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-white/70 py-8">
                Nenhum terapeuta cadastrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
