import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EditProfileDialog from "@/components/specialists/EditProfileDialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TherapistProfileData {
  name: string;
  bio: string;
  approach: string;
  price: number;
  avatar: string;
  cover: string;
  specializations: string[];
  rating: number;
  reviews: number;
  title: string;
}

const TherapistProfile: React.FC = () => {
  const {
    user,
    signOut
  } = useAuth();
  const [profileData, setProfileData] = useState<TherapistProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    toast
  } = useToast();
  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";
  const email = user?.email || "";
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        console.log("Buscando perfil para usuário ID:", user.id);

        // Buscar perfil básico
        const {
          data: profileData,
          error: profileError
        } = await supabase.from('therapist_profiles').select('*').eq('id', user.id).single();
        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
          if (profileError.code === 'PGRST116') {
            console.log("Perfil não encontrado. Criando um novo...");
            // Criar perfil básico se não existir
            const fullName = `${firstName} ${lastName}`.trim();
            const newProfile = {
              id: user.id,
              name: fullName || "Novo Terapeuta",
              title: "",
              bio: "",
              approach: "",
              price: 0,
              avatar: "",
              cover: "",
              specializations: [],
              rating: 0,
              reviews: 0
            };
            console.log("Inserindo novo perfil:", newProfile);
            const {
              data: insertData,
              error: insertError
            } = await supabase.from('therapist_profiles').insert({
              id: newProfile.id,
              name: newProfile.name,
              title: "",
              bio: "",
              approach: "",
              price: 0,
              avatar: "",
              cover: "",
              is_approved: false // Garantir que novos perfis comecem como não aprovados
            }).select();
            if (insertError) {
              console.error("Erro ao criar perfil:", insertError);
              toast({
                title: "Erro ao criar perfil",
                description: "Não foi possível criar seu perfil. Erro: " + insertError.message,
                variant: "destructive"
              });
              return;
            } else {
              console.log("Perfil criado com sucesso:", insertData);
              setProfileData(newProfile);
              toast({
                title: "Perfil criado",
                description: "Seu perfil foi criado com sucesso. Complete suas informações para aparecer na listagem pública."
              });
            }
          } else {
            // Outro erro que não seja "não encontrado"
            toast({
              title: "Erro ao buscar perfil",
              description: "Ocorreu um erro ao buscar seu perfil. Tente novamente mais tarde.",
              variant: "destructive"
            });
            return;
          }
        } else if (profileData) {
          console.log("Perfil encontrado:", profileData);

          // Buscar especialidades
          const {
            data: specializationsData,
            error: specializationsError
          } = await supabase.from('therapist_specializations').select('specialization').eq('therapist_id', user.id);
          if (specializationsError) {
            console.error("Erro ao buscar especialidades:", specializationsError);
          }
          const specializations = specializationsData?.map(item => item.specialization) || [];
          console.log("Especialidades encontradas:", specializations);
          setProfileData({
            ...profileData,
            specializations
          });
        }
      } catch (error) {
        console.error("Erro ao processar dados do perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [user, firstName, lastName, toast]);
  const isProfileComplete = profileData && profileData.bio && profileData.title && profileData.price > 0 && profileData.avatar && profileData.specializations.length > 0;
  return (
    <div>
      {isLoading ? (
        <div className="text-center py-4">
          <p className="text-white/60">Carregando perfil...</p>
        </div>
      ) : profileData ? (
        <div>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-teal-700/40 border-b border-lavender-400/20 mb-6">
              <TabsTrigger value="profile">
                Perfil
              </TabsTrigger>
              <TabsTrigger value="edit">
                Editar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Avatar centralizado */}
                <div className="flex justify-center mb-2">
                  {profileData.avatar ? (
                    <Avatar className="w-24 h-24 border-2 border-lavender-400">
                      <AvatarImage src={profileData.avatar} alt={profileData.name} />
                      <AvatarFallback className="bg-lavender-400/20 text-white text-xl">
                        {profileData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="w-24 h-24 bg-lavender-400/20 border-2 border-lavender-400/50">
                      <AvatarFallback className="text-white text-2xl">
                        {profileData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                
                {/* Dados do terapeuta */}
                <div className="space-y-2">
                  <h2 className="text-white text-xl font-medium">{profileData.name}</h2>
                  <p className="text-white/70">{email}</p>
                  {profileData.title && <p className="text-lavender-300">{profileData.title}</p>}
                  
                  {profileData.price > 0 ? (
                    <p className="text-lavender-300 mt-1 font-semibold">
                      R$ {profileData.price}/sessão
                    </p>
                  ) : (
                    <p className="text-white/50 mt-1 text-sm italic">
                      Defina o valor da sessão
                    </p>
                  )}
                </div>
                
                {/* Rating */}
                {profileData.rating > 0 && (
                  <div className="flex items-center justify-center text-white/70 mt-2">
                    <span className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={`${i < Math.floor(profileData.rating) ? "text-lavender-400 fill-lavender-400" : "text-gray-400"}`} 
                        />
                      ))}
                      <span className="ml-2">
                        {profileData.rating.toFixed(1)} ({profileData.reviews} avaliações)
                      </span>
                    </span>
                  </div>
                )}
                
                <div className="w-full border-t border-lavender-400/10 my-4 pt-4"></div>
                
                {/* Especialidades */}
                <div className="w-full">
                  <span className="text-white/60 text-sm block mb-2 text-left">Especialidades:</span>
                  {profileData.specializations.length > 0 ? (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {profileData.specializations.map((specialty, index) => (
                        <span key={index} className="bg-lavender-400/20 text-white px-3 py-1 text-sm rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/50 text-sm italic text-left">Adicione suas especialidades</p>
                  )}
                </div>
                
                {/* Bio resumida */}
                <div className="w-full mt-4">
                  <span className="text-white/60 text-sm block mb-2 text-left">Biografia:</span>
                  {profileData.bio ? (
                    <p className="text-white/90 text-left">
                      {profileData.bio.length > 100 ? `${profileData.bio.substring(0, 100)}...` : profileData.bio}
                    </p>
                  ) : (
                    <p className="text-white/50 text-sm italic text-left">
                      Adicione uma biografia para que seus clientes possam conhecer você melhor
                    </p>
                  )}
                </div>
                
                {/* Mensagem de perfil incompleto */}
                {!isProfileComplete && (
                  <div className="bg-amber-600/30 p-4 rounded-md mt-4 border border-amber-500/20 w-full">
                    <p className="text-white text-sm">
                      <strong>Perfil incompleto:</strong> Complete todas as informações do seu perfil para aparecer na listagem pública.
                      Itens necessários: título profissional, biografia, valor da sessão, foto de perfil e especialidades.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="edit">
              {user && profileData && (
                <EditProfileDialog 
                  therapistId={user.id} 
                  therapistData={{
                    name: profileData.name,
                    title: profileData.title || "",
                    bio: profileData.bio || "",
                    approach: profileData.approach || "",
                    price: profileData.price,
                    specializations: profileData.specializations,
                    avatar: profileData.avatar || ""
                  }} 
                  canEdit={true} 
                  inline={true} 
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-white/60">Perfil não encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default TherapistProfile;
