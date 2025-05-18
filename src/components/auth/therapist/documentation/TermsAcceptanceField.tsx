
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsAcceptanceFieldProps {
  form: UseFormReturn<any>;
}

const TermsAcceptanceField: React.FC<TermsAcceptanceFieldProps> = ({ form }) => {
  return (
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
  );
};

export default TermsAcceptanceField;
