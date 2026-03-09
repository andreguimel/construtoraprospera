import aboutImg from "@/assets/about-building.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-secondary">
      <div ref={ref} className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <h2 className="section-title mb-6">Sobre Nós</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A Prospera Imobiliária é referência no mercado imobiliário, com anos de experiência realizando os sonhos de nossos clientes.
              Oferecemos um atendimento personalizado e dedicado para encontrar o imóvel perfeito para você.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Nossa equipe de profissionais altamente qualificados está pronta para auxiliá-lo em todas as etapas da compra, venda ou locação do seu imóvel.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: "+500", label: "Imóveis" },
                { value: "+1.200", label: "Clientes" },
                { value: "+15", label: "Anos" },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-lg bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
                  <p className="text-2xl font-display font-bold text-accent">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <button className="btn-gold">Saiba Mais</button>
          </div>
          <div
            className={`relative transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <div className="absolute -inset-3 rounded-xl bg-accent/20 rotate-2" />
            <div className="relative rounded-lg overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>
              <img src={aboutImg} alt="Sobre a Prospera" className="w-full h-80 lg:h-96 object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
