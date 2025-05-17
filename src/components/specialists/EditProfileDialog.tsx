
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
import { Label } from "@/components/ui/label";
import { PencilIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface EditProfileDialogProps {
  therapistId: string;
  therapistData: {
    name: string;
    bio: string;
    approach: string;
    price: number;
    specializations: string[];
    avatar: string;
  };
  canEdit: boolean;
}

const EditProfileDialog = ({ therapistId, therapistData, canEdit }: EditProfileDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: therapistData.name,
    bio: therapistData.bio,
    approach: therapistData.approach,
    price: therapistData.price,
    specializations: therapistData.specializations.join(", "),
    avatar: therapistData.avatar
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!canEdit) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Atualizar perfil do terapeuta
      const { error: profileError } = await supabase
        .from('therapist_profiles')
        .update({
          name: formData.name,
          bio: formData.bio,
          approach: formData.approach,
          price: formData.price,
          avatar: formData.avatar
        })
        .eq('id', therapistId);
      
      if (profileError) throw profileError;
      
      // Atualizar especialidades
      const specializations = formData.specializations
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
      
      setIsOpen(false);
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

  const handleAddSpecialization = (newSpec: string) => {
    if (!newSpec.trim()) return;
    
    const currentSpecs = formData.specializations ? 
      formData.specializations.split(',').map(s => s.trim()).filter(s => s) : 
      [];
    
    if (!currentSpecs.includes(newSpec.trim())) {
      const updatedSpecs = [...currentSpecs, newSpec.trim()].join(', ');
      setFormData(prev => ({ ...prev, specializations: updatedSpecs }));
    }
  };

  const handleRemoveSpecialization = (specToRemove: string) => {
    const currentSpecs = formData.specializations.split(',').map(s => s.trim()).filter(s => s);
    const updatedSpecs = currentSpecs.filter(spec => spec !== specToRemove).join(', ');
    setFormData(prev => ({ ...prev, specializations: updatedSpecs }));
  };

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

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Nome Completo</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-teal-700/40 border-lavender-400/20 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specializations" className="text-white">Especialidades (separadas por vírgula)</Label>
            <Input
              id="specializations"
              name="specializations"
              value={formData.specializations}
              onChange={handleChange}
              className="bg-teal-700/40 border-lavender-400/20 text-white"
            />
            
            {/* Visualização de especialidades como badges */}
            {formData.specializations && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specializations.split(',').map((spec, index) => {
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

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">Biografia</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="bg-teal-700/40 border-lavender-400/20 text-white min-h-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="approach" className="text-white">Abordagem Terapêutica</Label>
            <Textarea
              id="approach"
              name="approach"
              value={formData.approach}
              onChange={handleChange}
              className="bg-teal-700/40 border-lavender-400/20 text-white min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">Valor da Sessão (R$)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="bg-teal-700/40 border-lavender-400/20 text-white"
              min="0"
              step="5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-white">URL da Imagem de Perfil</Label>
            <Input
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="bg-teal-700/40 border-lavender-400/20 text-white"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {formData.avatar && (
              <div className="mt-2 flex justify-center">
                <img 
                  src={formData.avatar} 
                  alt="Prévia da imagem" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-lavender-400"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-lavender-400 hover:bg-lavender-500 text-teal-900"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
