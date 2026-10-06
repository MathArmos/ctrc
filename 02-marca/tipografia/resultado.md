# Resultado do item 29 · as oito famílias candidatas

Oito famílias **SIL OFL**, de naturezas diferentes entre si, com **CTRC** composto em cada
uma a partir do **contorno real do glifo**. Duas folhas decidem:

| Folha | O que mostra |
|---|---|
| [folha-01-oito-em-grande.png](verificacao/folha-01-oito-em-grande.png) | as oito em tamanho grande, mesma altura de caixa alta, preto sobre branco |
| [folha-02-reducao.png](verificacao/folha-02-reducao.png) | as oito a 48, 24 e 16 px, em tamanho real, mais o de 16 px ampliado 6x |

| Arquivo | O que é |
|---|---|
| `candidatas.json` | as oito declaradas: natureza, arquivo, instância de peso, autor, licença, origem |
| `compor.mjs` | compõe CTRC em cada uma e mede o ângulo. Rodar com `node` |
| `medir.mjs` | folhas de contato, redução e tinta. Rodar depois do `compor.mjs` |
| `svg/CTRC-F<n>.svg` | cada composição, já em curvas, caixa alta normalizada em 1000 |
| `medidas.json` | tudo legível por máquina |
| `fontes/<familia>/` | o `.ttf`, o `OFL.txt` e o `METADATA.pb`, como vieram |

⚠️ **Nenhuma destas oito é a marca.** A escolhida vira **matriz** do lettering do item 14,
convertida em curvas e modificada (**D-03**). A OFL rege o arquivo da fonte, não o desenho
feito com ela.

## 1. As oito, e por que estas oito

A exigência era **natureza diferente entre si**, nunca oito variações da mesma ideia.

| | Família | Natureza | Peso usado |
|---|---|---|---|
| **F1** | Anton | display ultra pesada, caixa alta larga | único |
| **F2** | Oswald | condensada de sinalização, a referência do setor | 700 |
| **F3** | Archivo Black | grotesca industrial pesada, larga | único |
| **F4** | Big Shoulders Display | condensada extrema de sinalização, ombro quadrado, terminais horizontais | 800 |
| **F5** | Chakra Petch | chanfrada: cantos cortados em ângulo, tecnológica | Bold |
| **F6** | Teko | condensada esportiva, cantos duros, sem chanfro | 700 |
| **F7** | Inter | neutra geométrica, **controle do conjunto** | 900 |
| **F8** | Alfa Slab One | serifada mecânica pesada, natureza totalmente outra | único |

🔴 **Roboto Slab foi cogitada e REPROVOU na licença, não no desenho.** Ela mora em
`apache/robotoslab` e é **Apache 2.0**, que a **D-03** e o **RNF-05** não admitem. Alfa Slab
One entrou no lugar, ocupando a mesma natureza. 📌 **A licença foi conferida no arquivo, e
não de memória**: as oito vieram do diretório `ofl/` do repositório oficial `google/fonts`,
e o `OFL.txt` e o `METADATA.pb` de cada uma estão commitados ao lado do `.ttf`.

## 2. A régua, e o erro que ela cometeu primeiro

🔴 **A primeira passada devolveu ZERO nas oito, nas duas famílias oblíquas da malha, e o
zero era o aviso.** O [contrato da rota](../exploracao-simbolo/contrato-da-rota.md) declara
a malha como horizontal **0°**, oblíqua **−71°** e diagonais **±51°**. Normalizado para
`[0,180)`, **−71° é 109° e −51° é 129°** — e os alvos tinham sido postos em **71 e 51**, que
são os **espelhos** das famílias reais. Nenhuma aresta casava porque a régua procurava do
lado errado. 📌 **Medida impossível é defeito da régua antes de ser defeito do objeto**, e
é a mesma lição que já custou a "tinta de 132,5%" no item 12. O motivo ficou escrito dentro
do `compor.mjs`, no lugar do erro.

⚠️ **Espelho conta como dentro da família, e isso é escolha declarada**: espelhar uma forma
é de graça em desenho, então uma aresta a 71° fala a mesma língua que uma a 109°. Os dois
alvos de cada família estão escritos no código para que isso seja visível.

⚠️ **O histograma mede só aresta RETA**, e a fração curva de cada família vai no
`medidas.json`: família quase toda curva tem pouco a dizer sobre a malha, e isso precisa
aparecer em vez de virar um zero mudo.

🔴 **A convenção de redução é diferente da do símbolo, de propósito.** O item 12 reduziu o
símbolo numa caixa **quadrada** de 48, 24 e 16 px, porque símbolo tem razão perto de 1.
CTRC tem razão de **2,02 a 4,17**: numa caixa de 16x16 ele sairia com 4 px de altura, que
não é teste de nada. Aqui a redução é pela **altura de caixa alta**, que é a dimensão por
onde logotipo é de fato limitado em uso.

