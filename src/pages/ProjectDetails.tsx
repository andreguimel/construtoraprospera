import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Calendar, Ruler, Building2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

import property1 from "@/assets/property-1.jpg";

const statusLabels: Record<string, string> = {
  planejado: "Planejado",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
};

const typeLabels: Record<string, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  misto: "Misto",
};

const ProjectDetails = () => {
  const { id } = useParams();
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-96 bg-muted rounded-xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Projeto não encontrado</h1>
          <Link to="/projetos" className="btn-gold inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar aos projetos
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = project.images?.length ? project.images : [project.image_url || property1];
  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/projetos" className="inline-flex items-center gap-2 text-accent hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" /> Voltar aos projetos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gallery */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-muted aspect-video cursor-pointer" onClick={() => setLightbox(true)}>
                <img src={images[current]} alt={project.title} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full hover:bg-background transition-colors">
                      <ChevronLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full hover:bg-background transition-colors">
                      <ChevronRight className="h-5 w-5 text-foreground" />
                    </button>
                    <span className="absolute bottom-3 right-3 bg-background/80 text-foreground text-xs px-3 py-1 rounded-full">
                      {current + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setCurrent(i)} className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === current ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent-foreground">
                    {statusLabels[project.status] || project.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary-foreground">
                    {typeLabels[project.project_type] || project.project_type}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-foreground font-display">{project.title}</h1>
              </div>

              <div className="space-y-3 text-sm">
                {(project.location || project.city) && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-accent" />
                    {project.location || project.city}{project.state && `, ${project.state}`}
                  </div>
                )}
                {project.year && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-accent" />
                    Ano: {project.year}
                  </div>
                )}
                {project.built_area && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Ruler className="h-4 w-4 text-accent" />
                    Área construída: {project.built_area} m²
                  </div>
                )}
              </div>

              {project.description && (
                <div className="bg-card rounded-lg border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-2">Sobre o Projeto</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{project.description}</p>
                </div>
              )}

              <Link to="/contato" className="btn-gold inline-flex items-center gap-2 w-full justify-center">
                Solicitar Informações
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={() => setLightbox(false)}>
            <X className="h-8 w-8" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="h-10 w-10" />
          </button>
          <img src={images[current]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight className="h-10 w-10" />
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            {current + 1} / {images.length}
          </span>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProjectDetails;
