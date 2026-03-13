import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  project_type: string;
  location: string | null;
  city: string | null;
  state: string | null;
  year: number | null;
  built_area: number | null;
  image_url: string | null;
  images: string[] | null;
  featured: boolean | null;
  active: boolean | null;
}

interface ProjectFormProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectForm = ({ project, onClose }: ProjectFormProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!project;

  const [form, setForm] = useState({
    title: project?.title ?? "",
    description: project?.description ?? "",
    status: project?.status ?? "planejado",
    project_type: project?.project_type ?? "residencial",
    location: project?.location ?? "",
    city: project?.city ?? "",
    state: project?.state ?? "",
    year: project?.year?.toString() ?? "",
    built_area: project?.built_area?.toString() ?? "",
    images: project?.images ?? [],
    featured: project?.featured ?? false,
    active: project?.active ?? true,
  });

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description || null,
        status: form.status as any,
        project_type: form.project_type as any,
        location: form.location || null,
        city: form.city || null,
        state: form.state || null,
        year: form.year ? parseInt(form.year) : null,
        built_area: form.built_area ? parseFloat(form.built_area) : null,
        image_url: form.images[0] || null,
        images: form.images.length > 0 ? form.images : null,
        featured: form.featured,
        active: form.active,
      };

      if (isEditing) {
        const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects-list"] });
      toast({ title: isEditing ? "Projeto atualizado!" : "Projeto cadastrado!" });
      onClose();
    },
    onError: (err: any) => toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast({ title: "Preencha o título do projeto", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  return (
    <div>
      <Button variant="ghost" onClick={onClose} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
      </Button>

      <h2 className="text-2xl font-bold text-foreground mb-6 font-display">
        {isEditing ? "Editar Projeto" : "Novo Projeto"}
      </h2>

      <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Título *</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Descrição</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="planejado">Planejado</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <select value={form.project_type} onChange={(e) => set("project_type", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
              <option value="misto">Misto</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Localização</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Local / Endereço</Label>
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Input value={form.state} onChange={(e) => set("state", e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Detalhes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ano</Label>
              <Input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="Ex: 2025" />
            </div>
            <div className="space-y-2">
              <Label>Área Construída (m²)</Label>
              <Input type="number" step="0.01" value={form.built_area} onChange={(e) => set("built_area", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Imagens do Projeto</Label>
          <ImageUploader images={form.images as string[]} onChange={(imgs) => set("images", imgs)} />
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
            <Label>Destaque</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
            <Label>Ativo</Label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar projeto"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
