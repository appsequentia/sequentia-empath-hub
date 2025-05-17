
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard } from "lucide-react";
import { mockAppointments, Appointment } from "@/models/Appointment";
import { Link } from "react-router-dom";

const ClientAppointmentsList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-lavender-400" />
          Minhas Consultas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-white/70 text-center py-4">
            Você não possui nenhuma consulta agendada.
          </p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 rounded-md bg-teal-700/40"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lavender-300">
                      {appointment.therapistName}
                    </h3>
                    <p className="text-sm text-white/70">
                      {formatDate(appointment.date)} às {appointment.time}
                    </p>
                    <p className="text-xs mt-1 inline-block px-2 py-1 rounded-full bg-teal-600/50">
                      {appointment.status === "confirmed" && "Confirmada"}
                      {appointment.status === "pending" && "Aguardando confirmação"}
                      {appointment.status === "completed" && "Realizada"}
                      {appointment.status === "cancelled" && "Cancelada"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      to="/pagamento" 
                      state={{ appointment: {
                        ...appointment,
                        price: 180.00 // Mock price for session
                      }}}
                    >
                      <Button size="sm" variant="outline" className="border-lavender-400/30 hover:bg-lavender-400/10">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pagar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientAppointmentsList;
