
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Clock, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment, mockAppointments } from "@/models/Appointment";
import { toast } from "@/hooks/use-toast";

const getStatusBadge = (status: Appointment["status"]) => {
  switch (status) {
    case "pending":
      return <span className="bg-yellow-500/30 text-yellow-200 px-2 py-1 rounded-full text-xs">Pendente</span>;
    case "confirmed":
      return <span className="bg-green-500/30 text-green-200 px-2 py-1 rounded-full text-xs">Confirmada</span>;
    case "completed":
      return <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full text-xs">Concluída</span>;
    case "cancelled":
      return <span className="bg-red-500/30 text-red-200 px-2 py-1 rounded-full text-xs">Cancelada</span>;
    default:
      return null;
  }
};

const ClientAppointmentsList = () => {
  const appointments = mockAppointments;
  
  const handleCancelAppointment = (appointmentId: string) => {
    console.log("Cancel appointment:", appointmentId);
    toast({
      title: "Sessão cancelada",
      description: "A sessão foi cancelada com sucesso.",
      variant: "default"
    });
  };
  
  return (
    <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-lavender-400" />
          Minhas Sessões
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/70">Você não possui sessões agendadas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-lavender-400/20">
                  <TableHead className="text-white">Terapeuta</TableHead>
                  <TableHead className="text-white">Data</TableHead>
                  <TableHead className="text-white">Hora</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} className="border-lavender-400/20">
                    <TableCell className="text-white">{appointment.therapistName}</TableCell>
                    <TableCell className="text-white">
                      {format(new Date(appointment.date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-white">{appointment.time}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell>
                      {(appointment.status === "pending" || appointment.status === "confirmed") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-400/40 hover:border-red-400/60 text-red-300 hover:text-red-200"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
                      {appointment.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-lavender-400/40 hover:border-lavender-400/60 text-lavender-300"
                        >
                          Avaliar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientAppointmentsList;
