
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";

type TimeSlot = {
  time: string;
  available: boolean;
};

type AvailabilityMap = {
  [date: string]: TimeSlot[];
};

type ScheduleAppointmentDialogProps = {
  therapistId: string;
  therapistName: string;
};

// Mock data - this would come from an API in a real app
const mockAvailability: AvailabilityMap = {
  "2023-05-20": [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: false },
  ],
  "2023-05-21": [
    { time: "09:00", available: true },
    { time: "10:00", available: false },
    { time: "11:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
  ],
  "2023-05-22": [
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: true },
  ],
};

const ScheduleAppointmentDialog = ({ therapistId, therapistName }: ScheduleAppointmentDialogProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"date" | "time" | "confirm">("date");
  
  // Format the selected date to match our availability keys
  const formattedDate = date ? format(date, "yyyy-MM-dd") : null;
  
  // Get available time slots for the selected date
  const availableTimeSlots = formattedDate ? mockAvailability[formattedDate] || [] : [];
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      if (mockAvailability[dateKey] && mockAvailability[dateKey].some(slot => slot.available)) {
        setStep("time");
      } else {
        toast({
          title: "Sem horários disponíveis",
          description: "Não há horários disponíveis para esta data. Por favor, escolha outra data.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("confirm");
  };
  
  const handleConfirmAppointment = () => {
    // Here we'd make an API call to book the appointment
    // For now, we'll just show a success message
    toast({
      title: "Agendamento confirmado!",
      description: `Sua sessão com ${therapistName} foi agendada para ${date ? format(date, "dd 'de' MMMM 'às' ", { locale: ptBR }) : ""} ${selectedTime}.`,
      variant: "default"
    });
    
    // Reset the form
    setDate(undefined);
    setSelectedTime(null);
    setStep("date");
    
    // Close the dialog
    document.getElementById("close-dialog")?.click();
  };
  
  const handleBackToDate = () => {
    setSelectedTime(null);
    setStep("date");
  };
  
  const handleBackToTime = () => {
    setStep("time");
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-6 bg-lavender-400 hover:bg-lavender-500 text-teal-900">
          Agendar Consulta
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-teal-800 border-lavender-400/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Agendar Sessão com {therapistName}</DialogTitle>
        </DialogHeader>
        
        {step === "date" && (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-lavender-300">Selecione uma data para a consulta:</p>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="bg-teal-700/50 rounded-md border border-lavender-400/20 text-white pointer-events-auto"
              disabled={(date) => {
                const dateKey = format(date, "yyyy-MM-dd");
                return !mockAvailability[dateKey] || 
                  !mockAvailability[dateKey].some(slot => slot.available) ||
                  date < new Date();
              }}
            />
          </div>
        )}
        
        {step === "time" && date && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleBackToDate} className="text-lavender-300 border-lavender-400/20">
                Voltar
              </Button>
              <p className="text-lavender-300 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {format(date, "dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            
            <p className="text-center">Selecione um horário disponível:</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {availableTimeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant="outline"
                  disabled={!slot.available}
                  className={`
                    ${slot.available ? "border-lavender-400/20 text-white hover:bg-lavender-400/20" : "border-gray-600 text-gray-500"}
                  `}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {step === "confirm" && date && selectedTime && (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBackToTime} className="text-lavender-300 border-lavender-400/20">
              Voltar
            </Button>
            
            <div className="bg-teal-700/50 p-4 rounded-md border border-lavender-400/20">
              <h3 className="text-lg font-medium text-white mb-4">Confirmar Agendamento</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-lavender-300" />
                  <div>
                    <p className="text-white font-medium">Data e Hora</p>
                    <p className="text-white/80">
                      {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ""}, às {selectedTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-lavender-300" />
                  <div>
                    <p className="text-white font-medium">Terapeuta</p>
                    <p className="text-white/80">{therapistName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-lavender-300" />
                  <div>
                    <p className="text-white font-medium">Duração da Sessão</p>
                    <p className="text-white/80">50 minutos</p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-lavender-400 hover:bg-lavender-500 text-teal-900"
                onClick={handleConfirmAppointment}
              >
                Confirmar Agendamento
              </Button>
            </div>
          </div>
        )}
        
        <button id="close-dialog" className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAppointmentDialog;
