
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BookOpen, Calendar, PenSquare, School, Trash2, Plus } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description: string | null;
  created_at: string;
}

interface TherapistEducationProps {
  therapistId: string | undefined;
}

const educationFormSchema = z.object({
  degree: z.string().min(3, "Informe o título da formação"),
  institution: z.string().min(3, "Informe a instituição"),
  year: z.string().min(4, "Informe o ano de conclusão"),
  description: z.string().optional(),
});

type EducationFormValues = z.infer<typeof educationFormSchema>;

const TherapistEducation: React.FC<TherapistEducationProps> = ({ therapistId }) => {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  const { toast } = useToast();

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      degree: "",
      institution: "",
      year: "",
      description: "",
    },
  });

  const fetchEducationData = async () => {
    if (!therapistId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('therapist_education')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('year', { ascending: false });

      if (error) {
        console.error("Erro ao buscar formação acadêmica:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar sua formação acadêmica.",
          variant: "destructive",
        });
      } else {
        setEducationList(data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEducationData();
  }, [therapistId]);

  const openAddDialog = () => {
    setCurrentEducation(null);
    form.reset({
      degree: "",
      institution: "",
      year: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (education: Education) => {
    setCurrentEducation(education);
    form.reset({
      degree: education.degree,
      institution: education.institution,
      year: education.year,
      description: education.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta formação acadêmica?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('therapist_education')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Erro ao excluir formação:", error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir a formação acadêmica.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Formação acadêmica excluída com sucesso.",
        });
        fetchEducationData();
      }
    } catch (error) {
      console.error("Erro ao excluir formação:", error);
    }
  };

  const onSubmit = async (values: EducationFormValues) => {
    if (!therapistId) return;

    try {
      if (currentEducation) {
        // Atualizar formação existente
        const { error } = await supabase
          .from('therapist_education')
          .update({
            degree: values.degree,
            institution: values.institution,
            year: values.year,
            description: values.description || null,
          })
          .eq('id', currentEducation.id);

        if (error) {
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Formação acadêmica atualizada com sucesso.",
        });
      } else {
        // Adicionar nova formação
        const { error } = await supabase
          .from('therapist_education')
          .insert({
            therapist_id: therapistId,
            degree: values.degree,
            institution: values.institution,
            year: values.year,
            description: values.description || null,
          });

        if (error) {
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Formação acadêmica adicionada com sucesso.",
        });
      }

      setIsDialogOpen(false);
      fetchEducationData();
    } catch (error) {
      console.error("Erro ao salvar formação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a formação acadêmica.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-lavender-400" />
          Formação Acadêmica
        </h2>
        <Button 
          onClick={openAddDialog} 
          className="bg-lavender-500 hover:bg-lavender-600 text-teal-900"
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center text-white/70 py-4">Carregando...</p>
      ) : educationList.length === 0 ? (
        <Card className="bg-teal-700/30 border-lavender-400/20 p-6">
          <div className="text-center text-white/70">
            <School className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Nenhuma formação acadêmica cadastrada.</p>
            <p className="text-sm mt-1">Adicione sua formação para aumentar sua credibilidade.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {educationList.map((education) => (
            <Card 
              key={education.id} 
              className="bg-teal-700/30 border-lavender-400/20 p-4"
            >
              <div className="flex justify-between mb-1">
                <h3 className="font-medium text-white">{education.degree}</h3>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-lavender-300 hover:text-white"
                    onClick={() => openEditDialog(education)}
                  >
                    <PenSquare className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteEducation(education.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center text-white/80 text-sm mb-1">
                <School className="h-3.5 w-3.5 mr-1.5 text-lavender-300" />
                {education.institution}
              </div>
              <div className="flex items-center text-white/70 text-xs mb-2">
                <Calendar className="h-3 w-3 mr-1.5 text-lavender-300/80" />
                {education.year}
              </div>
              {education.description && (
                <p className="text-white/80 text-sm mt-2 border-t border-lavender-400/10 pt-2">
                  {education.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para adicionar/editar formação */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-teal-800 border-lavender-400/20 text-white">
          <DialogHeader>
            <DialogTitle>
              {currentEducation ? "Editar Formação" : "Adicionar Formação"}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {currentEducation 
                ? "Atualize os detalhes da sua formação acadêmica"
                : "Adicione uma nova formação acadêmica ao seu perfil"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Título / Curso</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Mestrado em Psicologia"
                        className="bg-teal-700/40 border-lavender-400/30 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Instituição</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Universidade de São Paulo"
                        className="bg-teal-700/40 border-lavender-400/30 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Ano de Conclusão</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: 2020"
                        className="bg-teal-700/40 border-lavender-400/30 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva detalhes sobre sua formação"
                        className="bg-teal-700/40 border-lavender-400/30 text-white min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="flex gap-3 pt-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-lavender-500 hover:bg-lavender-600 text-teal-900"
                >
                  {currentEducation ? "Salvar Alterações" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TherapistEducation;
