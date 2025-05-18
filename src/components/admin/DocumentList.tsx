
import { useState, useEffect } from "react";
import { FileDown, Check, X } from "lucide-react";
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

interface Document {
  id: string;
  therapist_id: string;
  therapist_name: string;
  document_type: string;
  file_name: string;
  uploaded_at: string;
  is_approved: boolean;
}

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      setLoading(true);
      
      // This is a simplified example. In a real implementation, you would:
      // 1. Query your documents table (which you would need to create)
      // 2. Join with therapist_profiles to get the therapist name
      
      // For now, we'll create some mock data to demonstrate the UI
      const mockDocuments: Document[] = [
        {
          id: '1',
          therapist_id: '123',
          therapist_name: 'João Silva',
          document_type: 'Identidade',
          file_name: 'identidade_joao.pdf',
          uploaded_at: new Date().toISOString(),
          is_approved: false
        },
        {
          id: '2',
          therapist_id: '123',
          therapist_name: 'João Silva',
          document_type: 'Certificação',
          file_name: 'certificado_psicologia_joao.pdf',
          uploaded_at: new Date().toISOString(),
          is_approved: true
        },
        {
          id: '3',
          therapist_id: '456',
          therapist_name: 'Maria Souza',
          document_type: 'Identidade',
          file_name: 'identidade_maria.pdf',
          uploaded_at: new Date().toISOString(),
          is_approved: false
        }
      ];
      
      setDocuments(mockDocuments);
      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erro ao buscar documentos",
        description: "Não foi possível carregar a lista de documentos.",
        variant: "destructive",
      });
    }
  }

  async function toggleApproval(id: string, currentStatus: boolean) {
    try {
      // In a real implementation, you would update your documents table
      
      // Update local state for the demo
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === id 
            ? { ...doc, is_approved: !currentStatus } 
            : doc
        )
      );
      
      toast({
        title: `Documento ${!currentStatus ? 'aprovado' : 'reprovado'}`,
        description: `O status do documento foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error toggling document approval:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do documento.",
        variant: "destructive",
      });
    }
  }

  async function downloadDocument(fileName: string) {
    // In a real implementation, you would download from Supabase Storage
    toast({
      title: "Download iniciado",
      description: `O download do documento ${fileName} foi iniciado.`,
    });
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Carregando...</div>;
  }

  return (
    <div className="rounded-md border border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-teal-700/30">
            <TableHead className="text-white">Terapeuta</TableHead>
            <TableHead className="text-white">Tipo de Documento</TableHead>
            <TableHead className="text-white">Data de Upload</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <TableRow key={doc.id} className="hover:bg-teal-700/30">
                <TableCell className="font-medium text-white">
                  {doc.therapist_name}
                </TableCell>
                <TableCell className="text-white/70">{doc.document_type}</TableCell>
                <TableCell className="text-white/70">
                  {new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Badge variant={doc.is_approved ? "default" : "outline"}>
                    {doc.is_approved ? 'Aprovado' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadDocument(doc.file_name)}
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={doc.is_approved ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleApproval(doc.id, doc.is_approved)}
                  >
                    {doc.is_approved ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-white/70 py-8">
                Nenhum documento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
