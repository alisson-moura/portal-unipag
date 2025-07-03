import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthControllerLogin } from "@/gen"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { AlertCircleIcon, LoaderCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "./auth-provider"
import { useNavigate } from "react-router";

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'O campo de e-mail é obrigatório.' })
        .email({ message: 'Por favor, insira um endereço de e-mail válido.' }),
    senha: z
        .string()
        .min(1, { message: 'O campo de senha é obrigatório.' }),
});


export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const { login } = useAuth()
    const navigate = useNavigate();
    const { isPending, error, mutate } = useAuthControllerLogin({
        mutation: {
            onSuccess: (response) => {
                console.log("executou")
                const { access_token, ...user } = response.data
                login(access_token, user)
                navigate('/admin');
            }
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            senha: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({ data: values })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Bem-vindo à UniPag</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Digite seu e-mail abaixo para entrar na sua conta
                    </p>
                </div>
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="grid gap-3">
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input placeholder="m@exemplo.com"  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="senha"
                        render={({ field }) => (
                            <FormItem className="grid gap-3">
                                <div className="flex items-center">
                                    <FormLabel>Senha</FormLabel>
                                   {/*  <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        Esqueceu sua senha?
                                    </a> */}
                                </div>
                                <FormControl>
                                    <Input type="password"  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isPending} type="submit">
                        {isPending &&
                            <LoaderCircleIcon
                                className="-ms-1 animate-spin"
                                size={16}
                                aria-hidden="true"
                            />}
                        Entrar
                    </Button>
                    {error && <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Não foi possível acessar sua conta.</AlertTitle>
                        <AlertDescription>
                            O e-mail ou a senha informados estão incorretos. Por favor, verifique seus dados e tente novamente.
                        </AlertDescription>
                    </Alert>
                    }
                </div>
            </form>
        </Form>
    )
}
