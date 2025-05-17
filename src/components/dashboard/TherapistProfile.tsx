
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EditProfileDialog from "@/components/specialists/EditProfileDialog";

interface TherapistProfileData {
  name: string;
  bio: string;
  approach: string;
  price: number;
  avatar: string;
  specializations: string[];
  rating: number;
  reviews: number;
}

const TherapistProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<TherapistProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";
  const email = user?.email || "";
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Buscar perfil básico
        const { data: profileData, error: profileError } = await supabase
          .from('therapist_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Erro ao buscar perfil:", profileError);
          return;
        }
        
        // Buscar especialidades
        const { data: specializationsData, error: specializationsError } = await supabase
          .from('therapist_specializations')
          .select('specialization')
          .eq('therapist_id', user.id);
          
        if (specializationsError) {
          console.error("Erro ao buscar especialidades:", specializationsError);
        }
        
        const specializations = specializationsData?.map(item => item.specialization) || [];
        
        if (profileData) {
          setProfileData({
            ...profileData,
            specializations
          });
        } else {
          // Criar perfil básico se não existir
          const newProfile = {
            id: user.id,
            name: `${firstName} ${lastName}`.trim(),
            bio: "",
            approach: "",
            price: 0,
            avatar: "",
            specializations: [],
            rating: 0,
            reviews: 0
          };
          
          const { error: insertError } = await supabase
            .from('therapist_profiles')
            .insert({
              id: newProfile.id,
              name: newProfile.name
            });
            
          if (insertError) {
            console.error("Erro ao criar perfil:", insertError);
          } else {
            setProfileData(newProfile);
          }
        }
      } catch (error) {
        console.error("Erro ao processar dados do perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, firstName, lastName]);

  return (
    <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white text-xl">Meu Perfil</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="border-red-400/50 text-white hover:bg-red-500/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-white/60">Carregando perfil...</p>
          </div>
        ) : profileData ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-lavender-400"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-lavender-400/20 flex items-center justify-center text-white text-xl">
                    {profileData.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-white text-lg font-medium">{profileData.name}</h2>
                <p className="text-white/70">{email}</p>
                
                {profileData.price > 0 && (
                  <p className="text-lavender-300 mt-1">
                    R$ {profileData.price}/sessão
                  </p>
                )}
              </div>
            </div>
            
            {profileData.rating > 0 && (
              <div className="flex items-center text-white/70">
                <span className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(profileData.rating)
                          ? "text-lavender-400 fill-lavender-400"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                  <span className="ml-2">
                    {profileData.rating.toFixed(1)} ({profileData.reviews} avaliações)
                  </span>
                </span>
              </div>
            )}
            
            {/* Especialidades */}
            {profileData.specializations.length > 0 && (
              <div>
                <span className="text-white/60 text-sm block mb-2">Especialidades:</span>
                <div className="flex flex-wrap gap-2">
                  {profileData.specializations.map((specialty, index) => (
                    <span 
                      key={index}
                      className="bg-lavender-400/20 text-white px-2 py-1 text-xs rounded-md"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Bio resumida */}
            {profileData.bio && (
              <div>
                <span className="text-white/60 text-sm">Biografia:</span>
                <p className="text-white/90 mt-1">
                  {profileData.bio.length > 100
                    ? `${profileData.bio.substring(0, 100)}...`
                    : profileData.bio}
                </p>
              </div>
            )}
            
            {/* Botão de editar perfil */}
            <div className="pt-2">
              <EditProfileDialog
                therapistId={user?.id || ""}
                therapistData={{
                  name: profileData.name,
                  bio: profileData.bio || "",
                  approach: profileData.approach || "",
                  price: profileData.price,
                  specializations: profileData.specializations,
                  avatar: profileData.avatar || ""
                }}
                canEdit={true}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-white/60">Perfil não encontrado.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistProfile;
