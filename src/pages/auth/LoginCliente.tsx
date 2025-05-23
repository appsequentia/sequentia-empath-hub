
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginCliente() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("cliente");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    const success = await signIn(data.email, data.password, activeTab);
    
    // Se o login foi bem-sucedido e o usuário é um admin tentando acessar /admin, não
    // é necessário fazer nenhum redirecionamento aqui pois o AuthContext já cuida disso
    console.log('Login attempt completed:', success);
  };
  
  return (
    <>
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-180px)] pt-24 pb-16 px-4">
        <div className="w-full max-w-md">
          <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center text-white">
                Entrar
              </CardTitle>
              <CardDescription className="text-center text-white/70">
                Insira seus dados para acessar sua conta
              </CardDescription>
              
              <Tabs 
                defaultValue="cliente" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full mt-4"
              >
                <TabsList className="grid grid-cols-2 w-full bg-teal-700/50">
                  <TabsTrigger 
                    value="cliente"
                    className="data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900"
                  >
                    Cliente
                  </TabsTrigger>
                  <TabsTrigger 
                    value="terapeuta"
                    className="data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900"
                  >
                    Terapeuta
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="cliente" className="mt-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        Entrar como Cliente
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-white/70">
                      Não tem uma conta?{" "}
                      <Link 
                        to="/register-cliente" 
                        className="text-lavender-300 hover:text-lavender-400 font-medium"
                      >
                        Crie agora
                      </Link>
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="terapeuta" className="mt-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        Entrar como Terapeuta
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-white/70">
                      Não tem uma conta?{" "}
                      <Link 
                        to="/register-terapeuta" 
                        className="text-lavender-300 hover:text-lavender-400 font-medium"
                      >
                        Cadastre-se
                      </Link>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
