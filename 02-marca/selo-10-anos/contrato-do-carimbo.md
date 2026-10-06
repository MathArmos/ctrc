# Contrato do carimbo · itens 39 a 41

Regra que a impressão de contato da anilha obedece, escrita **depois** de um piloto
construído e medido e **antes** de qualquer lote. Precedente: o contrato da rota do item 12
e o contrato do cubo.

| Arquivo | O que é |
|---|---|
| `carimbo.mjs` | a anilha, o campo de água em seis camadas e o corte por limiar |
| `folha-de-contato.mjs` | doze prensadas e a varredura de secura. Escreve `verificacao/` |
| `base-para-traco.mjs` | o A4 a 300 dpi com marca de registro, para a passada de caneta |
| `parametros.json` | o estado dos parâmetros no último `node carimbo.mjs` |

## 1. De onde veio

O pedido do driver: a marca de uma anilha molhada prensada no sulfite, com o excesso
tirado, imperfeita de propósito, porque é a imperfeição que diz que houve mão humana. Mais
a segunda camada do designer do copo de café: imprimir o resultado e desenhar por cima.

🔴 **O destino NÃO é o símbolo da marca, é o selo de 10 anos.** A decisão é de 2026-10-05 e
tem quatro motivos, cada um preso a algo já escrito neste repositório:

| Por que não é o símbolo | Onde está escrito |
|---|---|
| o eixo conceitual aprovado diz que **o que sobrevive é um ângulo**, e promete **direção** como significado único. Um anel é radialmente simétrico e não tem direção | `eixo-conceitual.md` §1 e §4, **D-08** |
| o contrato da rota proíbe curva, e a guarda `conferirAngulos()` **estoura** em qualquer aresta fora das três famílias | `exploracao-simbolo/contrato-da-rota.md` §1.3 |
| o símbolo precisa passar a 16 px medido. A falha seca é sub pixel: ou some, e aí não sobra autenticidade nenhuma, ou empasta, e aí vira a mancha que o próprio eixo acusa na marca atual | **RNF-02** |
| os dois estados congelariam a marca na geografia de 2026, contra o eixo de **expansão nacional** | **D-08** |

✅ **No selo nenhum dos quatro acontece.** Selo é peça datada e comemorativa, então registrar
onde a rede estava aos 10 anos é próprio dele, não defeito. E ele não responde à RNF-02.

## 2. O que a máquina obedece

1. 🔴 **Nenhum modelo generativo encosta nisto** (**D-04**, **RNF-06**). A imperfeição é
   aritmética: um campo escalar de água, montado camada por camada, cortado por um limiar.
2. 🔴 **O acidente é reproduzível.** Toda prensada é uma semente. Carimbo que ninguém sabe
   regerar se perde na primeira troca de parâmetro, e aí a peça vira refém de um PNG.
3. 🔴 **Cortar um campo liso, nunca espalhar ruído por pixel.** Ruído independente por pixel
   produz chuvisco e retícula, que é a cara de pincel de Photoshop que o projeto está
   evitando. Quebra de tinta real tem forma orgânica e tamanho correlacionado, e é isso que
   o corte de um campo suave entrega de graça.
4. **Preto sobre branco, uma cor só.** Cor é o item 27.
5. ⚠️ **Toda tipografia aqui é provisória.** Os itens 14 e 29 não foram decididos, então o
   `10 ANOS` sai em Helvetica do sistema, só para ocupar lugar e medir.

## 3. A geometria, e a decisão que faz o selo ler

🔴 **A face da anilha é um plano só.** Anilha de face rebaixada entre aro e cubo imprimiria
**dois anéis**, e as quatro aberturas de pegada cairiam no rebaixo, que não encosta no
papel: elas sairiam brancas sobre branco, ou seja **invisíveis**. Com a face plana a tinta
cobre o disco inteiro e os cinco furos leem como vazio, que era o pedido.

| Parâmetro | Valor | O que é |
|---|---|---|
| `furoCentral` | 0,155 | o furo da barra, em raio normalizado |
| `aberturas` | 4 | as pegadas |
| `aberturaRaio` | 0,60 | do centro ao centro da pegada |
| `aberturaMeia` · `aberturaEspessura` | 0,130 · 0,075 | meia cápsula, no sentido tangencial e radial |
| `aberturaGiro` | 45° | põe as quatro nas diagonais e **deixa os quatro eixos livres**, que é onde o texto cabe |

A pegada é uma **cápsula** (segmento engrossado) e não um retângulo arredondado, porque a
distância exata de um ponto a uma cápsula sai em três linhas, e é essa mesma distância que
alimenta o acúmulo de borda. Uma forma só, dois usos.

## 4. O campo de água, em ordem de amplitude

