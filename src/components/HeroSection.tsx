import heroImg from "@/assets/hero-building.jpg";
import { Search, ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Edifício moderno" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </div>

      <div className="relative container mx-auto px-4 py-24">
        <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-primary-foreground/90 text-sm font-medium">Mais de 500 imóveis disponíveis</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4 max-w-2xl animate-fade-in-up leading-tight">
          Encontre o imóvel dos seus sonhos
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/75 max-w-xl mb-10 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Apartamentos, casas e coberturas nas melhores localizações do Brasil, com atendimento personalizado.
        </p>

        <div
          className="bg-card/95 backdrop-blur-md rounded-xl p-5 flex flex-col md:flex-row gap-3 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "0.3s", boxShadow: "var(--shadow-elevated)" }}
        >
          <select className="flex-1 px-4 py-3.5 rounded-lg bg-secondary text-foreground border border-border text-sm cursor-pointer">
            <option>Tipo do Imóvel</option>
            <option>Apartamento</option>
            <option>Casa</option>
            <option>Cobertura</option>
            <option>Terreno</option>
          </select>
          <select className="flex-1 px-4 py-3.5 rounded-lg bg-secondary text-foreground border border-border text-sm cursor-pointer">
            <option>Localização</option>
            <option>São Paulo</option>
            <option>Rio de Janeiro</option>
            <option>Belo Horizonte</option>
          </select>
          <select className="flex-1 px-4 py-3.5 rounded-lg bg-secondary text-foreground border border-border text-sm cursor-pointer">
            <option>Dormitórios</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4+</option>
          </select>
          <button className="btn-gold flex items-center justify-center gap-2 rounded-lg">
            <Search className="h-4 w-4" />
            Buscar
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-primary-foreground/50" />
      </div>
    </section>
  );
};

export default HeroSection;
