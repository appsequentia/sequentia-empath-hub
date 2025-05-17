
import { useState } from "react";
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
import { PencilIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  if (!canEdit) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Em uma implementação real, aqui enviaria os dados para o backend
    console.log("Dados do perfil atualizados:", formData);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas alterações foram salvas com sucesso.",
      duration: 3000,
    });
    
    setIsOpen(false);
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
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-lavender-400 hover:bg-lavender-500 text-teal-900"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
