
import React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClientInfoAccordion: React.FC = () => {
  return (
    <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">Informações Úteis</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="text-white">
          <AccordionItem value="payments">
            <AccordionTrigger className="text-lavender-300">Como funcionam os pagamentos?</AccordionTrigger>
            <AccordionContent className="text-white/80">
              <p className="mb-2">Aceitamos diversos métodos de pagamento:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Cartões de crédito e débito</li>
                <li>PIX</li>
                <li>Transferência bancária</li>
              </ul>
              <p className="mt-2">Os pagamentos são processados de forma segura antes da sessão. Você receberá uma confirmação por e-mail após cada transação.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cancellation">
            <AccordionTrigger className="text-lavender-300">Política de cancelamento</AccordionTrigger>
            <AccordionContent className="text-white/80">
              <p>Você pode cancelar ou remarcar sua sessão com até 24 horas de antecedência sem custo adicional. Cancelamentos com menos de 24 horas podem estar sujeitos a uma taxa de 50% do valor da sessão.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="tips">
            <AccordionTrigger className="text-lavender-300">Dicas para sua sessão</AccordionTrigger>
            <AccordionContent className="text-white/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>Escolha um local silencioso e privado para sua sessão online</li>
                <li>Certifique-se de ter uma conexão de internet estável</li>
                <li>Tenha água por perto</li>
                <li>Reserve alguns minutos antes e depois da sessão para se preparar e refletir</li>
                <li>Anote questões importantes que deseja abordar durante a sessão</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ClientInfoAccordion;
