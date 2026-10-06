# Resultado do item 14 · o lettering CTRC

Matriz: **Big Shoulders Display, instância `wght 800`**, SIL OFL 1.1, escolhida pelo driver
no item 29. Convertida em curvas e **modificada**, que é o que a **D-03** manda.

| Folha | O que mostra |
|---|---|
| [folha-01-antes-e-depois.png](verificacao/folha-01-antes-e-depois.png) | a fonte como vem e o lettering, um sobre o outro |
| [folha-02-reducao.png](verificacao/folha-02-reducao.png) | 48, 24 e 16 px em tamanho real, mais o de 16 px a 7x |

| Arquivo | O que é |
|---|---|
| `contorno.mjs` | a ferramenta: corte local de contorno, sem achatar curva em polígono |
| `lettering.mjs` | as três modificações e a montagem da palavra |
| `medir.mjs` | a régua: ângulo, vértice mais agudo, redução e tinta |
| `folha.mjs` | as folhas de contato |
| `svg/lettering-ctrc.svg` | o lettering, em curvas, caixa alta = 1000 |
| `medidas.json` | tudo legível por máquina |

## 1. As três modificações, e todas saem da malha

🔴 **M1. A perna do R vai para exatamente 19° da vertical.** Na fonte as duas arestas dela
estão a **16,8°** e **15,1°**, ou seja a perna **afunila**. Levadas as duas a 19°, ficam
paralelas e a perna passa a ter largura constante de **161,13** unidades.

📌 **E esse número não foi escolhido por simetria: ele é a espessura de haste da própria
fonte.** Medida na haste do T (159,4 a 320,6), na haste do R (54,4 a 215,6) e nos dois
terminais do C, ela dá **161,2** nas quatro. A perna a 19° cai em cima desse peso com
**0,07 unidade** de diferença, que é 0,007% da caixa alta. ✅ **A correção do ângulo e a
regularização do peso são o mesmo gesto**, e isso não foi planejado: foi medido depois.

✅ **É esta a modificação que torna literal a frase do eixo conceitual.** De tudo o que
existe hoje sobrevive um ângulo, e ele está aqui dentro da letra, com número.

🔴 **M2. Os dois terminais do C são cortados a 19° da vertical, paralelos entre si.** Na
fonte eles são **horizontais**, e isso foi medido e não suposto: o C tem duas retas de 161
unidades a 0° e mais nada de oblíquo. Cortados, a boca do C deixa de ser um entalhe
retangular e passa a ser um corte inclinado.

⚠️ **Os dois cortes são PARALELOS, e nunca espelhados.** Espelhados, eles abririam a boca em
bico, que é a forma do chevron, e a **D-07** manda o chevron morrer **como forma**. O que
sobrevive é o ângulo. Paralelos, a boca inclina e não aponta.

❌ **A 51° foi tentado e descartado por medida, não por gosto.** O terminal tem 161 unidades
e a boca tem 260: um corte a 51° sobe 199 unidades ao longo do terminal e **fecha a boca**.
A folha do experimento mostra os dois braços comidos. O 51° da malha não cabe nesta letra, e
quem decide isso é a aritmética do tamanho do terminal.

🔴 **M3. O espaçamento é redesenhado**, e deixa de ser o da fonte: vãos de **34, 34 e 46**
unidades entre as caixas das letras, contra 46,4, 61,6 e 72,2 que os avanços da fonte dão.
O vão R|C é maior de propósito, porque a perna do R agora avança mais para a direita no pé.

❌ **O T não foi tocado.** Ele é horizontal e vertical puros, e não há nada nele que a malha
peça para mudar. Mexer no T seria mexer para parecer que se mexeu.

## 2. As medidas

| Medida | Valor |
|---|---|
| caixa | 2025,4 x 1022,5 · razão **1,981** |
| aresta reta | 49,9% do contorno |
| **oblíqua 19°** | **24,7%** da aresta reta (na fonte crua era **5,8%**) |
| horizontal | 26,9% |
| vertical | 48,4% |
| diagonal 51° | 0% |
| **fora da malha** | **0%** |
| vértice mais agudo | **71°** · nenhum abaixo de 60° |
| tinta | 51,1% |
| fidelidade em redução | 48 px **0,918** · 24 px **0,862** · 16 px **0,810** |

🟢 **A malha entrou de verdade.** A oblíqua de 19° quadruplicou, de 5,8% para 24,7% do
contorno reto, e **nenhuma aresta sobrou fora da malha**: antes a fonte tinha 5% de arestas
em ângulo nenhum, e agora são 0%. Toda reta do lettering é horizontal, vertical, ou está a
19° da vertical.

🔴 **A VERTICAL É UMA QUARTA FAMÍLIA, E ELA PRECISA SER DECLARADA.** O
[contrato da rota](../exploracao-simbolo/contrato-da-rota.md) diz que vertical pura **não
está na malha**, e que quem precisar de uma paga o preço por escrito. Aqui são **48,4%** do
contorno reto, e o preço está pago nesta linha: **haste de letra é vertical, e não há
lettering latino sem isso.**

📌 **E vale notar o que isso evita.** Na marca atual a haste do R é **oblíqua a −71°**, e é
daí que vem boa parte da estranheza que faz o monograma ler RK. Aqui a oblíqua foi para a
**perna** e para os **terminais**, e as hastes ficaram verticais. ✅ **Herdar o ângulo sem
herdar onde ele estava é exatamente o que a D-07 pede**: sobrevive a regra, morre a forma.

🟢 **O vértice mais agudo do lettering inteiro tem 71°, e isso não é sorte.** Como a malha só
traz 0° e 19° da vertical, todo encontro entre as duas famílias dá **90 − 19 = 71°**. ✅ **A
malha garante sozinha que não existe ponta aguda**, o que é dinheiro nos itens 36 (bordado) e
37 (gravação a laser), onde ângulo fechado é o que falha primeiro.

🟡 **A fidelidade a 16 px dá 0,810, abaixo do piso de 0,85, e a folha de contato aprova.**
É exatamente o caso que o contrato já declarava: a régua mede **quantização de borda**, não
colapso de forma, e numa palavra de 33 px de largura a borda domina o número. Na folha, a 16
px os quatro contraformas continuam abertos e a palavra continua lendo CTRC. ⚠️ **O piso de
0,85 foi escrito para o SÍMBOLO, numa caixa quadrada**, e não para uma palavra de razão 2.

⚠️ **A tinta de 51,1% não se compara com o teto de 45% do símbolo.** Lá a caixa é quadrada e
sobra fundo; aqui ela é justa na palavra. O teto de 45% continua valendo para o símbolo.

## 3. O que esta página não decide

⚠️ **O símbolo (item 13) sai deste C**, e ainda não foi visto ao lado da palavra.
⚠️ **Nada aqui foi visto em cor, em bordado, em gravação ou sobre fotografia** (itens 27, 35 a 38).
⚠️ **Nenhuma busca figurativa no INPI** (P-03, pePI fora do ar).
⚠️ **O corte do C está em `x = 470`**, que é um parâmetro declarado em `lettering.mjs` e foi
escolhido olhando: a 420 ele come a boca, a 470 ele corta só o canto. **Mudar esse número é
uma linha**, e é o tipo de ajuste que o driver faz no Figma.
