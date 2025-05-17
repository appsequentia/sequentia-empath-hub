import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Star, Check, Briefcase, Clock, Calendar } from "lucide-react";
import ScheduleAppointmentDialog from "@/components/appointments/ScheduleAppointmentDialog";

// Sample therapist data - in a real app this would come from an API or database
const therapistData = {
  id: "1",
  name: "Dra. Sofia Mendes",
  title: "Psicóloga Clínica",
  specialty: "Psicologia Cognitiva",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  cover: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  rating: 4.9,
  reviews: 124,
  price: 150,
  bio: "Sou psicóloga clínica com mais de 10 anos de experiência no atendimento a adultos e adolescentes. Especializada em Terapia Cognitivo-Comportamental, trabalho com questões relacionadas à ansiedade, depressão, fobias, estresse pós-traumático e problemas de autoestima.",
  approach: "Minha abordagem é baseada na Terapia Cognitivo-Comportamental, focada em identificar e modificar padrões de pensamento e comportamento que causam sofrimento. Trabalho de forma colaborativa com meus clientes para desenvolver estratégias práticas que promovam mudanças positivas e duradouras.",
  education: [
    {
      degree: "Doutorado em Psicologia Clínica",
      institution: "Universidade Federal de São Paulo",
      year: "2015"
    },
    {
      degree: "Mestrado em Neurociência Cognitiva",
      institution: "Universidade de São Paulo",
      year: "2012"
    },
    {
      degree: "Graduação em Psicologia",
      institution: "Universidade Estadual do Rio de Janeiro",
      year: "2010"
    }
  ],
  specializations: [
    "Ansiedade",
    "Depressão",
    "Transtornos de Humor",
    "Fobias",
    "Estresse",
    "Autoestima"
  ],
  languages: ["Português", "Inglês", "Espanhol"],
  reviewsList: [
    {
      name: "Marina L.",
      date: "15/04/2023",
      rating: 5,
      comment: "A Dra. Sofia é uma profissional excepcional. Me ajudou a superar um período muito difícil de ansiedade com técnicas práticas e eficazes."
    },
    {
      name: "Carlos R.",
      date: "22/03/2023",
      rating: 5,
      comment: "Estou em terapia com a Dra. Sofia há 6 meses e os resultados são surpreendentes. Recomendo fortemente."
    },
    {
      name: "Juliana M.",
      date: "05/02/2023",
      rating: 4,
      comment: "Excelente profissional, muito atenciosa e competente. As sessões são sempre produtivas e esclarecedoras."
    }
  ],
  availability: {
    Monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    Wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    Friday: ["14:00", "15:00", "16:00", "17:00"]
  }
};

