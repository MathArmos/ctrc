# Marca atual redesenhada em vetor limpo

Item 6 de [TAREFAS.md](../TAREFAS.md). Base da auditoria (item 7) e da página de antes e
depois (item 26).

| Arquivo | O que é |
|---|---|
| `marca-atual-limpa.svg` | o entregável: monograma em geometria limpa, 1787,703 x 1000 |
| `marca-atual-construcao.mjs` | gera o SVG a partir dos parâmetros medidos. Rodar com `node` |
| `marca-atual-medidas.json` | parâmetros e os 17 vértices, legíveis por máquina |
| `verificacao/` | as três evidências desta página |

🔴 **Isto é a marca ATUAL, não a marca nova.** Ela lê RK, reprova em redução e continua
sendo o problema que o rebranding existe para resolver. Este arquivo serve para medir o
problema e para mostrar o antes, nunca como ponto de partida de desenho.

⚠️ **Nenhum modelo generativo encostou nesta geometria.** O desenho é intersecção de retas
cujos ângulos e posições saíram de medição na fotografia do cliente. `logs/licencas.md`
não muda: não houve recurso de terceiro. O uso de ferramenta está em `logs/uso-de-ia.md`.

## 1. Por que nenhuma das duas fontes serve crua

**O autotrace (`01-auditoria/logo-atual-autotrace.svg`) não serve como desenho.** Ele tem
curva onde a marca tem reta: o contorno dele é uma sequência de Béziers que ondula ao longo
de arestas que no objeto real são retas únicas.

**A fotografia da fachada não serve crua como geometria**, e isso não estava registrado
antes. O painel do bloco central está fortemente escorçado: medida na fotografia, a marca
sai com razão largura/altura de **0,798**, contra **1,55** medida na parede interna, que é
plano frontal. Ler ângulo direto daquela fotografia erra por dezenas de graus. A linha de
base do lettering ali aparece a **9,5°**, que é inclinação do plano, não do desenho.

✅ **O que cada fonte entrega de bom**: a fachada entrega resolução (a marca ocupa 105 x 132
px nativos, contra 60 px na parede); o autotrace e a parede entregam proporção. O
procedimento abaixo usa a resolução de uma e a proporção das outras.

## 2. Procedimento

1. **Recorte e binarização** da marca em `fachada-entardecer.jpg`, ampliada 8x com lanczos.
   O histograma separa fundo (luminância 43 a 60) de marca (213 a 218) sem ambiguidade;
   limiar em 140.
2. **Retificação**: homografia estimada por maximização de IoU contra a silhueta do
   autotrace, que é frontal. Resultado **IoU 0,9653**, o que também confirma que o autotrace
   é fiel em proporção, e falho só no traçado.
3. **Autocalibração** pela própria estrutura da marca, sem depender mais do autotrace:
   procura-se a homografia corretiva que torna paralelas as arestas que o projeto da marca
   obriga a serem paralelas, e que põe as duas diagonais simétricas em torno da horizontal.
   Isto derruba a dispersão da família oblíqua de 1,067° para **0,737°**.
4. **Ajuste de retas** por mínimos quadrados totais em cada aresta, usando os 76% centrais
   de cada segmento para não contaminar com o arredondamento dos cantos.
5. **Regularização**: cada aresta recebe o ângulo adotado da sua família, os pesos de haste
   que devem ser iguais passam a ser iguais, e os vértices viram intersecção das retas.
6. **Verificação** pixel a pixel contra a fotografia retificada.

⚠️ **A razão largura/altura é a única grandeza que este procedimento não fixa.**
Paralelismo é invariante por transformação afim, então a autocalibração não distingue
aspecto. Ver a seção 8.

## 3. Ângulos

A marca inteira se resolve em **três famílias de ângulo** e nada mais. Dispersão ponderada
por comprimento de aresta, depois da autocalibração:

| Família | Onde aparece | Medido | Dispersão | **Adotado** |
|---|---|---|---|---|
| horizontal | topo e base dos dois glifos, face inferior do braço, piso do contraforma | 0,000° | 0,503° | **0°** |
| oblíqua | haste da R, nos dois lados | -70,884° | 0,737° | **-71,0°**, ou **19,0° da vertical** |
| diagonal | perna da R, corte do braço, os quatro lados do chevron | ±51,127° | 0,46° a 0,98° | **±51,0°** |

