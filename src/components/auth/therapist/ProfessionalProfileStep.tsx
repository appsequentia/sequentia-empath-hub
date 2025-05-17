
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
import { X } from "lucide-react";

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
  
  const handleAddSpecialty = (specialty: string) => {
    const currentSpecialties = form.getValues("specialties") || [];
    if (currentSpecialties.includes(specialty) || currentSpecialties.length >= 5) return;
    
    form.setValue("specialties", [...currentSpecialties, specialty]);
  };
  
  const handleRemoveSpecialty = (specialty: string) => {
    const currentSpecialties = form.getValues("specialties") || [];
    form.setValue("specialties", currentSpecialties.filter(s => s !== specialty));
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
        name="registrationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Número de Registro Profissional</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: CRP 01/12345" 
                className="bg-teal-700/50 text-white border-lavender-400/30 placeholder:text-white/50"
                {...field} 
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sessionPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Valor da Sessão (R$)</FormLabel>
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
        
        <FormField
          control={form.control}
          name="sessionDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Duração da Sessão</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
      </div>
    </div>
  );
};

export default ProfessionalProfileStep;
