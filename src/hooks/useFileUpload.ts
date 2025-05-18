
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useFileUpload = (bucketName = 'therapist_docs') => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [bucketReady, setBucketReady] = useState<boolean | null>(null);

  // Function to upload file to storage
  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    try {
      setIsUploading(true);
      console.log("Starting upload for file:", file.name, "to path:", path);
      
      if (!file) {
        console.error("No file provided for upload");
        return null;
      }
      
      if (bucketReady === false) {
        console.error("Storage bucket not ready or accessible");
        throw new Error("O sistema de armazenamento está indisponível no momento. Tente novamente mais tarde.");
      }
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        throw new Error(`O arquivo ${file.name} excede o limite de 5MB.`);
      }
      
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;
      
      console.log("Uploading to:", filePath);
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw new Error(`Erro ao enviar ${file.name}: ${uploadError.message}`);
      }
      
      console.log("Upload successful, data:", data);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      console.log("Public URL:", urlData.publicUrl);
      
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('File upload error:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Erro ao enviar arquivo",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const updateBucketStatus = (status: boolean) => {
    setBucketReady(status);
  };

  return {
    uploadFile,
    isUploading,
    bucketReady,
    updateBucketStatus
  };
};
