# Contrato da rota · item 12

Regra que **toda** rota de símbolo obedece, e que a máquina cobra sozinha. Escrito antes
do lote, com uma rota piloto já construída e medida (precedente: contrato do cubo).

| Arquivo | O que é |
|---|---|
| `malha.mjs` | as três famílias de ângulo, a álgebra de retas e a **guarda** |
| `rotas.mjs` | a geometria de cada rota. Rodar com `node`, escreve `svg/` e `medidas.json` |
| `medir.mjs` | render e medição. Escreve `verificacao/` e `medidas-render.json` |

## 1. O que toda rota obedece

1. 🔴 **Só três famílias de ângulo**: horizontal **0°**, oblíqua **-71°** (19° da vertical)
   e diagonais **±51°**. É a **D-07**, e é a única coisa que sobrevive da marca atual.
   ⚠️ **Vertical pura (90°) não está na malha.** Rota que precisar de uma declara a quarta
   família e paga o preço por escrito.
2. 🔴 **A guarda é mecânica, não é revisão.** `conferirAngulos()` mede cada aresta do
   polígono já construído e **estoura** se alguma cair fora, com o ângulo e o comprimento
   no erro. Rota com aresta torta não chega a virar SVG.
3. ❌ **Nenhuma curva.** Todo contorno é interseção de retas, como no item 6. Curva entra
   só se o driver decidir, e aí vira parâmetro declarado.
4. ❌ **Nenhum modelo generativo encosta na geometria** (D-04). As rotas são aritmética.
5. ⚠️ **Peso de haste NÃO é herdado.** Da marca atual sobrevive o ângulo, e mais nada: os
   pesos de cada rota são decisão nova e aparecem em `medidas.json` como parâmetro.
6. **Preto sobre branco, uma cor só.** Cor é o item 27 e não entra aqui: rota que só
   funciona colorida está reprovada antes de começar.

## 2. O que se mede em cada rota

| Medida | Como sai | Para que serve |
|---|---|---|
| caixa e razão | da própria geometria | avatar circular (item 18) e versões horizontal e vertical |
| **tinta**, % da caixa | raster a 1400 px | massa visual. Comparável entre rotas porque a caixa é normalizada |
| **fidelidade em redução** a 48, 24 e 16 px | IoU do símbolo reduzido e reampliado contra ele mesmo em tamanho grande | é o número do **RNF-02** |
| **IoU contra o chevron atual** | as duas silhuetas normalizadas na mesma caixa | distância da forma que morre (**D-07**) |
| **IoU contra o monograma atual** | idem | mesma coisa, no conjunto |
| folha de contato | `verificacao/<id>-contato.png`: grande, 48, 24 e 16 lado a lado | 📌 **é a evidência que decide**, o número é companhia |

## 3. Pisos propostos, ainda não aprovados pelo driver

🟡 Os três números abaixo são **proposta**, e nenhum tem base externa. Valem quando o
driver os aceitar, e até lá servem para ordenar as rotas, nunca para eliminar nenhuma.

- **IoU contra o chevron ≥ 0,50**: a rota está perto demais da forma que a D-07 mata.
- **fidelidade a 16 px < 0,85**: a rota perde a forma em redução.
- **tinta acima de ~45%**: a rota é mancha antes de ser desenho, e vai sofrer em bordado.

## 4. Duas limitações declaradas da própria régua

⚠️ **A fidelidade em redução mede borda, e não colapso.** A 16 px o que domina o IoU é a
quantização dos cantos, então o número sobe e desce um pouco sem que a forma mude: a A1
mede **0,882 a 24 px e 0,896 a 16**, fora de ordem. 📌 **Quem decide se o vazado fechou é
a folha de contato.**

🔴 **`resize` com `background` sobre entrada de 1 canal devolve 3 canais, e isso já custou
uma medida impossível aqui**: a primeira passada imprimiu **tinta de 132,5%**. Todo caminho
de medição termina em `.greyscale()` antes do `.raw()`. 📌 **Medida impossível é defeito da
régua antes de ser defeito do objeto.**

## 5. Estado

🟢 **Piloto construído e medido**: rota **A**, o C poligonal, nas duas variantes de
terminal. ⚠️ **As demais rotas só entram depois de o driver aprovar este contrato e a
lista**, porque replicar antes é replicar o erro.
