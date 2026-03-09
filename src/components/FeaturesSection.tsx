import coupleImg from "@/assets/couple-browsing.jpg";
import { UserCheck, MapPinned, ShieldCheck } from "lucide-react";

const features = [
  { icon: UserCheck, title: "Atendimento Personalizado", text: "Nossa equipe oferece um atendimento exclusivo, entendendo suas necessidades para encontrar o imóvel ideal." },
  { icon: MapPinned, title: "As Melhores Localizações", text: "Imóveis nas regiões mais valorizadas, com infraestrutura completa e fácil acesso." },
  { icon: ShieldCheck, title: "Segurança e Confiança", text: "Processos transparentes e seguros, garantindo tranquilidade em todas as negociações." },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-12">Encontre o Lar Perfeito para Você</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <img src={coupleImg} alt="Casal buscando imóvel" className="w-full h-80 object-cover" />
          </div>
          <div className="grid gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-lg p-6 flex gap-4 items-start" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="w-12 h-12 shrink-0 rounded-lg bg-primary flex items-center justify-center">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
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
