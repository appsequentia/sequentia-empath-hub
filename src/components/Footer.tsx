
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-teal-800/50 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="text-lavender-400">Se</span>quentia
            </h3>
            <p className="text-white/80 text-sm">
              Conectando pessoas às terapias que transformam vidas através de um processo 
              inteligente e personalizado.
            </p>
          </div>
          
          <div>
            <h4 className="text-lavender-300 font-medium mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-white/80 hover:text-lavender-300 text-sm">Como funciona</Link></li>
              <li><Link to="/specialists" className="text-white/80 hover:text-lavender-300 text-sm">Especialistas</Link></li>
              <li><Link to="/therapies" className="text-white/80 hover:text-lavender-300 text-sm">Terapias</Link></li>
              <li><Link to="/pricing" className="text-white/80 hover:text-lavender-300 text-sm">Planos</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lavender-300 font-medium mb-4">Acesso</h4>
            <ul className="space-y-2">
              <li><Link to="/login-client" className="text-white/80 hover:text-lavender-300 text-sm">Entrar como cliente</Link></li>
              <li><Link to="/signup-client" className="text-white/80 hover:text-lavender-300 text-sm">Cadastrar como cliente</Link></li>
              <li><Link to="/login-therapist" className="text-white/80 hover:text-lavender-300 text-sm">Entrar como terapeuta</Link></li>
              <li><Link to="/signup-therapist" className="text-white/80 hover:text-lavender-300 text-sm">Cadastrar como terapeuta</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lavender-300 font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-white/80 hover:text-lavender-300 text-sm">Termos de uso</Link></li>
              <li><Link to="/privacy" className="text-white/80 hover:text-lavender-300 text-sm">Política de privacidade</Link></li>
              <li><Link to="/cookies" className="text-white/80 hover:text-lavender-300 text-sm">Política de cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Sequentia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
