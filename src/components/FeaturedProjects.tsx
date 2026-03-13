import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MapPin, Calendar, Ruler, ArrowRight } from "lucide-react";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const fallbackImages = [property1, property2, property3];

const statusLabels: Record<string, string> = {
  planejado: "Planejado",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
};

const statusColors: Record<string, string> = {
  planejado: "bg-accent/20 text-accent-foreground",
  em_andamento: "bg-primary/20 text-primary-foreground",
  concluido: "bg-green-500/20 text-green-300",
};

const FeaturedProjects = () => {
  const { ref, isVisible } = useScrollAnimation();

  const { data: projects } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("active", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (!projects?.length) return null;

  return (
    <section className="py-20 bg-secondary">
      <div ref={ref} className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <h2 className="section-title">Projetos em Destaque</h2>
          <Link to="/projetos" className="hidden md:inline-flex items-center gap-1 text-accent text-sm font-medium hover:underline">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <Link
              key={project.id}
              to={`/projetos/${project.id}`}
              className={`group bg-card rounded-xl border border-border overflow-hidden hover:border-accent transition-all duration-500 hover:-translate-y-1 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 150}ms`, boxShadow: "var(--shadow-card)" }}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={project.image_url || project.images?.[0] || fallbackImages[i % 3]}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status] || "bg-muted text-muted-foreground"}`}>
                  {statusLabels[project.status] || project.status}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold text-foreground font-display group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
                  {(project.city || project.location) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {project.city || project.location}
                    </span>
                  )}
                  {project.year && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {project.year}
                    </span>
                  )}
                  {project.built_area && (
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3.5 w-3.5" />
                      {project.built_area} m²
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/projetos" className="btn-gold inline-flex items-center gap-2">
            Ver todos os projetos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
