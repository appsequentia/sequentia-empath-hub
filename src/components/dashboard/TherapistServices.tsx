
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ListChecks, Clock, DollarSign, PenSquare, Trash2, Plus, AlertCircle, ShieldCheck } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  active: boolean;
  created_at: string;
}

interface TherapistServicesProps {
  therapistId: string | undefined;
  planLimit: number;
  planName: string;
  planActive: boolean;
}

const serviceFormSchema = z.object({
  name: z.string().min(3, "Informe o nome da terapia"),
  description: z.string().optional(),
  duration: z.coerce.number().min(15, "A duração mínima é de 15 minutos"),
  price: z.coerce.number().min(1, "O valor deve ser maior que zero"),
  active: z.boolean().default(true),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const TherapistServices: React.FC<TherapistServicesProps> = ({ 
  therapistId, 
  planLimit,
  planName,
  planActive
}) => {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const { toast } = useToast();
  
  const canAddMore = servicesList.length < planLimit;
  const isLimitReached = servicesList.length >= planLimit;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 60,
      price: 0,
      active: true,
    },
  });

  const fetchServicesData = async () => {
    if (!therapistId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('therapist_services')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Erro ao buscar serviços:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus serviços.",
          variant: "destructive",
        });
      } else {
        setServicesList(data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesData();
  }, [therapistId]);

  const openAddDialog = () => {
    if (isLimitReached) {
      toast({
        title: "Limite atingido",
        description: `Você atingiu o limite de ${planLimit} serviços do seu plano ${planName}. Faça upgrade para adicionar mais serviços.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!planActive) {
      toast({
        title: "Plano inativo",
        description: "Seu plano está inativo. Ative seu plano para gerenciar seus serviços.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentService(null);
    form.reset({
      name: "",
      description: "",
      duration: 60,
      price: 0,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    if (!planActive) {
      toast({
        title: "Plano inativo",
        description: "Seu plano está inativo. Ative seu plano para gerenciar seus serviços.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentService(service);
    form.reset({
      name: service.name,
      description: service.description || "",
      duration: service.duration,
      price: service.price,
      active: service.active,
    });
    setIsDialogOpen(true);
  };

  const handleToggleStatus = async (service: Service) => {
    if (!planActive) {
      toast({
        title: "Plano inativo",
        description: "Seu plano está inativo. Ative seu plano para gerenciar seus serviços.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('therapist_services')
        .update({
          active: !service.active
        })
        .eq('id', service.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Status atualizado",
        description: service.active 
          ? "Serviço desativado com sucesso" 
          : "Serviço ativado com sucesso",
      });
      
      fetchServicesData();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do serviço.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!planActive) {
      toast({
        title: "Plano inativo",
        description: "Seu plano está inativo. Ative seu plano para gerenciar seus serviços.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Tem certeza que deseja excluir este serviço?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('therapist_services')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Erro ao excluir serviço:", error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o serviço.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Serviço excluído com sucesso.",
        });
        fetchServicesData();
      }
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
    }
  };

  const onSubmit = async (values: ServiceFormValues) => {
    if (!therapistId) return;

    if (!planActive) {
      toast({
        title: "Plano inativo",
        description: "Seu plano está inativo. Ative seu plano para gerenciar seus serviços.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentService) {
        // Atualizar serviço existente
        const { error } = await supabase
          .from('therapist_services')
          .update({
            name: values.name,
            description: values.description || null,
            duration: values.duration,
            price: values.price,
            active: values.active,
          })
          .eq('id', currentService.id);

        if (error) {
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Serviço atualizado com sucesso.",
        });
      } else {
        if (isLimitReached) {
          toast({
            title: "Limite atingido",
            description: `Você atingiu o limite de ${planLimit} serviços do seu plano ${planName}. Faça upgrade para adicionar mais serviços.`,
            variant: "destructive",
          });
          return;
        }
        
        // Adicionar novo serviço
        const { error } = await supabase
          .from('therapist_services')
          .insert({
            therapist_id: therapistId,
            name: values.name,
            description: values.description || null,
            duration: values.duration,
            price: values.price,
            active: values.active,
          });

        if (error) {
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Serviço adicionado com sucesso.",
        });
      }

      setIsDialogOpen(false);
      fetchServicesData();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o serviço.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-lavender-400" />
          Serviços e Terapias
        </h2>
        <Button 
          onClick={openAddDialog} 
          className="bg-lavender-500 hover:bg-lavender-600 text-teal-900"
          disabled={isLimitReached || !planActive}
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar
        </Button>
      </div>
      
      {/* Plano atual */}
      <Card className="bg-teal-700/30 border-lavender-400/20 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-5 w-5 ${planActive ? 'text-green-400' : 'text-yellow-500'}`} />
            <div>
              <p className="font-medium text-white">Plano: {planName}</p>
              <p className="text-xs text-white/70">
                {isLimitReached ? (
                  <span className="text-yellow-400">Limite atingido: {servicesList.length}/{planLimit} serviços</span>
                ) : (
                  <span>Utilizando: {servicesList.length}/{planLimit} serviços</span>
                )}
              </p>
            </div>
          </div>
          <div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-lavender-300 border-lavender-400/30 hover:bg-lavender-400/20"
            >
              Upgrade
            </Button>
          </div>
        </div>
        
        {!planActive && (
          <div className="mt-2 p-2 bg-amber-500/20 rounded text-sm text-white border border-amber-500/30 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <span>Seu plano está inativo. Ative para gerenciar seus serviços.</span>
          </div>
        )}
      </Card>

      {isLoading ? (
        <p className="text-center text-white/70 py-4">Carregando...</p>
      ) : servicesList.length === 0 ? (
        <Card className="bg-teal-700/30 border-lavender-400/20 p-6">
          <div className="text-center text-white/70">
            <ListChecks className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Nenhum serviço ou terapia cadastrado.</p>
            <p className="text-sm mt-1">Adicione seus serviços para que clientes possam agendar sessões.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {servicesList.map((service) => (
            <Card 
              key={service.id} 
              className={`p-4 border-l-4 ${service.active 
                ? 'bg-teal-700/30 border-lavender-400/40 border-l-lavender-400' 
                : 'bg-teal-700/20 border-gray-400/20 border-l-gray-500 opacity-70'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{service.name}</h3>
                    {!service.active && (
                      <span className="text-xs bg-gray-600/40 text-white/70 px-2 py-0.5 rounded">Inativo</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center text-white/80 text-sm">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-lavender-300/80" />
                      {service.duration} minutos
                    </div>
                    <div className="flex items-center text-white/80 text-sm font-medium">
                      <DollarSign className="h-3.5 w-3.5 mr-0.5 text-lavender-300/80" />
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                    </div>
                  </div>
                  
                  {service.description && (
                    <p className="text-white/80 text-sm mt-2">
                      {service.description}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2 items-center">
                  <Switch
                    checked={service.active}
                    onCheckedChange={() => handleToggleStatus(service)}
                    disabled={!planActive}
                    className="data-[state=checked]:bg-lavender-400"
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-lavender-300 hover:text-white"
                    onClick={() => openEditDialog(service)}
                    disabled={!planActive}
                  >
                    <PenSquare className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteService(service.id)}
                    disabled={!planActive}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para adicionar/editar serviço */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-teal-800 border-lavender-400/20 text-white">
          <DialogHeader>
            <DialogTitle>
              {currentService ? "Editar Serviço" : "Adicionar Serviço"}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {currentService 
                ? "Atualize os detalhes do seu serviço ou terapia"
                : "Adicione um novo serviço ou terapia ao seu perfil"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nome do Serviço</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Terapia Cognitivo Comportamental"
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
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Duração (minutos)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min={15}
                          step={5}
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Valor (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min={0}
                          step={10}
                          className="bg-teal-700/40 border-lavender-400/30 text-white"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Descrição do Serviço</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o serviço oferecido, metodologia, indicações, etc."
                        className="bg-teal-700/40 border-lavender-400/30 text-white min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border border-lavender-400/20 p-4">
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-white">Status do Serviço</FormLabel>
                      <FormDescription className="text-white/60">
                        Quando ativo, este serviço aparecerá para agendamento
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-lavender-400"
                      />
                    </FormControl>
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
                  {currentService ? "Salvar Alterações" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TherapistServices;
