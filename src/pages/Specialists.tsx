
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Search, Briefcase, GraduationCap, CheckCircle, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

// Sample therapist data - in a real app this would come from an API
const therapists = [
  {
    id: "1",
    name: "Dra. Sofia Mendes",
    title: "Psicóloga Clínica",
    specialty: "Psicologia Cognitiva",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 124,
    price: 150,
    description: "Especialista em terapia cognitivo-comportamental com mais de 10 anos de experiência.",
    specializations: ["Ansiedade", "Depressão", "Estresse"],
    education: "Doutorado em Psicologia Clínica, USP",
    experience: "10+ anos",
    availability: ["Segunda", "Quarta", "Sexta"]
  },
  {
    id: "2",
    name: "Dr. Rafael Costa",
    title: "Psicanalista",
    specialty: "Psicanálise",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 98,
    price: 180,
    description: "Psicanalista com abordagem focada em traumas e relacionamentos.",
    specializations: ["Trauma", "Relacionamentos", "Autoconhecimento"],
    education: "Mestrado em Psicanálise, UFRJ",
    experience: "8 anos",
    availability: ["Terça", "Quinta", "Sábado"]
  },
  {
    id: "3",
    name: "Dra. Camila Santos",
    title: "Terapeuta Familiar",
    specialty: "Terapia Sistêmica",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviews: 87,
    price: 160,
    description: "Especialista em terapia familiar e relacionamentos interpessoais.",
    specializations: ["Família", "Casais", "Crianças"],
    education: "Especialização em Terapia Familiar, PUC-SP",
    experience: "7 anos",
    availability: ["Segunda", "Quarta", "Sexta"]
  },
  {
    id: "4",
    name: "Dr. Pedro Oliveira",
    title: "Psicólogo Comportamental",
    specialty: "Terapia Comportamental",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    reviews: 76,
    price: 140,
    description: "Especialista em modificação comportamental e hábitos.",
    specializations: ["Compulsões", "Fobias", "Hábitos"],
    education: "Doutorado em Psicologia Comportamental, UNICAMP",
    experience: "9 anos",
    availability: ["Segunda", "Terça", "Quinta"]
  },
  {
    id: "5",
    name: "Dra. Beatriz Lima",
    title: "Neuropsicóloga",
    specialty: "Neuropsicologia",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 110,
    price: 190,
    description: "Especialista em avaliação e reabilitação neuropsicológica.",
    specializations: ["TDAH", "Dificuldades de Aprendizagem", "Doenças Neurodegenerativas"],
    education: "Pós-doutorado em Neuropsicologia, Universidade Federal de São Paulo",
    experience: "12 anos",
    availability: ["Terça", "Quinta", "Sexta"]
  },
  {
    id: "6",
    name: "Dr. Lucas Ferreira",
    title: "Psiquiatra",
    specialty: "Psiquiatria Geral",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 135,
    price: 220,
    description: "Psiquiatra com experiência em tratamento medicamentoso integrado à psicoterapia.",
    specializations: ["Transtornos de Humor", "Transtornos de Ansiedade", "Esquizofrenia"],
    education: "Residência em Psiquiatria, Hospital das Clínicas, USP",
    experience: "15 anos",
    availability: ["Segunda", "Quarta", "Sexta"]
  }
];

const specialties = [
  "Todas especialidades",
  "Psicologia Cognitiva",
  "Psicanálise",
  "Terapia Sistêmica",
  "Terapia Comportamental",
  "Neuropsicologia",
  "Psiquiatria"
];

