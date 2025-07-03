# --- STAGE 1: Build das dependências e da aplicação ---
FROM node:22.14-alpine AS builder

WORKDIR /app

# Copia o package.json e package-lock.json da raiz PRIMEIRO
# Isso é crucial para o cache e para o npm ci, que depende do package-lock.json global.
COPY package.json ./
COPY package-lock.json ./

# Copia os package.json dos workspaces.
# Eles são necessários para o npm ci entender as dependências dos sub-projetos.
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

# Instala todas as dependências (dev e prod) de todos os workspaces.
# O npm ci é preferível ao npm install em Dockerfiles para builds reproduzíveis.
RUN npm ci

# Copia o restante do código fonte.
# O Docker invalidará este passo e os próximos se qualquer arquivo mudar.
COPY . .

RUN npm run prisma:generate

RUN npm run web:generate

# Executa o script de build que você definiu na raiz do monorepo.
# Isso gerará o build do frontend em /apps/web/dist e a copiará para /apps/api/public
# e o build do backend em /apps/api/dist.
RUN npm run build

# --- STAGE 2: Imagem Final de Produção ---
# Usa uma imagem Node.js Alpine ainda mais leve para a imagem de produção.
FROM node:22.14-alpine

# Define o diretório de trabalho na imagem final.
WORKDIR /usr/src/app

# Copia APENAS os artefatos de build necessários do estágio 'builder'.
# 1. Código compilado do backend (NestJS).
COPY --from=builder /app/apps/api/dist dist/

# 2. Pasta 'public' do backend, que contém o build do frontend.
COPY --from=builder /app/apps/api/public public/

# Copia o package.json e package-lock.json APENAS do projeto API
# Isso é necessário para instalar as dependências de produção para a API nesta imagem final.
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Instala APENAS as dependências de produção para o projeto API.
# 'npm ci --omit=dev' é ideal aqui.
RUN npm ci --omit=dev

# Expõe a porta que seu NestJS escuta.
EXPOSE 3000

# Comando para iniciar a aplicação NestJS.
CMD ["node", "dist/main.js"]