# Resultado do item 13 · o símbolo, derivado da letra

Quatro derivações, e **nenhuma é forma nova**: toda peça é uma letra do lettering do item 14,
que por sua vez é a Big Shoulders Display 800 em curvas, modificada pela malha da **D-07**.
É o que a **D-09** manda e o que o [RFC 000](../../docs/rfcs/000-rfc-desenho-no-figma.md)
pede na ação 5.

| Folha | O que mostra |
|---|---|
| [folha-00-quatro.png](verificacao/folha-00-quatro.png) | as quatro, grandes e a 48, 24 e 16 px, mais o de 16 px a 8x |
| [../assinatura/verificacao/folha-02-gagueira.png](../assinatura/verificacao/folha-02-gagueira.png) | 🔴 **a folha que decide**: cada símbolo ao lado da palavra |

## 1. As quatro, medidas pela régua do item 12

A régua é a mesma de `exploracao-simbolo/medir.mjs`, rodada com esta pasta como alvo. ✅ **Ela
não foi reescrita**, que é o que a decisão de 2026-10-06 pede: a medição virou régua e deixou
de gerar forma.

| | Derivação | razão | tinta | 16 px | **chevron** | monograma |
|---|---|---|---|---|---|---|
| **S1** | o C sozinho | 0,466 | **24,2%** | 0,682 | 0,360 | 0,107 |
| **S2** | C e T compostos, vão 34 | **0,955** | 43,6% | **0,799** | **0,157** | 0,209 |
| **S3** | CT travado, barra contínua | 0,779 | 42,3% | 0,789 | 0,283 | 0,222 |
| **S4** | CT travado, haste na boca | 0,721 | 38,5% | 0,796 | 0,307 | 0,209 |

Pisos aceitos: chevron ≥ 0,50 reprova · 16 px < 0,85 reprova, mas a folha decide · tinta > 45% reprova.

✅ **As quatro passam em chevron e em tinta, com folga.** A mais perto da forma que a D-07
mata é a S1, com 0,360 contra um piso de 0,50.

🟡 **As quatro ficam abaixo de 0,85 em redução, e isso era esperado.** A régua mede
quantização de borda, e o contrato já declarava esse ruído. **A S1 é a pior (0,682) por um
motivo geométrico e não por colapso**: ela tem razão 0,466, e a medida encaixa a forma numa
caixa **quadrada** de 16x16, então o C sai com 7 px de largura. A régua está punindo a
proporção, não o desenho.

## 2. 🔴 O que a folha mostrou e o número não: a assinatura gagueja

A palavra é **CTRC**, e ela já começa com C e com T. Posto ao lado dela, um símbolo **CT**
repete as duas primeiras letras, e a assinatura passa a ler **"CT CTRC"**.

| Símbolo na assinatura | Como lê |
|---|---|
| **S1** | **"C CTRC"** · o C lê como marca, e não como letra repetida |
| **S2** e **S3** | 🔴 **"CT CTRC"** · gagueira visível, as duas primeiras letras ditas duas vezes |

📌 **Isto não aparece em medida nenhuma da tabela acima.** A S2 e a S3 ganham em razão, em
redução e em distância do chevron, e perdem na única coisa que a assinatura principal (item
15) precisa fazer. ⚠️ **Era um risco previsto**: o resultado do item 12 já escrevia que
*"a D pode ficar redundante com ela [a palavra]"*, e aqui ele se cumpriu com a letra real.

## 3. Escolha do driver, 2026-10-06: **S1, o C sozinho**

🟢 **S1, o C sozinho**, com uma ressalva que foi resolvida logo depois e está na seção 5.

**Por que a S1:**
1. é a única que **não gagueja** na assinatura, e a assinatura é o item 15, o entregável principal;
2. é a mais leve de longe (**24,2%** de tinta contra 42 e 43), o que é dinheiro em bordado (item 36);
3. é a mais distante do **monograma** atual (0,107);
4. ela lê como **marca**, e não como duas letras compostas lado a lado.

🔴 **A ressalva, e ela é real: a S1 é estreita demais para o tamanho pequeno.** Com razão
0,466, num avatar de 40 px ela sai com 18 px de largura, e a 16 px com 7. Na folha, a 16 px
o contraforma do C quase fecha.

