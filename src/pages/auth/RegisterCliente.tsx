
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const registerSchema = z.object({
  fullName: z.string()
    .min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterCliente() {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useAuth();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: RegisterFormValues) => {
    // Extrai o primeiro nome e o restante como sobrenome
    const nameParts = data.fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    await signUp(data.email, data.password, firstName, lastName);
  };
  
  return (
    <>
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-180px)] pt-24 pb-16 px-4">
        <div className="w-full max-w-md">
          <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center text-white">
                Cadastro de Cliente
              </CardTitle>
              <CardDescription className="text-center text-white/70">
                Crie sua conta e comece sua jornada terapêutica
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Nome Completo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Seu nome completo" 
                            className="bg-teal-700/50 text-white border-lavender-400/30 placeholder:text-white/50"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="seu-email@exemplo.com" 
                            className="bg-teal-700/50 text-white border-lavender-400/30 placeholder:text-white/50"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="********" 
                              className="bg-teal-700/50 text-white border-lavender-400/30 placeholder:text-white/50"
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full text-white/70 hover:text-white hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium"
                  >
                    Criar Conta
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center">
                <p className="text-white/70">
                  Já tem uma conta?{" "}
                  <Link 
                    to="/login-cliente" 
                    className="text-lavender-300 hover:text-lavender-400 font-medium"
                  >
                    Faça login
                  </Link>
                </p>
                <Link 
                  to="/register-terapeuta" 
                  className="block mt-3 text-white/70 hover:text-lavender-300 text-sm"
                >
                  Cadastrar como terapeuta
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
