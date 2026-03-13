import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Home, Key, Building, Shield, Users, TrendingUp, ArrowRight, CheckCircle, MessageCircle, ClipboardCheck, Handshake, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import coupleImg from "@/assets/couple-browsing.jpg";

const Servicos = () => {
  const { data: settings } = useSiteSettings();
  const { ref: ref1, isVisible: vis1 } = useScrollAnimation();
  const { ref: ref2, isVisible: vis2 } = useScrollAnimation();
  const { ref: ref3, isVisible: vis3 } = useScrollAnimation();

  const mainServices = settings
    ? [
        { icon: Home, title: settings.service_1_title, description: settings.service_1_desc },
        { icon: Key, title: settings.service_2_title, description: settings.service_2_desc },
        { icon: Building, title: settings.service_3_title, description: settings.service_3_desc },
      ]
    : [
        { icon: Home, title: "Compra e Venda", description: "Assessoria completa na compra e venda de imóveis residenciais e comerciais." },
        { icon: Key, title: "Aluguel de Imóveis", description: "Encontre o imóvel ideal para alugar com as melhores condições do mercado." },
        { icon: Building, title: "Administração de Imóveis", description: "Gestão profissional do seu patrimônio imobiliário com total transparência." },
      ];

  const extraServices = [
    { icon: Shield, title: "Assessoria Jurídica", description: "Suporte jurídico completo para garantir segurança em todas as transações imobiliárias, incluindo análise documental e contratos." },
    { icon: Users, title: "Consultoria Personalizada", description: "Análise do seu perfil e necessidades para encontrar as melhores oportunidades do mercado imobiliário atual." },
    { icon: TrendingUp, title: "Avaliação de Imóveis", description: "Avaliação técnica e mercadológica para definir o valor justo do seu imóvel com base em dados reais." },
  ];

  const steps = [
    { icon: Search, number: "01", title: "Análise", description: "Entendemos suas necessidades, perfil e objetivos para traçar a melhor estratégia." },
    { icon: ClipboardCheck, number: "02", title: "Seleção", description: "Apresentamos as melhores opções do mercado, previamente filtradas para você." },
    { icon: Handshake, number: "03", title: "Negociação", description: "Conduzimos toda a negociação buscando as melhores condições para ambas as partes." },
    { icon: CheckCircle, number: "04", title: "Conclusão", description: "Acompanhamos toda a documentação até a entrega das chaves." },
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

      {/* Main Services - cards maiores com hover elevado */}
      <section className="py-20">
        <div ref={ref1} className="container mx-auto px-4">
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Oferecemos um portfólio completo de serviços para atender todas as suas demandas no mercado imobiliário, com profissionalismo e transparência.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainServices.map((s, i) => (
              <div
                key={s.title}
                className={`group bg-card rounded-2xl p-10 text-center border border-border hover:border-accent transition-all duration-500 hover:-translate-y-2 ${
                  vis1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ boxShadow: "var(--shadow-card)", transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: "var(--gradient-gold)" }}>
                  <s.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-4">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Trabalhamos - processo em steps */}
      <section className="py-20 bg-primary">
        <div ref={ref2} className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-primary-foreground text-center mb-4">
            Como Trabalhamos
          </h2>
          <p className="text-primary-foreground/60 text-center max-w-xl mx-auto mb-16">
            Nosso processo é pensado para oferecer a melhor experiência do início ao fim.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`relative text-center transition-all duration-500 ${
                  vis2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="text-5xl font-display font-black text-accent/20 mb-3">{step.number}</div>
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <step.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg text-primary-foreground mb-2">{step.title}</h3>
                <p className="text-primary-foreground/60 text-sm leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8">
                    <ArrowRight className="h-5 w-5 text-accent/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Services + imagem */}
      <section className="py-20">
        <div ref={ref3} className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title mb-8">Serviços Complementares</h2>
              <div className="space-y-6">
                {extraServices.map((s, i) => (
                  <div
                    key={s.title}
                    className={`flex gap-5 p-5 rounded-xl bg-secondary border border-border hover:border-accent transition-all duration-500 ${
                      vis3 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                    }`}
                    style={{ transitionDelay: `${i * 150}ms` }}
                  >
                    <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-gold)" }}>
                      <s.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1">{s.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 rounded-2xl bg-accent/10 rotate-3" />
              <div className="relative rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>
                <img src={coupleImg} alt="Consultoria imobiliária" className="w-full h-[480px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <MessageCircle className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="section-title mb-4">Pronto para começar?</h2>
            <p className="text-muted-foreground mb-8">
              Nossa equipe está pronta para atendê-lo. Entre em contato e descubra como podemos transformar seus planos em realidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contato" className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-3">
                Fale Conosco <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/imoveis" className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-border text-foreground hover:bg-card transition-colors font-medium text-sm">
                Ver Imóveis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Servicos;
