import aboutImg from "@/assets/about-building.jpg";

const AboutSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title mb-6">Sobre Nós</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A Prospera Imobiliária é referência no mercado imobiliário, com anos de experiência realizando os sonhos de nossos clientes. 
              Oferecemos um atendimento personalizado e dedicado para encontrar o imóvel perfeito para você.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nossa equipe de profissionais altamente qualificados está pronta para auxiliá-lo em todas as etapas da compra, venda ou locação do seu imóvel.
            </p>
            <button className="btn-gold">Saiba Mais</button>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <img src={aboutImg} alt="Sobre a Prospera" className="w-full h-80 lg:h-96 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
