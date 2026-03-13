import { Home, Key, Building } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const icons = [Home, Key, Building];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { data: settings } = useSiteSettings();

  const services = settings
    ? [
        { icon: icons[0], title: settings.service_1_title, description: settings.service_1_desc },
        { icon: icons[1], title: settings.service_2_title, description: settings.service_2_desc },
        { icon: icons[2], title: settings.service_3_title, description: settings.service_3_desc },
      ]
    : [
        { icon: icons[0], title: "Compra e Venda", description: "Assessoria completa na compra e venda de imóveis residenciais e comerciais." },
        { icon: icons[1], title: "Aluguel de Imóveis", description: "Encontre o imóvel ideal para alugar com as melhores condições do mercado." },
        { icon: icons[2], title: "Administração de Imóveis", description: "Gestão profissional do seu patrimônio imobiliário com total transparência." },
      ];

  return (
    <section className="py-20 bg-background">
      <div ref={ref} className="container mx-auto px-4">
        <h2 className="section-title mb-12 text-center">Nossos Serviços</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`bg-card rounded-xl p-8 text-center transition-all duration-500 border-2 border-transparent hover:border-accent hover:scale-[1.02] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ boxShadow: "var(--shadow-card)", transitionDelay: `${i * 150}ms` }}
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
  );
};

export default ServicesSection;
