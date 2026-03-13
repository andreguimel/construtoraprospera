import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Maximize2, BedDouble, Bath, Car, ArrowLeft, DogIcon, Sofa, Phone, Mail, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const fallbackImages = [property1, property2, property3];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: settings } = useSiteSettings();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ["property-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-28 pb-20 container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-[400px] bg-muted rounded-xl" />
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-28 pb-20 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Imóvel não encontrado</h1>
          <p className="text-muted-foreground mb-6">Este imóvel pode ter sido removido ou o link está incorreto.</p>
          <Link to="/imoveis">
            <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Ver todos os imóveis</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = property.images?.length
    ? property.images
    : property.image_url
      ? [property.image_url]
      : [fallbackImages[0]];

  const isTerrain = property.property_type === "terreno";

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no imóvel "${property.title}" (${formatPrice(Number(property.price))}). Gostaria de mais informações.`
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-4 bg-primary">
        <div className="container mx-auto px-4">
          <Link to="/imoveis" className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors mb-3">
            <ArrowLeft className="h-4 w-4" /> Voltar para imóveis
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">{property.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-primary-foreground/70 text-sm">
            <MapPin className="h-4 w-4" />
            {[property.address, property.neighborhood, property.city, property.state].filter(Boolean).join(", ")}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="rounded-xl overflow-hidden border border-border">
              <img
                src={allImages[0]}
                alt={property.title}
                className="w-full h-[300px] md:h-[450px] object-cover"
              />
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-1 p-1 bg-card">
                  {allImages.slice(1, 5).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${property.title} - foto ${i + 2}`}
                      className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Price & badges */}
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-3xl font-bold text-accent">{formatPrice(Number(property.price))}</p>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground capitalize">
                {property.transaction_type}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-foreground capitalize">
                {property.property_type}
              </span>
            </div>

            {/* Features grid */}
            {!isTerrain && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FeatureCard icon={<BedDouble className="h-5 w-5" />} label="Quartos" value={String(property.bedrooms ?? 0)} />
                <FeatureCard icon={<Bath className="h-5 w-5" />} label="Banheiros" value={String(property.bathrooms ?? 0)} />
                <FeatureCard icon={<Car className="h-5 w-5" />} label="Vagas" value={String(property.garage_spots ?? 0)} />
                <FeatureCard icon={<Maximize2 className="h-5 w-5" />} label="Área" value={property.area ? `${property.area}m²` : "—"} />
              </div>
            )}
            {isTerrain && property.area && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FeatureCard icon={<Maximize2 className="h-5 w-5" />} label="Área" value={`${property.area}m²`} />
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-display font-semibold text-foreground mb-3">Descrição</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Additional details */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-display font-semibold text-foreground mb-4">Detalhes</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                {property.condominium_fee && (
                  <DetailRow label="Condomínio" value={formatPrice(Number(property.condominium_fee))} />
                )}
                {property.iptu && (
                  <DetailRow label="IPTU" value={formatPrice(Number(property.iptu))} />
                )}
                <DetailRow label="Aceita pets" value={property.accepts_pets ? "Sim" : "Não"} icon={<DogIcon className="h-4 w-4" />} />
                {!isTerrain && (
                  <DetailRow label="Mobiliado" value={property.furnished ? "Sim" : "Não"} icon={<Sofa className="h-4 w-4" />} />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Contact */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24 space-y-5">
              <h2 className="text-lg font-display font-semibold text-foreground">Interessado?</h2>
              <p className="text-sm text-muted-foreground">
                Entre em contato conosco para agendar uma visita ou tirar dúvidas sobre este imóvel.
              </p>

              <a
                href={`https://wa.me/5500000000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full flex items-center justify-center gap-2 py-3 rounded-lg"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>

              <a
                href="tel:+5500000000000"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-secondary transition-colors"
              >
                <Phone className="h-4 w-4" />
                Ligar agora
              </a>

              <a
                href="mailto:contato@prospera.com.br"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-secondary transition-colors"
              >
                <Mail className="h-4 w-4" />
                Enviar e-mail
              </a>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Código: {property.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-card rounded-xl border border-border p-4 text-center">
    <div className="flex justify-center text-accent mb-2">{icon}</div>
    <p className="text-lg font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const DetailRow = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    {icon && <span className="text-muted-foreground">{icon}</span>}
    <span className="text-muted-foreground">{label}:</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

export default PropertyDetails;