const Specialists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas especialidades");
  const [sortBy, setSortBy] = useState("rating");

  const filteredTherapists = therapists
    .filter(therapist => 
      (therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
       therapist.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedSpecialty === "Todas especialidades" || therapist.specialty === selectedSpecialty)
    )
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      } else if (sortBy === "price_low") {
        return a.price - b.price;
      } else if (sortBy === "price_high") {
        return b.price - a.price;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-teal-900 text-white">
      <Header />
      <main className="pt-20 pb-16">
        {/* Hero section */}
        <div className="bg-teal-800/50 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Encontre o <span className="text-lavender-400">especialista ideal</span> para você
              </h1>
              <p className="text-white/80 max-w-2xl mx-auto text-lg">
                Nossa plataforma reúne os melhores profissionais em saúde mental, cuidadosamente selecionados para oferecer o atendimento que você precisa.
              </p>
            </div>
          </div>
        </div>
        
        {/* Filters and search */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 mt-10">
          <div className="bg-teal-800/40 backdrop-blur-sm p-6 rounded-lg border border-lavender-400/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm mb-2 text-white/80">Buscar especialista</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                  <Input 
                    id="search"
                    placeholder="Nome, especialidade..."
                    className="pl-10 bg-teal-700/40 border-lavender-400/20 text-white placeholder:text-white/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="specialty" className="block text-sm mb-2 text-white/80">Especialidade</label>
                <Select 
                  value={selectedSpecialty} 
                  onValueChange={setSelectedSpecialty}
                >
                  <SelectTrigger className="bg-teal-700/40 border-lavender-400/20 text-white w-full">
                    <SelectValue placeholder="Selecione uma especialidade" />
                  </SelectTrigger>
                  <SelectContent className="bg-teal-800 border-lavender-400/20">
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty} className="text-white hover:bg-lavender-400/20">
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="sort" className="block text-sm mb-2 text-white/80">Ordenar por</label>
                <Select 
                  value={sortBy} 
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="bg-teal-700/40 border-lavender-400/20 text-white w-full">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="bg-teal-800 border-lavender-400/20">
                    <SelectItem value="rating" className="text-white hover:bg-lavender-400/20">Melhor avaliação</SelectItem>
                    <SelectItem value="price_low" className="text-white hover:bg-lavender-400/20">Menor preço</SelectItem>
                    <SelectItem value="price_high" className="text-white hover:bg-lavender-400/20">Maior preço</SelectItem>
                    <SelectItem value="name" className="text-white hover:bg-lavender-400/20">Nome (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 mt-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-teal-800/40 border-b border-lavender-400/20 w-full justify-start overflow-x-auto">
              <TabsTrigger 
                value="all" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Todos
              </TabsTrigger>
              <TabsTrigger 
                value="online" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Atendimento Online
              </TabsTrigger>
              <TabsTrigger 
                value="in-person" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Atendimento Presencial
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {filteredTherapists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTherapists.map((therapist) => (
                    <TherapistCard key={therapist.id} therapist={therapist} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-white/80 text-lg">Nenhum especialista encontrado com esses critérios.</p>
                  <Button 
                    className="mt-4 bg-lavender-400 hover:bg-lavender-500 text-teal-900"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedSpecialty("Todas especialidades");
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="online" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTherapists.slice(0, 4).map((therapist) => (
                  <TherapistCard key={therapist.id} therapist={therapist} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="in-person" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTherapists.slice(2, 6).map((therapist) => (
                  <TherapistCard key={therapist.id} therapist={therapist} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Therapist card component
const TherapistCard = ({ therapist }) => {
  return (
    <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20 overflow-hidden animate-fade-in hover:scale-[1.02] transition-transform duration-300">
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
          
          <div className="mt-4 space-y-3">
            <p className="text-white/80">{therapist.description}</p>
            
            <div className="flex items-center text-sm">
              <GraduationCap className="h-4 w-4 text-lavender-400 mr-2" />
              <span className="text-white/90">{therapist.education}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Briefcase className="h-4 w-4 text-lavender-400 mr-2" />
              <span className="text-white/90">Experiência: {therapist.experience}</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {therapist.specializations.map((spec, index) => (
                <span 
                  key={index}
                  className="bg-lavender-400/20 text-lavender-300 text-xs px-2 py-1 rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
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
            <span className="text-white font-medium">R$ {therapist.price}/sessão</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-lavender-400/10 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {therapist.availability.map((day, index) => (
                <span 
                  key={index}
                  className="bg-teal-700/40 text-white/90 text-xs px-2 py-1 rounded-full"
                >
                  {day}
                </span>
              ))}
            </div>
            
            <Link to={`/specialists/${therapist.id}`}>
              <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900">
                <CheckCircle className="h-4 w-4 mr-2" />
                Ver perfil
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Specialists;
