
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  client_id: string;
  client_name?: string;
}

interface TherapistReviewsProps {
  therapistId: string | undefined;
}

const TherapistReviews: React.FC<TherapistReviewsProps> = ({ therapistId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const { toast } = useToast();

  const fetchReviewsData = async () => {
    if (!therapistId) return;

    setIsLoading(true);
    try {
      // Buscar as avaliações do terapeuta
      const { data, error } = await supabase
        .from('therapist_reviews')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar avaliações:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as avaliações.",
          variant: "destructive",
        });
        return;
      }

      // Buscar os nomes dos clientes que fizeram as avaliações
      const reviewsWithClientNames = await Promise.all((data || []).map(async (review) => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', review.client_id)
          .single();

        let clientName = "Cliente Anônimo";
        if (profileData) {
          clientName = `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim();
          if (!clientName) clientName = "Cliente Anônimo";
        }

        return {
          ...review,
          client_name: clientName
        };
      }));

      setReviews(reviewsWithClientNames);
      
      // Calcular a média das avaliações
      if (reviewsWithClientNames.length > 0) {
        const sum = reviewsWithClientNames.reduce((acc, review) => acc + review.rating, 0);
        setAvgRating(sum / reviewsWithClientNames.length);
        setReviewsCount(reviewsWithClientNames.length);
      } else {
        setAvgRating(0);
        setReviewsCount(0);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, [therapistId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Star className="h-5 w-5 text-lavender-400" />
          Avaliações de Clientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-white/70 py-4">Carregando avaliações...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-lavender-400/30" />
            <p className="text-white/70">Você ainda não recebeu avaliações.</p>
            <p className="text-white/50 text-sm mt-1">
              As avaliações aparecerão aqui quando seus clientes avaliarem suas sessões.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumo das avaliações */}
            <div className="flex items-center justify-between p-4 bg-teal-700/30 rounded-md">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-white">{avgRating.toFixed(1)}</div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(avgRating)
                            ? "text-lavender-400 fill-lavender-400"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">{reviewsCount} avaliações</p>
                  <p className="text-white/70 text-sm">Média geral</p>
                </div>
              </div>
              <Button 
                variant="outline"
                className="text-lavender-300 border-lavender-400/30 hover:bg-lavender-400/20"
              >
                Ver todas
              </Button>
            </div>
            
            {/* Lista de avaliações */}
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div 
                  key={review.id} 
                  className="p-4 bg-teal-700/30 rounded-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-lavender-400/30 rounded-full flex items-center justify-center text-lavender-300 font-medium">
                        {review.client_name?.charAt(0) || "A"}
                      </div>
                      <span className="font-medium text-white">{review.client_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/70">
                      <Calendar className="h-3 w-3 mr-0.5" />
                      {formatDate(review.created_at)}
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < review.rating
                            ? "text-lavender-400 fill-lavender-400"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  {review.comment ? (
                    <p className="text-white/90 text-sm">{review.comment}</p>
                  ) : (
                    <p className="text-white/50 italic text-sm">Sem comentários adicionais</p>
                  )}
                </div>
              ))}
              
              {reviews.length > 5 && (
                <div className="text-center pt-2">
                  <Button
                    variant="outline"
                    className="text-lavender-300 border-lavender-400/30 hover:bg-lavender-400/20"
                  >
                    Carregar mais avaliações
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistReviews;
