import { Link } from "react-router-dom";
import { MapPin, Maximize2, BedDouble, Bath, Car } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const fallbackImages = [property1, property2, property3];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

const FeaturedProperties = () => {
  const { ref, isVisible } = useScrollAnimation();

  const { data: properties, isLoading } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("active", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const isTerrain = (type: string) => type === "terreno";

  return (
    <section className="py-20 bg-background">
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Imóveis em Destaque</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Selecionamos os melhores imóveis para você. Confira nossas opções exclusivas.
          </p>
        </div>

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
          <p className="text-center text-muted-foreground">Nenhum imóvel em destaque no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((p, i) => (
              <div
                key={p.id}
                className={`card-property cursor-pointer group transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
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
                  <p className="text-accent font-bold text-xl mt-1">{formatPrice(Number(p.price))}</p>
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
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
