FROM node:20

# Cria diretório e define como diretório de trabalho
WORKDIR /app

# Copia apenas arquivos essenciais primeiro (para usar cache de build)
COPY package*.json ./

# Instala dependências (INCLUINDO o bcrypt compilado corretamente)
RUN npm install --ignore-scripts

# Copia o restante da aplicação
COPY . .

# Gera Prisma Client
RUN npx prisma generate

# Builda o projeto
RUN npm run build

# Copia os arquivos de schema para o dist (se necessário)
RUN cp -r prisma dist/

# Instala browser para puppeteer (depois do build, pra não afetar deps nativas)
RUN npx puppeteer browsers install chrome

# Permissões e usuário
RUN chown -R node:node /app
USER node

EXPOSE 3000

# Inicia a aplicação
CMD ["node", "dist/src/main.js"]
