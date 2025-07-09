import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useUsuarioControllerRedefinirSenha } from "@/gen";
import { queryClient } from "@/lib/query-client";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner"

export function RedefinirSenha({ id }: { id: string }) {
    const [open, setOpen] = useState(false);
    const [novaSenha, setNovaSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);


    const { mutate, isPending } = useUsuarioControllerRedefinirSenha({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: ["vendedores"] });
                setOpen(false);
                setNovaSenha("");
                toast.success("Senha redefinida com sucesso.")
            },
            onError(error) {
                toast.error("Não foi possível redefinir a senha.")
                console.error("Erro ao redefinir senha:", error);
            },
        },
    });

    const gerarSenhaAleatoria = () => {
        const numeroAleatorio = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0");
        const senhaGerada = `Unipag@${numeroAleatorio}`;
        setNovaSenha(senhaGerada);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (novaSenha.trim()) {
            mutate({
                id,
                data: {
                    senha: novaSenha
                }
            });
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setNovaSenha("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" size="sm">
                    Redefinir Senha
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Redefinir Senha</DialogTitle>
                    <DialogDescription>
                        Defina uma nova senha para o usuário. Você pode gerar uma senha
                        aleatória ou inserir uma personalizada.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nova-senha">Nova Senha</Label>
                            <div className="relative">
                                <Input
                                    id="nova-senha"
                                    type={mostrarSenha ? "text" : "password"}
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    placeholder="Digite a nova senha"
                                    className="pr-20"
                                    required
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                    >
                                        {mostrarSenha ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={gerarSenhaAleatoria}
                                        title="Gerar senha aleatória"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending || !novaSenha.trim()}>
                            {isPending ? "Redefinindo..." : "Redefinir"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}