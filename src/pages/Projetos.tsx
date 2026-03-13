import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Calendar, Ruler, Building2, ArrowRight } from "lucide-react";

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

const typeLabels: Record<string, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  misto: "Misto",
};

const Projetos = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display mb-4">
            Nossos Projetos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça os projetos que estamos construindo e os que já entregamos com qualidade e excelência.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border animate-pulse h-96" />
              ))}
            </div>
          ) : !projects?.length ? (
            <div className="text-center py-20 text-muted-foreground">
              <Building2 className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl mb-2">Nenhum projeto cadastrado ainda</p>
              <p className="text-sm">Volte em breve para conferir nossos lançamentos!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Link
                  key={project.id}
                  to={`/projetos/${project.id}`}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image_url || project.images?.[0] || fallbackImages[index % 3]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status] || "bg-muted text-muted-foreground"}`}>
                        {statusLabels[project.status] || project.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/90 text-accent-foreground">
                        {typeLabels[project.project_type] || project.project_type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-foreground font-display group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {(project.city || project.location) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {project.city || project.location}
                          {project.state && `, ${project.state}`}
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

                    <div className="flex items-center text-accent text-sm font-medium pt-1">
                      Ver detalhes <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projetos;
