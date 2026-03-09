import coupleImg from "@/assets/couple-browsing.jpg";
import { UserCheck, MapPinned, ShieldCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  { icon: UserCheck, title: "Atendimento Personalizado", text: "Nossa equipe oferece um atendimento exclusivo, entendendo suas necessidades para encontrar o imóvel ideal." },
  { icon: MapPinned, title: "As Melhores Localizações", text: "Imóveis nas regiões mais valorizadas, com infraestrutura completa e fácil acesso." },
  { icon: ShieldCheck, title: "Segurança e Confiança", text: "Processos transparentes e seguros, garantindo tranquilidade em todas as negociações." },
];

const FeaturesSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-secondary">
      <div ref={ref} className="container mx-auto px-4">
        <h2 className="section-title mb-12">Encontre o Lar Perfeito para Você</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`rounded-xl overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} style={{ boxShadow: "var(--shadow-elevated)" }}>
            <img src={coupleImg} alt="Casal buscando imóvel" className="w-full h-80 object-cover" />
          </div>
          <div className="grid gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`bg-card rounded-xl p-6 flex gap-4 items-start transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
                style={{ boxShadow: "var(--shadow-card)", transitionDelay: `${i * 150}ms` }}
              >
                <div className="relative">
                  <span className="absolute -top-2 -left-2 text-[40px] font-display font-bold text-accent/10 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center relative z-10" style={{ background: "var(--gradient-gold)" }}>
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
