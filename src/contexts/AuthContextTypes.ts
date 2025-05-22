
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string, userType?: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, userType?: string) => Promise<void>;
  signOut: () => Promise<void>;
}
