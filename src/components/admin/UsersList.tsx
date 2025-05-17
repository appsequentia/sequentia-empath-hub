
import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data - in a real app, this would come from your backend
const initialUsers = [
  { id: "1", name: "Maria Silva", email: "maria@example.com", type: "terapeuta", status: "ativo" },
  { id: "2", name: "João Santos", email: "joao@example.com", type: "terapeuta", status: "pendente" },
  { id: "3", name: "Ana Oliveira", email: "ana@example.com", type: "cliente", status: "ativo" },
  { id: "4", name: "Carlos Pereira", email: "carlos@example.com", type: "cliente", status: "ativo" },
  { id: "5", name: "Juliana Costa", email: "juliana@example.com", type: "terapeuta", status: "ativo" },
  { id: "6", name: "Pedro Almeida", email: "pedro@example.com", type: "cliente", status: "inativo" },
  { id: "7", name: "Fernanda Lima", email: "fernanda@example.com", type: "terapeuta", status: "rejeitado" },
  { id: "8", name: "Roberto Dias", email: "roberto@example.com", type: "cliente", status: "ativo" },
  { id: "9", name: "Camila Souza", email: "camila@example.com", type: "terapeuta", status: "ativo" },
  { id: "10", name: "Lucas Martins", email: "lucas@example.com", type: "cliente", status: "ativo" },
];

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredUsers = initialUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pendente":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "inativo":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "rejeitado":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "terapeuta":
        return "bg-lavender-500/20 text-lavender-300 border-lavender-400/30";
      case "cliente":
        return "bg-teal-500/20 text-teal-300 border-teal-400/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
        <Input 
          placeholder="Pesquisar usuários..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-teal-700/30 border-lavender-400/20 text-white placeholder:text-white/50"
        />
      </div>
      
      <div className="overflow-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-teal-700/30">
            <TableRow>
              <TableHead className="text-white font-medium">Nome</TableHead>
              <TableHead className="text-white font-medium">Email</TableHead>
              <TableHead className="text-white font-medium">Tipo</TableHead>
              <TableHead className="text-white font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id} className="border-b border-teal-700/30">
                <TableCell className="text-white font-medium">{user.name}</TableCell>
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getTypeColor(user.type)}>
                    {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(user.status)}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredUsers.length === 0 && (
          <p className="text-center text-white/70 py-8">Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}
