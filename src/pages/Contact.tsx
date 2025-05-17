
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Mensagem enviada",
        description: "Recebemos sua mensagem e retornaremos em breve.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-teal-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16 lg:py-24 mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Fale com a gente</h1>
            <p className="text-lg text-white/80">
              Estamos aqui para te ajudar. Envie sua mensagem e responderemos o quanto antes.
            </p>
          </div>

          <div className="bg-teal-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-lavender-400/20 transition-all hover:border-lavender-400/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className="mt-1 bg-teal-700/50 border-lavender-400/30 focus:border-lavender-400 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="mt-1 bg-teal-700/50 border-lavender-400/30 focus:border-lavender-400 text-white"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-white">Tipo de assunto</Label>
                <Select value={subject} onValueChange={setSubject} required>
                  <SelectTrigger className="mt-1 bg-teal-700/50 border-lavender-400/30 focus:border-lavender-400 text-white">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent className="bg-teal-800 border-lavender-400/30">
                    <SelectItem value="support" className="text-white focus:bg-lavender-400/30">Suporte</SelectItem>
                    <SelectItem value="question" className="text-white focus:bg-lavender-400/30">Dúvidas</SelectItem>
                    <SelectItem value="suggestion" className="text-white focus:bg-lavender-400/30">Sugestão</SelectItem>
                    <SelectItem value="other" className="text-white focus:bg-lavender-400/30">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message" className="text-white">Mensagem</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem aqui..."
                  required
                  className="mt-1 min-h-32 bg-teal-700/50 border-lavender-400/30 focus:border-lavender-400 text-white"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? "Enviando..." : "Enviar mensagem"}
              </Button>
            </form>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-teal-800/30 backdrop-blur-sm rounded-lg p-6 border border-lavender-400/10 transition-all hover:border-lavender-400/30 hover:bg-teal-800/40">
              <div className="flex justify-center mb-4">
                <Mail className="h-8 w-8 text-lavender-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">E-mail</h3>
              <p className="text-white/80">contato@sequentia.app</p>
            </div>

            <div className="bg-teal-800/30 backdrop-blur-sm rounded-lg p-6 border border-lavender-400/10 transition-all hover:border-lavender-400/30 hover:bg-teal-800/40">
              <div className="flex justify-center mb-4">
                <Phone className="h-8 w-8 text-lavender-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Telefone</h3>
              <p className="text-white/80">(11) 99999-0000</p>
            </div>

            <div className="bg-teal-800/30 backdrop-blur-sm rounded-lg p-6 border border-lavender-400/10 transition-all hover:border-lavender-400/30 hover:bg-teal-800/40">
              <div className="flex justify-center mb-4">
                <Clock className="h-8 w-8 text-lavender-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Horário</h3>
              <p className="text-white/80">Segunda a sexta, das 9h às 18h</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
