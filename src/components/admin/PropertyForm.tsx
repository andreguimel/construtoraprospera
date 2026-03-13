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
import type { Tables } from "@/integrations/supabase/types";
import ImageUploader from "./ImageUploader";

interface PropertyFormProps {
  property: Tables<"properties"> | null;
  onClose: () => void;
}

const PropertyForm = ({ property, onClose }: PropertyFormProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!property;

  const [form, setForm] = useState({
    title: property?.title ?? "",
    description: property?.description ?? "",
    price: property?.price?.toString() ?? "",
    address: property?.address ?? "",
    city: property?.city ?? "",
    state: property?.state ?? "",
    neighborhood: property?.neighborhood ?? "",
    property_type: property?.property_type ?? "casa",
    transaction_type: property?.transaction_type ?? "venda",
    bedrooms: property?.bedrooms?.toString() ?? "0",
    bathrooms: property?.bathrooms?.toString() ?? "0",
    area: property?.area?.toString() ?? "",
    garage_spots: property?.garage_spots?.toString() ?? "0",
    condominium_fee: property?.condominium_fee?.toString() ?? "",
    iptu: property?.iptu?.toString() ?? "",
    image_url: property?.image_url ?? "",
    accepts_pets: property?.accepts_pets ?? false,
    furnished: property?.furnished ?? false,
    featured: property?.featured ?? false,
    active: property?.active ?? true,
  });

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description || null,
        price: parseFloat(form.price),
        address: form.address,
        city: form.city || null,
        state: form.state || null,
        neighborhood: form.neighborhood || null,
        property_type: form.property_type,
        transaction_type: form.transaction_type,
        bedrooms: parseInt(form.bedrooms) || 0,
        bathrooms: parseInt(form.bathrooms) || 0,
        area: form.area ? parseFloat(form.area) : null,
        garage_spots: parseInt(form.garage_spots) || 0,
        condominium_fee: form.condominium_fee ? parseFloat(form.condominium_fee) : null,
        iptu: form.iptu ? parseFloat(form.iptu) : null,
        image_url: form.image_url || null,
        accepts_pets: form.accepts_pets,
        furnished: form.furnished,
        featured: form.featured,
        active: form.active,
      };

      if (isEditing) {
        const { error } = await supabase.from("properties").update(payload).eq("id", property.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("properties").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      queryClient.invalidateQueries({ queryKey: ["featured-properties"] });
      toast({ title: isEditing ? "Imóvel atualizado!" : "Imóvel cadastrado!" });
      onClose();
    },
    onError: (err: any) => toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.address) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  return (
    <div>
      <Button variant="ghost" onClick={onClose} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
      </Button>

      <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-display)" }}>
        {isEditing ? "Editar Imóvel" : "Novo Imóvel"}
      </h2>

      <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 space-y-6">
        {/* Informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Título *</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Descrição</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Preço (R$) *</Label>
            <Input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Tipo de transação</Label>
            <select value={form.transaction_type} onChange={(e) => set("transaction_type", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Tipo de imóvel</Label>
            <select value={form.property_type} onChange={(e) => set("property_type", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
              <option value="rural">Rural</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>URL da imagem</Label>
            <Input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        {/* Endereço */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Endereço *</Label>
              <Input value={form.address} onChange={(e) => set("address", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} />
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

        {/* Características */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Características</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Quartos</Label>
              <Input type="number" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Banheiros</Label>
              <Input type="number" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Área (m²)</Label>
              <Input type="number" step="0.01" value={form.area} onChange={(e) => set("area", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Vagas</Label>
              <Input type="number" value={form.garage_spots} onChange={(e) => set("garage_spots", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Valores adicionais */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Valores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Condomínio (R$)</Label>
              <Input type="number" step="0.01" value={form.condominium_fee} onChange={(e) => set("condominium_fee", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>IPTU (R$)</Label>
              <Input type="number" step="0.01" value={form.iptu} onChange={(e) => set("iptu", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={form.accepts_pets} onCheckedChange={(v) => set("accepts_pets", v)} />
            <Label>Aceita pets</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.furnished} onCheckedChange={(v) => set("furnished", v)} />
            <Label>Mobiliado</Label>
          </div>
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
            {mutation.isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar imóvel"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