A maior correção imposta a uma aresta foi de **0,841°** (aresta superior da perna da R), e
dezesseis das dezessete ficaram abaixo de 0,8°.

📌 **A simetria das diagonais não foi imposta a olho, foi medida**: com o aspecto fixado, a
média das diagonais que descem (+51,127°) e a das que sobem (-51,126°) batem na terceira
casa. O chevron é simétrico em torno de uma horizontal.

❌ **Relação não adotada, e registrada para quem vier depois**: o complemento da diagonal
(38,87°) fica a 0,63° do dobro da obliquidade da haste (38,23°), dentro da incerteza. Se
isso fosse intenção de projeto, a marca teria um parâmetro só em vez de dois. **Não foi
adotado**, porque a diferença está dentro do ruído e adotá-la seria inventar intenção que
a medida não sustenta.

## 4. Pesos de haste

Unidade: altura de caixa alta = 1000.

| Haste | Medido | **Adotado** |
|---|---|---|
| braço da R | 248,42 | **252,37** |
| perna da R | 250,19 | **252,37** |
| braço superior do chevron | 252,45 | **252,37** |
| braço inferior do chevron | 258,43 | **252,37** |
| **haste da R** | **275,21** | **275,21** |

✅ **As quatro primeiras devem ser iguais e agora são.** Elas chegaram com dispersão de
**4,0%**, que é o tipo de inconsistência que o item 6 existe para remover.

🔴 **A haste é 9,05% mais pesada que as demais, e isso FICA.** Não é inconsistência: haste
quase vertical mais pesada que diagonal é compensação óptica corrente em tipografia.
Igualar as cinco mudaria o desenho em vez de limpá-lo. ⚠️ A medida sobrevive à incerteza de
aspecto: mesmo no pior caso dela a haste continua entre 6% e 12% mais pesada.

## 5. Linhas de referência e alinhamentos

A marca tem **três horizontais de referência**, e os dois glifos compartilham as três.

| Linha | y | Como se confirmou |
|---|---|---|
| topo | 0 | topo da R e topo do chevron separados por **0,13%** da caixa alta |
| meio | 488,9 | ver abaixo |
| base | 1000 | base da haste, base da perna e base do chevron, amplitude de **0,31%** |

✅ **"Altura idêntica", que o PRD afirmava, está confirmada com número**: os dois glifos
dividem topo e base com erro abaixo de 0,31% da caixa alta.

🟢 **E um alinhamento que ninguém tinha registrado: o vértice do chevron cai no piso do
contraforma da R.** Medidos de forma independente, eles ficam a **0,01% da caixa alta** um
do outro (y 489,02 contra 488,90). Isso não é consequência de nenhum outro parâmetro: a
altura do vértice depende de onde o chevron está e de quanto ele é largo, que são escolhas
livres. É alinhamento de projeto, e a construção o reproduz.

📐 **Quatro arestas saem exatamente do mesmo comprimento, 324,74**: o corte diagonal do
braço da R, a base da perna da R, o topo do chevron e a base do chevron. Isso cai como
consequência do peso leve único mais a simetria de ±51°, e serve como conferência da
construção.

## 6. Proporções

| Medida | Valor | Em % da caixa alta |
|---|---|---|
| caixa do conjunto | 1787,70 x 1000 | razão **1,788** |
| glifo R | 1202,07 de largura | 120,21% |
| chevron | 738,52 de largura | 73,85% |
| sobreposição dos dois glifos | 152,91 | **8,55% da largura do conjunto** |
| boca do contraforma da R | 314,07 | 31,41%, ou **1,245x o peso leve** |
| vão entre a perna da R e o chevron, na altura do meio | 261,0 | 26,10% |

🔴 **A boca do contraforma é mais larga que a própria haste do R (1,245x).** O bojo não
fecha: ele é um entalhe aberto para o lado do chevron, e é por isso que o olho fecha um K.
O PRD já dizia isso; aqui ele vira número.

## 7. O que foi removido de propósito

| O que saiu | Tamanho do que saiu |
|---|---|
| ondulação do contorno ao longo das arestas retas | desvio típico de **0,17%** da caixa alta |
| arredondamento dos 17 cantos, que é fabricação e não desenho | até **1,01%** da caixa alta |
| três a seis quebras de aresta por lado longo, que o traçado criava | sem efeito sobre o ângulo ajustado |

