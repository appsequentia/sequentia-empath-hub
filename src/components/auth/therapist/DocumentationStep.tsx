
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Upload, File, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentationStepProps {
  form: UseFormReturn<any>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const ALLOWED_DOC_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf'];

const DocumentationStep: React.FC<DocumentationStepProps> = ({ form }) => {
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [idDocumentPreview, setIdDocumentPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string>("");
  const [previewName, setPreviewName] = useState<string>("");
  
  // Verificar se campos obrigatórios estão preenchidos
  const profilePicture = form.watch("profilePicture");
  const certificate = form.watch("certificate");
  const idDocument = form.watch("idDocument");
  const termsAccepted = form.watch("termsAccepted");
  
  // Handle file selection and validation
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>, 
    setPreview: (url: string | null) => void, 
    fieldName: string,
    allowedTypes: string[]
  ) => {
    const file = event.target.files?.[0];
    setUploadError(null);
    
    if (!file) {
      setPreview(null);
      return;
    }
    
    console.log(`Validating ${fieldName} file:`, file.name, file.type, file.size);
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `O arquivo ${file.name} excede o tamanho máximo permitido de 5MB.`;
      setUploadError(errorMsg);
      form.setError(fieldName as any, { message: errorMsg });
      event.target.value = '';
      return;
    }
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const typeNames = fieldName === 'profilePicture' 
        ? 'JPEG/PNG' 
        : 'PDF, JPEG ou PNG';
        
      const errorMsg = `Formato de arquivo não permitido para ${file.name}. Use ${typeNames}.`;
      setUploadError(errorMsg);
      form.setError(fieldName as any, { message: errorMsg });
      event.target.value = '';
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      
      // Clear any previous errors
      form.clearErrors(fieldName as any);
    };
    reader.readAsDataURL(file);
  };

  // Generate icon based on file type
  const getFileTypeIcon = (fileUrl: string | null) => {
    if (!fileUrl) return null;
    
    if (fileUrl.startsWith('data:image')) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (fileUrl.startsWith('data:application/pdf')) {
      return <File className="h-5 w-5 text-blue-500" />;
    }
    
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };
  
  // Generate file name from form field
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
  
  // Open preview dialog
  const openPreview = (fileUrl: string | null, type: string, name: string) => {
    if (fileUrl) {
      setPreviewUrl(fileUrl);
      setPreviewType(type);
      setPreviewName(name);
      setPreviewOpen(true);
    }
  };
  
  return (
    <div className="space-y-6">
      {uploadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <FormField
        control={form.control}
        name="profilePicture"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel className="text-white flex items-center gap-2">
              Foto de Perfil
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-white/70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-sm">Uma foto profissional aumenta a confiança dos clientes. Use formato JPEG ou PNG com no máximo 5MB.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-40 h-40 rounded-full flex items-center justify-center mb-4 overflow-hidden cursor-pointer",
                    "bg-teal-700/50 border-2 border-dashed",
                    profilePicturePreview ? "border-green-400/40" : "border-lavender-400/30"
                  )}
                  onClick={() => profilePicturePreview && openPreview(
                    profilePicturePreview, 
                    "image", 
                    getFileName("profilePicture", profilePicturePreview) || "Foto de Perfil"
                  )}
                >
                  {profilePicturePreview ? (
                    <img 
                      src={profilePicturePreview} 
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
                  {profilePicturePreview ? "Alterar foto" : "Selecionar foto"}
                </Label>
                
                <Input
                  id="profile-picture-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    handleFileChange(e, setProfilePicturePreview, "profilePicture", ALLOWED_IMAGE_TYPES);
                    if (e.target.files && e.target.files[0]) {
                      onChange(e.target.files[0]);
                    }
                  }}
                  {...field}
                />
                
                {profilePicturePreview && (
                  <div className="flex items-center mt-2 text-sm text-white/80">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="truncate max-w-[200px]">
                      {getFileName("profilePicture", profilePicturePreview)}
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
            <FormLabel className="text-white flex items-center gap-2">
              Certificado de Formação/Capacitação
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-white/70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-sm">Envie seu diploma, certificado ou registro profissional. Formatos aceitos: PDF, JPEG ou PNG com no máximo 5MB.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <div className="flex items-center space-x-4">
                <div 
                  className={cn(
                    "flex-1 flex items-center p-4 rounded-md cursor-pointer",
                    "bg-teal-700/50 border border-dashed",
                    certificatePreview ? "border-green-400/40 bg-teal-700/60" : "border-lavender-400/30"
                  )}
                  onClick={() => certificatePreview && openPreview(
                    certificatePreview, 
                    certificatePreview.startsWith('data:image') ? "image" : "pdf",
                    getFileName("certificate", certificatePreview) || "Certificado"
                  )}
                >
                  <div className="flex-1 flex items-center">
                    {certificatePreview ? (
                      <>
                        {getFileTypeIcon(certificatePreview)}
                        <span className="text-white ml-2 truncate">
                          {getFileName("certificate", certificatePreview)}
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
                    {certificatePreview ? "Alterar" : "Upload"}
                  </Label>
                </div>
                
                <Input
                  id="certificate-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    handleFileChange(e, setCertificatePreview, "certificate", ALLOWED_DOC_TYPES);
                    if (e.target.files && e.target.files[0]) {
                      onChange(e.target.files[0]);
                    }
                  }}
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription className="text-white/50 text-sm">
              Formatos aceitos: PDF, JPEG, PNG (máx 5MB)
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
            <FormLabel className="text-white flex items-center gap-2">
              Documento de Identidade com Foto
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-white/70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-sm">RG, CNH ou outro documento oficial com foto. Formatos aceitos: PDF, JPEG ou PNG com no máximo 5MB.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <div className="flex items-center space-x-4">
                <div 
                  className={cn(
                    "flex-1 flex items-center p-4 rounded-md cursor-pointer",
                    "bg-teal-700/50 border border-dashed",
                    idDocumentPreview ? "border-green-400/40 bg-teal-700/60" : "border-lavender-400/30"
                  )}
                  onClick={() => idDocumentPreview && openPreview(
                    idDocumentPreview, 
                    idDocumentPreview.startsWith('data:image') ? "image" : "pdf",
                    getFileName("idDocument", idDocumentPreview) || "Documento de Identidade"
                  )}
                >
                  <div className="flex-1 flex items-center">
                    {idDocumentPreview ? (
                      <>
                        {getFileTypeIcon(idDocumentPreview)}
                        <span className="text-white ml-2 truncate">
                          {getFileName("idDocument", idDocumentPreview)}
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
                    {idDocumentPreview ? "Alterar" : "Upload"}
                  </Label>
                </div>
                
                <Input
                  id="id-document-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    handleFileChange(e, setIdDocumentPreview, "idDocument", ALLOWED_DOC_TYPES);
                    if (e.target.files && e.target.files[0]) {
                      onChange(e.target.files[0]);
                    }
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
      
      {/* Dialog para visualizar documentos */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{previewName}</DialogTitle>
          </DialogHeader>
          
          <div className="flex justify-center mt-4">
            {previewUrl && (
              previewType === "pdf" ? (
                <embed src={previewUrl} type="application/pdf" width="100%" height="500px" />
              ) : (
                <img src={previewUrl} alt="Visualização" className="max-h-[70vh] object-contain" />
              )
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setPreviewOpen(false)}
              className="mt-4"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentationStep;
