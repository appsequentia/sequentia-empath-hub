
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { PencilIcon, X, ImageIcon, DollarSign, BadgeIcon, FileText, Briefcase, TagIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface EditProfileDialogProps {
  therapistId: string;
  therapistData: {
    name: string;
    title: string;
    bio: string;
    approach: string;
    price: number;
    specializations: string[];
    avatar: string;
  };
  canEdit: boolean;
  inline?: boolean;
}

const profileSchema = z.object({
  name: z.string().min(3, "Nome precisa ter no mínimo 3 caracteres"),
  title: z.string().min(3, "Título profissional é obrigatório"),
  bio: z.string().min(10, "Biografia precisa ter no mínimo 10 caracteres"),
  approach: z.string().optional(),
  price: z.coerce.number().min(1, "Valor por sessão precisa ser maior que zero"),
  avatar: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
  specializations: z.string()
});

const EditProfileDialog = ({ therapistId, therapistData, canEdit, inline = false }: EditProfileDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: therapistData.name,
      title: therapistData.title || "",
      bio: therapistData.bio || "",
      approach: therapistData.approach || "",
      price: therapistData.price,
      avatar: therapistData.avatar || "",
      specializations: therapistData.specializations.join(", ")
    }
  });

  useEffect(() => {
    form.reset({
      name: therapistData.name,
      title: therapistData.title || "",
      bio: therapistData.bio || "",
      approach: therapistData.approach || "",
      price: therapistData.price,
      avatar: therapistData.avatar || "",
      specializations: therapistData.specializations.join(", ")
    });
  }, [therapistData, form]);

  if (!canEdit) return null;

  const handleSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    
    try {
      // Atualizar perfil do terapeuta
      const { error: profileError } = await supabase
        .from('therapist_profiles')
        .update({
          name: values.name,
          title: values.title,
          bio: values.bio,
          approach: values.approach || "",
          price: values.price,
          avatar: values.avatar || ""
        })
        .eq('id', therapistId);
      
      if (profileError) throw profileError;
      
      // Atualizar especialidades
      const specializations = values.specializations
        .split(",")
        .map(spec => spec.trim())
        .filter(spec => spec);

      // Excluir especialidades atuais
      await supabase
        .from('therapist_specializations')
        .delete()
        .eq('therapist_id', therapistId);

      // Adicionar novas especialidades
      if (specializations.length > 0) {
        const { error: specError } = await supabase
          .from('therapist_specializations')
          .insert(
            specializations.map(spec => ({
              therapist_id: therapistId,
              specialization: spec
            }))
          );
          
        if (specError) throw specError;
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas alterações foram salvas com sucesso.",
        duration: 3000,
      });
      
      // Fechar o diálogo após salvar com sucesso
      if (!inline) {
        setIsOpen(false);
      }
      
      // Recarregar a página para refletir as alterações
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao salvar suas alterações.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSpecialization = () => {
    if (!newSpecialization.trim()) return;
    
    const currentSpecs = form.getValues("specializations");
    const specsArray = currentSpecs ? 
      currentSpecs.split(',').map(s => s.trim()).filter(s => s) : 
      [];
    
    if (!specsArray.includes(newSpecialization.trim())) {
      const updatedSpecs = [...specsArray, newSpecialization.trim()].join(', ');
      form.setValue("specializations", updatedSpecs);
    }
    
    setNewSpecialization("");
  };

  const handleRemoveSpecialization = (specToRemove: string) => {
    const currentSpecs = form.getValues("specializations").split(',')
      .map(s => s.trim()).filter(s => s);
    const updatedSpecs = currentSpecs.filter(spec => spec !== specToRemove).join(', ');
    form.setValue("specializations", updatedSpecs);
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white flex items-center">
                <BadgeIcon className="h-4 w-4 mr-2 text-lavender-300" />
                Nome Completo
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-teal-700/40 border-lavender-400/20 text-white"
                  placeholder="Seu nome completo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-lavender-300" />
                Título Profissional
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-teal-700/40 border-lavender-400/20 text-white"
                  placeholder="Ex: Psicólogo, Psicoterapeuta, Psicanalista"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <Label className="text-white flex items-center">
            <TagIcon className="h-4 w-4 mr-2 text-lavender-300" />
            Especialidades
          </Label>
          
          <div className="flex gap-2">
            <Input
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              className="bg-teal-700/40 border-lavender-400/20 text-white flex-1"
              placeholder="Ex: Ansiedade, Depressão, TDAH"
            />
            <Button 
              type="button" 
              onClick={handleAddSpecialization}
              variant="secondary"
              className="bg-lavender-400/20 hover:bg-lavender-400/30 text-white"
            >
              Adicionar
            </Button>
          </div>
          
          <FormField
            control={form.control}
            name="specializations"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="hidden"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Visualização de especialidades como badges */}
          {form.watch("specializations") && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch("specializations").split(',').map((spec, index) => {
                const trimmedSpec = spec.trim();
                if (!trimmedSpec) return null;
                
                return (
                  <Badge 
                    key={index}
                    className="bg-lavender-400/20 text-white hover:bg-lavender-400/30 pl-3 pr-2 py-1.5 flex items-center gap-1"
                  >
                    {trimmedSpec}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSpecialization(trimmedSpec)}
                      className="text-white/70 hover:text-white ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white flex items-center">
                <FileText className="h-4 w-4 mr-2 text-lavender-300" />
                Biografia
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="bg-teal-700/40 border-lavender-400/20 text-white min-h-32"
                  placeholder="Descreva sua experiência profissional e abordagem"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="approach"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white flex items-center">
                <FileText className="h-4 w-4 mr-2 text-lavender-300" />
                Abordagem Terapêutica
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="bg-teal-700/40 border-lavender-400/20 text-white min-h-24"
                  placeholder="Descreva sua abordagem terapêutica e métodos"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-lavender-300" />
                Valor da Sessão (R$)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="bg-teal-700/40 border-lavender-400/20 text-white"
                  min="0"
                  step="5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white flex items-center">
                <ImageIcon className="h-4 w-4 mr-2 text-lavender-300" />
                URL da Imagem de Perfil
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-teal-700/40 border-lavender-400/20 text-white"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </FormControl>
              <FormMessage />
              {field.value && (
                <div className="mt-2 flex justify-center">
                  <img 
                    src={field.value} 
                    alt="Prévia da imagem" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-lavender-400"
                    onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/150"}
                  />
                </div>
              )}
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          {!inline && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
              disabled={isLoading}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit"
            className="bg-lavender-400 hover:bg-lavender-500 text-teal-900"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (inline) {
    return formContent;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 flex items-center gap-2">
          <PencilIcon className="h-4 w-4" />
          Editar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-teal-800 border-lavender-400/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar Perfil</DialogTitle>
          <DialogDescription className="text-white/70">
            Atualize as informações do seu perfil profissional
          </DialogDescription>
        </DialogHeader>

        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
