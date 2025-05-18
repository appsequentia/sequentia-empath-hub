
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";

interface DocumentationStepProps {
  form: UseFormReturn<any>;
}

const DocumentationStep: React.FC<DocumentationStepProps> = ({ form }) => {
  const [profilePictureFile, setProfilePictureFile] = useState<string | null>(null);
  const [certificateFile, setCertificateFile] = useState<string | null>(null);
  const [idDocumentFile, setIdDocumentFile] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Handler para exibir preview de arquivos de imagem
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: (url: string | null) => void, fieldName: string) => {
    const file = event.target.files?.[0];
    setUploadError(null);
    
    if (!file) {
      setFile(null);
      return;
    }
    
    // Verificar tamanho do arquivo (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      setUploadError(`O arquivo excede o tamanho máximo permitido de 5MB.`);
      return;
    }
    
    // Verificar tipos de arquivos permitidos
    const allowedTypes = fieldName === 'profilePicture' 
      ? ['image/jpeg', 'image/png', 'image/jpg']
      : ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      
    if (!allowedTypes.includes(file.type)) {
      setUploadError(`Formato de arquivo não permitido. Use ${fieldName === 'profilePicture' ? 'JPEG/PNG' : 'PDF, JPEG ou PNG'}.`);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getFileTypeIcon = (fileUrl: string | null) => {
    if (!fileUrl) return null;
    
    if (fileUrl.startsWith('data:image')) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (fileUrl.startsWith('data:application/pdf')) {
      return <File className="h-5 w-5 text-blue-500" />;
    }
    
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };
  
  const getFileName = (fieldName: string, fileUrl: string | null) => {
    if (!fileUrl) return null;
    
    const file = form.getValues(fieldName);
    if (file && file.name) {
      return file.name;
    }
    
    return fieldName === 'profilePicture' 
      ? 'foto-perfil' 
      : fieldName === 'certificate' 
        ? 'certificado' 
        : 'documento-identidade';
  };
  
  return (
    <div className="space-y-6">
      {uploadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{uploadError}</span>
        </Alert>
      )}
      
      <FormField
        control={form.control}
        name="profilePicture"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel className="text-white">Foto de Perfil</FormLabel>
            <FormControl>
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-40 h-40 rounded-full flex items-center justify-center mb-4 overflow-hidden",
                    "bg-teal-700/50 border-2 border-dashed border-lavender-400/30"
                  )}
                >
                  {profilePictureFile ? (
                    <img 
                      src={profilePictureFile} 
                      alt="Preview da foto de perfil" 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Upload className="h-10 w-10 text-white/50" />
                  )}
                </div>
                
                <Label
                  htmlFor="profile-picture-upload"
                  className="cursor-pointer bg-lavender-400/30 hover:bg-lavender-400/40 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {profilePictureFile ? "Alterar foto" : "Selecionar foto"}
                </Label>
                
                <Input
                  id="profile-picture-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    handleFileChange(e, setProfilePictureFile, "profilePicture");
                    onChange(e.target.files?.[0] || null);
                  }}
                  {...field}
                />
                
                {profilePictureFile && (
                  <div className="flex items-center mt-2 text-sm text-white/80">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="truncate max-w-[200px]">
                      {getFileName("profilePicture", profilePictureFile)}
                    </span>
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription className="text-center text-white/50 text-sm">
              Uma foto profissional aumenta a confiança dos clientes
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="certificate"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel className="text-white">Certificado de Formação/Capacitação</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "flex-1 flex items-center p-4 rounded-md",
                  "bg-teal-700/50 border border-dashed border-lavender-400/30",
                  certificateFile && "border-green-400/40 bg-teal-700/60"
                )}>
                  <div className="flex-1 flex items-center">
                    {certificateFile ? (
                      <>
                        {getFileTypeIcon(certificateFile)}
                        <span className="text-white ml-2 truncate">
                          {getFileName("certificate", certificateFile)}
                        </span>
                      </>
                    ) : (
                      <p className="text-white/50">Nenhum arquivo selecionado</p>
                    )}
                  </div>
                  
                  <Label
                    htmlFor="certificate-upload"
                    className="cursor-pointer ml-auto bg-lavender-400/30 hover:bg-lavender-400/40 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {certificateFile ? "Alterar" : "Upload"}
                  </Label>
                </div>
                
                <Input
                  id="certificate-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    handleFileChange(e, setCertificateFile, "certificate");
                    onChange(e.target.files?.[0] || null);
                  }}
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription className="text-white/50 text-sm">
              Formatos aceitos: PDF, DOC, JPEG, PNG (máx 5MB)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="idDocument"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel className="text-white">Documento de Identidade com Foto</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "flex-1 flex items-center p-4 rounded-md",
                  "bg-teal-700/50 border border-dashed border-lavender-400/30",
                  idDocumentFile && "border-green-400/40 bg-teal-700/60"
                )}>
                  <div className="flex-1 flex items-center">
                    {idDocumentFile ? (
                      <>
                        {getFileTypeIcon(idDocumentFile)}
                        <span className="text-white ml-2 truncate">
                          {getFileName("idDocument", idDocumentFile)}
                        </span>
                      </>
                    ) : (
                      <p className="text-white/50">Nenhum arquivo selecionado</p>
                    )}
                  </div>
                  
                  <Label
                    htmlFor="id-document-upload"
                    className="cursor-pointer ml-auto bg-lavender-400/30 hover:bg-lavender-400/40 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {idDocumentFile ? "Alterar" : "Upload"}
                  </Label>
                </div>
                
                <Input
                  id="id-document-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    handleFileChange(e, setIdDocumentFile, "idDocument");
                    onChange(e.target.files?.[0] || null);
                  }}
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription className="text-white/50 text-sm">
              RG, CNH ou outro documento oficial com foto
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-lavender-400 data-[state=checked]:border-lavender-400"
              />
            </FormControl>
            <div className="space-y-1">
              <FormLabel className="text-white">
                Aceito os <a href="#" className="text-lavender-300 hover:underline">termos de serviço</a> e a <a href="#" className="text-lavender-300 hover:underline">política de privacidade</a>
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default DocumentationStep;
