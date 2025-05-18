
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FileUploadField from "./documentation/FileUploadField";
import FilePreviewDialog from "./documentation/FilePreviewDialog";
import TermsAcceptanceField from "./documentation/TermsAcceptanceField";

// Constants for file validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const ALLOWED_DOC_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf'];

interface DocumentationStepProps {
  form: UseFormReturn<any>;
}

const DocumentationStep: React.FC<DocumentationStepProps> = ({ form }) => {
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [idDocumentPreview, setIdDocumentPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string>("");
  const [previewName, setPreviewName] = useState<string>("");
  
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
      
      <FileUploadField
        form={form}
        name="profilePicture"
        label="Foto de Perfil"
        description="Uma foto profissional aumenta a confiança dos clientes"
        tooltip="Uma foto profissional aumenta a confiança dos clientes. Use formato JPEG ou PNG com no máximo 5MB."
        setPreview={setProfilePicturePreview}
        preview={profilePicturePreview}
        allowedTypes={ALLOWED_IMAGE_TYPES}
        isProfilePicture={true}
        setUploadError={setUploadError}
        getFileName={getFileName}
        openPreview={openPreview}
      />
      
      <FileUploadField
        form={form}
        name="certificate"
        label="Certificado de Formação/Capacitação"
        description="Formatos aceitos: PDF, JPEG, PNG (máx 5MB)"
        tooltip="Envie seu diploma, certificado ou registro profissional. Formatos aceitos: PDF, JPEG ou PNG com no máximo 5MB."
        setPreview={setCertificatePreview}
        preview={certificatePreview}
        allowedTypes={ALLOWED_DOC_TYPES}
        setUploadError={setUploadError}
        getFileName={getFileName}
        openPreview={openPreview}
      />
      
      <FileUploadField
        form={form}
        name="idDocument"
        label="Documento de Identidade com Foto"
        description="RG, CNH ou outro documento oficial com foto"
        tooltip="RG, CNH ou outro documento oficial com foto. Formatos aceitos: PDF, JPEG ou PNG com no máximo 5MB."
        setPreview={setIdDocumentPreview}
        preview={idDocumentPreview}
        allowedTypes={ALLOWED_DOC_TYPES}
        setUploadError={setUploadError}
        getFileName={getFileName}
        openPreview={openPreview}
      />
      
      <TermsAcceptanceField form={form} />
      
      {/* File preview dialog */}
      <FilePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        previewUrl={previewUrl}
        previewType={previewType}
        previewName={previewName}
      />
    </div>
  );
};

export default DocumentationStep;
