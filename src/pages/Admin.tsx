import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, LogOut, Home, Settings, Building2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import PropertyForm from "@/components/admin/PropertyForm";
import ProjectForm from "@/components/admin/ProjectForm";
import TeamMemberForm from "@/components/admin/TeamMemberForm";
import SettingsPanel from "@/components/admin/SettingsPanel";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [editingProperty, setEditingProperty] = useState<Tables<"properties"> | null>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"properties" | "projects" | "team" | "settings">("properties");

  const { data: properties, isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      queryClient.invalidateQueries({ queryKey: ["featured-properties"] });
      toast({ title: "Imóvel excluído com sucesso" });
    },
    onError: (err: any) => toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" }),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast({ title: "Projeto excluído com sucesso" });
    },
    onError: (err: any) => toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" }),
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Carregando...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Acesso negado</h1>
        <p className="text-muted-foreground">Você não tem permissão de administrador.</p>
        <Button variant="outline" onClick={signOut}>Sair</Button>
      </div>
    </div>
  );

  const handleEdit = (property: Tables<"properties">) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingProperty(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProperty(null);
    setEditingProject(null);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Painel Administrativo
          </h1>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm"><Home className="h-4 w-4 mr-1" /> Site</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-3">
          <Button
            variant={activeTab === "properties" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setActiveTab("properties"); setShowForm(false); }}
          >
            Imóveis
          </Button>
          <Button
            variant={activeTab === "projects" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setActiveTab("projects"); setShowForm(false); }}
          >
            <Building2 className="h-4 w-4 mr-1" /> Projetos
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setActiveTab("settings"); setShowForm(false); }}
          >
            <Settings className="h-4 w-4 mr-1" /> Configurações
          </Button>
        </div>

        {activeTab === "settings" ? (
          <SettingsPanel />
        ) : activeTab === "projects" ? (
          showForm ? (
            <ProjectForm project={editingProject} onClose={handleFormClose} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground font-display">
                  Projetos ({projects?.length ?? 0})
                </h2>
                <Button onClick={() => { setEditingProject(null); setShowForm(true); }} className="btn-gold">
                  <Plus className="h-4 w-4 mr-1" /> Novo Projeto
                </Button>
              </div>

              {projectsLoading ? (
                <p className="text-muted-foreground">Carregando projetos...</p>
              ) : !projects?.length ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg mb-2">Nenhum projeto cadastrado</p>
                  <p className="text-sm">Clique em "Novo Projeto" para começar</p>
                </div>
              ) : (
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Título</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cidade</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ativo</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((p) => (
                          <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
                            <td className="px-4 py-3 text-muted-foreground capitalize">{p.project_type}</td>
                            <td className="px-4 py-3 text-muted-foreground">{p.city ?? "—"}</td>
                            <td className="px-4 py-3 text-muted-foreground capitalize">{p.status.replace("_", " ")}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {p.active ? "Ativo" : "Inativo"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingProject(p); setShowForm(true); }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => {
                                  if (confirm("Excluir este projeto?")) deleteProjectMutation.mutate(p.id);
                                }}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )
        ) : showForm ? (
          <PropertyForm property={editingProperty} onClose={handleFormClose} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Imóveis ({properties?.length ?? 0})
              </h2>
              <Button onClick={handleNew} className="btn-gold">
                <Plus className="h-4 w-4 mr-1" /> Novo Imóvel
              </Button>
            </div>

            {isLoading ? (
              <p className="text-muted-foreground">Carregando imóveis...</p>
            ) : !properties?.length ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg mb-2">Nenhum imóvel cadastrado</p>
                <p className="text-sm">Clique em "Novo Imóvel" para começar</p>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Título</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cidade</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Preço</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((p) => (
                        <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
                          <td className="px-4 py-3 text-muted-foreground capitalize">{p.property_type}</td>
                          <td className="px-4 py-3 text-muted-foreground">{p.city ?? "—"}</td>
                          <td className="px-4 py-3 text-foreground">{formatPrice(p.price)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {p.active ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => {
                                if (confirm("Excluir este imóvel?")) deleteMutation.mutate(p.id);
                              }}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
