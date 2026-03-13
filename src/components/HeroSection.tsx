import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-building.jpg";
import { Search, ChevronDown } from "lucide-react";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const HeroSection = () => {
  const navigate = useNavigate();
  const { data: filters } = usePropertyFilters();
  const { data: settings } = useSiteSettings();
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [current, setCurrent] = useState(0);

  // Parse hero images from comma-separated string or single URL
  const heroImages: string[] = (() => {
    const raw = settings?.hero_images || "";
    if (!raw) return [heroImg];
    const urls = raw.split(",").map((u) => u.trim()).filter(Boolean);
    return urls.length > 0 ? urls : [heroImg];
  })();

  const nextSlide = useCallback(() => {
    setCurrent((c) => (c + 1) % heroImages.length);
  }, [heroImages.length]);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length, nextSlide]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type) params.set("tipo", type);
    if (city) params.set("cidade", city);
    if (bedrooms) params.set("quartos", bedrooms);
    navigate(`/imoveis?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Slideshow background */}
      <div className="absolute inset-0">
        {heroImages.map((img, i) => (
          <img
            key={img + i}
            src={img}
            alt="Hero"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </div>

      <div className="relative container mx-auto px-4 py-24">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4 max-w-2xl animate-fade-in-up leading-tight">
          {settings?.hero_title || "Encontre ou Construa o imóvel dos seus sonhos"}
        </h1>

        <p className="text-base md:text-xl text-primary-foreground/75 max-w-xl mb-8 md:mb-10 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          {settings?.hero_subtitle || "Apartamentos, casas e coberturas nas melhores localizações do Brasil, com atendimento personalizado."}
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

      {/* Slide indicators */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-accent w-8" : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-primary-foreground/50" />
      </div>
    </section>
  );
};

export default HeroSection;
