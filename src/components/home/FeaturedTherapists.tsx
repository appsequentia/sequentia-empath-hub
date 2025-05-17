
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const therapists = [
  {
    id: "1",
    name: "Dra. Sofia Mendes",
    specialty: "Psicologia Cognitiva",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    reviews: 124,
    price: 150,
    description: "Especialista em terapia cognitivo-comportamental com mais de 10 anos de experiência."
  },
  {
    id: "2",
    name: "Dr. Rafael Costa",
    specialty: "Psicanálise",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    rating: 4.8,
    reviews: 98,
    price: 180,
    description: "Psicanalista com abordagem focada em traumas e relacionamentos."
  },
  {
    id: "3",
    name: "Dra. Camila Santos",
    specialty: "Terapia Sistêmica",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80", 
    rating: 4.7,
    reviews: 87,
    price: 160,
    description: "Especialista em terapia familiar e relacionamentos interpessoais."
  },
];

export function FeaturedTherapists() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Terapeutas <span className="text-lavender-400">destacados</span>
            </h2>
            <p className="mt-2 text-white/80 max-w-xl">
              Profissionais altamente qualificados e bem avaliados pelos clientes
            </p>
          </div>
          <Link to="/specialists">
            <Button variant="outline" className="mt-4 md:mt-0 bg-transparent border-lavender-400 text-white hover:bg-lavender-500/20">
              Ver todos os especialistas
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <Card key={therapist.id} className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center">
                    <img 
                      src={therapist.avatar} 
                      alt={therapist.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-lavender-400"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">{therapist.name}</h3>
                      <p className="text-lavender-300">{therapist.specialty}</p>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-white/80 text-sm">{therapist.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
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
                    <span className="text-white font-medium">R$ {therapist.price}/h</span>
                  </div>
                  
                  <Link to={`/specialists/${therapist.id}`}>
                    <Button className="w-full mt-6 bg-lavender-400 hover:bg-lavender-500 text-teal-900">
                      Ver perfil
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
