
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProfessionalProfileStepProps {
  form: UseFormReturn<any>;
}

// Lista de especialidades disponíveis
const availableSpecialties = [
  "Terapia Cognitivo-Comportamental",
  "Psicanálise",
  "Psicoterapia",
  "Terapia de Casal",
  "Terapia Familiar",
  "Terapia Infantil",
  "Neuropsicologia",
  "Psicologia Organizacional",
  "Terapia Sistêmica",
  "Terapia Humanista",
  "Psicologia Positiva",
  "Gestalt-terapia",
  "Psicoterapia Breve",
  "Acompanhamento Terapêutico",
  "Avaliação Psicológica"
];

// Lista de títulos profissionais
const professionalTitles = [
  "Psicólogo",
  "Psiquiatra",
  "Psicanalista",
  "Terapeuta ocupacional",
  "Fonoaudiólogo",
  "Neuropsicólogo",
  "Psicopedagogo",
  "Outro"
];

// Opções de duração da sessão
const sessionDurations = [
  "30 minutos",
  "45 minutos",
  "50 minutos",
  "60 minutos",
  "90 minutos",
  "120 minutos"
];

const ProfessionalProfileStep: React.FC<ProfessionalProfileStepProps> = ({ form }) => {
  const specialties = form.watch("specialties") || [];
  const hasNoRegistration = form.watch("hasNoRegistration") || false;
  const services = form.watch("services") || [{ name: "", duration: "", price: "", description: "" }];
  
  // Effect to handle the hasNoRegistration checkbox
  useEffect(() => {
    if (hasNoRegistration) {
      form.setValue("registrationNumber", "", { shouldValidate: true });
    }
  }, [hasNoRegistration, form]);
  
  const handleAddSpecialty = (specialty: string) => {
    const currentSpecialties = form.getValues("specialties") || [];
    if (currentSpecialties.includes(specialty) || currentSpecialties.length >= 5) return;
    
    form.setValue("specialties", [...currentSpecialties, specialty]);
  };
  
  const handleRemoveSpecialty = (specialty: string) => {
    const currentSpecialties = form.getValues("specialties") || [];
    form.setValue("specialties", currentSpecialties.filter(s => s !== specialty));
  };

  const addService = () => {
    const currentServices = form.getValues("services") || [];
    if (currentServices.length >= 3) return; // Limite de 3 serviços
    
    form.setValue("services", [
      ...currentServices, 
      { name: "", duration: "", price: "", description: "" }
    ]);
  };
  
  const removeService = (index: number) => {
    const currentServices = form.getValues("services") || [];
    form.setValue(
      "services", 
      currentServices.filter((_, i) => i !== index)
    );
  };
  
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="professionalTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Título Profissional</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full bg-teal-700/50 text-white border-lavender-400/30">
                  <SelectValue placeholder="Selecione seu título profissional" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-teal-800 border-lavender-400/30">
                {professionalTitles.map((title) => (
                  <SelectItem 
                    key={title} 
                    value={title}
                    className="text-white hover:bg-lavender-400/20"
                  >
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="hasNoRegistration"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked) {
                    form.setValue("registrationNumber", "");
                  }
                }}
                className="data-[state=checked]:bg-lavender-400 data-[state=checked]:border-lavender-400"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-white cursor-pointer">
                Não possuo registro profissional no momento
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="registrationNumber"
        render={({ field }) => (
          <FormItem className={hasNoRegistration ? "hidden" : ""}>
            <FormLabel className="text-white">Número de Registro Profissional</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: CRP 01/12345" 
                className="bg-teal-700/50 text-white border-lavender-400/30 placeholder:text-white/50"
                {...field} 
                disabled={hasNoRegistration}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="specialties"
        render={() => (
          <FormItem>
            <FormLabel className="text-white">Especialidades (máx. 5)</FormLabel>
            <div className="mb-2">
              <Select onValueChange={handleAddSpecialty} disabled={specialties.length >= 5}>
                <SelectTrigger className="w-full bg-teal-700/50 text-white border-lavender-400/30">
                  <SelectValue placeholder={specialties.length >= 5 ? "Limite máximo atingido" : "Adicionar especialidade"} />
                </SelectTrigger>
                <SelectContent className="bg-teal-800 border-lavender-400/30">
                  {availableSpecialties
                    .filter(specialty => !specialties.includes(specialty))
                    .map((specialty) => (
                      <SelectItem 
                        key={specialty} 
                        value={specialty}
                        className="text-white hover:bg-lavender-400/20"
                      >
                        {specialty}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {specialties.map((specialty: string) => (
                <Badge 
                  key={specialty} 
                  className="bg-lavender-400/30 text-white hover:bg-lavender-400/40 px-3 py-1"
                >
                  {specialty}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSpecialty(specialty)}
                    className="ml-2 text-white/80 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {specialties.length === 0 && (
              <p className="text-sm text-white/50 mt-2">Selecione pelo menos uma especialidade</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="biography"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Biografia</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva sua experiência profissional, abordagens e métodos de trabalho..." 
                className="bg-teal-700/50 text-white border-lavender-400/30 placeholder:text-white/50 min-h-[120px]"
                {...field} 
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
            <FormLabel className="text-white">Abordagem</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva sua abordagem terapêutica..." 
                className="bg-teal-700/50 text-white border-lavender-400/30 placeholder:text-white/50 min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Serviços/Terapias oferecidas - novo campo */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-white">Terapias oferecidas (máx. 3)</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addService}
            disabled={services.length >= 3}
            className="bg-transparent border-lavender-400/30 text-white hover:bg-lavender-400/10"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>

        {services.map((service, index) => (
          <div key={index} className="mb-4 p-4 bg-teal-700/30 rounded-md border border-lavender-400/20">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-white font-medium">Terapia {index + 1}</h4>
              {services.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeService(index)}
                  className="h-8 px-2 text-white/70 hover:text-white hover:bg-red-500/20"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              <FormField
                control={form.control}
                name={`services.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Nome da terapia</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Terapia Individual" 
                        className="bg-teal-700/50 text-white border-lavender-400/30 placeholder:text-white/50"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name={`services.${index}.duration`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Duração</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full bg-teal-700/50 text-white border-lavender-400/30">
                            <SelectValue placeholder="Selecione a duração" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-teal-800 border-lavender-400/30">
                          {sessionDurations.map((duration) => (
                            <SelectItem 
                              key={duration} 
                              value={duration}
                              className="text-white hover:bg-lavender-400/20"
                            >
                              {duration}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`services.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Valor (R$)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">R$</span>
                          <Input 
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="150,00" 
                            className="bg-teal-700/50 text-white border-lavender-400/30 placeholder:text-white/50 pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name={`services.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva esta modalidade de terapia..." 
                        className="bg-teal-700/50 text-white border-lavender-400/30 placeholder:text-white/50"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalProfileStep;
