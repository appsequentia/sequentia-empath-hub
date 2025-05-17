
import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, CalendarCheck } from "lucide-react";

const Pagamento = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const location = useLocation();
  
  // Mock data - in a real app, this would come from URL state or API
  const appointment = location.state?.appointment || {
    id: "1",
    therapistName: "Dra. Sofia Mendes",
    date: "2023-05-25",
    time: "10:00",
    price: 180.00
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="min-h-screen bg-teal-900 text-white">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">Pagamento da Sessão</h1>
          
          <div className="space-y-8">
            {/* Appointment summary */}
            <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-lavender-400" />
                  Detalhes da Sessão
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-white/70">Terapeuta</h3>
                    <p className="text-lg font-medium text-white">{appointment.therapistName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-white/70">Data e Horário</h3>
                    <p className="text-lg font-medium text-white">
                      {formatDate(appointment.date)} às {appointment.time}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-white/70">Valor</h3>
                  <p className="text-2xl font-bold text-lavender-300">
                    R$ {appointment.price.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Single session */}
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20 hover:border-lavender-400/60 transition-all">
                <CardHeader>
                  <CardTitle className="text-white">Sessão Avulsa</CardTitle>
                  <CardDescription className="text-white/70">
                    Pagamento único para esta sessão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-6">
                    Ideal para quem deseja experimentar uma sessão ou prefere agendar consultas ocasionais.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => setIsPaymentModalOpen(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pagar Sessão Avulsa
                  </Button>
                </CardContent>
              </Card>
              
              {/* Subscription */}
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20 hover:border-lavender-400/60 transition-all">
                <CardHeader>
                  <CardTitle className="text-white">Plano Mensal</CardTitle>
                  <CardDescription className="text-white/70">
                    4 sessões por mês com desconto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-6">
                    Economize 15% no valor das sessões e garanta seu horário fixo com nosso plano mensal.
                  </p>
                  <Button 
                    className="w-full"
                    variant="secondary"
                    onClick={() => setIsSubscriptionModalOpen(true)}
                  >
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Assinar Plano Mensal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Single payment modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="bg-teal-800 text-white border-lavender-400/20">
          <DialogHeader>
            <DialogTitle>Pagamento de Sessão Avulsa</DialogTitle>
            <DialogDescription className="text-white/70">
              Essa funcionalidade será ativada após a configuração do Stripe.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setIsPaymentModalOpen(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Subscription modal */}
      <Dialog open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
        <DialogContent className="bg-teal-800 text-white border-lavender-400/20">
          <DialogHeader>
            <DialogTitle>Assinatura de Plano Mensal</DialogTitle>
            <DialogDescription className="text-white/70">
              Essa funcionalidade será ativada após a configuração do Stripe.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setIsSubscriptionModalOpen(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Pagamento;
