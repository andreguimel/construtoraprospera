import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Shield, ShieldCheck, UserPlus, X } from "lucide-react";

interface ManagedUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  roles: string[];
}

const SUPER_ADMIN_EMAIL = "andreguimel@gmail.com";

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("user");

  const callManageUsers = async (body: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await supabase.functions.invoke("manage-users", {
      body,
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (res.error) throw new Error(res.error.message || "Erro na operação");
    if (res.data?.error) throw new Error(res.data.error);
    return res.data;
  };

  const { data: users, isLoading } = useQuery({
    queryKey: ["managed-users"],
    queryFn: () => callManageUsers({ action: "list" }).then((d) => d.users as ManagedUser[]),
  });

  const inviteMutation = useMutation({
    mutationFn: () => callManageUsers({ action: "invite", email, password, full_name: fullName, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-users"] });
      toast({ title: "Usuário criado com sucesso!" });
      setShowInvite(false);
      setEmail("");
      setPassword("");
      setFullName("");
      setRole("user");
    },
    onError: (err: any) => toast({ title: "Erro ao criar usuário", description: err.message, variant: "destructive" }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ user_id, role }: { user_id: string; role: string }) =>
      callManageUsers({ action: "update_role", user_id, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-users"] });
      toast({ title: "Permissão atualizada!" });
    },
    onError: (err: any) => toast({ title: "Erro", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (user_id: string) => callManageUsers({ action: "delete", user_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-users"] });
      toast({ title: "Usuário removido!" });
    },
    onError: (err: any) => toast({ title: "Erro ao remover", description: err.message, variant: "destructive" }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Usuários ({users?.length ?? 0})
        </h2>
        <Button onClick={() => setShowInvite(!showInvite)} className="btn-gold">
          {showInvite ? <><X className="h-4 w-4 mr-1" /> Cancelar</> : <><UserPlus className="h-4 w-4 mr-1" /> Novo Usuário</>}
        </Button>
      </div>

      {showInvite && (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Criar novo usuário</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              inviteMutation.mutate();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nome do usuário" />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" required />
            </div>
            <div className="space-y-2">
              <Label>Senha *</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label>Permissão</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário (imóveis e projetos)</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={inviteMutation.isPending} className="btn-gold">
                {inviteMutation.isPending ? "Criando..." : "Criar Usuário"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Carregando usuários...</p>
      ) : !users?.length ? (
        <p className="text-muted-foreground text-center py-16">Nenhum usuário encontrado.</p>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Permissão</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Criado em</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSuperAdmin = u.email === SUPER_ADMIN_EMAIL;
                  const currentRole = u.roles.includes("admin") ? "admin" : u.roles.includes("user") ? "user" : "none";

                  return (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {u.full_name || "—"}
                          {isSuperAdmin && <ShieldCheck className="h-4 w-4 text-accent" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        {isSuperAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent-foreground">
                            <Shield className="h-3 w-3" /> Super Admin
                          </span>
                        ) : (
                          <Select
                            value={currentRole}
                            onValueChange={(newRole) => updateRoleMutation.mutate({ user_id: u.id, role: newRole })}
                          >
                            <SelectTrigger className="w-[180px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Usuário</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="none">Sem permissão</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(u.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!isSuperAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm(`Remover usuário ${u.email}?`)) deleteMutation.mutate(u.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