Quem mexer aqui mexe nesta ordem. É ela que separa objeto levantado do papel de textura
jogada por cima.

| | Camada | Por que existe |
|---|---|---|
| a | **filme de miolo** (0,72) | o que sobra de água no meio depois da prensa. Nasce **abaixo do limiar**, então o miolo é branco e só as placas mais molhadas imprimem |
| b | **inclinação** (0,34) | a mão nunca prensa nivelada. É a camada que mais convence, porque deixa a falha **correlacionada** em vez de espalhada |
| c | **mancha** (grade 5, amplitude 0,60) | a água empoça em placas. Ruído de valor suavizado, duas oitavas |
| d | **esmagamento de borda** (ganho 0,80, largura 0,017) | prensado, o filme é empurrado para fora e acumula na beirada de **todo** contato, inclusive em volta de cada furo. É a assinatura de que havia um objeto com espessura |
| d' | **quebra da borda** (0,45) | a borda **também** seca onde a anilha levantou. Sem isto o aro externo sai um círculo perfeito, e círculo perfeito é o único detalhe que denuncia desenho na hora |
| e | **grão** (0,085 na grade 150, mais 0,022 por pixel) | a fibra do sulfite quebra a tinta no limiar |
| f | **respingo** (faixa 0,05) | gota fina pouco além do aro, **agrupada onde a água empoçou** |

## 5. Três erros pagos, com a medida de cada um

🔴 **Face toda inkada deu 58,2% de tinta e leu como disco preto.** A primeira passada tratou
a prensa como se a água ficasse onde estava. Ela não fica: é empurrada para a borda. O
campo foi refeito para ser dominado pela borda, e a tinta caiu para a faixa de 10% a 38%.

🔴 **Letra VAZADA sumiu.** `10 ANOS` entrou primeiro como gravação, que é como anilha de
verdade costuma carregar o número. Gravado não encosta no papel, então sai branco, e **o
miolo já é branco**: a palavra inteira desapareceu. Hoje a letra é **alto relevo**, que
toca o papel antes da face e é o ponto que **menos** falha.

🔴 **Grão por pixel lê como aerógrafo.** Com ruído independente, a passagem de molhado para
seco virou uma rampa suave de retícula. O grão passou a ter grumo (ruído de valor na grade
150), e a borda da tinta ficou rasgada em vez de esfumada.

## 6. O que a folha de contato achou, e ainda está aberto

🔴 **O `10 ANOS` é engolido quando cai em zona molhada.** Nas doze prensadas ele fica
legível em P01, P03, P05 e P11, e afoga em P04, P06, P08 e P12. É realista e é inaceitável
num ativo de marca, porque passa a depender de sorte.

✅ **O conserto é físico e existe em anilha de verdade**: um **fosso rebaixado** em volta
das letras, que não imprime e garante halo branco em qualquer prensada. Não foi
implementado, e é a primeira coisa a fazer se o driver mantiver o texto fundido.

❌ **A alternativa é tirar o texto do carimbo** e deixá-lo na camada tipográfica do selo,
com a família do item 29. Mais seguro e menos charmoso.

## 7. Os dois estados: não implementados, e por quê

O pedido é São Paulo e Santa Catarina em duas das quatro aberturas, bem sutis.

🔴 **Nenhuma silhueta foi desenhada, de propósito.** Contorno de estado desenhado de memória
é dado inventado dentro de um ativo de marca, e este projeto já escreve que espaço
reservado é explicitamente inválido, nunca plausível. Precisa de origem: a malha estadual
do IBGE é pública e entra em `logs/licencas.md` no dia em que for usada.

⚠️ **E a colocação pedida não fecha na física.** Abertura é furo: não há metal, logo não há
tinta, logo nada pode imprimir lá dentro. Duas saídas, e são diferentes:

| Saída | Como funciona | Custo |
|---|---|---|
| **a) a mão desenha** | o estado entra na passada de caneta, dentro do vazio. Fica honesto: o ferro traz o acidente, a mão traz a intenção | depende de o driver traçar bem, e o contorno fica solto no branco |
| **b) a abertura É o estado** | duas das quatro pegadas são **fundidas no formato** do estado. Imprimem como vazio igual às outras, sem caneta nenhuma | precisa da malha do IBGE, e a pegada deixa de ser cápsula, o que mexe no §3 |

🟡 **A (b) é mais forte e não foi decidida.** Ela é sutil de verdade (um furo é um furo até
alguém contar), dispensa a mão e não inventa física.

## 8. Estado

🟢 **Piloto construído, medido e com doze prensadas na folha.** ⚠️ **Falta a escolha do
driver**: qual prensada, qual secura, o que fazer com o `10 ANOS` e qual das duas saídas
dos estados. A passada de caneta está preparada em `base-para-traco/A4-carimbo-300dpi.png`.
