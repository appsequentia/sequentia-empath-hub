
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Brain, Clock, ArrowRight } from "lucide-react";

const About = () => {
  const benefits = [
    {
      title: "Menos tempo procurando, mais tempo cuidando de você",
      description: "Nossa plataforma elimina a busca exaustiva por terapeutas, permitindo que você se concentre no que realmente importa: sua saúde mental.",
      icon: Clock
    },
    {
      title: "Compatibilidade personalizada",
      description: "Nossa tecnologia analisa seu perfil e necessidades para recomendar os terapeutas mais adequados ao seu caso específico.",
      icon: Brain
    },
    {
      title: "Comunidade de especialistas verificados",
      description: "Contamos apenas com profissionais certificados e verificados, garantindo um atendimento de qualidade e confiança.",
      icon: Users
    }
  ];

  const faqs = [
    {
      question: "Quanto tempo leva para encontrar um terapeuta?",
      answer: "O processo leva apenas alguns minutos. Após completar nossa avaliação, você receberá recomendações de terapeutas instantaneamente. Daí é só escolher e agendar sua primeira sessão."
    },
    {
      question: "Como funciona o pagamento das sessões?",
      answer: "Oferecemos diversas opções de pagamento, incluindo cartão de crédito, transferência bancária e PIX. Você pode optar por pagar sessão a sessão ou adquirir pacotes com descontos especiais."
    },
    {
      question: "Posso mudar de terapeuta se não me adaptar?",
      answer: "Sim, absolutamente! Entendemos que a compatibilidade entre paciente e terapeuta é fundamental. Se você sentir que não houve uma boa conexão, pode buscar outro profissional sem custo adicional."
    },
    {
      question: "As sessões são presenciais ou online?",
      answer: "Nossa plataforma oferece ambas as opções. Você pode optar por sessões online através de nossa plataforma segura de videochamada ou, dependendo da disponibilidade do terapeuta, agendar sessões presenciais."
    },
    {
      question: "Como é garantida a confidencialidade?",
      answer: "A privacidade e confidencialidade são prioridades absolutas. Utilizamos criptografia de ponta a ponta em nossas comunicações e seguimos rigorosamente as normas éticas e legais de sigilo profissional."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-teal-900">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Saúde mental <span className="text-lavender-400">acessível</span> e <span className="text-lavender-400">personalizada</span>
                </h1>
                <p className="text-lg text-white/80 mb-8">
                  Conectamos você ao terapeuta ideal através de um processo simples e eficiente, baseado em suas necessidades específicas.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/assessment/start">
                    <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium">
                      Faça sua avaliação
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/specialists">
                    <Button variant="outline" className="bg-transparent border-lavender-400 text-white hover:bg-lavender-500/20">
                      Ver especialistas
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden animate-fade-in">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Terapia online" 
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <HowItWorks />
        
        {/* Benefits section */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-lavender-400/10 rounded-tr-full blur-3xl opacity-50 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Por que escolher a <span className="text-lavender-400">Sequentia</span>
              </h2>
              <p className="mt-4 text-white/80">
                Benefícios que fazem a diferença no seu caminho para o bem-estar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {benefits.map((benefit, index) => (
                <Card key={index} className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20 hover:border-lavender-400/40 transition-all">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-lavender-400/20 flex items-center justify-center mb-4">
                      <benefit.icon className="h-6 w-6 text-lavender-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                    <p className="text-white/70">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Process walkthrough */}
        <section className="py-16 md:py-24 bg-teal-800/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                O processo <span className="text-lavender-400">passo a passo</span>
              </h2>
              <p className="mt-4 text-white/80">
                Conheça em detalhes como funciona nossa plataforma
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <ol className="relative border-l border-lavender-400/30 space-y-12 pl-8">
                  <li className="relative">
                    <div className="absolute -left-[41px] flex items-center justify-center w-8 h-8 rounded-full bg-lavender-400 text-teal-900 font-bold">1</div>
                    <h3 className="text-xl font-bold text-white mb-2">Cadastro e avaliação inicial</h3>
                    <p className="text-white/80 mb-4">
                      Crie sua conta e responda a uma avaliação criada por especialistas para entendermos suas necessidades e objetivos.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="text-lavender-300 mr-2 h-5 w-5 mt-0.5 shrink-0" />
                        <span className="text-white/90">Perguntas baseadas em metodologias científicas</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-lavender-300 mr-2 h-5 w-5 mt-0.5 shrink-0" />
                        <span className="text-white/90">Processo rápido (cerca de 5 minutos)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-lavender-300 mr-2 h-5 w-5 mt-0.5 shrink-0" />
                        <span className="text-white/90">100% confidencial e seguro</span>
                      </li>
                    </ul>
                  </li>
                  <li className="relative">
                    <div className="absolute -left-[41px] flex items-center justify-center w-8 h-8 rounded-full bg-lavender-400 text-teal-900 font-bold">2</div>
                    <h3 className="text-xl font-bold text-white mb-2">Recomendações personalizadas</h3>
                    <p className="text-white/80 mb-4">
                      Nosso algoritmo identifica os terapeutas e abordagens mais adequadas ao seu perfil e necessidades.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="text-lavender-300 mr-2 h-5 w-5 mt-0.5 shrink-0" />
                        <span className="text-white/90">Sugestão de diferentes abordagens terapêuticas</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-lavender-300 mr-2 h-5 w-5 mt-0.5 shrink-0" />
                        <span className="text-white/90">Compatibilidade entre perfis</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-lavender-300 mr-2 h-5 w-5 mt-0.5 shrink-0" />
                        <span className="text-white/90">Opções que se encaixam na sua disponibilidade</span>
                      </li>
                    </ul>
                  </li>
                  <li className="relative">
                    <div className="absolute -left-[41px] flex items-center justify-center w-8 h-8 rounded-full bg-lavender-400 text-teal-900 font-bold">3</div>
                    <h3 className="text-xl font-bold text-white mb-2">Agendamento e sessões</h3>
                    <p className="text-white/80 mb-4">
                      Escolha o terapeuta e horário que melhor se adequam à sua rotina e inicie sua jornada terapêutica.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="text-lavender-300 mr-2 h-5 w-5 mt-0.5 shrink-0" />
                        <span className="text-white/90">Visualização em tempo real da agenda dos profissionais</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-lavender-300 mr-2 h-5 w-5 mt-0.5 shrink-0" />
                        <span className="text-white/90">Opções online ou presenciais (conforme disponibilidade)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-lavender-300 mr-2 h-5 w-5 mt-0.5 shrink-0" />
                        <span className="text-white/90">Pagamentos seguros e facilitados</span>
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Tecnologia e bem-estar" 
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Perguntas <span className="text-lavender-400">frequentes</span>
              </h2>
              <p className="mt-4 text-white/80">
                Tire suas dúvidas sobre nossa plataforma
              </p>
            </div>
            
            <Accordion type="single" collapsible className="bg-teal-800/40 backdrop-blur-sm rounded-xl p-6 border border-lavender-400/20">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-lavender-400/10 last:border-0">
                  <AccordionTrigger className="text-left text-white hover:text-lavender-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-12 text-center">
              <p className="text-white/80 mb-6">
                Ainda tem dúvidas? Entre em contato com nossa equipe de suporte.
              </p>
              <Link to="/contato">
                <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium">
                  Fale conosco
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
