import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import { MapPin, Maximize2 } from "lucide-react";

const properties = [
  {
    image: property1,
    title: "Apartamento Luxuoso",
    price: "R$ 950.000",
    area: "350m²",
    location: "Asa Sul, Brasília",
  },
  {
    image: property2,
    title: "Casa Moderna",
    price: "R$ 1.500.000",
    area: "250m²",
    location: "Alphaville, SP",
  },
  {
    image: property3,
    title: "Cobertura Exclusiva",
    price: "R$ 2.300.000",
    area: "450m²",
    location: "Leblon, RJ",
  },
];

const FeaturedProperties = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-12">Imóveis em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((p) => (
            <div key={p.title} className="card-property cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-lg text-foreground">{p.title}</h3>
                <p className="text-accent font-bold text-xl mt-1">{p.price}</p>
                <div className="flex items-center gap-4 mt-3 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.location}</span>
                  <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{p.area}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
