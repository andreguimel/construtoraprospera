import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Maximize2, BedDouble, Bath, Car, Search, X } from "lucide-react";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const fallbackImages = [property1, property2, property3];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

const Imoveis = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: filters } = usePropertyFilters();

  const [type, setType] = useState(searchParams.get("tipo") || "");
  const [city, setCity] = useState(searchParams.get("cidade") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("quartos") || "");

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties-list", type, city, bedrooms],
    queryFn: async () => {
      let query = supabase.from("properties").select("*").eq("active", true).order("created_at", { ascending: false });
      if (type) query = query.eq("property_type", type);
      if (city) query = query.eq("city", city);
      if (bedrooms) query = query.eq("bedrooms", parseInt(bedrooms));
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type) params.set("tipo", type);
    if (city) params.set("cidade", city);
    if (bedrooms) params.set("quartos", bedrooms);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setType("");
    setCity("");
    setBedrooms("");
    setSearchParams({});
  };

  const hasFilters = type || city || bedrooms;
  const isTerrain = (t: string) => t === "terreno";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero banner */}
      <section className="pt-28 pb-12 bg-primary">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">
            Imóveis Disponíveis
          </h1>
          <p className="text-primary-foreground/70">
            Encontre o imóvel ideal para você
          </p>
        </div>
      </section>

      {/* Search filters */}
      <section className="bg-card border-b border-border sticky top-[72px] z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-secondary text-foreground border border-border text-sm cursor-pointer"
            >
              <option value="">Todos os tipos</option>
              {filters?.types.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-secondary text-foreground border border-border text-sm cursor-pointer"
            >
              <option value="">Todas as cidades</option>
              {filters?.cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-secondary text-foreground border border-border text-sm cursor-pointer"
            >
              <option value="">Dormitórios</option>
              {filters?.bedrooms.map((b) => (
                <option key={b} value={String(b)}>{b} {b === 1 ? "quarto" : "quartos"}</option>
              ))}
            </select>
            <button onClick={handleSearch} className="btn-gold flex items-center justify-center gap-2 rounded-lg px-6">
              <Search className="h-4 w-4" /> Buscar
            </button>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors px-3">
                <X className="h-4 w-4" /> Limpar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-property animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : !properties?.length ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-2">Nenhum imóvel encontrado</p>
              <p className="text-sm text-muted-foreground">Tente alterar os filtros de busca</p>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-4 text-accent hover:underline text-sm font-medium">
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {properties.length} {properties.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((p, i) => (
                  <Link key={p.id} to={`/imoveis/${p.id}`} className="card-property cursor-pointer group block">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={p.image_url || fallbackImages[i % fallbackImages.length]}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground capitalize">
                        {p.transaction_type}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-lg text-foreground">{p.title}</h3>
                      <p className="text-accent font-bold text-xl mt-1">{p.hide_price ? "Sob consulta" : formatPrice(Number(p.price))}</p>
                      <div className="flex items-center gap-4 mt-3 text-muted-foreground text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {p.neighborhood ? `${p.neighborhood}, ` : ""}{p.city}
                        </span>
                        {p.area && (
                          <span className="flex items-center gap-1">
                            <Maximize2 className="h-3.5 w-3.5" />{p.area}m²
                          </span>
                        )}
                      </div>
                      {!isTerrain(p.property_type) ? (
                        <div className="flex items-center gap-4 mt-2 text-muted-foreground text-xs border-t border-border pt-3">
                          <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{p.bedrooms} quartos</span>
                          <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{p.bathrooms} banhos</span>
                          <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5" />{p.garage_spots} vagas</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 mt-2 text-muted-foreground text-xs border-t border-border pt-3">
                          <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />Pronto para construir</span>
                        </div>
                      )}
                      <Link to={`/imoveis/${p.id}`} className="block w-full mt-4 py-2.5 rounded-lg border border-accent text-accent text-sm font-semibold text-center transition-all duration-300 hover:bg-accent hover:text-accent-foreground">
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Imoveis;