const SpecialistDetail = () => {
  const { id } = useParams();
  // In a real app, we would fetch the therapist data based on the id
  const therapist = therapistData;
  
  return (
    <div className="min-h-screen bg-teal-900 text-white">
      <Header />
      <main className="pt-20">
        {/* Cover Image */}
        <div className="w-full h-48 md:h-64 bg-teal-800 relative overflow-hidden">
          <img 
            src={therapist.cover} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        {/* Profile Header */}
        <div className="max-w-5xl mx-auto px-6 md:px-10 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <img 
              src={therapist.avatar} 
              alt={therapist.name} 
              className="w-32 h-32 rounded-full border-4 border-lavender-400 object-cover"
            />
            
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-white">{therapist.name}</h1>
              <p className="text-lavender-300 text-lg">{therapist.title}</p>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {therapist.specializations.slice(0, 3).map((spec, index) => (
                  <span 
                    key={index}
                    className="bg-lavender-400/20 text-lavender-300 text-xs px-2 py-1 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
                {therapist.specializations.length > 3 && (
                  <span className="text-lavender-300 text-xs">
                    +{therapist.specializations.length - 3}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end mt-4 md:mt-0">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(therapist.rating) ? 'text-lavender-400 fill-lavender-400' : 'text-gray-400'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-white/90 text-sm">{therapist.rating} ({therapist.reviews} avaliações)</span>
              </div>
              
              <span className="text-white font-medium text-lg">R$ {therapist.price}/sessão</span>
            </div>
          </div>
        </div>
        
        {/* Content Tabs */}
        <div className="max-w-5xl mx-auto px-6 md:px-10 mt-8">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="bg-teal-800/40 border-b border-lavender-400/20 p-0 h-auto w-full">
              <TabsTrigger 
                value="profile" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Perfil
              </TabsTrigger>
              <TabsTrigger 
                value="experience" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Experiência
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Avaliações
              </TabsTrigger>
              <TabsTrigger 
                value="schedule" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Agenda
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-white mb-3">Sobre mim</h2>
                  <p className="text-white/80">{therapist.bio}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-white mb-3">Minha abordagem terapêutica</h2>
                  <p className="text-white/80">{therapist.approach}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-white mb-3">Especialidades</h2>
                  <div className="flex flex-wrap gap-2">
                    {therapist.specializations.map((spec, index) => (
                      <span 
                        key={index}
                        className="bg-lavender-400/20 text-lavender-300 px-3 py-1 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-white mb-3">Idiomas</h2>
                  <div className="flex flex-wrap gap-2">
                    {therapist.languages.map((lang, index) => (
                      <span 
                        key={index}
                        className="bg-teal-700/40 text-white/90 px-3 py-1 rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                    <Check className="h-5 w-5 mr-2 text-lavender-400" />
                    Formação Acadêmica
                  </h2>
                  
                  <div className="space-y-4">
                    {therapist.education.map((edu, index) => (
                      <div 
                        key={index} 
                        className="bg-teal-700/40 p-4 rounded-md border-l-4 border-lavender-400"
                      >
                        <h3 className="text-white font-medium">{edu.degree}</h3>
                        <p className="text-lavender-300 text-sm">{edu.institution}</p>
                        <p className="text-white/60 text-sm mt-1">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-lavender-400" />
                    Experiência Profissional
                  </h2>
                  
                  <div className="bg-teal-700/40 p-4 rounded-md border-l-4 border-lavender-400">
                    <h3 className="text-white font-medium">Psicóloga Clínica</h3>
                    <p className="text-lavender-300 text-sm">Clínica Mente Saudável</p>
                    <p className="text-white/60 text-sm mt-1">2015 - Presente</p>
                  </div>
                  
                  <div className="bg-teal-700/40 p-4 rounded-md border-l-4 border-lavender-400 mt-4">
                    <h3 className="text-white font-medium">Pesquisadora em Psicologia Clínica</h3>
                    <p className="text-lavender-300 text-sm">Universidade Federal de São Paulo</p>
                    <p className="text-white/60 text-sm mt-1">2012 - 2015</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-white">Avaliações de clientes</h2>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-white mr-2">{therapist.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(therapist.rating) ? 'text-lavender-400 fill-lavender-400' : 'text-gray-400'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {therapist.reviewsList.map((review, index) => (
                      <div 
                        key={index}
                        className="border-b border-lavender-400/10 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="text-white font-medium">{review.name}</h3>
                            <p className="text-white/60 text-sm">{review.date}</p>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'text-lavender-400 fill-lavender-400' : 'text-gray-400'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-white/80">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-white mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-lavender-400" />
                    Disponibilidade
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(therapist.availability).map(([day, times]) => (
                      <div key={day} className="bg-teal-700/40 p-4 rounded-md">
                        <h3 className="text-white font-medium border-b border-lavender-400/20 pb-2 mb-3">{day}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {times.map((time) => (
                            <div 
                              key={time} 
                              className="bg-lavender-400/20 text-white text-center py-2 rounded cursor-pointer hover:bg-lavender-400/30 transition-colors flex items-center justify-center"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="text-sm">{time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <ScheduleAppointmentDialog therapistId={therapist.id} therapistName={therapist.name} />
                </CardContent>
              </Card>
              
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-white mb-3">Informações sobre consultas</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-lavender-400/20 p-2 rounded mr-3">
                        <Clock className="h-5 w-5 text-lavender-300" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Duração da sessão</h3>
                        <p className="text-white/80 text-sm">50 minutos</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-lavender-400/20 p-2 rounded mr-3">
                        <Clock className="h-5 w-5 text-lavender-300" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Política de cancelamento</h3>
                        <p className="text-white/80 text-sm">Cancelamento gratuito até 24 horas antes da sessão</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-lavender-400/20 p-2 rounded mr-3">
                        <Clock className="h-5 w-5 text-lavender-300" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Modalidades de atendimento</h3>
                        <p className="text-white/80 text-sm">Presencial e online</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SpecialistDetail;
