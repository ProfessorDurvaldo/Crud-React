# Roteiro de Aula — CRUD com React (useState)

**Tema:** Lista de Tecnologias
**Objetivo:** Construir um app de lista completo, passo a passo, entendendo a lógica de cada operação.
**Pré-requisito:** Saber o que é componente, JSX e `useState` básico.

---

## Visão geral das 5 partes

| Parte | O que vamos fazer | O que o aluno aprende |
|-------|-------------------|-----------------------|
| 1 | Exibir uma lista de objetos | Estrutura de dados, `.map()`, `key` |
| 2 | Filtrar em tempo real | Estado derivado, `.filter()`, `.includes()` |
| 3 | Cadastrar novo item | Spread operator, `Date.now()`, limpar campo |
| 4 | Apagar um item | `.filter()` para remover, passar id por parâmetro |
| 5 | Editar um item | Flag de modo, `.map()` para atualizar, spread em objeto |

## Arquivos da aula

- `dados.js` — array inicial de tecnologias
- `App.css` — estilos prontos (cards, formulário, botões)
- `App.jsx` — vamos construir juntos, parte por parte
- `roteiro.md` — este arquivo

---

## Estrutura do objeto

Cada item da lista tem 4 propriedades:

```js
{
  id: 1,
  nome: "JavaScript",
  valor: 0,              // custo do curso/licença em R$
  imagem: "https://..."  // URL da logo da tecnologia
}
```

> Usamos `id` numérico nos dados iniciais e `Date.now()` nos cadastrados pelo usuário.

## O arquivo dados.js (já pronto)

```js
// dados.js
export const tecnologias = [
  {
    id: 1,
    nome: "JavaScript",
    valor: 0,
    imagem: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  },
  {
    id: 2,
    nome: "React",
    valor: 0,
    imagem: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
  {
    id: 3,
    nome: "PHP",
    valor: 0,
    imagem: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
  },
];
```

Vamos importar esse array no `App.jsx` em todas as partes:

```jsx
import { tecnologias } from "./dados";
```

---
---

# PARTE 1 — Exibir a lista

## Objetivo da parte
Mostrar uma lista de tecnologias na tela. O aluno vai ver como renderizar um array de objetos com `.map()`.

## Estado necessário nesta parte

```jsx
const [itens, setItens] = useState(tecnologias);
```

> Só temos um estado por enquanto. O app ainda não faz nada além de mostrar.

## Código do App.jsx nesta parte

```jsx
import { useState } from "react";
import { tecnologias } from "./dados";
import "./App.css";

export default function App() {
  const [itens, setItens] = useState(tecnologias);

  return (
    <div className="container">
      <h1>📋 Tecnologias</h1>

      <ul className="lista">
        {itens.map((item) => (
          <li key={item.id} className="item">
            <img src={item.imagem} alt={item.nome} className="item-img" />
            <div className="item-info">
              <strong>{item.nome}</strong>
              <span>R$ {item.valor},00</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Pontos para explicar

**Por que `.map()`?**
O React não sabe renderizar um array diretamente — precisamos transformar cada item em JSX. O `.map()` faz isso: percorre o array e devolve um elemento para cada item.

**Por que `key={item.id}`?**
O React usa a `key` para identificar cada elemento da lista. Sem ela, quando a lista muda, o React não sabe qual elemento foi alterado, removido ou adicionado — e pode se perder na hora de atualizar a tela.

**Por que o objeto tem `id`?**
Toda hora que precisarmos apagar ou editar um item específico, vamos precisar de uma forma de identificá-lo. O `id` é essa referência única.

**De onde vêm as classes `container`, `lista`, `item`, `item-img`, `item-info`?**
Já estão prontas no `App.css`. Por isso o componente já nasce com a aparência de card, sem precisar escrever nenhum CSS agora.

---
---

# PARTE 2 — Filtrar a lista

## Objetivo da parte
Adicionar um campo de busca que filtra a lista em tempo real conforme o usuário digita.

## O que muda em relação à Parte 1

Adicionamos um novo estado `busca` e criamos a variável `filtrados`.

```jsx
// Novo estado
const [busca, setBusca] = useState("");

