import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-building.jpg";
import { Search, ChevronDown } from "lucide-react";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";

const HeroSection = () => {
  const navigate = useNavigate();
  const { data: filters } = usePropertyFilters();
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type) params.set("tipo", type);
    if (city) params.set("cidade", city);
    if (bedrooms) params.set("quartos", bedrooms);
    navigate(`/imoveis?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Edifício moderno" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </div>

      <div className="relative container mx-auto px-4 py-24">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4 max-w-2xl animate-fade-in-up leading-tight">
          Encontre ou Construa o imóvel dos seus sonhos
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/75 max-w-xl mb-10 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Apartamentos, casas e coberturas nas melhores localizações do Brasil, com atendimento personalizado.
        </p>

        <div
          className="bg-card/95 backdrop-blur-md rounded-xl p-5 flex flex-col md:flex-row gap-3 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "0.3s", boxShadow: "var(--shadow-elevated)" }}
        >
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 px-4 py-3.5 rounded-lg bg-secondary text-foreground border border-border text-sm cursor-pointer"
          >
            <option value="">Tipo do Imóvel</option>
            {filters?.types.map((t) => (
              <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-3.5 rounded-lg bg-secondary text-foreground border border-border text-sm cursor-pointer"
          >
            <option value="">Localização</option>
            {filters?.cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="flex-1 px-4 py-3.5 rounded-lg bg-secondary text-foreground border border-border text-sm cursor-pointer"
          >
            <option value="">Dormitórios</option>
            {filters?.bedrooms.map((b) => (
              <option key={b} value={String(b)}>{b}</option>
            ))}
          </select>
          <button onClick={handleSearch} className="btn-gold flex items-center justify-center gap-2 rounded-lg">
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
