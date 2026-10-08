# Resultado do item 26 · antes e depois

| Folha | O que mostra |
|---|---|
| [folha-01-antes-e-depois.png](verificacao/folha-01-antes-e-depois.png) | as duas marcas lado a lado, a tira de reducao das duas, e as duas reguas |

| Arquivo | O que e |
|---|---|
| `comparar.mjs` | roda as duas marcas pela mesma regua e monta a folha |
| `medidas.json` | tudo legivel por maquina, inclusive a contagem por limiar |

⚠️ **O "antes" e o redesenho limpo do item 6, e nao a marca de producao.** O vetor original
nao existe e isso esta fechado por impossibilidade (**P-06**). O redesenho bate com a
fotografia retificada em IoU 0,980, e e o melhor antes disponivel. **Esta ressalva vai na
pagina do PDF, e nao fica so aqui.**

## 1. A mesma regua nos dois lados

🔴 **E isso e a unica coisa que torna a comparacao honesta.** Mesma convencao de reducao
(altura de caixa alta, e nunca caixa quadrada), mesmo N de reamostragem, mesmo limiar, mesmo
caminho de codigo. Comparar o numero do item 23 com um numero medido de outro jeito seria
comparar reguas, e nao marcas.

## 2. 🔴 A IoU favorece a marca ATUAL, e isso esta declarado

| | razao | tinta | 48 px | 24 px | 16 px |
|---|---|---|---|---|---|
| marca atual | 1,788 | 50,9% | 0,962 | 0,930 | **0,899** |
| assinatura CTRC | 2,719 | 50,5% | 0,924 | 0,872 | **0,815** |

Lido solto, esse numero diz que a marca nova e pior em reducao. **Ele nao diz isso.**

📌 **A IoU premia silhueta simples e traco grosso.** A marca atual tem **2 pecas**, e a
assinatura nova tem **5** mais uma palavra de quatro letras. Entre marcas de complexidade
diferente, a IoU mede **complexidade**, e nao qualidade. Era a mesma lição que o contrato da
rota ja tinha escrito no item 12: a IoU mede quantizacao de borda, nao colapso de forma.

⚠️ **Nenhum numero foi escolhido depois do resultado para fazer a marca nova ganhar.** A regua
e a do item 23, escrita antes, e o resultado dela esta impresso como saiu.

## 3. 🟢 O que separa as duas e topologia, e ali a conta inverte e nao se mexe mais

| Medida | grande | 48 px | 24 px | 16 px | firme? |
|---|---|---|---|---|---|
| atual · pecas pretas separadas | 2 | 2 | 3 | 3 | ❌ varia com o limiar |
| **atual · contraformas FECHADOS** | **0** | **0** | **0** | **0** | ✅ **em todo limiar** |
| CTRC · pecas pretas separadas | 5 | 5 | 5 | 8 | ❌ varia com o limiar |
| **CTRC · contraformas FECHADOS** | **1** | **1** | **1** | **1** | ✅ **em todo limiar** |

🟢 **Contraforma fechado e a unica medida que nao se mexe**: 0 na marca atual e 1 na nova, em
todo tamanho e em todo limiar testado (100, 128, 160 e 190).

🔴 **E ela e o achado 1 do PRD medido por outro caminho.** Aquele achado diz que o bojo do R
nao fecha e que o olho fecha um K, e chegou la por geometria: sobreposicao de 8,55% da largura
e boca do contraforma a 1,245x o peso da haste. Aqui a mesma coisa aparece como **contagem**,
sem nenhuma medida de angulo ou de peso: **a marca atual nao tem um unico contraforma fechado,
em tamanho nenhum.** A assinatura nova tem um, e o mantem fechado a 16 px.

⚠️ **A contagem de PECAS varia com o limiar abaixo de 48 px nas duas marcas**, entao ela nao
sustenta conclusao nenhuma nesse tamanho. Fica registrada com o aviso, e **nao e usada como
argumento**. 📌 Mesma familia da lição de sempre neste projeto: medida instavel e defeito da
regua antes de ser defeito do objeto.

## 4. O que esta pagina nao decide

⚠️ **Ela compara a assinatura horizontal com o monograma atual**, que sao as duas pecas
principais. A vertical e o simbolo isolado nao entram, porque a marca atual nao tem
equivalente dos dois.
⚠️ **Nada aqui foi visto em cor** (item 27 ja mediu a paleta, mas o antes e depois esta em
preto e branco de proposito, para que a comparacao seja de forma e nao de cor).
⚠️ **A marca atual nao foi vista em uso real lado a lado com a nova**, que seria o item 58 (o
plano de migracao por fase).
