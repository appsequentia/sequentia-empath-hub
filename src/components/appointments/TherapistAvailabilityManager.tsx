
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type TimeSlot = {
  time: string;
};

type AvailabilityByDate = {
  [date: string]: TimeSlot[];
};

const TherapistAvailabilityManager = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<AvailabilityByDate>({});
  const [newTimeSlot, setNewTimeSlot] = useState<string>("");
  
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const selectedDateSlots = formattedDate ? timeSlots[formattedDate] || [] : [];
  
  const handleAddTimeSlot = () => {
    if (!date) {
      toast({
        title: "Selecione uma data",
        description: "É necessário selecionar uma data antes de adicionar horários.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newTimeSlot) {
      toast({
        title: "Horário inválido",
        description: "Digite um horário válido no formato HH:MM.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if the time slot format is valid (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newTimeSlot)) {
      toast({
        title: "Formato inválido",
        description: "O horário deve estar no formato HH:MM (ex: 09:30).",
        variant: "destructive"
      });
      return;
    }
    
    // Add the new time slot
    const dateKey = format(date, "yyyy-MM-dd");
    const updatedSlots = { ...timeSlots };
    
    // Check if the time slot already exists for the date
    if (updatedSlots[dateKey]?.some(slot => slot.time === newTimeSlot)) {
      toast({
        title: "Horário duplicado",
        description: "Este horário já está disponível na data selecionada.",
        variant: "destructive"
      });
      return;
    }
    
    // Add new slot
    if (!updatedSlots[dateKey]) {
      updatedSlots[dateKey] = [];
    }
    
    updatedSlots[dateKey] = [
      ...updatedSlots[dateKey],
      { time: newTimeSlot }
    ].sort((a, b) => a.time.localeCompare(b.time));
    
    setTimeSlots(updatedSlots);
    setNewTimeSlot("");
    
    toast({
      title: "Horário adicionado",
      description: `Horário ${newTimeSlot} adicionado para ${format(date, "dd 'de' MMMM", { locale: ptBR })}.`,
      variant: "default"
    });
  };
  
  const handleRemoveTimeSlot = (time: string) => {
    if (!date) return;
    
    const dateKey = format(date, "yyyy-MM-dd");
    const updatedSlots = { ...timeSlots };
    
    updatedSlots[dateKey] = updatedSlots[dateKey].filter(slot => slot.time !== time);
    
    // If no more slots for the date, remove the date entry
    if (updatedSlots[dateKey].length === 0) {
      delete updatedSlots[dateKey];
    }
    
    setTimeSlots(updatedSlots);
    
    toast({
      title: "Horário removido",
      description: `Horário ${time} removido da data ${format(date, "dd 'de' MMMM", { locale: ptBR })}.`,
      variant: "default"
    });
  };
  
  const handleSaveAvailability = () => {
    // Here you would save the availability to your database
    console.log("Saving availability:", timeSlots);
    
    toast({
      title: "Disponibilidade salva",
      description: "Sua disponibilidade foi atualizada com sucesso.",
      variant: "default"
    });
  };
  
  return (
    <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
      <CardHeader>
        <CardTitle className="text-white">Gerenciar Disponibilidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-white mb-2 block">Selecione uma data</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-lavender-400/20 bg-teal-700/40 hover:bg-teal-700/60 text-white",
                      !date && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-teal-700 border-lavender-400/20">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex-1">
              <label className="text-sm text-white mb-2 block">Adicionar horário (HH:MM)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: 09:00"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="border-lavender-400/20 bg-teal-700/40 text-white placeholder:text-gray-400"
                />
                <Button 
                  onClick={handleAddTimeSlot}
                  className="bg-lavender-400 hover:bg-lavender-500 text-teal-900"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {date && (
            <div>
              <h3 className="text-white font-medium mb-3">
                Horários disponíveis para {format(date, "dd 'de' MMMM", { locale: ptBR })}:
              </h3>
              
              {selectedDateSlots.length === 0 ? (
                <p className="text-white/70 text-sm">
                  Nenhum horário adicionado. Adicione horários acima.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedDateSlots.map((slot) => (
                    <div 
                      key={slot.time} 
                      className="bg-lavender-400/20 rounded-full px-3 py-1 text-white flex items-center gap-2"
                    >
                      <span>{slot.time}</span>
                      <button 
                        onClick={() => handleRemoveTimeSlot(slot.time)} 
                        className="hover:text-red-300 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between mt-4 pt-4 border-t border-lavender-400/20">
            <div>
              {Object.keys(timeSlots).length > 0 && (
                <p className="text-white/70 text-sm">
                  Datas configuradas: {Object.keys(timeSlots).length}
                </p>
              )}
            </div>
            <Button
              className="bg-lavender-400 hover:bg-lavender-500 text-teal-900"
              onClick={handleSaveAvailability}
            >
              <Check className="h-4 w-4 mr-2" />
              Salvar Disponibilidade
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistAvailabilityManager;
