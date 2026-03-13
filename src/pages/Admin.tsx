import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, LogOut, Home, Settings, Building2, Users, MessageSquare, Eye, EyeOff, UserCog } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import PropertyForm from "@/components/admin/PropertyForm";
import ProjectForm from "@/components/admin/ProjectForm";
import TeamMemberForm from "@/components/admin/TeamMemberForm";
import SettingsPanel from "@/components/admin/SettingsPanel";
import UserManagement from "@/components/admin/UserManagement";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingProperty, setEditingProperty] = useState<Tables<"properties"> | null>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"properties" | "projects" | "team" | "messages" | "settings" | "users">("properties");

  const { data: properties, isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin && activeTab === "properties",
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin && activeTab === "projects",
  });

  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin && activeTab === "team",
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin && activeTab === "messages",
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

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: "Membro excluído com sucesso" });
    },
    onError: (err: any) => toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" }),
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast({ title: "Mensagem excluída" });
    },
    onError: (err: any) => toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" }),
  });

  const toggleReadMutation = useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      const { error } = await supabase.from("contact_messages").update({ read }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    },
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
        <Button variant="outline" onClick={async () => { await signOut(); navigate("/auth"); }}>Sair</Button>
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
    setEditingMember(null);
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
        <div className="flex gap-2 mb-6 border-b border-border pb-3 overflow-x-auto">
          <Button
            variant={activeTab === "properties" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setActiveTab("properties"); setShowForm(false); }}
            className="shrink-0"
          >
            <Home className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Imóveis</span>
          </Button>
          <Button
            variant={activeTab === "projects" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setActiveTab("projects"); setShowForm(false); }}
            className="shrink-0"
          >
            <Building2 className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Projetos</span>
          </Button>
          <Button
            variant={activeTab === "team" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setActiveTab("team"); setShowForm(false); }}
            className="shrink-0"
          >
            <Users className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Equipe</span>
          </Button>
          <Button
            variant={activeTab === "messages" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setActiveTab("messages"); setShowForm(false); }}
            className="relative shrink-0"
          >
            <MessageSquare className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Mensagens</span>
            {messages && messages.filter((m) => !m.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {messages.filter((m) => !m.read).length}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setActiveTab("settings"); setShowForm(false); }}
            className="shrink-0"
          >
            <Settings className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Configurações</span>
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setActiveTab("users"); setShowForm(false); }}
            className="shrink-0"
          >
            <UserCog className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Usuários</span>
          </Button>
        </div>

        {activeTab === "settings" ? (
          <SettingsPanel />
        ) : activeTab === "messages" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground font-display">
                Mensagens ({messages?.length ?? 0})
              </h2>
            </div>

            {messagesLoading ? (
              <p className="text-muted-foreground">Carregando mensagens...</p>
            ) : !messages?.length ? (
              <div className="text-center py-16 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg mb-2">Nenhuma mensagem recebida</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`bg-card rounded-lg border p-5 transition-colors ${msg.read ? "border-border opacity-70" : "border-accent/50"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{msg.name}</h3>
                          {!msg.read && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent-foreground">Nova</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                          <span>{msg.email}</span>
                          {msg.phone && <span>{msg.phone}</span>}
                          {msg.subject && <span>Assunto: {msg.subject}</span>}
                          <span>{new Date(msg.created_at).toLocaleString("pt-BR")}</span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-line">{msg.message}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" title={msg.read ? "Marcar como não lida" : "Marcar como lida"} onClick={() => toggleReadMutation.mutate({ id: msg.id, read: !msg.read })}>
                          {msg.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => {
                          if (confirm("Excluir esta mensagem?")) deleteMessageMutation.mutate(msg.id);
                        }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : activeTab === "team" ? (
          showForm ? (
            <TeamMemberForm member={editingMember} onClose={handleFormClose} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground font-display">
                  Equipe ({teamMembers?.length ?? 0})
                </h2>
                <Button onClick={() => { setEditingMember(null); setShowForm(true); }} className="btn-gold">
                  <Plus className="h-4 w-4 mr-1" /> Novo Membro
                </Button>
              </div>

              {teamLoading ? (
                <p className="text-muted-foreground">Carregando equipe...</p>
              ) : !teamMembers?.length ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg mb-2">Nenhum membro cadastrado</p>
                  <p className="text-sm">Clique em "Novo Membro" para começar</p>
                </div>
              ) : (
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Foto</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cargo</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ordem</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map((m) => (
                          <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              {m.photo_url ? (
                                <img src={m.photo_url} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 font-medium text-foreground">{m.name}</td>
                            <td className="px-4 py-3 text-muted-foreground">{m.role}</td>
                            <td className="px-4 py-3 text-muted-foreground">{m.display_order}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${m.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {m.active ? "Ativo" : "Inativo"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingMember(m); setShowForm(true); }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => {
                                  if (confirm("Excluir este membro?")) deleteTeamMutation.mutate(m.id);
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
