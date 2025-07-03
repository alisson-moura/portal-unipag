import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircleIcon,  LoaderCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { z } from 'zod';
import { useUsuarioControllerCreate } from "@/gen";
import { queryClient } from "@/lib/query-client";

const cadastroSchema = z.object({
    nome: z.string()
        .min(3, { message: 'O nome precisa ter no mínimo 3 caracteres.' }),
    email: z.string()
        .min(1, { message: 'O campo e-mail é obrigatório.' })
        .email({ message: 'Por favor, insira um endereço de e-mail válido.' }),
    senha: z.string()
        .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
});

export function CadastrarVendedorForm() {
    const [open, setOpen] = useState(false);
    const { mutate, isPending, error } = useUsuarioControllerCreate({
        mutation: {
            onSuccess: (() => {
                form.reset()
                setOpen(false)
                queryClient.invalidateQueries({queryKey: ["vendedores"]})
            }),
        },
    })

    const form = useForm<z.infer<typeof cadastroSchema>>({
        resolver: zodResolver(cadastroSchema),
        defaultValues: {
            nome: "",
            email: "",
            senha: ""
        },
    });

    function onSubmit(values: z.infer<typeof cadastroSchema>) {
        mutate({ data: { ...values, role: "VENDEDOR" } })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Cadastrar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle>Cadastrar vendedor</DialogTitle>
                            <DialogDescription>
                                Preencha os campos abaixo para cadastrar um novo vendedor.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Nome Field */}
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome e sobrenome" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Digite o e-mail" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Senha Field */}
                        <FormField
                            control={form.control}
                            name="senha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input type="senha" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>
                                {isPending &&
                                    <LoaderCircleIcon
                                        className="-ms-1 animate-spin"
                                        size={16}
                                        aria-hidden="true"
                                    />}
                                Cadastrar
                            </Button>
                        </DialogFooter>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircleIcon />
                                <AlertTitle>Não foi possível cadastrar o vendedor.</AlertTitle>
                                <AlertDescription>
                                    <p>{error.response?.data.message}</p>
                                </AlertDescription>
                            </Alert>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}