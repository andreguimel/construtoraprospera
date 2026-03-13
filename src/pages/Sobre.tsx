import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import aboutImg from "@/assets/about-building.jpg";
import coupleImg from "@/assets/couple-browsing.jpg";
import { CheckCircle, User } from "lucide-react";
import { Link } from "react-router-dom";

const Sobre = () => {
  const { data: settings } = useSiteSettings();

  const { data: teamMembers } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const stats = settings
    ? [
        { value: settings.about_stat_1_value, label: settings.about_stat_1_label },
        { value: settings.about_stat_2_value, label: settings.about_stat_2_label },
        { value: settings.about_stat_3_value, label: settings.about_stat_3_label },
      ]
    : [
        { value: "+500", label: "Imóveis" },
        { value: "+1.200", label: "Clientes" },
        { value: "+15", label: "Anos" },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero banner */}
      <section className="pt-28 pb-12 bg-primary">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">
            Sobre Nós
          </h1>
          <p className="text-primary-foreground/70">
            Conheça a história e os valores da Prospera Imobiliária e Construtora
          </p>
        </div>
      </section>

      {/* Quem somos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Quem Somos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {settings?.about_text_1 || "A Prospera Imobiliária e Construtora é referência no mercado imobiliário, com anos de experiência realizando os sonhos de nossos clientes. Oferecemos um atendimento personalizado e dedicado para encontrar o imóvel perfeito para você."}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {settings?.about_text_2 || "Nossa equipe de profissionais altamente qualificados está pronta para auxiliá-lo em todas as etapas da compra, venda ou locação do seu imóvel."}
              </p>
              <div className="grid grid-cols-3 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="text-center p-4 rounded-lg bg-card border border-border">
                    <p className="text-2xl font-display font-bold text-accent">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 rounded-xl bg-accent/20 rotate-2" />
              <div className="relative rounded-lg overflow-hidden shadow-elevated">
                <img src={aboutImg} alt="Sobre a Prospera" className="w-full h-80 lg:h-96 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-lg overflow-hidden shadow-elevated">
                <img src={coupleImg} alt="Atendimento personalizado" className="w-full h-80 lg:h-96 object-cover" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="section-title mb-6">Nossos Diferenciais</h2>
              <div className="space-y-4">
                {[
                  "Atendimento personalizado e dedicado",
                  "Equipe altamente qualificada",
                  "Amplo portfólio de imóveis",
                  "Atuamos como imobiliária e construtora",
                  "Transparência em todas as negociações",
                  "Suporte completo do início ao fim",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipe */}
      {teamMembers && teamMembers.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="section-title mb-12 text-center">Nossa Equipe</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-card rounded-xl border border-border overflow-hidden text-center hover:border-accent transition-colors" style={{ boxShadow: "var(--shadow-card)" }}>
                  <div className="aspect-square bg-muted overflow-hidden">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-20 w-20 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-foreground text-lg">{member.name}</h3>
                    <p className="text-accent text-sm font-medium mt-1">{member.role}</p>
                    {member.bio && (
                      <p className="text-muted-foreground text-xs mt-3 leading-relaxed line-clamp-3">{member.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Pronto para realizar seu sonho?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudá-lo a encontrar ou construir o imóvel ideal.
          </p>
          <Link to="/contato" className="btn-gold inline-block">
            Fale Conosco
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sobre;
