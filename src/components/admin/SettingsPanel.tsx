import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings, SiteSettings } from "@/hooks/useSiteSettings";
import ImageUploader from "./ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Save, Phone, Mail, MessageCircle, Home, FileText, Info, Globe } from "lucide-react";

type Tab = "contato" | "hero" | "sobre" | "servicos" | "pagina_contato";

const tabs: { key: Tab; label: string; icon: typeof Phone }[] = [
  { key: "contato", label: "Contato", icon: Phone },
  { key: "hero", label: "Hero / Início", icon: Home },
  { key: "sobre", label: "Sobre Nós", icon: Info },
  { key: "servicos", label: "Serviços", icon: FileText },
  { key: "pagina_contato", label: "Pág. Contato", icon: Globe },
];

const SettingsPanel = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("contato");
  const [form, setForm] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  const set = (key: keyof SiteSettings, value: string) => {
    if (form) setForm({ ...form, [key]: value });
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!form) return;
      const entries = Object.entries(form) as [string, string][];
      for (const [key, value] of entries) {
        // Try update first, then upsert if row doesn't exist
        const { data } = await supabase
          .from("site_settings")
          .select("id")
          .eq("key", key)
          .maybeSingle();
        if (data) {
          const { error } = await supabase
            .from("site_settings")
            .update({ value, updated_at: new Date().toISOString() })
            .eq("key", key);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("site_settings")
            .insert({ key, value });
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Configurações salvas!" });
    },
    onError: (err: any) =>
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" }),
  });

  if (isLoading || !form) return <p className="text-muted-foreground">Carregando configurações...</p>;

  const Field = ({ label, settingsKey, multiline }: { label: string; settingsKey: keyof SiteSettings; multiline?: boolean }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {multiline ? (
        <Textarea value={form[settingsKey]} onChange={(e) => set(settingsKey, e.target.value)} rows={3} />
      ) : (
        <Input value={form[settingsKey]} onChange={(e) => set(settingsKey, e.target.value)} />
      )}
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <h2 className="text-2xl font-bold text-foreground font-display">Configurações do Site</h2>
      <p className="text-sm text-muted-foreground">Edite os textos e informações de cada seção do site.</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === t.key
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "contato" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="WhatsApp (com código do país)" settingsKey="whatsapp" />
              <Field label="Telefone" settingsKey="phone" />
              <Field label="E-mail" settingsKey="email" />
              <Field label="Endereço" settingsKey="address" />
              <Field label="Horário de Funcionamento" settingsKey="hours" />
              <Field label="Instagram URL" settingsKey="instagram_url" />
              <Field label="Facebook URL" settingsKey="facebook_url" />
            </div>
          </>
        )}

        {activeTab === "hero" && (
          <>
            <Field label="Título Principal" settingsKey="hero_title" />
            <Field label="Subtítulo" settingsKey="hero_subtitle" multiline />
            <div className="space-y-2">
              <Label>Imagens de Fundo (carrossel)</Label>
              <ImageUploader
                images={form.hero_images ? form.hero_images.split(",").map((u) => u.trim()).filter(Boolean) : []}
                onChange={(imgs) => set("hero_images", imgs.join(","))}
              />
              <p className="text-xs text-muted-foreground">Adicione múltiplas imagens para criar um carrossel automático. Recomendado: 1920x1080 ou maior.</p>
            </div>
          </>
        )}

        {activeTab === "sobre" && (
          <>
            <Field label="Parágrafo 1" settingsKey="about_text_1" multiline />
            <Field label="Parágrafo 2" settingsKey="about_text_2" multiline />
            <h3 className="font-semibold text-foreground pt-2">Estatísticas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Field label="Valor 1" settingsKey="about_stat_1_value" />
                <Field label="Rótulo 1" settingsKey="about_stat_1_label" />
              </div>
              <div className="space-y-2">
                <Field label="Valor 2" settingsKey="about_stat_2_value" />
                <Field label="Rótulo 2" settingsKey="about_stat_2_label" />
              </div>
              <div className="space-y-2">
                <Field label="Valor 3" settingsKey="about_stat_3_value" />
                <Field label="Rótulo 3" settingsKey="about_stat_3_label" />
              </div>
            </div>
          </>
        )}

        {activeTab === "servicos" && (
          <>
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-4 bg-secondary rounded-lg space-y-3">
                <h3 className="font-semibold text-foreground">Serviço {n}</h3>
                <Field label="Título" settingsKey={`service_${n}_title` as keyof SiteSettings} />
                <Field label="Descrição" settingsKey={`service_${n}_desc` as keyof SiteSettings} multiline />
              </div>
            ))}
          </>
        )}

        {activeTab === "pagina_contato" && (
          <>
            <Field label="Título da Página" settingsKey="contact_page_title" />
            <Field label="Subtítulo" settingsKey="contact_page_subtitle" multiline />
          </>
        )}
      </div>

      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="btn-gold">
        <Save className="h-4 w-4 mr-2" />
        {mutation.isPending ? "Salvando..." : "Salvar configurações"}
      </Button>
    </div>
  );
};

export default SettingsPanel;
