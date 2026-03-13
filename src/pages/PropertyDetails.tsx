import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Maximize2, BedDouble, Bath, Car, ArrowLeft, DogIcon, Sofa, Phone, Mail, MessageCircle, ChevronLeft, ChevronRight, X, Youtube, Instagram } from "lucide-react";
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

  const priceText = property.hide_price ? "Sob consulta" : formatPrice(Number(property.price));

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no imóvel "${property.title}"${property.hide_price ? "" : ` (${priceText})`}. Gostaria de mais informações.`
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
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Carousel */}
            <ImageGallery images={allImages} title={property.title} />

            {/* Price & badges */}
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-3xl font-bold text-accent">{priceText}</p>
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
                href={`https://wa.me/${settings?.whatsapp ?? "5500000000000"}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full flex items-center justify-center gap-2 py-3 rounded-lg"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>

              <a
                href={`tel:+${settings?.phone ?? "5500000000000"}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-secondary transition-colors"
              >
                <Phone className="h-4 w-4" />
                Ligar agora
              </a>

              <a
                href={`mailto:${settings?.email ?? "contato@prospera.com.br"}`}
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

const ImageGallery = ({ images, title }: { images: string[]; title: string }) => {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <>
      <div className="rounded-xl overflow-hidden border border-border bg-card">
        <div className="relative group cursor-pointer" onClick={() => setLightbox(true)}>
          <img
            src={images[current]}
            alt={`${title} - foto ${current + 1}`}
            className="w-full h-[300px] md:h-[450px] object-cover transition-all duration-300"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
              <div className="absolute bottom-3 right-3 bg-card/80 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full">
                {current + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-1 p-2 overflow-x-auto">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${title} - foto ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-20 w-28 flex-shrink-0 object-cover rounded cursor-pointer transition-all duration-200 ${
                  i === current ? "ring-2 ring-accent opacity-100" : "opacity-60 hover:opacity-90"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightbox(false)}>
            <X className="h-8 w-8" />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 text-white/70 hover:text-white"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 text-white/70 hover:text-white"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            </>
          )}
          <img
            src={images[current]}
            alt={`${title} - foto ${current + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 text-white/70 text-sm">
            {current + 1} / {images.length}
          </div>
        </div>
      )}
    </>
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
