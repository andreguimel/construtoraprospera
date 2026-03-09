import { Building2, Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Encontre-nos</h3>
            <div className="space-y-3 text-sm opacity-80">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> (11) 1234-5678</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> contato@prospera.com.br</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Rua das Flores, 123, São Paulo, SP</p>
            </div>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300" aria-label="WhatsApp">
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-4">Receba Nossas Novidades</h3>
            <p className="text-sm opacity-70 mb-4">Cadastre-se e fique por dentro das melhores oportunidades.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm"
              />
              <button className="btn-gold text-sm px-4 py-2.5 rounded-lg">Cadastrar</button>
            </div>
          </div>

          <div className="flex items-start justify-end">
            <div className="flex items-center gap-2">
              <Building2 className="h-10 w-10 text-accent" />
              <div>
                <span className="text-2xl font-display font-bold">Prospera</span>
                <span className="block text-xs uppercase tracking-[0.2em] opacity-70">Imobiliária</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-4">
        <p className="text-center text-xs opacity-60">© 2025 Prospera Imobiliária. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