⚠️ **A tinta medida aqui NÃO se compara com o teto de 45% do símbolo.** Lá a caixa é
quadrada e sobra fundo; aqui a caixa é justa na palavra, então 55% a 67% é o normal de um
logotipo pesado. O teto de 45% continua valendo **para o símbolo**, e para mais nada.

⚠️ **Kerning não é aplicado.** O `fontkitten` faz mapa um para um de caractere para glifo,
sem GPOS: o que se vê é o avanço natural de cada letra, tracking 0. **Declarado, não
esquecido** — o espaçamento é redesenhado à mão no item 14, e é justamente lá que ele deixa
de ser o da fonte.

🟡 **A caixa alta do Teko diverge do que ele declara.** Medida em nove letras de topo chato
(T, E, H, I, L, F, C, R, Z) ela dá **642** nas nove; o `OS/2` do arquivo declara **622**. O
valor **medido** é o usado, e a divergência fica registrada.

## 3. As medidas

| | Família | razão | aresta reta | horizontal | vertical | tinta | largura a 16 px |
|---|---|---|---|---|---|---|---|
| **F1** | Anton | 2,02 | 66% | 24% | 76% | 66,4% | **33 px** |
| **F2** | Oswald | 2,50 | 61% | 29% | 62% | 57,0% | 41 px |
| **F3** | Archivo Black | **4,17** | 49% | 52% | 39% | 56,4% | **69 px** |
| **F4** | Big Shoulders Display | 2,04 | 43% | 34% | 55% | 53,7% | **33 px** |
| **F5** | Chakra Petch | 3,55 | **100%** | 39% | 43% | **45,7%** | 57 px |
| **F6** | Teko | 2,92 | 82% | 37% | 57% | 65,9% | 47 px |
| **F7** | Inter | 3,65 | 49% | 48% | 41% | 55,3% | 60 px |
| **F8** | Alfa Slab One | 3,71 | 62% | 43% | 57% | 67,3% | 62 px |

As porcentagens de ângulo são fração do comprimento de aresta **reta**, não do contorno
inteiro. 🟢 **A Chakra Petch é a única 100% reta**: ela não tem uma curva sequer, o que a
torna a mais fácil de casar com uma malha de retas e a mais barata em gravação a laser.

## 4. 🔴 A evidência que responde a P-09

A **P-09** pergunta se a malha angular continua obrigando o desenho, e o [RFC 000](../../docs/rfcs/000-rfc-desenho-no-figma.md)
mandou decidir **com a família escolhida na frente**, para que fosse evidência e não gosto.
Esta é a evidência.

**CTRC tem uma única haste oblíqua: a perna do R.** É ela que diz se a letra conversa com os
19° da marca atual, e ela está medida nas oito:

| | Família | oblíqua | da vertical | massa | família da malha mais perto | erra por |
|---|---|---|---|---|---|---|
| **F4** | Big Shoulders Display | 107° | **17°** | 5,8% | oblíqua 19° (109°) | 🟢 **2°** |
| **F2** | Oswald | 106° | **16°** | 5,1% | oblíqua 19° (109°) | 🟢 **3°** |
| **F5** | Chakra Petch | 135° e 45° | 45° | 16,4% | diagonal ±51° | 🟡 **6°** |
| **F7** | Inter | 116° | 26° | 10,4% | oblíqua 19° (109°) | 7° |
| **F6** | Teko | 117° | 27° | 2,9% | oblíqua 19° (109°) | 8° |
| **F3** | Archivo Black | 118° | 28° | 4,9% | oblíqua 19° (109°) | 9° |
| **F1** | Anton | — | — | — | — | ❌ **nenhuma aresta oblíqua** |
| **F8** | Alfa Slab One | — | — | — | — | ❌ **nenhuma aresta oblíqua** |

🟢 **Duas famílias já falam a malha sem que nada seja mexido**: a perna do R da **Big
Shoulders** cai a **2°** dos 19° herdados, e a da **Oswald** a **3°**. Nessas duas a frase do
eixo conceitual — *"uma única coisa sobrevive, e não é uma forma, é um ângulo"* — se sustenta
sozinha, e endireitar a perna para os 19° exatos é correção de **2 a 3 graus**, invisível ao
olho e dentro do que a **D-03** já autoriza (a fonte é modificada).

🟡 **A Chakra Petch fala a OUTRA família da malha.** Os chanfros dela estão a **45°** exatos,
que ficam a 6° dos **±51°** do chevron. Puxar o chanfro de 45° para 51° é uma modificação de
uma aresta por canto, e aí a malha passa a aparecer em **16,4%** do contorno, que é o dobro
da massa de qualquer outra candidata.

