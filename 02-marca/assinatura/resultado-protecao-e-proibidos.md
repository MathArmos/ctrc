# Resultado dos itens 24 e 25 · area de protecao e usos proibidos

Os dois fecham a parte normativa da marca: o item 24 diz quanto espaco ela exige em volta e
qual o menor tamanho em que ela pode ser usada, e o item 25 diz o que nao se faz com ela.

| Folha | O que mostra |
|---|---|
| [folha-06-protecao.png](verificacao/folha-06-protecao.png) | a protecao desenhada nas tres pecas, os vaos internos medidos e o tamanho minimo em tamanho real |
| [folha-07-proibidos.png](verificacao/folha-07-proibidos.png) | as oito proibicoes, cada uma com o erro desenhado de verdade |

| Arquivo | O que e |
|---|---|
| `protecao.mjs` | deriva a protecao dos vaos internos, converte o tamanho minimo e desenha a folha |
| `proibidos.mjs` | monta os oito paineis e mede os dois numeros que a folha cita |
| `medidas-protecao.json` e `medidas-proibidos.json` | legiveis por maquina |
| `svg/<peca>-protecao.svg` | cada peca com a moldura de protecao, em curvas |

## 1. Item 24 · a protecao foi DERIVADA, e nao escolhida

A regra cabe numa frase: **se um elemento de fora puder chegar mais perto da palavra do que o
simbolo esta, ele entra na leitura da assinatura.** Entao o piso e o maior vao interno, e o
valor adotado e o menor multiplo inteiro de `u` que o supera **estritamente**.

Os vaos internos foram medidos caixa de tinta contra caixa de tinta, e nao lidos da constante
`VAOS` do item 14. 📌 **A constante diz o que foi pedido, e a caixa diz o que saiu.**

| Onde | Vao |
|---|---|
| letra 1 contra letra 2 | 34 |
| letra 2 contra letra 3 | 34 |
| letra 3 contra letra 4 | 46 |
| **simbolo contra palavra, horizontal** | **161,2** |
| simbolo contra palavra, vertical | 120,9 |

🟢 **Protecao = 2u = 322,4 unidades de caixa alta**, ou 32,2% da altura de caixa alta.

⚠️ **Empatar nao serve, e e por isso que nao e 1u.** A 1u um elemento de fora fica exatamente
tao longe quanto o simbolo esta da palavra, e ai a leitura e ambigua: ele pode ser lido como
parte do conjunto. 2u e o menor multiplo inteiro de `u` que resolve isso.

## 2. Item 24 · o tamanho minimo sai do item 23, e nao e decidido aqui

O piso ja estava medido e aprovado na folha de contato do item 23: **16 px de altura de caixa
alta**. Esta pagina so converte para as unidades em que alguem de fato aplica a marca.

| Peca | Caixa a 16 px | Caixa alta em mm a 300 dpi | Largura em mm a 300 dpi |
|---|---|---|---|
| assinatura horizontal | 44 x 16 px | 1,35 mm | 3,77 mm |
| assinatura vertical | 32 x 35 px | 1,35 mm | 2,74 mm |
| simbolo isolado | 9 x 16 px | 1,35 mm | 0,80 mm |

🔴 **O AVATAR TEM PISO PROPRIO, E ELE E MAIOR.** O PRD §5 pede o simbolo reconhecivel a 40 px
num avatar **circular**, e circulo corta canto: o quadrado inscrito num circulo de 40 px tem
**28,3 px** de lado, e nele cabe uma caixa alta de **27 px**. ⚠️ **O piso de 16 px e de campo
retangular e nao responde por recorte circular.** Os dois convivem e dizem coisas diferentes.

## 3. Item 25 · as oito proibicoes, e os dois numeros que elas carregam

📌 **Proibicao sem motivo e gosto do autor, e manual cheio de gosto do autor nao e obedecido.**
Duas das oito trazem numero medido neste repositorio, e as outras seis apontam para a regra do
sistema que elas quebram.

| Proibicao | Motivo |
|---|---|
| nao distorcer | escala nao uniforme muda a espessura de haste, e `u` e a unidade de que saem o vao, a protecao e o sistema inteiro |
| nao girar | a malha da **D-07** e absoluta: horizontais a 0° e obliquas a 19° da vertical. Girar leva as duas familias para angulo nenhum |
| **nao pintar a palavra de vermelho no fundo escuro** | 🔴 **medido no item 28: 3,80:1**, abaixo do piso de 4,5 para texto normal. O simbolo pode, porque ele e grafismo; a palavra nao, porque ela e texto |
| nao recompor o vao | o vao simbolo/palavra e 1u, e e dele que a protecao do item 24 e derivada. Encostar os dois faz a assinatura ler **CCTRC** |
| nao vazar em contorno | a marca e massa chapada. Vazada, perde o peso que a torna reconhecivel de longe |
| nao sombrear nem dar volume | a marca atual existe hoje em tres vermelhos porque cada acabamento a reinterpreta. Sombra reabre essa porta |
| **nao digitar CTRC na fonte** | 🔴 **medido aqui: o C muda 8,7% dos pixels e o R muda 1,5%** entre a fonte crua e o lettering do item 14 |
| **nao usar abaixo do tamanho minimo** | 🔴 **medido com a regua do item 23**: a 16 px a fidelidade e 0,815 e a folha aprova; a 10 px cai para 0,690 e a 8 px para 0,688 |

⚠️ **O errado esta desenhado de verdade em todos os oito, e nunca so descrito.** Quem le um
manual precisa reconhecer o erro quando o vir, e para isso ele tem de estar na pagina.

## 4. Uma correcao de processo feita no caminho

🔴 **`assinatura.mjs` escrevia arquivo como efeito colateral de ser IMPORTADO.** O item 24
precisa de `U`, que e a unidade do sistema e mora la; importar a unidade reescrevia os quatro
SVG da assinatura. Era idempotente, entao nao quebrou nada, **e e o tipo de coisa que deixa de
ser idempotente no dia em que alguem mexer no arquivo**. Hoje ele so escreve quando rodado
direto, pela guarda de `import.meta.url` que `lettering.mjs` ja usava.

✅ **E `letraCrua` nasceu em `lettering.mjs` pelo mesmo motivo**: o item 25 precisa desenhar a
fonte crua ao lado do lettering, e a alternativa era recarregar a fonte aqui com o caminho, o
peso e a escala copiados. **Duas copias do caminho da matriz sao duas chances de uma divergir.**

## 5. O que estas duas paginas nao decidem

⚠️ **Nada aqui foi visto em cor, em bordado, em gravacao ou sobre fotografia** (itens 27, 35 a 38).
⚠️ **A protecao nao foi testada contra logo de parceiro**, que e o item 56: convivencia com
marca de terceiro pode exigir mais que 2u, e isso se decide com o logo do parceiro na frente.
⚠️ **O tamanho minimo de 16 px e de tela.** Bordado e gravacao tem piso proprio, que sai da
espessura minima do processo e nao da fidelidade de pixel, e sao os itens 36 e 37.
