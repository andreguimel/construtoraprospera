import { Home, Key, Building } from "lucide-react";

const services = [
  { icon: Home, title: "Compra e Venda", description: "Assessoria completa na compra e venda de imóveis residenciais e comerciais." },
  { icon: Key, title: "Aluguel de Imóveis", description: "Encontre o imóvel ideal para alugar com as melhores condições do mercado." },
  { icon: Building, title: "Administração de Imóveis", description: "Gestão profissional do seu patrimônio imobiliário com total transparência." },
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-12 text-center">Nossos Serviços</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.title} className="bg-card rounded-lg p-8 text-center transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-secondary flex items-center justify-center">
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
