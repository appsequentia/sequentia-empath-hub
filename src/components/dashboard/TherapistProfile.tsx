import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EditProfileDialog from "@/components/specialists/EditProfileDialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  return <div>
      <div className="flex justify-between items-center mb-4">
        <CardTitle className="text-white text-xl">Meu Perfil</CardTitle>
        
      </div>

      {isLoading ? <div className="text-center py-4">
          <p className="text-white/60">Carregando perfil...</p>
        </div> : profileData ? <div>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-teal-700/40 border-b border-lavender-400/20 p-0 h-auto w-full">
              <TabsTrigger value="profile" className="py-2 px-4 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none">
                Perfil
              </TabsTrigger>
              <TabsTrigger value="edit" className="py-2 px-4 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none">
                Editar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="pt-4">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-shrink-0">
                    {profileData.avatar ? <img src={profileData.avatar} alt={profileData.name} className="w-16 h-16 rounded-full object-cover border-2 border-lavender-400" /> : <div className="w-16 h-16 rounded-full bg-lavender-400/20 flex items-center justify-center text-white text-xl">
                        {profileData.name.charAt(0)}
                      </div>}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-white text-lg font-medium">{profileData.name}</h2>
                    <div className="text-white/70">{email}</div>
                    {profileData.title && <p className="text-lavender-300/80 text-sm">{profileData.title}</p>}
                    
                    {profileData.price > 0 ? <p className="text-lavender-300 mt-1">
                        R$ {profileData.price}/sessão
                      </p> : <p className="text-white/50 mt-1 text-sm italic">
                        Defina o valor da sessão
                      </p>}
                  </div>
                </div>
                
                {profileData.rating > 0 && <div className="flex items-center text-white/70">
                    <span className="flex items-center">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} className={`${i < Math.floor(profileData.rating) ? "text-lavender-400 fill-lavender-400" : "text-gray-400"}`} />)}
                      <span className="ml-2">
                        {profileData.rating.toFixed(1)} ({profileData.reviews} avaliações)
                      </span>
                    </span>
                  </div>}
                
                {/* Especialidades */}
                <div>
                  <span className="text-white/60 text-sm block mb-2">Especialidades:</span>
                  {profileData.specializations.length > 0 ? <div className="flex flex-wrap gap-2">
                      {profileData.specializations.map((specialty, index) => <span key={index} className="bg-lavender-400/20 text-white px-2 py-1 text-xs rounded-md">
                          {specialty}
                        </span>)}
                    </div> : <p className="text-white/50 text-sm italic">Adicione suas especialidades</p>}
                </div>
                
                {/* Bio resumida */}
                <div>
                  <span className="text-white/60 text-sm">Biografia:</span>
                  {profileData.bio ? <p className="text-white/90 mt-1">
                      {profileData.bio.length > 100 ? `${profileData.bio.substring(0, 100)}...` : profileData.bio}
                    </p> : <p className="text-white/50 text-sm italic mt-1">
                      Adicione uma biografia para que seus clientes possam conhecer você melhor
                    </p>}
                </div>
                
                {/* Mensagem de perfil incompleto */}
                {!isProfileComplete && <div className="bg-amber-600/30 p-4 rounded-md mt-4 border border-amber-500/20">
                    <p className="text-white text-sm">
                      <strong>Perfil incompleto:</strong> Complete todas as informações do seu perfil para aparecer na listagem pública.
                      Itens necessários: título profissional, biografia, valor da sessão, foto de perfil e especialidades.
                    </p>
                  </div>}
              </div>
            </TabsContent>
            
            <TabsContent value="edit" className="pt-4">
              {user && profileData && <EditProfileDialog therapistId={user.id} therapistData={{
            name: profileData.name,
            title: profileData.title || "",
            bio: profileData.bio || "",
            approach: profileData.approach || "",
            price: profileData.price,
            specializations: profileData.specializations,
            avatar: profileData.avatar || ""
          }} canEdit={true} inline={true} />}
            </TabsContent>
          </Tabs>
        </div> : <div className="text-center py-4">
          <p className="text-white/60">Perfil não encontrado.</p>
        </div>}
    </div>;
};
export default TherapistProfile;