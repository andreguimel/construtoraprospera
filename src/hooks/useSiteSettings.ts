import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  whatsapp: string;
  phone: string;
  email: string;
}

const defaults: SiteSettings = {
  whatsapp: "5500000000000",
  phone: "5500000000000",
  email: "contato@prospera.com.br",
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");
      if (error) throw error;
      const settings = { ...defaults };
      data?.forEach((row: { key: string; value: string }) => {
        if (row.key in settings) {
          (settings as any)[row.key] = row.value;
        }
      });
      return settings;
    },
    staleTime: 5 * 60 * 1000,
  });
}
