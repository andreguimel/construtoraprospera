import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  // Contact
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  // Hero
  hero_images: string;
  hero_title: string;
  hero_subtitle: string;
  // About
  about_text_1: string;
  about_text_2: string;
  about_stat_1_value: string;
  about_stat_1_label: string;
  about_stat_2_value: string;
  about_stat_2_label: string;
  about_stat_3_value: string;
  about_stat_3_label: string;
  // Services
  service_1_title: string;
  service_1_desc: string;
  service_2_title: string;
  service_2_desc: string;
  service_3_title: string;
  service_3_desc: string;
  // Contact page
  contact_page_title: string;
  contact_page_subtitle: string;
  // Footer
  instagram_url: string;
  facebook_url: string;
}

const defaults: SiteSettings = {
  whatsapp: "5500000000000",
  phone: "(11) 1234-5678",
  email: "contato@prospera.com.br",
  address: "Rua das Flores, 123, São Paulo, SP",
  hours: "Seg–Sex: 9h às 18h | Sáb: 9h às 13h",
  hero_images: "",
  hero_title: "Encontre ou Construa o imóvel dos seus sonhos",
  hero_subtitle: "Casas, apartamentos e terrenos nas melhores localizações, com atendimento personalizado.",
  about_text_1: "A Prospera Imobiliária e Construtora é referência no mercado imobiliário, com anos de experiência realizando os sonhos de nossos clientes. Oferecemos um atendimento personalizado e dedicado para encontrar o imóvel perfeito para você.",
  about_text_2: "Nossa equipe de profissionais altamente qualificados está pronta para auxiliá-lo em todas as etapas da compra, venda ou locação do seu imóvel.",
  about_stat_1_value: "+500",
  about_stat_1_label: "Imóveis",
  about_stat_2_value: "+1.200",
  about_stat_2_label: "Clientes",
  about_stat_3_value: "+15",
  about_stat_3_label: "Anos",
  service_1_title: "Compra e Venda",
  service_1_desc: "Assessoria completa na compra e venda de imóveis residenciais e comerciais.",
  service_2_title: "Aluguel de Imóveis",
  service_2_desc: "Encontre o imóvel ideal para alugar com as melhores condições do mercado.",
  service_3_title: "Administração de Imóveis",
  service_3_desc: "Gestão profissional do seu patrimônio imobiliário com total transparência.",
  contact_page_title: "Fale Conosco",
  contact_page_subtitle: "Estamos prontos para ajudá-lo a encontrar ou construir o imóvel dos seus sonhos.",
  instagram_url: "#",
  facebook_url: "#",
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
