import { z } from 'zod';

export const CreateVendedorSchema = z.object({
    nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    email: z.string().email('Formato de e-mail inválido.')
});

export type CreateVendedorDto = z.infer<typeof CreateVendedorSchema>;