# TMDB API

API para gerenciamento de filmes.

## Pré-requisitos

- Node.js (versão X ou superior)
- npm

## Instalação

```bash
npm install
```

## Rodando o projeto

```bash
npm run dev
```

O servidor será iniciado na porta 3333.

## Documentação Swagger

Acesse a documentação interativa em:  
http://localhost:3333/api-docs

A especificação OpenAPI está disponível no arquivo `swagger.json` na raiz do projeto.

## Como funciona a recomendação de filmes

A lista de recomendações é gerada a partir dos seguintes critérios:

- **Qualidade:** Só são considerados filmes com nota (`vote_average`) igual ou superior a 6.0 e popularidade (`popularity`) igual ou superior a 10.
- **Status:** Apenas filmes já lançados (`status: "Released"`) e que não sejam adultos (`adult: false`).
- **Idioma:** Por padrão, são priorizados filmes em português (`pt`) e inglês (`en`). Se o parâmetro `language` for informado na URL, ele é priorizado junto com o inglês.
- **Diversidade de gêneros:** O sistema busca garantir que a lista final tenha variedade de gêneros, limitando a quantidade de filmes do mesmo gênero.
- **Ordenação e variedade:** Os filmes são ordenados por nota, popularidade e, em seguida, embaralhados para trazer variedade a cada requisição.
- **Limite:** São retornados até 10 filmes recomendados.

garantindo que a recomendação seja relevante, variada e adequada ao público.

## Exemplo de requisição

```bash
curl http://localhost:3333/filmes/recomendados
```

## Contato

Dúvidas ou sugestões: [seu-email@dominio.com]

## Configuração

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais: 