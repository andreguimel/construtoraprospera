import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Phone, Mail, MessageCircle, Save } from "lucide-react";

const SettingsPanel = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();

  const [whatsapp, setWhatsapp] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (settings) {
      setWhatsapp(settings.whatsapp);
      setPhone(settings.phone);
      setEmail(settings.email);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async () => {
      const updates = [
        { key: "whatsapp", value: whatsapp },
        { key: "phone", value: phone },
        { key: "email", value: email },
      ];
      for (const u of updates) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: u.value, updated_at: new Date().toISOString() })
          .eq("key", u.key);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Configurações salvas!" });
    },
    onError: (err: any) =>
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" }),
  });

  if (isLoading) return <p className="text-muted-foreground">Carregando configurações...</p>;

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
        Configurações de Contato
      </h2>
      <p className="text-sm text-muted-foreground">
        Esses dados aparecem na página de detalhes dos imóveis e nos botões de contato.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-accent" /> WhatsApp
          </Label>
          <Input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="5511999999999"
          />
          <p className="text-xs text-muted-foreground">Número com código do país (ex: 5511999999999)</p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-accent" /> Telefone
          </Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="5511999999999"
          />
          <p className="text-xs text-muted-foreground">Número com código do país (ex: 5511999999999)</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-accent" /> E-mail
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato@empresa.com.br"
          />
        </div>
      </div>

      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="btn-gold">
        <Save className="h-4 w-4 mr-2" />
        {mutation.isPending ? "Salvando..." : "Salvar configurações"}
      </Button>
    </div>
  );
};

export default SettingsPanel;
