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
import { AlertCircleIcon, Loader2 } from "lucide-react"
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
import { cadastrarVendedorInputSchema, useCadastrarVendedor, type CadastrarVendedorInput } from "./api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export function CadastrarVendedorForm() {
    const [open, setOpen] = useState(false);
    const { mutate, isError, error, isPending } = useCadastrarVendedor();
    const form = useForm<CadastrarVendedorInput>({
        resolver: zodResolver(cadastrarVendedorInputSchema),
        defaultValues: {
            nome: "",
            email: "",
        },
    });

    function onSubmit(values: CadastrarVendedorInput) {
        console.log("Formulário enviado com os dados:", values);
        mutate(values, {
            onSuccess: () => {
                form.reset()
                setOpen(false);
            }
        })
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
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cadastrando...
                                    </>
                                ) : "Cadastrar"}
                            </Button>
                        </DialogFooter>
                        {isError && (
                            <Alert variant="destructive">
                                <AlertCircleIcon />
                                <AlertTitle>Não foi possível cadastrar o vendedor.</AlertTitle>
                                <AlertDescription>
                                    <p>{error.message}</p>
                                </AlertDescription>
                            </Alert>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}