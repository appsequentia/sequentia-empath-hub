
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ricardo Oliveira",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    text: "O processo de diagnóstico da Sequentia foi surpreendentemente preciso. Encontrei uma terapeuta que realmente entende minhas necessidades.",
    rating: 5
  },
  {
    name: "Fernanda Costa",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    text: "Estava hesitante no início, mas o sistema de recomendação me conectou com um terapeuta que realmente me ajudou a superar um momento difícil.",
    rating: 5
  },
  {
    name: "Bruno Santos",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    text: "A facilidade de agendar sessões e a qualidade dos profissionais fizeram toda a diferença no meu processo terapêutico.",
    rating: 4
  }
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            O que nossos <span className="text-lavender-400">clientes</span> dizem
          </h2>
          <p className="mt-4 text-white/80">
            Histórias reais de pessoas que transformaram suas vidas através da Sequentia
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
              <CardContent className="p-6">
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? 'text-lavender-400 fill-lavender-400' : 'text-gray-400'}`}
                    />
                  ))}
                </div>
                
                <p className="text-white/90 italic">"{testimonial.text}"</p>
                
                <div className="mt-6 flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="ml-3 text-white font-medium">{testimonial.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
