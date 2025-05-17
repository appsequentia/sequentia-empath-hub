
import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, CalendarCheck, Star } from "lucide-react";
import { SessionPackages } from "@/components/home/SessionPackages";

const Pagamento = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const location = useLocation();
  
  // Get recommended therapists from state if available
  const recommendedTherapists = location.state?.recommendedTherapists || [];
  
  // Mock data - in a real app, this would come from URL state or API
  const appointment = {
    id: "1",
    therapistName: recommendedTherapists[0]?.name || "Dra. Sofia Mendes",
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
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">Recomendações de Sessão</h1>
          
          <div className="space-y-12">
            {/* Recommended Therapists */}
            {recommendedTherapists.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6">Terapeutas Recomendados</h2>
                <div className="grid grid-cols-1 gap-6">
                  {recommendedTherapists.map((therapist) => (
                    <Card 
                      key={therapist.id} 
                      className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-shrink-0">
                            <img 
                              src={therapist.avatar} 
                              alt={therapist.name} 
                              className="w-28 h-28 rounded-full object-cover border-2 border-lavender-400"
                            />
                            <div className="mt-3 bg-lavender-400/20 rounded-full px-3 py-1 text-center">
                              <span className="text-lavender-300 font-medium text-sm">Compatível</span>
                            </div>
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="text-xl font-medium text-white">{therapist.name}</h3>
                                <p className="text-lavender-300">{therapist.specialty}</p>
                              </div>
                              <div className="flex items-center mt-2 md:mt-0">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i}
                                      className={`h-4 w-4 ${i < Math.floor(therapist.rating) ? 'text-lavender-400 fill-lavender-400' : 'text-gray-400'}`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-white/90 text-sm">{therapist.rating} ({therapist.reviews})</span>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <p className="text-white/80 text-sm">
                                Áreas de foco: 
                                <span className="text-white ml-1">
                                  {therapist.focus.join(", ")}
                                </span>
                              </p>
                            </div>
                            
                            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                              <span className="text-white font-medium">R$ {therapist.price}/sessão</span>
                              <Button 
                                className="bg-lavender-400 hover:bg-lavender-500 text-teal-900"
                                onClick={() => setIsPaymentModalOpen(true)}
                              >
                                Agendar com este terapeuta
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
            
            {/* Session Packages */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Planos de Sessão</h2>
              <SessionPackages />
            </section>
          </div>
        </div>
      </main>
      
      {/* Payment modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="bg-teal-800 text-white border-lavender-400/20">
          <DialogHeader>
            <DialogTitle>Agendamento de Sessão</DialogTitle>
            <DialogDescription className="text-white/70">
              Selecione a data e horário para sua primeira sessão.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-white/80">
              Este recurso de agendamento será ativado em breve.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsPaymentModalOpen(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Subscription modal - kept from original */}
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
