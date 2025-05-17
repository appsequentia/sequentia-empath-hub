
import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

// Mock data - in a real app, this would come from your backend
const initialPendingTherapists = [
  {
    id: "1",
    name: "Maria Silva",
    specialties: ["Terapia Cognitivo Comportamental", "Ansiedade"],
    registrationNumber: "CRP 01/12345",
    dateApplied: "2025-05-14T10:30:00"
  },
  {
    id: "2",
    name: "João Santos",
    specialties: ["Psicanálise", "Depressão"],
    registrationNumber: "CRP 02/54321",
    dateApplied: "2025-05-15T09:15:00"
  },
  {
    id: "3",
    name: "Ana Oliveira",
    specialties: ["Terapia Sistêmica", "Relacionamentos"],
    registrationNumber: "CRP 05/67890",
    dateApplied: "2025-05-16T14:20:00"
  }
];

export default function PendingTherapists() {
  const [pendingTherapists, setPendingTherapists] = useState(initialPendingTherapists);
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleApprove = (id: string) => {
    // In a real app, you would call your API to approve the therapist
    const therapist = pendingTherapists.find(t => t.id === id);
    setPendingTherapists(pendingTherapists.filter(t => t.id !== id));
    
    toast({
      title: "Terapeuta aprovado",
      description: `${therapist?.name} foi aprovado com sucesso.`,
    });
  };
  
  const handleReject = (id: string) => {
    // In a real app, you would call your API to reject the therapist
    const therapist = pendingTherapists.find(t => t.id === id);
    setPendingTherapists(pendingTherapists.filter(t => t.id !== id));
    
    toast({
      title: "Terapeuta rejeitado",
      description: `${therapist?.name} foi rejeitado.`,
      variant: "destructive",
    });
  };
  
  if (pendingTherapists.length === 0) {
    return <p className="text-white text-center py-6">Não há terapeutas pendentes de aprovação.</p>;
  }
  
  return (
    <div className="overflow-auto">
      <Table className="min-w-full">
        <TableHeader className="bg-teal-700/30">
          <TableRow>
            <TableHead className="text-white font-medium">Nome</TableHead>
            <TableHead className="text-white font-medium">Especialidades</TableHead>
            <TableHead className="text-white font-medium">Registro</TableHead>
            <TableHead className="text-white font-medium">Data</TableHead>
            <TableHead className="text-white font-medium">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingTherapists.map(therapist => (
            <TableRow key={therapist.id} className="border-b border-teal-700/30">
              <TableCell className="text-white">{therapist.name}</TableCell>
              <TableCell className="text-white">
                <div className="flex flex-wrap gap-1">
                  {therapist.specialties.map(specialty => (
                    <span key={specialty} className="text-xs bg-lavender-500/20 text-lavender-300 px-2 py-1 rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-white">{therapist.registrationNumber}</TableCell>
              <TableCell className="text-white">{formatDate(therapist.dateApplied)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(therapist.id)}
                    className="bg-transparent hover:bg-green-600/20 border border-green-500/30 text-green-400"
                  >
                    <Check className="h-4 w-4 mr-1" /> Aprovar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(therapist.id)}
                    className="bg-transparent hover:bg-red-600/20 border border-red-500/30 text-red-400"
                  >
                    <X className="h-4 w-4 mr-1" /> Rejeitar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
