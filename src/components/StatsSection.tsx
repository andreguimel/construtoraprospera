import { Building2, Users, Award, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const stats = [
  { icon: Building2, value: "+500", label: "Imóveis Disponíveis" },
  { icon: Users, value: "+1.200", label: "Clientes Satisfeitos" },
  { icon: Award, value: "+15", label: "Anos de Experiência" },
  { icon: TrendingUp, value: "98%", label: "Taxa de Satisfação" },
];

const StatsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-16 bg-primary overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-accent blur-3xl" />
      </div>
      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent/20 flex items-center justify-center">
                <s.icon className="h-7 w-7 text-accent" />
              </div>
              <p className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">{s.value}</p>
              <p className="text-sm text-primary-foreground/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
