
export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  therapistId: string;
  therapistName: string;
  clientId: string;
  clientName: string;
  date: string; // ISO date format
  time: string; // Format: "HH:MM"
  status: AppointmentStatus;
  createdAt: string;
}

// Mock data for appointments
export const mockAppointments: Appointment[] = [
  {
    id: "1",
    therapistId: "1",
    therapistName: "Dra. Sofia Mendes",
    clientId: "101",
    clientName: "João Silva",
    date: "2023-05-25",
    time: "10:00",
    status: "confirmed",
    createdAt: "2023-05-20T14:30:00Z"
  },
  {
    id: "2",
    therapistId: "2",
    therapistName: "Dr. Lucas Oliveira",
    clientId: "101",
    clientName: "João Silva",
    date: "2023-05-30",
    time: "14:00",
    status: "pending",
    createdAt: "2023-05-19T09:15:00Z"
  }
];
