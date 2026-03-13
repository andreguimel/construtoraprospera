import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Home, Key, Building, Shield, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const allIcons = [Home, Key, Building, Shield, Users, TrendingUp];

const Servicos = () => {
  const { data: settings } = useSiteSettings();

  const mainServices = settings
    ? [
        { icon: allIcons[0], title: settings.service_1_title, description: settings.service_1_desc },
        { icon: allIcons[1], title: settings.service_2_title, description: settings.service_2_desc },
        { icon: allIcons[2], title: settings.service_3_title, description: settings.service_3_desc },
      ]
    : [
        { icon: allIcons[0], title: "Compra e Venda", description: "Assessoria completa na compra e venda de imóveis residenciais e comerciais." },
        { icon: allIcons[1], title: "Aluguel de Imóveis", description: "Encontre o imóvel ideal para alugar com as melhores condições do mercado." },
        { icon: allIcons[2], title: "Administração de Imóveis", description: "Gestão profissional do seu patrimônio imobiliário com total transparência." },
      ];

  const extraServices = [
    { icon: allIcons[3], title: "Assessoria Jurídica", description: "Suporte jurídico completo para garantir segurança em todas as transações imobiliárias." },
    { icon: allIcons[4], title: "Consultoria Personalizada", description: "Análise do seu perfil e necessidades para encontrar as melhores oportunidades do mercado." },
    { icon: allIcons[5], title: "Avaliação de Imóveis", description: "Avaliação técnica e mercadológica para definir o valor justo do seu imóvel." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero banner */}
      <section className="pt-28 pb-12 bg-primary">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">
            Nossos Serviços
          </h1>
          <p className="text-primary-foreground/70">
            Soluções completas para todas as suas necessidades imobiliárias
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainServices.map((s, i) => (
              <div
                key={s.title}
                className="bg-card rounded-xl p-8 text-center border border-border hover:border-accent hover:scale-[1.02] transition-all duration-300"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-gold)" }}>
                  <s.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Services */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-12 text-center">Mais Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {extraServices.map((s) => (
              <div
                key={s.title}
                className="bg-card rounded-xl p-8 text-center border border-border hover:border-accent hover:scale-[1.02] transition-all duration-300"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-gold)" }}>
                  <s.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Precisa de ajuda?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Nossa equipe está pronta para atendê-lo. Entre em contato e descubra como podemos ajudar.
          </p>
          <Link to="/contato" className="btn-gold inline-flex items-center gap-2">
            Fale Conosco <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Servicos;
