import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePropertyFilters = () => {
  return useQuery({
    queryKey: ["property-filters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("property_type, city, bedrooms")
        .eq("active", true);
      if (error) throw error;

      const types = [...new Set(data.map((p) => p.property_type).filter(Boolean))].sort();
      const cities = [...new Set(data.map((p) => p.city).filter(Boolean))].sort() as string[];
      const bedrooms = [...new Set(data.map((p) => p.bedrooms).filter((b) => b !== null && b > 0))].sort((a, b) => (a ?? 0) - (b ?? 0));

      return { types, cities, bedrooms };
    },
    staleTime: 1000 * 60 * 5,
  });
};
