
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Briefcase, Calendar, PenSquare, Trash2, Plus, Building } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

interface Experience {
  id: string;
  position: string;
  company: string;
  start_date: string;
  end_date: string | null;
  current: boolean | null;
  description: string | null;
  created_at: string;
}

interface TherapistExperienceProps {
  therapistId: string | undefined;
}

const experienceFormSchema = z.object({
  position: z.string().min(3, "Informe o cargo"),
  company: z.string().min(3, "Informe a empresa ou organização"),
  start_date: z.string().min(4, "Informe a data de início"),
  end_date: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

const TherapistExperience: React.FC<TherapistExperienceProps> = ({ therapistId }) => {
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const { toast } = useToast();

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      position: "",
      company: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
    },
  });

  const watchCurrent = form.watch("current");

  useEffect(() => {
    if (watchCurrent) {
      form.setValue("end_date", "");
    }
  }, [watchCurrent, form]);

  const fetchExperienceData = async () => {
    if (!therapistId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('therapist_experience')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('start_date', { ascending: false });

      if (error) {
        console.error("Erro ao buscar experiência profissional:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar sua experiência profissional.",
          variant: "destructive",
        });
      } else {
        setExperienceList(data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperienceData();
  }, [therapistId]);

  const openAddDialog = () => {
    setCurrentExperience(null);
    form.reset({
      position: "",
      company: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (experience: Experience) => {
    setCurrentExperience(experience);
    form.reset({
      position: experience.position,
      company: experience.company,
      start_date: experience.start_date,
      end_date: experience.end_date || "",
      current: experience.current || false,
      description: experience.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta experiência profissional?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('therapist_experience')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Erro ao excluir experiência:", error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir a experiência profissional.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Experiência profissional excluída com sucesso.",
        });
        fetchExperienceData();
      }
    } catch (error) {
      console.error("Erro ao excluir experiência:", error);
    }
  };

  const onSubmit = async (values: ExperienceFormValues) => {
    if (!therapistId) return;

    try {
      const dataToSave = {
        position: values.position,
        company: values.company,
        start_date: values.start_date,
        end_date: values.current ? null : values.end_date || null,
        current: values.current || false,
        description: values.description || null,
      };

      if (currentExperience) {
        // Atualizar experiência existente
        const { error } = await supabase
          .from('therapist_experience')
          .update(dataToSave)
          .eq('id', currentExperience.id);

        if (error) {
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Experiência profissional atualizada com sucesso.",
        });
      } else {
        // Adicionar nova experiência
        const { error } = await supabase
          .from('therapist_experience')
          .insert({
            therapist_id: therapistId,
            ...dataToSave
          });

        if (error) {
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Experiência profissional adicionada com sucesso.",
        });
      }

      setIsDialogOpen(false);
      fetchExperienceData();
    } catch (error) {
      console.error("Erro ao salvar experiência:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a experiência profissional.",
        variant: "destructive",
      });
    }
  };

  const formatDatePeriod = (startDate: string, endDate: string | null, current: boolean | null) => {
    let formattedStart = startDate;
    let formattedEnd = endDate || "";
    
    if (current) {
      return `${formattedStart} - Atual`;
    } else if (endDate) {
      return `${formattedStart} - ${formattedEnd}`;
    }
    
    return formattedStart;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-lavender-400" />
          Experiência Profissional
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
      ) : experienceList.length === 0 ? (
        <Card className="bg-teal-700/30 border-lavender-400/20 p-6">
          <div className="text-center text-white/70">
            <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Nenhuma experiência profissional cadastrada.</p>
            <p className="text-sm mt-1">Adicione sua experiência para mostrar sua trajetória profissional.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {experienceList.map((experience) => (
            <Card 
              key={experience.id} 
              className="bg-teal-700/30 border-lavender-400/20 p-4"
            >
              <div className="flex justify-between mb-1">
                <h3 className="font-medium text-white">{experience.position}</h3>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-lavender-300 hover:text-white"
                    onClick={() => openEditDialog(experience)}
                  >
                    <PenSquare className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteExperience(experience.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center text-white/80 text-sm mb-1">
                <Building className="h-3.5 w-3.5 mr-1.5 text-lavender-300" />
                {experience.company}
              </div>
              <div className="flex items-center text-white/70 text-xs mb-2">
                <Calendar className="h-3 w-3 mr-1.5 text-lavender-300/80" />
                {formatDatePeriod(experience.start_date, experience.end_date, experience.current)}
                {experience.current && (
                  <span className="ml-2 bg-lavender-500/20 text-white px-1.5 py-0.5 text-xs rounded">
                    Atual
                  </span>
                )}
              </div>
              {experience.description && (
                <p className="text-white/80 text-sm mt-2 border-t border-lavender-400/10 pt-2">
                  {experience.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para adicionar/editar experiência */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-teal-800 border-lavender-400/20 text-white">
          <DialogHeader>
            <DialogTitle>
              {currentExperience ? "Editar Experiência" : "Adicionar Experiência"}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {currentExperience 
                ? "Atualize os detalhes da sua experiência profissional"
                : "Adicione uma nova experiência profissional ao seu perfil"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Cargo / Função</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Psicólogo Clínico"
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
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Empresa / Organização</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Clínica Bem-Estar"
                        className="bg-teal-700/40 border-lavender-400/30 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Data de Início</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 2018"
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
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Data de Término</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 2020"
                          className="bg-teal-700/40 border-lavender-400/30 text-white"
                          disabled={form.watch("current")}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="current"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-lavender-400 data-[state=checked]:border-lavender-400"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-white">Trabalho atual</FormLabel>
                    </div>
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
                        placeholder="Descreva suas responsabilidades e conquistas"
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
                  {currentExperience ? "Salvar Alterações" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TherapistExperience;
