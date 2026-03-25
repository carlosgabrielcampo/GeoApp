# GeoApp

Aplicacao web para visualizacao e gerenciamento de pontos geograficos em mapa, com suporte a criacao, edicao e remocao de registros no formato GeoJSON.

## Tecnologias principais

- Next.js 16 com App Router
- React 19
- TypeScript
- Leaflet + React Leaflet
- Tailwind CSS 4
- React Toastify
- Lucide React

## Como instalar e rodar

### 1. Pre-requisitos

- Node.js 20 ou superior
- npm

Observacao: o projeto possui `package-lock.json`, entao o fluxo recomendado e utilizar `npm`.

### 2. Instalar dependencias

Na raiz do projeto, execute:

```bash
npm install
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Depois, acesse:

```text
http://localhost:3000
```

### 4. Gerar build de producao

```bash
npm run build
```

### 5. Rodar a aplicacao em modo de producao

Depois do build:

```bash
npm run start
```

### 6. Executar lint

```bash
npm run lint
```

## Estrutura resumida

- `src/app`: paginas e rotas da aplicacao com App Router
- `src/app/api/geojson`: endpoints para listar, criar, editar e remover pontos
- `src/components/map`: renderizacao do mapa e dos pontos
- `src/components/modal`: formulario de criacao/edicao de pontos
- `src/components/providers`: componentes de suporte de interface, como sidebar
- `src/database/db.ts`: armazenamento em memoria dos registros
- `src/services/dbHandler.ts`: camada cliente para consumo da API

## Decisoes tecnicas

### Next.js com App Router

O projeto foi estruturado em Next.js para aproveitar:

- roteamento nativo
- API Routes via `route.ts`
- separacao clara entre interface, servicos e camada de acesso a dados

Essa escolha simplifica a organizacao do projeto e permite manter frontend e backend leve no mesmo codigo-base.

### TypeScript

TypeScript foi utilizado para garantir tipagem dos objetos GeoJSON, contratos da API e estados da interface. Isso reduz erros comuns de integracao entre formulario, mapa e endpoints.

### Leaflet + React Leaflet

Leaflet foi escolhido por ser uma biblioteca madura e adequada para mapas interativos 2D. O `react-leaflet` foi usado para integrar o mapa ao ecossistema React de forma declarativa.

Como Leaflet depende de APIs do navegador, o mapa principal e carregado com `dynamic import` e `ssr: false`, evitando problemas de renderizacao no servidor.

### API interna com armazenamento em memoria

Os dados sao manipulados por rotas em `src/app/api/geojson` e armazenados em memoria em `src/database/db.ts`.

Essa abordagem foi uma escolha simples e direta para a implementacao atual porque:

- elimina dependencias externas de banco de dados
- facilita testes locais
- deixa o fluxo CRUD visivel e facil de entender

### Tailwind CSS e bibliotecas auxiliares

Tailwind CSS foi usado para acelerar a construcao da interface, principalmente no mapa, modal e sidebar. Bibliotecas auxiliares completam a experiencia:

- `lucide-react` para icones
- `react-toastify` para feedback visual de sucesso e erro
- `uuid` para geracao dos identificadores dos novos pontos

## Observacoes relevantes

- Nao ha uso de variaveis de ambiente no estado atual do projeto.
- Os dados nao sao persistidos em banco. Como o armazenamento e em memoria, qualquer reinicializacao do servidor faz os registros voltarem ao estado inicial definido em `src/database/db.ts`.
- O endpoint de GeoJSON foi pensado para trabalhar com `Feature` do tipo `Point`.
- Existe um ponto inicial de exemplo cadastrado para facilitar a validacao da interface e do fluxo CRUD.
- O projeto depende de tiles do OpenStreetMap para exibicao do mapa.

## Scripts disponiveis

```bash
npm run dev
npm run build
npm run start
npm run lint
```