// Variável derivada — NÃO é um estado
const filtrados = itens.filter((item) =>
  item.nome.toLowerCase().includes(busca.toLowerCase())
);
```

E no JSX substituímos `itens.map(...)` por `filtrados.map(...)`.

## Código do App.jsx nesta parte

```jsx
import { useState } from "react";
import { tecnologias } from "./dados";
import "./App.css";

export default function App() {
  const [itens, setItens] = useState(tecnologias);
  const [busca, setBusca] = useState(""); // ← NOVO

  // Derivado — recalcula a cada render
  const filtrados = itens.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container">
      <h1>📋 Tecnologias</h1>

      {/* NOVO: campo de busca */}
      <input
        type="text"
        placeholder="Filtrar por nome..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <ul className="lista">
        {filtrados.map((item) => ( // ← trocou itens por filtrados
          <li key={item.id} className="item">
            <img src={item.imagem} alt={item.nome} className="item-img" />
            <div className="item-info">
              <strong>{item.nome}</strong>
              <span>R$ {item.valor},00</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Pontos para explicar

**`filtrados` não é um estado — por quê?**
Porque ele sempre pode ser recalculado a partir de `itens` e `busca`. Toda vez que qualquer um deles muda, o React re-renderiza o componente e `filtrados` é recalculado automaticamente na hora.

> Regra prática: se um valor *depende* de outro estado, não coloca em `useState`. Deixa como variável normal.

**Por que `.toLowerCase()` nos dois lados?**
Para a busca não diferenciar maiúscula de minúscula. "react", "React" e "REACT" viram "react" na comparação.

**Por que `.includes()` e não `===`?**
Com `===` o usuário teria que digitar o nome exato. Com `.includes()`, digitar "rea" já encontra "React".

**Esse input de filtro tem classe?**
Não precisa de classe própria — o CSS já estiliza qualquer `input[type="text"]` direto dentro do `.container`.

---
---

# PARTE 3 — Cadastrar um item

## Objetivo da parte
Adicionar um formulário onde o usuário preenche nome, valor e URL da imagem e cadastra um novo item na lista.

## O que muda em relação à Parte 2

Adicionamos 3 estados para os campos do formulário e a função `cadastrar`.

```jsx
const [inputNome, setInputNome]     = useState("");
const [inputValor, setInputValor]   = useState("");
const [inputImagem, setInputImagem] = useState("");
```

## A função cadastrar

```jsx
function cadastrar() {
  if (!inputNome.trim()) return; // 1. valida: nome é obrigatório

  const novoItem = {
    id: Date.now(),                  // 2. id único usando timestamp
    nome: inputNome.trim(),
    valor: Number(inputValor) || 0,  // converte string para número
    imagem: inputImagem.trim(),
  };

  setItens([...itens, novoItem]); // 3. adiciona sem apagar os anteriores

  setInputNome("");    // 4. limpa os campos
  setInputValor("");
  setInputImagem("");
}
```

## Código do App.jsx nesta parte

```jsx
import { useState } from "react";
import { tecnologias } from "./dados";
import "./App.css";

export default function App() {
  const [itens, setItens] = useState(tecnologias);
  const [busca, setBusca] = useState("");

  // Novos estados do formulário ↓
  const [inputNome, setInputNome]     = useState("");
  const [inputValor, setInputValor]   = useState("");
  const [inputImagem, setInputImagem] = useState("");

  const filtrados = itens.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function cadastrar() {
    if (!inputNome.trim()) return;

    const novoItem = {
      id: Date.now(),
      nome: inputNome.trim(),
      valor: Number(inputValor) || 0,
      imagem: inputImagem.trim(),
    };

    setItens([...itens, novoItem]);
    setInputNome("");
    setInputValor("");
    setInputImagem("");
  }

  return (
    <div className="container">
      <h1>📋 Tecnologias</h1>

      <input
        type="text"
        placeholder="Filtrar por nome..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {/* NOVO: Formulário de cadastro */}
      <div className="form">
        <h2>Cadastrar tecnologia</h2>

        <input
          type="text"
          placeholder="Nome da tecnologia"
          value={inputNome}
          onChange={(e) => setInputNome(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor (R$)"
          value={inputValor}
          onChange={(e) => setInputValor(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL da imagem"
          value={inputImagem}
          onChange={(e) => setInputImagem(e.target.value)}
        />
        <button onClick={cadastrar}>Cadastrar</button>
      </div>

      <ul className="lista">
        {filtrados.map((item) => (
          <li key={item.id} className="item">
            <img src={item.imagem} alt={item.nome} className="item-img" />
            <div className="item-info">
              <strong>{item.nome}</strong>
              <span>R$ {item.valor},00</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Pontos para explicar

**Por que `[...itens, novoItem]` e não `itens.push(novoItem)`?**
No React nunca modificamos o estado diretamente. O `push` alteraria o array existente sem o React saber. Com o spread `[...]` criamos um array completamente novo — aí o React percebe a mudança e re-renderiza.

**Por que `Date.now()` como id?**
Retorna o número de milissegundos desde 1970 — sempre um número diferente a cada chamada. É simples e suficiente para fins didáticos. Em produção usaríamos o id vindo do banco de dados.

**Por que `Number(inputValor) || 0`?**
O valor do input sempre vem como string. `Number()` converte para número. O `|| 0` garante que se o campo estiver vazio (que viraria `NaN`), o valor salvo seja 0.

**De onde vem o card branco em volta do formulário?**
É a classe `.form` no CSS — já cuida do fundo branco, sombra e espaçamento entre os campos. O botão "Cadastrar" também já vem estilizado em roxo porque o CSS tem a regra `.form > button`.

---
---

# PARTE 4 — Apagar um item

## Objetivo da parte
Adicionar um botão "Apagar" em cada item da lista que remove aquele item permanentemente.

## O que muda em relação à Parte 3

Adicionamos a função `apagar`, um wrapper `<div className="acoes">` e o botão no JSX. Nenhum estado novo é necessário.

## A função apagar

```jsx
function apagar(id) {
  const nova = itens.filter((item) => item.id !== id);
  setItens(nova);
}
```

Linha por linha:
- `itens.filter(...)` percorre todos os itens
- `item.id !== id` mantém todos os itens **exceto** o que tem aquele id
- `setItens(nova)` atualiza a lista com o array sem o item removido

## O botão no JSX

```jsx
<div className="acoes">
  <button className="btn-apagar" onClick={() => apagar(item.id)}>
    Apagar
  </button>
</div>
```

> Por que `() => apagar(item.id)` e não só `apagar`?
> Porque precisamos passar o `id` como argumento. Se escrevêssemos `onClick={apagar}` sem a arrow function, a função seria chamada sem saber qual item apagar.

## Código do App.jsx nesta parte

```jsx
import { useState } from "react";
import { tecnologias } from "./dados";
import "./App.css";

export default function App() {
  const [itens, setItens] = useState(tecnologias);
  const [busca, setBusca]             = useState("");
  const [inputNome, setInputNome]     = useState("");
  const [inputValor, setInputValor]   = useState("");
  const [inputImagem, setInputImagem] = useState("");

  const filtrados = itens.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function cadastrar() {
    if (!inputNome.trim()) return;
    const novoItem = {
      id: Date.now(),
      nome: inputNome.trim(),
      valor: Number(inputValor) || 0,
      imagem: inputImagem.trim(),
    };
    setItens([...itens, novoItem]);
    setInputNome("");
    setInputValor("");
    setInputImagem("");
  }

  // NOVO: função apagar
  function apagar(id) {
    const nova = itens.filter((item) => item.id !== id);
    setItens(nova);
  }

  return (
    <div className="container">
      <h1>📋 Tecnologias</h1>

      <input
        type="text"
        placeholder="Filtrar por nome..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="form">
        <h2>Cadastrar tecnologia</h2>

        <input
          type="text"
          placeholder="Nome da tecnologia"
          value={inputNome}
          onChange={(e) => setInputNome(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor (R$)"
          value={inputValor}
          onChange={(e) => setInputValor(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL da imagem"
          value={inputImagem}
          onChange={(e) => setInputImagem(e.target.value)}
        />
        <button onClick={cadastrar}>Cadastrar</button>
      </div>

      <ul className="lista">
        {filtrados.map((item) => (
          <li key={item.id} className="item">
            <img src={item.imagem} alt={item.nome} className="item-img" />
            <div className="item-info">
              <strong>{item.nome}</strong>
              <span>R$ {item.valor},00</span>
            </div>
            {/* NOVO: botão apagar */}
            <div className="acoes">
              <button className="btn-apagar" onClick={() => apagar(item.id)}>
                Apagar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Pontos para explicar

**`.filter()` aqui tem sentido diferente do filtro de busca?**
É o mesmo método, mas com lógica invertida:
- No filtro de busca: `includes(busca)` → **mantém** quem bate com a busca
- No apagar: `item.id !== id` → **mantém** todos exceto o que queremos remover

**E se dois itens tiverem o mesmo id?**
Os dois seriam removidos. Por isso o `id` precisa ser único — e é por isso que usamos `Date.now()` no cadastro.

**Por que o botão tem `className="btn-apagar"`?**
O CSS já define essa classe com fundo vermelho (`#ef4444`). Sem ela o botão ficaria com a cor padrão (cinza escuro) do seletor genérico `button`.

---
---

# PARTE 5 — Editar um item

## Objetivo da parte
Permitir que o usuário clique em "Editar" em um item e altere seu nome, valor e imagem.

## O que muda em relação à Parte 4

A edição acontece **no mesmo formulário** do cadastro. O que diferencia os dois modos é um novo estado chamado `editandoId`.

```jsx
const [editandoId, setEditandoId] = useState(null);
```

- `null` → modo cadastro (comportamento padrão)
- qualquer id → modo edição

## As funções da edição

### iniciarEdicao — ativa o modo edição

```jsx
function iniciarEdicao(item) {
  setEditandoId(item.id);   // marca qual item está sendo editado
  setInputNome(item.nome);  // preenche o formulário com os dados atuais
  setInputValor(item.valor);
  setInputImagem(item.imagem);
}
```

Ao clicar em "Editar", apenas populamos os campos e guardamos o id. A lista não muda ainda.

### salvarEdicao — aplica as alterações

```jsx
function salvarEdicao() {
  if (!inputNome.trim()) return;

  const atualizada = itens.map((item) =>
    item.id === editandoId
      ? {
          ...item,
          nome: inputNome.trim(),
          valor: Number(inputValor) || 0,
          imagem: inputImagem.trim(),
        }
      : item
  );

  setItens(atualizada);
  setEditandoId(null); // volta ao modo cadastro
  setInputNome("");
  setInputValor("");
  setInputImagem("");
}
```

O `.map()` percorre todos os itens:
- Se o `id` bate com `editandoId` → devolve o objeto atualizado (`{ ...item, ...novosDados }`)
- Se não bate → devolve o item sem alteração

### cancelarEdicao — descarta sem salvar

```jsx
function cancelarEdicao() {
  setEditandoId(null);
  setInputNome("");
  setInputValor("");
  setInputImagem("");
}
```

## Renderização condicional do formulário e dos botões

```jsx
<h2>{editandoId ? "Editar tecnologia" : "Cadastrar tecnologia"}</h2>

{editandoId ? (
  <div className="form-botoes">
    <button className="btn-salvar" onClick={salvarEdicao}>Salvar</button>
    <button className="btn-cancelar" onClick={cancelarEdicao}>Cancelar</button>
  </div>
) : (
  <button onClick={cadastrar}>Cadastrar</button>
)}
```

> `editandoId` funciona como uma **flag de modo**: `null` = cadastro, qualquer id = edição.
> A classe `form-botoes` só existe para colocar Salvar e Cancelar lado a lado — o botão único de Cadastrar não precisa dela.

## Código completo do App.jsx — versão final

```jsx
import { useState } from "react";
import { tecnologias } from "./dados";
import "./App.css";

export default function App() {
  // ── Lista ──────────────────────────────────────────────────
  const [itens, setItens] = useState(tecnologias);

  // ── Filtro ─────────────────────────────────────────────────
  const [busca, setBusca] = useState("");

  // ── Formulário ─────────────────────────────────────────────
  const [inputNome, setInputNome]     = useState("");
  const [inputValor, setInputValor]   = useState("");
  const [inputImagem, setInputImagem] = useState("");

  // ── Controle de modo ───────────────────────────────────────
  const [editandoId, setEditandoId] = useState(null);

  // ── Derivado ───────────────────────────────────────────────
  const filtrados = itens.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // ── Funções ────────────────────────────────────────────────
  function cadastrar() {
    if (!inputNome.trim()) return;
    const novoItem = {
      id: Date.now(),
      nome: inputNome.trim(),
      valor: Number(inputValor) || 0,
      imagem: inputImagem.trim(),
    };
    setItens([...itens, novoItem]);
    setInputNome("");
    setInputValor("");
    setInputImagem("");
  }

  function apagar(id) {
    setItens(itens.filter((item) => item.id !== id));
  }

  function iniciarEdicao(item) {
    setEditandoId(item.id);
    setInputNome(item.nome);
    setInputValor(item.valor);
    setInputImagem(item.imagem);
  }

  function salvarEdicao() {
    if (!inputNome.trim()) return;
    const atualizada = itens.map((item) =>
      item.id === editandoId
        ? {
            ...item,
            nome: inputNome.trim(),
            valor: Number(inputValor) || 0,
            imagem: inputImagem.trim(),
          }
        : item
    );
    setItens(atualizada);
    setEditandoId(null);
    setInputNome("");
    setInputValor("");
    setInputImagem("");
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setInputNome("");
    setInputValor("");
    setInputImagem("");
  }

  // ── JSX ────────────────────────────────────────────────────
  return (
    <div className="container">
      <h1>📋 Tecnologias</h1>

      {/* Filtro */}
      <input
        type="text"
        placeholder="Filtrar por nome..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {/* Formulário */}
      <div className="form">
        <h2>{editandoId ? "Editar tecnologia" : "Cadastrar tecnologia"}</h2>

        <input
          type="text"
          placeholder="Nome da tecnologia"
          value={inputNome}
          onChange={(e) => setInputNome(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor (R$)"
          value={inputValor}
          onChange={(e) => setInputValor(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL da imagem"
          value={inputImagem}
          onChange={(e) => setInputImagem(e.target.value)}
        />

        {editandoId ? (
          <div className="form-botoes">
            <button className="btn-salvar" onClick={salvarEdicao}>Salvar</button>
            <button className="btn-cancelar" onClick={cancelarEdicao}>Cancelar</button>
          </div>
        ) : (
          <button onClick={cadastrar}>Cadastrar</button>
        )}
      </div>

      {/* Lista */}
      <ul className="lista">
        {filtrados.length === 0 ? (
          <li className="vazio">Nenhuma tecnologia encontrada.</li>
        ) : (
          filtrados.map((item) => (
            <li
              key={item.id}
              className={`item ${editandoId === item.id ? "item-editando" : ""}`}
            >
              <img src={item.imagem} alt={item.nome} className="item-img" />
              <div className="item-info">
                <strong>{item.nome}</strong>
                <span>R$ {item.valor},00</span>
              </div>
              <div className="acoes">
                <button className="btn-editar" onClick={() => iniciarEdicao(item)}>
                  Editar
                </button>
                <button className="btn-apagar" onClick={() => apagar(item.id)}>
                  Apagar
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
```

## Pontos para explicar

**Por que `{ ...item, nome: inputNome }` e não só `{ nome: inputNome }`?**
O spread `...item` copia todas as propriedades do item original. Sem ele, o objeto resultante teria só `nome` e perderia `id`, `valor` e `imagem`. O spread garante que só alteramos o que queremos.

**Por que o formulário de cadastro e edição são o mesmo?**
Para simplificar. Os campos são os mesmos — o que muda é o botão e a função chamada. O `editandoId` é o "interruptor" que decide qual comportamento está ativo.

**Por que `.map()` para editar e não `.filter()`?**
O `.filter()` remove itens. O `.map()` transforma — percorre todos e devolve o mesmo array com o item modificado no lugar certo.

**Por que o item editado fica com fundo amarelo?**
A classe `item-editando` é aplicada condicionalmente: `` `item ${editandoId === item.id ? "item-editando" : ""}` ``. O CSS já define essa classe com borda e fundo amarelos, então o usuário vê visualmente qual card está sendo editado no momento.

**Por que adicionamos o `filtrados.length === 0 ? ... : ...`?**
Pra dar feedback visual quando a busca não encontra nada, em vez de mostrar uma lista vazia sem explicação. A classe `.vazio` já está pronta no CSS pra esse texto em itálico cinza.

---
---

## Resumo final dos estados

| Estado | Tipo | Para quê |
|--------|------|----------|
| `itens` | array de objetos | guarda a lista completa |
| `busca` | string | valor do campo de filtro |
| `inputNome` | string | campo nome do formulário |
| `inputValor` | string | campo valor do formulário |
| `inputImagem` | string | campo URL do formulário |
| `editandoId` | number ou null | flag que indica o modo atual |

## Resumo das classes CSS usadas

| Classe | Onde é usada | O que faz |
|--------|--------------|-----------|
| `.container` | div raiz | centraliza o app e define largura máxima |
| `.form` | div do formulário | card branco com sombra e espaçamento |
| `.lista` | `<ul>` | remove marcadores e organiza os cards em coluna |
| `.item` | cada `<li>` | visual de card com borda lateral roxa |
| `.item-editando` | `<li>` em edição | troca a borda e fundo para amarelo |
| `.item-img` | `<img>` | tamanho fixo 44x44 e cantos arredondados |
| `.item-info` | div nome+valor | organiza nome em destaque e valor em cinza |
| `.acoes` | div dos botões do item | alinha Editar/Apagar lado a lado |
| `.form-botoes` | div Salvar+Cancelar | alinha os dois botões lado a lado no modo edição |
| `.btn-editar` `.btn-apagar` `.btn-salvar` `.btn-cancelar` | botões | cor de cada ação |
| `.vazio` | `<li>` de lista vazia | texto cinza em itálico |

## Resumo das operações e métodos

| Operação | Método | Lógica |
|----------|--------|--------|
| Filtrar | `.filter()` derivado | mantém quem bate com a busca |
| Cadastrar | spread `[...arr, novo]` | cria novo array com item adicionado |
| Apagar | `.filter()` | cria novo array sem o item |
| Editar | `.map()` + spread de objeto | substitui só o item alterado |

## Fluxo resumido

```
digita no filtro   → setBusca()      → filtrados recalcula     → lista atualiza
clica Cadastrar    → cadastrar()     → setItens([...])         → item aparece na lista
clica Apagar       → apagar(id)      → setItens(filter)        → item some da lista
clica Editar       → iniciarEdicao() → setEditandoId(id)       → formulário muda de modo
clica Salvar       → salvarEdicao()  → setItens(map)           → item atualizado na lista
clica Cancelar     → cancelarEdicao()→ setEditandoId(null)     → volta ao modo cadastro
```