✅ **E isso tem saída medível, que é alargar o C só para o símbolo.** Símbolo derivado de
letra tem direito a proporção própria. ⚠️ **Alargar não é escalar em x**: escalar engrossaria
a haste vertical e deixaria os braços horizontais como estão, quebrando o peso. O que serve é
**afastar o lado direito mantendo a haste em 161,2**, que é cirurgia de curva e vira uma
modificação declarada, como as três do item 14.

❌ **Não foi feito ainda, e é decisão do driver**, porque muda a proporção do símbolo e
portanto a cara da assinatura inteira.

## 4. O que esta página não decide

⚠️ **Nada aqui foi visto em cor, em bordado, em gravação ou sobre fotografia** (itens 27, 35 a 38).
⚠️ **Nenhuma busca figurativa no INPI** (P-03, pePI fora do ar).
⚠️ **O símbolo é trocável por um comando**: `SIMBOLO` em `../assinatura/assinatura.mjs`. Trocar
o valor refaz as três assinaturas e o símbolo isolado.

## 5. O alargamento do C, e o que ele custou

🔴 **A ressalva da S1 era real e foi medida: como letra, o C tem razão 0,466 e reprova a 16 px**
(fidelidade 0,682 contra o piso de 0,85, que é o **RNF-02**). Na folha, o contraforma vira uma
fresta. Símbolo derivado de letra tem direito a proporção própria, e foi isso que se usou.

❌ **Alargar escalando em x estava fora, e por dois motivos, não um.** O primeiro é peso:
escala em x engrossaria a haste esquerda, que é vertical, e deixaria os braços de cima e de
baixo como estão, porque a espessura deles é vertical. O C sairia com dois pesos. 🔴 **O
segundo é pior e é silencioso: escala não preserva ângulo**, então os dois cortes de 19° do
item 14 sairiam com outro ângulo e a malha cairia sem que nada reclamasse.

✅ **O que serve é TRANSLADAR.** O C tem dois ápices de tangente horizontal, em cima e embaixo,
no mesmo x. Eles partem o contorno em metade esquerda e metade direita. Afastando a direita e
tapando a fenda com uma reta horizontal em cada ápice, o C alarga e **nada mais muda**.
📌 **Conferido, e não presumido**: os dois cortes continuam a **71°** com comprimento **164,5 e
401,8**, idênticos antes e depois, e as duas barras inseridas medem exatamente o delta.

⚠️ **Uma premissa minha estourou na guarda, e foi ela que impediu um C torto.** Eu havia
assumido que o ápice de baixo era o ponto onde o contorno começa. Não é: depois do chanfro do
item 14, `chanfrar` reconstrói o contorno a partir do ponto de corte, então `inicio` passa a
ser um ponto qualquer do braço. A guarda acusou ápices em x=287,5 e x=339,2 e parou. Os dois
ápices passaram a ser **achados varrendo**.

### A busca, e o mínimo que passa

| razão | delta | tinta | 16 px | chevron |
|---|---|---|---|---|
| 0,466 | 0 | 24,2% | **0,682** ❌ | 0,360 |
| **0,580** | **116,4** | 35,6% | **0,853** ✅ | 0,438 |
| 0,660 | 198,2 | 43,5% | 0,891 | 0,462 |
| 0,740 | 280,0 | **51,6%** ❌ | 0,918 | 0,466 |

🔴 **ALARGAR TEM DOIS PREÇOS, E OS DOIS SOBEM JUNTOS.** A tinta cresce, o que é dívida em
bordado (item 36); e o símbolo **se aproxima do chevron**, que é a forma que a **D-07** manda
morrer: de 0,360 a 0,466 contra um piso de reprova em 0,50. 📌 **É por isso que o delta
adotado é o mínimo que passa, e não o que mede melhor em redução**: cada unidade a mais compra
fidelidade pagando com distância da marca velha. Mesmo critério das buscas de véu deste
projeto, em que o que entra é o mínimo que passa com margem.

⚠️ **O C do símbolo ficou mais largo que o C da palavra**, e isso é diferença declarada, não
descuido: na assinatura ele lê como marca, e não como a primeira letra repetida. Conferido na
folha, nas três larguras.
