
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Upload, CheckCircle, HelpCircle } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FileUploadFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  description: string;
  tooltip: string;
  setPreview: (url: string | null) => void;
  preview: string | null;
  allowedTypes: string[];
  className?: string;
  isProfilePicture?: boolean;
  setUploadError: (error: string | null) => void;
  getFileName: (fieldName: string, fileUrl: string | null) => string | null;
  openPreview: (fileUrl: string | null, type: string, name: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  form,
  name,
  label,
  description,
  tooltip,
  setPreview,
  preview,
  allowedTypes,
  className,
  isProfilePicture = false,
  setUploadError,
  getFileName,
  openPreview
}) => {
  // Handle file selection and validation
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);
    
    if (!file) {
      setPreview(null);
      return;
    }
    
    console.log(`Validating ${name} file:`, file.name, file.type, file.size);
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `O arquivo ${file.name} excede o tamanho máximo permitido de 5MB.`;
      setUploadError(errorMsg);
      form.setError(name as any, { message: errorMsg });
      event.target.value = '';
      return;
    }
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const typeNames = isProfilePicture 
        ? 'JPEG/PNG' 
        : 'PDF, JPEG ou PNG';
        
      const errorMsg = `Formato de arquivo não permitido para ${file.name}. Use ${typeNames}.`;
      setUploadError(errorMsg);
      form.setError(name as any, { message: errorMsg });
      event.target.value = '';
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      
      // Clear any previous errors
      form.clearErrors(name as any);
    };
    reader.readAsDataURL(file);
  };
  
  // Generate file type icon for non-profile picture fields
  const getFileTypeIcon = (fileUrl: string | null) => {
    if (!fileUrl) return null;
    
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem className={className}>
          <FormLabel className="text-white flex items-center gap-2">
            {label}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-white/70" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-sm">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            {isProfilePicture ? (
              // Profile Picture Upload (Circle)
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-40 h-40 rounded-full flex items-center justify-center mb-4 overflow-hidden cursor-pointer",
                    "bg-teal-700/50 border-2 border-dashed",
                    preview ? "border-green-400/40" : "border-lavender-400/30"
                  )}
                  onClick={() => preview && openPreview(
                    preview, 
                    "image", 
                    getFileName(name, preview) || "Foto de Perfil"
                  )}
                >
                  {preview ? (
                    <img 
                      src={preview} 
                      alt="Preview da foto de perfil" 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Upload className="h-10 w-10 text-white/50" />
                  )}
                </div>
                
                <Label
                  htmlFor={`${name}-upload`}
                  className="cursor-pointer bg-lavender-400/30 hover:bg-lavender-400/40 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {preview ? "Alterar foto" : "Selecionar foto"}
                </Label>
                
                <Input
                  id={`${name}-upload`}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    handleFileChange(e);
                    if (e.target.files && e.target.files[0]) {
                      onChange(e.target.files[0]);
                    }
                  }}
                  {...fieldProps}
                />
                
                {preview && (
                  <div className="flex items-center mt-2 text-sm text-white/80">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="truncate max-w-[200px]">
                      {getFileName(name, preview)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // Document Upload (Rectangle)
              <div className="flex items-center space-x-4">
                <div 
                  className={cn(
                    "flex-1 flex items-center p-4 rounded-md cursor-pointer",
                    "bg-teal-700/50 border border-dashed",
                    preview ? "border-green-400/40 bg-teal-700/60" : "border-lavender-400/30"
                  )}
                  onClick={() => preview && openPreview(
                    preview, 
                    preview.startsWith('data:image') ? "image" : "pdf",
                    getFileName(name, preview) || label
                  )}
                >
                  <div className="flex-1 flex items-center">
                    {preview ? (
                      <>
                        {getFileTypeIcon(preview)}
                        <span className="text-white ml-2 truncate">
                          {getFileName(name, preview)}
                        </span>
                      </>
                    ) : (
                      <p className="text-white/50">Nenhum arquivo selecionado</p>
                    )}
                  </div>
                  
                  <Label
                    htmlFor={`${name}-upload`}
                    className="cursor-pointer ml-auto bg-lavender-400/30 hover:bg-lavender-400/40 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {preview ? "Alterar" : "Upload"}
                  </Label>
                </div>
                
                <Input
                  id={`${name}-upload`}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    handleFileChange(e);
                    if (e.target.files && e.target.files[0]) {
                      onChange(e.target.files[0]);
                    }
                  }}
                  {...fieldProps}
                />
              </div>
            )}
          </FormControl>
          <FormDescription className="text-white/50 text-sm">
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileUploadField;
