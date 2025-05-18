
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string | null;
  previewType: string;
  previewName: string;
}

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({
  open,
  onOpenChange,
  previewUrl,
  previewType,
  previewName
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
            className="mt-4"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewDialog;
