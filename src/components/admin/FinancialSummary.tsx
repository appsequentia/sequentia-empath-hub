
import { useState, useEffect } from "react";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FinancialSummary {
  total_revenue: number;
  total_sessions: number;
  avg_session_value: number;
  growth_rate: number;
}

interface TherapistRevenue {
  therapist_id: string;
  therapist_name: string;
  total_sessions: number;
  total_revenue: number;
  pending_payment: number;
}

export function FinancialSummary() {
  const [summary, setSummary] = useState<FinancialSummary>({
    total_revenue: 0,
    total_sessions: 0,
    avg_session_value: 0,
    growth_rate: 0
  });
  const [therapistRevenues, setTherapistRevenues] = useState<TherapistRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFinancialData();
  }, []);

  async function fetchFinancialData() {
    try {
      setLoading(true);
      
      // This is a simplified example. In a real implementation, you would fetch actual data.
      
      // Mock summary data
      const mockSummary: FinancialSummary = {
        total_revenue: 5850.00,
        total_sessions: 39,
        avg_session_value: 150.00,
        growth_rate: 12.5
      };
      
      // Mock therapist revenues
      const mockTherapistRevenues: TherapistRevenue[] = [
        {
          therapist_id: '1',
          therapist_name: 'João Silva',
          total_sessions: 15,
          total_revenue: 2250.00,
          pending_payment: 750.00
        },
        {
          therapist_id: '2',
          therapist_name: 'Maria Souza',
          total_sessions: 12,
          total_revenue: 1800.00,
          pending_payment: 600.00
        },
        {
          therapist_id: '3',
          therapist_name: 'Carlos Ferreira',
          total_sessions: 12,
          total_revenue: 1800.00,
          pending_payment: 600.00
        }
      ];
      
      setSummary(mockSummary);
      setTherapistRevenues(mockTherapistRevenues);
      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        title: "Erro ao buscar dados financeiros",
        description: "Não foi possível carregar os dados financeiros.",
        variant: "destructive",
      });
    }
  }

  function handlePayment(therapistId: string, amount: number) {
    toast({
      title: "Pagamento simulado",
      description: `Pagamento de R$ ${amount.toFixed(2)} para o terapeuta seria processado.`,
    });
    
    // Update local state for the demo
    setTherapistRevenues(prev => 
      prev.map(t => 
        t.therapist_id === therapistId 
          ? { ...t, pending_payment: 0 } 
          : t
      )
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white">Receita Total</CardTitle>
            <CardDescription className="text-white/70">Total acumulado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-10 w-10 text-lavender-400 mr-4" />
              <span className="text-3xl font-bold text-white">R$ {summary.total_revenue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white">Sessões Realizadas</CardTitle>
            <CardDescription className="text-white/70">Total de sessões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-10 w-10 text-lavender-400 mr-4" />
              <span className="text-3xl font-bold text-white">{summary.total_sessions}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white">Ticket Médio</CardTitle>
            <CardDescription className="text-white/70">Crescimento: {summary.growth_rate}%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-10 w-10 text-lavender-400 mr-4" />
              <span className="text-3xl font-bold text-white">R$ {summary.avg_session_value.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Therapist Revenues Table */}
      <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Receita por Terapeuta</CardTitle>
          <CardDescription className="text-white/70">Detalhamento por profissional</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-teal-700/30">
                <TableHead className="text-white">Terapeuta</TableHead>
                <TableHead className="text-white text-right">Sessões</TableHead>
                <TableHead className="text-white text-right">Receita Total</TableHead>
                <TableHead className="text-white text-right">A Pagar</TableHead>
                <TableHead className="text-white text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {therapistRevenues.map((revenue) => (
                <TableRow key={revenue.therapist_id} className="hover:bg-teal-700/30">
                  <TableCell className="font-medium text-white">
                    {revenue.therapist_name}
                  </TableCell>
                  <TableCell className="text-white text-right">{revenue.total_sessions}</TableCell>
                  <TableCell className="text-white text-right">
                    R$ {revenue.total_revenue.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-white text-right">
                    R$ {revenue.pending_payment.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      disabled={revenue.pending_payment === 0}
                      onClick={() => handlePayment(revenue.therapist_id, revenue.pending_payment)}
                    >
                      <DollarSign className="mr-1 h-4 w-4" />
                      Pagar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-white/70">
            * Os pagamentos reais devem ser processados pelo sistema financeiro.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
