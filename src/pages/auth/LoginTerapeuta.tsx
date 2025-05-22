import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginTerapeuta() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("terapeuta");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard-terapeuta";
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signIn(data.email, data.password, activeTab);
      
      // We don't need to check the return value as the AuthContext will handle navigation
      toast({
        title: "Login realizado com sucesso",
        description: "Você será redirecionado para o painel.",
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  return (
    <>
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-160px)] px-4 py-20">
        <Card className="w-full max-w-md border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Login
            </CardTitle>
            <CardDescription className="text-center text-white/70">
              Entre com seu email e senha para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4 bg-teal-700/40">
                <TabsTrigger 
                  value="terapeuta"
                  className="data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-800"
                >
                  Terapeuta
                </TabsTrigger>
                <TabsTrigger 
                  value="cliente"
                  className="data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-800"
                  onClick={() => navigate('/login-cliente')}
                >
                  Cliente
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="terapeuta" className="mt-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="seu@email.com" 
                              {...field}
                              className="bg-teal-700/40 border-lavender-400/20 text-white"
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
                                placeholder="••••••••" 
                                {...field}
                                className="bg-teal-700/40 border-lavender-400/20 text-white pr-10"
                              />
                              <button 
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between items-center">
                      <Link 
                        to="#"
                        className="text-sm text-lavender-300 hover:text-lavender-400 hover:underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-lavender-400 hover:bg-lavender-500 text-teal-900"
                    >
                      Entrar
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-white/70">
              Ainda não tem uma conta?{" "}
              <Link 
                to="/register-terapeuta"
                className="text-lavender-300 hover:text-lavender-400 hover:underline"
              >
                Cadastre-se como terapeuta
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </>
  );
}
