import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import { MapPin, Maximize2, BedDouble, Bath, Car } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const properties = [
  {
    image: property1,
    title: "Casa Moderna com Jardim",
    price: "R$ 1.850.000",
    area: "420m²",
    location: "Alphaville, SP",
    beds: 4, baths: 3, parking: 3,
    badge: "Destaque",
  },
  {
    image: property2,
    title: "Terreno Residencial",
    price: "R$ 450.000",
    area: "600m²",
    location: "Condomínio Fechado, Campinas",
    beds: 0, baths: 0, parking: 0,
    badge: "Oportunidade",
    isTerrain: true,
  },
  {
    image: property3,
    title: "Casa com Piscina",
    price: "R$ 2.200.000",
    area: "380m²",
    location: "Barra da Tijuca, RJ",
    beds: 5, baths: 4, parking: 3,
    badge: "Exclusivo",
  },
];

const FeaturedProperties = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-background">
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Imóveis em Destaque</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Selecionamos os melhores imóveis para você. Confira nossas opções exclusivas.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((p, i) => (
            <div
              key={p.title}
              className={`card-property cursor-pointer group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
                  {p.badge}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-lg text-foreground">{p.title}</h3>
                <p className="text-accent font-bold text-xl mt-1">{p.price}</p>
                <div className="flex items-center gap-4 mt-3 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.location}</span>
                  <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{p.area}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground text-xs border-t border-border pt-3">
                  <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{p.beds} quartos</span>
                  <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{p.baths} banhos</span>
                  <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5" />{p.parking} vagas</span>
                </div>
                <button className="w-full mt-4 py-2.5 rounded-lg border border-accent text-accent text-sm font-semibold transition-all duration-300 hover:bg-accent hover:text-accent-foreground">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