🔴 **Duas famílias matam a malha por construção**: **Anton** e **Alfa Slab One** não têm uma
única aresta oblíqua — são horizontal e vertical e mais nada, com a perna do R resolvida em
curva. ⚠️ **Escolher uma das duas é decidir a P-09 pelo lado do "a malha cai"**, e aí o
parágrafo do eixo conceitual precisa ser reescrito, porque a frase central dele promete o
ângulo como herança única. **Isso é decisão, não defeito** — mas é uma decisão cara, e ela
tem de ser tomada sabendo.

## 5. O que a folha de redução mostra, e o número não

A 16 px de caixa alta **as oito continuam lendo CTRC**. O que separa as oito ali não é
sumir, é **empastar**, que é exatamente o defeito que a marca atual tem:

🔴 **Anton e Teko fecham os contraformas.** São as duas mais pesadas (66,4% e 65,9% de tinta)
e a 16 px o vazado do C e o olho do R começam a entupir. ⚠️ **É o mesmo mecanismo que o
achado 2 do PRD mede na marca atual**, e o parágrafo do eixo conceitual acusa o concorrente
disso: empastar também desqualifica a proposta.

🟢 **Chakra Petch e Archivo Black são as que mais seguram o vazado**, e a Chakra Petch é a
mais leve do conjunto (45,7%), o que é dinheiro em bordado (item 36).

🟡 **Largura a 16 px é a outra metade da conta, e ela puxa para o lado contrário.** Big
Shoulders e Anton saem com **33 px**, Archivo Black com **69**. Uma marca que precisa viver
ao lado de um símbolo em avatar e em sinalização paga caro por 69 px de palavra.

## 6. Recomendação

🟢 **F4, Big Shoulders Display**, com **F5 Chakra Petch** como alternativa angular e **F2
Oswald** como a segura.

**Por que a F4:**
1. é a que **mais perto chega da malha** (2°), então a P-09 fecha pelo lado de "a malha se
   sustenta", e o parágrafo do eixo conceitual não precisa ser mexido;
2. o **ombro quadrado e o lado quase reto** dela dão um C que já é quase geometria, que é
   material direto para o símbolo do item 13 sair da letra, que é o que a **D-09** manda fazer;
3. é a **mais compacta a 16 px** (33 px), empatada com a Anton, e sem o empastamento da Anton;
4. é uma **fonte de sinalização**, e o PRD §5 diz que sinalização, fachada, parede e uniforme
   valem mais que papelaria neste projeto;
5. é a **menos rodada** das oito, o que baixa o risco de a proposta parecer template.

🔴 **O que ela custa, e está declarado**: condensada pesada é **o território mais lotado da
categoria fitness**, e o critério de diferenciação do item 6 do regulamento é julgado por
gente que vê academia o dia inteiro. A F5 compra diferenciação e perde compacidade; a F8
compra diferenciação de sobra e **mata a malha**.

## 7. O que esta página não decide

⚠️ **A escolha da família é do driver** (RFC 000, item de ação 3). As oito estão construídas,
medidas e a um comando de distância.
⚠️ **O espaçamento aqui é o da fonte, e não o da marca.** Kerning não aplicado, tracking 0.
⚠️ **Nenhuma foi vista em cor, em fotografia, em bordado ou em gravação** (itens 27, 35 a 38).
⚠️ **Nenhuma foi vista ao lado de um símbolo**, e o símbolo muda a leitura de todas: palavra
larga pede símbolo pequeno, e palavra estreita aguenta símbolo grande.
⚠️ **Nenhuma passou por busca figurativa no INPI** (P-03, pePI fora do ar).

## 8. Correção feita depois de a família ser escolhida

🔴 **A natureza da F4 estava escrita errada, e o erro era meu.** Eu havia descrito a Big
Shoulders como tendo *"terminais cortados em ângulo"*, e isso foi **afirmado de reputação,
nunca medido**. Aberto o contorno do C, os dois terminais da boca são **horizontais** (duas
retas de 161 unidades a 0°), e a letra inteira só tem aresta oblíqua na **perna do R**. A
tabela de ângulos da seção 4 já dizia isso desde o começo: a F4 aparece lá com 107° e 105°
e mais nada. **Era a prosa que contradizia a medida, e não o contrário.**

✅ **O que isso muda, e o que não muda.** Não muda a recomendação nem a escolha: a F4
continua sendo a que mais perto chega da malha, a mais compacta a 16 px e a mais adequada em
sinalização. **Muda o motivo 2 da seção 6**, que apontava para um ângulo que não existe: o
que a F4 entrega ao símbolo não é terminal angulado, é **ombro quadrado e lado quase reto**,
ou seja um C que já é quase polígono.

📌 **E muda uma coisa no item 14**: cortar os terminais na malha deixa de ser *acentuar o que
a fonte já faz* e passa a ser **a modificação principal do lettering**, que é o que a D-03
autoriza e o que separa um logotipo de uma palavra digitada.