⚠️ **O arredondamento dos cantos é do letreiro físico, não do desenho.** Ele aparece como
dois a três segmentos curtos de ângulo intermediário em cada canto, e some quando as retas
longas são intersectadas.

## 8. Verificação

Rasterizando o desenho e comparando com a fotografia retificada, pixel a pixel:

- **IoU 0,97972**
- desenho fora da marca: **0,89%** da área
- marca fora do desenho: **1,18%** da área
- distância do contorno fotografado ao desenho, em % da caixa alta:
  média **0,203%**, mediana **0,166%**, p90 **0,420%**, p99 **0,706%**, máximo **1,006%**

📐 `verificacao/01-sobreposicao.png` mostra onde cada sobra está: cinza é acordo, vermelho é
desenho sobrando, azul é marca sobrando. **A divergência é uma franja fina e os picos ficam
todos nos cantos**, que é exatamente o resultado esperado de trocar canto arredondado por
canto vivo.

🟡 `verificacao/03-reducao-*.png` são conferência de sanidade, na mesma convenção de largura
que a auditoria já usava (16 px de largura dão 9 px de altura nesta razão). **O teste de
redução que vale é o do item 7**, e ele continua a fazer.

## 9. Incerteza declarada

🔴 **A razão largura/altura é a única grandeza que o material disponível não fecha.**
Paralelismo não distingue aspecto, e todas as instâncias fotografadas da marca estão em
planos de orientação desconhecida. O ajuste contra a parede interna, que é o único plano
frontal disponível, deixa uma anisotropia residual de **2,84%**.

| Grandeza | Valor adotado | Incerteza |
|---|---|---|
| razão da caixa | 1,788 | entre **1,74 e 1,84** |
| diagonal | 51,0° | **± 1,1°** |
| obliquidade da haste | 19,0° da vertical | **± 0,9°** |
| pesos, um contra o outro | razão 1,0905 | ± 3% |

📌 **É a P-06 que fecha isso**, e ela continua aberta: o vetor original da marca atual, com
o cliente. Quando ele chegar, esta página se confere contra ele em uma passada, e os quatro
números acima deixam de ter faixa.

⚠️ **E um detalhe que só o vetor original resolve**: o pé do contraforma (V5) e o encontro
da perna com a haste (V9) caem a **0,33% da caixa alta** um do outro, sobre a mesma reta.
Isso está dentro do ruído de medida de um ponto coincidente. **Foi mantido como medido, e
não forçado a coincidir**, porque forçar mudaria a topologia do desenho num ponto que a
fotografia não decide. É também onde a marca mais aperta em redução.

## 10. Correções a números que o PRD carrega

🔴 **A sobreposição dos dois glifos não é 5,7%, é 8,55%.** O número do PRD saiu do
autotrace; este saiu da fotografia retificada, que mede **8,14%** antes da regularização.
Vale corrigir a linha 1 da seção 2 do PRD quando o item 7 for escrito.

✅ **"Dois glifos de altura idêntica" está confirmado**, agora com erro declarado (0,31% da
caixa alta).

## 11. O que não entrou, e por quê

❌ **O lettering "RENATOCARIANI" não foi redesenhado.** Ele é texto composto em família
tipográfica, não desenho de marca, e redesenhá-lo é identificar a família primeiro. Na
fachada ele sai com **3,13 px de altura de caixa alta** em resolução nativa, que não
sustenta nenhuma medida de forma de letra.

🟡 **O que dele já está medido e fica guardado aqui**: a linha de base dele e a do topo são
paralelas entre si dentro de 0,64°, e o bloco inteiro tem 3,13 px de altura de caixa alta
contra 132 px de altura do monograma, ou seja o lettering é **2,4%** da altura do
monograma. Isso basta para montar o conjunto no item 26 se o cliente mandar o vetor.

⚠️ **O item 26 (antes e depois) vai querer o conjunto, não só o monograma.** Se a P-06 não
chegar a tempo, a decisão é do driver: mostrar só o monograma nos dois lados, ou compor o
lettering a partir de uma família aproximada e declarar isso na página.
