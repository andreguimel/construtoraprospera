import heroImg from "@/assets/hero-building.jpg";
import { Search } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[520px] flex items-center mt-16">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Edifício moderno" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-8 max-w-xl animate-fade-in-up">
          Encontre o imóvel dos seus sonhos
        </h1>

        <div className="bg-card/95 backdrop-blur-sm rounded-lg p-4 flex flex-col md:flex-row gap-3 max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <select className="flex-1 px-4 py-3 rounded-md bg-secondary text-foreground border border-border text-sm">
            <option>Tipo do Imóvel</option>
            <option>Apartamento</option>
            <option>Casa</option>
            <option>Cobertura</option>
            <option>Terreno</option>
          </select>
          <select className="flex-1 px-4 py-3 rounded-md bg-secondary text-foreground border border-border text-sm">
            <option>Localização</option>
            <option>São Paulo</option>
            <option>Rio de Janeiro</option>
            <option>Belo Horizonte</option>
          </select>
          <select className="flex-1 px-4 py-3 rounded-md bg-secondary text-foreground border border-border text-sm">
            <option>Dormitórios</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4+</option>
          </select>
          <button className="btn-gold flex items-center justify-center gap-2">
            <Search className="h-4 w-4" />
            Buscar
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
