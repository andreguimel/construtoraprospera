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

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  bio: string | null;
  display_order: number;
  active: boolean;
}

interface TeamMemberFormProps {
  member: TeamMember | null;
  onClose: () => void;
}

const TeamMemberForm = ({ member, onClose }: TeamMemberFormProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!member;

  const [form, setForm] = useState({
    name: member?.name ?? "",
    role: member?.role ?? "",
    bio: member?.bio ?? "",
    photo_url: member?.photo_url ?? "",
    photos: member?.photo_url ? [member.photo_url] : [],
    display_order: member?.display_order?.toString() ?? "0",
    active: member?.active ?? true,
  });

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        role: form.role,
        bio: form.bio || null,
        photo_url: form.photos[0] || null,
        display_order: parseInt(form.display_order) || 0,
        active: form.active,
      };

      if (isEditing) {
        const { error } = await supabase.from("team_members").update(payload).eq("id", member.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("team_members").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: isEditing ? "Membro atualizado!" : "Membro cadastrado!" });
      onClose();
    },
    onError: (err: any) => toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      toast({ title: "Preencha nome e cargo", variant: "destructive" });
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
        {isEditing ? "Editar Membro" : "Novo Membro"}
      </h2>

      <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Cargo *</Label>
            <Input value={form.role} onChange={(e) => set("role", e.target.value)} required placeholder="Ex: Diretor, Corretor, Arquiteto" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Bio / Descrição</Label>
          <Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} />
        </div>

        <div className="space-y-2">
          <Label>Foto</Label>
          <ImageUploader
            images={form.photos}
            onChange={(imgs) => set("photos", imgs)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ordem de exibição</Label>
            <Input type="number" value={form.display_order} onChange={(e) => set("display_order", e.target.value)} />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
            <Label>Ativo</Label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar membro"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
};

export default TeamMemberForm;
