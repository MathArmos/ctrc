# Resultado dos itens 27 e 28 · a paleta e o contraste

| Folha | O que mostra |
|---|---|
| [folha-01-paleta.png](verificacao/folha-01-paleta.png) | as quatro cores, com HEX, RGB, CMYK e papel |
| [folha-02-contraste.png](verificacao/folha-02-contraste.png) | cada par com o texto de verdade nos dois tamanhos, ao lado do número |

| Arquivo | O que é |
|---|---|
| `medir-vermelhos.mjs` | mede os vermelhos nos quatro materiais do cliente |
| `paleta.mjs` | a paleta, a matriz de contraste e o CMYK. É também o módulo que o item 19 importa |
| `folhas.mjs` | as duas folhas |
| `paleta.json` e `medidas-vermelhos.json` | legíveis por máquina |

## 1. Um vermelho só, e isso já estava decidido

O eixo conceitual acusa a marca atual de existir **"em três vermelhos diferentes, um por
acabamento"**. Entregar dois contradiria o próprio parágrafo que vai ao avaliador. Esta
página **não decide se a marca é vermelha**: ela mede os três e acha o um.

## 2. De onde ele sai, e por que não dos outros dois

Medidos os quatro materiais do cliente, em `00-briefing/material-cliente/`:

| Material | Vermelho dominante | Natureza |
|---|---|---|
| fachada ao entardecer | `#782828`, `#883838` | halo retroiluminado contra o céu |
| fachada à noite | `#982828`, `#781818` | o mesmo halo, outra exposição |
| **marca na parede, fotografia real** | **`#E80838`, `#D80838`** | **frontal, luz chapada, material real** |
| interior, render | `#782828` | vermelho de ambiente de render |

🔴 **Os três primeiros não são a cor do material.** Dois são halo fotografado contra o céu e
um é iluminação de render. ✅ **A única fonte frontal, em luz chapada e sobre material de
verdade, é a marca na parede**, e é dela que o vermelho sai.

⚠️ **Os baldes daquela medição são de 4 bits** (`r >> 4`), ou seja faixas de 16 níveis, o que
é grosso demais para definir cor de marca. A parede foi **remedida em precisão cheia**:
separando a face difusa da lateral sombreada pelo percentil de R, a mediana dá **`#DE0943`**.

## 3. 🔴 A incerteza de balanço de branco, medida e NÃO aplicada

A fotografia da parede tem viés quente. As superfícies quase neutras dela dão:

| Faixa de luminância | Mediana | Ganhos para neutralizar |
|---|---|---|
| 150 a 240 | `#B1ABA6` | R ×0,966 · B ×1,030 |
| 120 a 200 | `#9F9A94` | R ×0,969 · B ×1,041 |
| 180 a 235 | `#C9C0B9` | R ×0,955 · B ×1,038 |

O viés é **consistente nas três faixas**, e corrigi-lo levaria o vermelho de `#DE0943` para
cerca de **`#D70945`**.

❌ **A correção não foi aplicada, de propósito.** As superfícies usadas como referência podem
ser **bege de verdade**, e nesse caso corrigir introduz erro em vez de tirar. A diferença
está dentro da própria incerteza do método.

📌 **E a primeira tentativa de estimar o balanço estava inválida**: ela usou os pixels mais
claros, e eles estavam **estourados** (`#FFFCF9`, com 254,9 de 255). Balanço estimado em
pixel clipado não mede nada. A estimativa foi refeita fora do clip.

🟢 **Nasce a P-10**: o valor definitivo pede amostra física da tinta ou uma fotografia com
carta de cinza. Até lá vale o medido, com esta página declarando o que se sabe e o que não.

## 4. A paleta

| Token | HEX | RGB | CMYK | Papel |
|---|---|---|---|---|
| **ctrc-vermelho** | `#DE0943` | 222, 9, 67 | 0, 96, 70, 13 | a cor da marca, e a única cor de marca |
| **ctrc-preto** | `#111111` | 17, 17, 17 | 0, 0, 0, 93 | fundo escuro, tinta sobre claro |
| **ctrc-branco** | `#FFFFFF` | 255, 255, 255 | 0, 0, 0, 0 | tinta sobre vermelho e sobre preto |
| **ctrc-cinza** | `#6E6E6E` | 110, 110, 110 | 0, 0, 0, 57 | texto secundário sobre claro |

⚠️ **O CMYK é ingênuo, sem perfil de impressão.** Ele orienta e **não fecha impressão**. Um
vermelho desta saturação está fora do gamute de quadricromia e vai sair mais apagado em
processo: isso é dívida declarada dos itens 35 a 38.

🔴 **Pantone NÃO está declarado, e isso é escolha.** Não existe conversão livre e confiável de
sRGB para Pantone, e as bibliotecas que fazem isso são licenciadas. 📌 **Inventar um número
seria pior do que declarar a falta**, porque Pantone é o valor que a gráfica usa para fechar
tinta, e um número errado vira produto errado. A página do PDF escreve "a confirmar em prova
física", que é a formulação que sobrevive.

## 5. Item 28 · o contraste, medido

Piso do **RNF-04**: **4,5:1** para texto normal, **3,0:1** para texto grande e para grafismo.

| Par | Contraste | Texto normal | Texto grande |
|---|---|---|---|
| branco sobre vermelho | **4,97** | passa | passa |
| vermelho sobre branco | **4,97** | passa | passa |
| branco sobre preto | 18,88 | passa | passa |
| preto sobre branco | 18,88 | passa | passa |
| **vermelho sobre preto** | **3,80** | 🔴 **REPROVA** | passa |
| cinza sobre branco | 5,10 | passa | passa |

🔴 **Um par reprova, e ele vira regra em vez de virar problema.** O vermelho sobre o preto dá
**3,80:1**: ele **não carrega texto normal** no fundo escuro. Passa como texto grande e passa
como **grafismo**, que tem piso de 3:1.

✅ **É exatamente por isso que a versão colorida (item 19) põe a cor no SÍMBOLO e a tinta na
PALAVRA.** A regra não foi escolhida no olho: ela caiu da medida.

## 6. O que esta página não decide

⚠️ **Pantone** (seção 4) e o **valor definitivo do vermelho** (P-10, seção 3).
⚠️ **O comportamento em quadricromia não foi provado**, só previsto. Itens 35 a 38.
⚠️ **Nenhuma cor foi vista impressa, bordada ou gravada.**
