# CTRC — rebranding · lista de produção

Prazo de trabalho: outubro de 2026, foco total.
Entrega: PDF de até 10 MB para a Chamada Criativa Nacional, mais acervo fora do PDF.

**Legenda:** `OBR` exigido pelo regulamento · `FORA` produzido mas não entra no PDF
Sem marca = entra no PDF.

---

## Fase 0. Montagem

- [x] 1. Repositório no GitHub `FORA`
- [x] 2. Estrutura de pastas `FORA`
- [x] 3. Arquivo Figma do projeto `FORA` · 🟢 **O KIT ESTÁ NO AR** em [UD0WZgvNBdOtsouECaHB7g](https://www.figma.com/design/UD0WZgvNBdOtsouECaHB7g/Untitled), no quadro `CTRC · marca` (nó `7:6`), à direita do painel de referências. Traz a assinatura horizontal e a vertical, o símbolo e o lettering isolados, positiva, negativa e monocromática, o teste de redução a 48, 24 e 16 px, a paleta com os quatro valores e a **malha da D-07 como guia**. Os quatro valores da paleta entraram também como **estilos de cor locais**. ⚠️ **Tudo em curvas e editável**: nenhuma peça é imagem. 📌 **As 18 peças soltas que o § 4 do RFC 000 previa NÃO entraram**, e o motivo é que elas perderam a função: o kit existia para o driver escolher dentro do acervo recusado, e o símbolo fechou pela letra. Elas continuam em `02-marca/exploracao-simbolo/` e `02-marca/simbolo/`
- [ ] 4. Log de uso de IA, contínuo desde o primeiro prompt `FORA`
- [ ] 5. Log de licenças, contínuo `FORA`

## Fase 1. Diagnóstico (semana 1)

- [x] 6. Marca atual redesenhada em vetor limpo `FORA` (02-marca/, medições em marca-atual-medicoes.md)
- [ ] 7. Auditoria da marca atual, 2 páginas
- [x] 8. Busca INPI, classes 41 e 25
- [ ] 9. Quadro comparativo com concorrentes
- [x] 10. Decisão de nome: **CTRC** (decidido por evidência, ver 01-auditoria)
- [x] 11. Eixo conceitual, um parágrafo (02-marca/eixo-conceitual.md, expansão nacional, D-08)

## Fase 2. Marca (semanas 1 e 2)

🔴 **A ORDEM DESTA FASE INVERTEU EM 2026-10-06** ([RFC 000](docs/rfcs/000-rfc-desenho-no-figma.md), **D-09**).
A fila passa a ser **29 → 14 → 13**: a tipografia primeiro, o lettering depois, e o símbolo derivado da letra
por último. O driver assume o desenho no Figma, e a medição vira régua do que ele desenhar.

- [x] 12. Exploração do símbolo, 5 a 8 rotas em preto e branco `FORA` (7 rotas em 02-marca/exploracao-simbolo/, resultado.md) · 🔴 **RECUSADA EM BLOCO em 2026-10-06**: nenhuma falhou em medida, o aprovador recusou pelo olho (*"têm cara de gerado"*). Vira **acervo e matéria-prima do kit**, não origem do ativo
- [x] 13. Símbolo escolhido, vetorizado · 🟢 **FECHADO: o C sozinho, alargado em 116,4** (02-marca/simbolo-letra/simbolo.mjs). 🔴 **Alargado por TRANSLAÇÃO e nunca por escala em x**, porque escala engrossaria a haste e mudaria o ângulo dos dois cortes de 19°, derrubando a malha em silêncio; conferido que os cortes continuam a 71° com comprimento idêntico. O delta é o **mínimo que passa** no piso de 16 px, e a busca está na tabela do próprio arquivo. ⚠️ **Alargar tem dois preços que sobem juntos**: tinta (24,2% → 51,6%) e **aproximação do chevron** (0,360 → 0,466, contra reprova em 0,50). O histórico das quatro derivações fica abaixo · 🟡 **QUATRO DERIVAÇÕES CONSTRUÍDAS E MEDIDAS** em 02-marca/simbolo-letra/, todas tiradas da letra do item 14 (D-09), com a régua do item 12 rodada sem ser reescrita. 🔴 **A FOLHA ACHOU O QUE O NÚMERO NÃO VÊ: a assinatura gagueja.** A palavra já começa com C e com T, então um símbolo CT ao lado dela lê **"CT CTRC"**. A S2 e a S3 ganham em razão e em redução e perdem nisso. ⚠️ **Falta a escolha do driver**, e a recomendação é a S1 (o C sozinho), com a ressalva de que ela é estreita e precisa ser alargada para o tamanho pequeno. As 11 variantes antigas ficam em 02-marca/simbolo/
- [x] 14. Lettering CTRC · 🟢 **FEITO** em 02-marca/lettering/, matriz Big Shoulders Display 800 em curvas e modificada (D-03). Três modificações, todas saindo da malha: a perna do R a **19° da vertical** (e a largura dela cai em cima da espessura de haste da própria fonte, 161,2, sem que isso fosse planejado), os terminais do C cortados a 19° e **paralelos** (espelhados virariam chevron, que a D-07 mata), e os vãos redesenhados. A oblíqua foi de **5,8% para 24,7%** do contorno reto e **nada sobrou fora da malha**. Vértice mais agudo **71°**, que é 90−19 e é a malha garantindo sozinha que não há ponta aguda
- [x] 15. Assinatura principal `OBR` · 🟢 **FECHADA** · 🟡 **MONTADA** em 02-marca/assinatura/, com a unidade do sistema sendo a espessura de haste medida (u = 161,2). **Presa à escolha do símbolo (item 13)**: trocar `SIMBOLO` refaz as três assinaturas com um comando
- [x] 16. Versão horizontal `OBR` · vão de 1u (u = 161,2, a espessura de haste medida)
- [x] 17. Versão vertical `OBR` · vão de 0,75u
- [x] 18. Símbolo isolado para avatar · razão 0,580 depois do alargamento, fidelidade **0,860** a 16 px, acima do piso
- [x] 19. Versão colorida `OBR` · 🟢 **FEITA**: o símbolo leva a cor e a palavra leva a tinta. ⚠️ **A regra caiu da medida e não do olho**: vermelho sobre preto dá **3,80:1**, que reprova texto normal e passa como grafismo, então a palavra não pode ser vermelha no fundo escuro
- [x] 20. Versão monocromática `OBR` · uma cor chapada só, nas quatro peças
- [x] 21. Versão positiva `OBR`
- [x] 22. Versão negativa `OBR` · ⚠️ o fundo escuro é **provisório** (`#111111`) até o item 27
- [x] 23. Teste de redução medido, a 48, 24 e 16 px `OBR` · por **altura de caixa alta**, que é a dimensão por onde logotipo é limitado em uso. Símbolo **0,860**, horizontal 0,815, vertical 0,800, com a folha aprovando as duas abaixo do piso
- [x] 24. Área de proteção · 🟢 **FEITA** em 02-marca/assinatura/ (`protecao.mjs`). **2u = 322,4 unidades de caixa alta**, e ela foi **DERIVADA, nao escolhida**: a regra e que nada de fora pode chegar mais perto da palavra do que o simbolo esta, entao o piso e o maior vao interno (161,2, medido caixa de tinta contra caixa de tinta) e o valor adotado e o menor multiplo inteiro de `u` que o supera **estritamente**. ⚠️ **1u nao serve porque EMPATA**. Traz tambem o tamanho minimo convertido do item 23 (16 px de caixa alta = 1,35 mm a 300 dpi) e 🔴 **o piso proprio do avatar, que e MAIOR**: circulo de 40 px tem quadrado inscrito de 28,3 px e cabe caixa alta de 27
- [x] 25. Usos proibidos · 🟢 **FEITOS**, oito, em 02-marca/assinatura/ (`proibidos.mjs`), **cada um com o erro desenhado de verdade e nunca so descrito**. 📌 **Proibicao sem motivo e gosto do autor, e manual cheio de gosto do autor nao e obedecido**: dois deles trazem numero medido neste repositorio (vermelho sobre preto da **3,80:1**, item 28; e a palavra digitada na fonte crua difere do lettering em **8,7% dos pixels no C e 1,5% no R**) e um terceiro mede o tamanho proibido com a regua do item 23 (**0,815 a 16 px, 0,690 a 10 e 0,688 a 8**)
- [x] 26. Antes e depois, lado a lado · 🟢 **FEITO** em 02-marca/antes-e-depois/, com as duas marcas passando pela **MESMA regua**. 🔴 **E A IoU FAVORECE A MARCA ATUAL (0,899 contra 0,815 a 16 px), E ISSO ESTA DECLARADO EM VEZ DE ESCONDIDO**: a IoU premia silhueta simples e traco grosso, e entre marcas de complexidade diferente (2 pecas contra 5 mais uma palavra) ela mede **complexidade**, nao qualidade. 🟢 **O que separa as duas e topologia, e ali a conta inverte e nao se mexe**: **contraformas fechados, 0 na atual e 1 na nova, em todo tamanho e em todo limiar testado**. ⚠️ **E isso e o achado 1 do PRD medido por outro caminho**: aquele chegou no "le RK" por geometria, e aqui a mesma coisa aparece como contagem, sem uma unica medida de angulo. ⚠️ **A contagem de PECAS varia com o limiar abaixo de 48 px nas duas marcas e NAO e usada como argumento**

## Fase 3. Sistema visual (semana 2)

- [x] 27. Paleta: HEX, RGB, CMYK, Pantone `OBR` · 🟢 **UM VERMELHO SÓ, `#DE0943`**, medido na face difusa da marca na parede, que é a única fonte frontal em luz chapada. Os outros três materiais dão vermelho escuro de halo e de render, e não a cor do material. ⚠️ **O viés quente da fotografia foi MEDIDO e NÃO corrigido**, porque as superfícies de referência podem ser bege de verdade: nasce a **P-10**. 🔴 **Pantone não declarado, de propósito**: não há conversão livre e confiável, e número errado vira tinta errada na gráfica
- [x] 28. Teste de contraste da paleta · 🔴 **um par reprova e virou regra**: vermelho sobre preto dá 3,80:1, abaixo do piso de 4,5 para texto normal. É o que decide a versão colorida do item 19
- [x] 29. Tipografia de apoio, licença OFL `OBR` · 🟢 **AS OITO CANDIDATAS ESTÃO COMPOSTAS E MEDIDAS** (02-marca/tipografia/, resultado.md), de naturezas diferentes entre si, cada licença conferida no arquivo e registrada em logs/licencas.md. 🔴 **E ELAS TRAZEM A EVIDÊNCIA DA P-09**: a perna do R da Big Shoulders cai a **2°** dos 19° herdados e a da Oswald a **3°**, enquanto **Anton e Alfa Slab One não têm uma única aresta oblíqua** e matam a malha por construção. ⚠️ **Falta só a escolha da família, que é do driver**
- [ ] 30. Tipografia de números (carga, recorde)
- [ ] 31. Grafismo auxiliar derivado do símbolo
- [ ] 32. Padronagem
- [ ] 33. Ícones das áreas do CT
- [ ] 34. Direção de fotografia

## Fase 4. Viabilidade de produção (semana 2)

- [ ] 35. Marca em canal retroiluminado
- [ ] 36. Marca em bordado
- [ ] 37. Marca em gravação a laser
- [ ] 38. Marca em uma cor sobre fotografia

## Fase 5. Selo de 10 anos (semana 3)

🟡 **EXISTE MATERIAL PILOTO AQUI, FORA DE ORDEM, E NENHUM ITEM FECHOU.** Em 2026-10-05 nasceu
em `02-marca/selo-10-anos/` o **carimbo de anilha molhada**: anilha de face plana, campo de
água em seis camadas, corte por limiar, doze prensadas na folha de contato e o A4 a 300 dpi
pronto para a passada de caneta. Tudo aritmético, **nenhum modelo generativo encostou**
(D-04). 🔴 **Ele espera QUATRO decisões do driver**: qual prensada, qual secura, o que fazer
com o `10 ANOS` que afoga em quatro das doze, e qual das duas saídas para os estados de SP e
SC. ⚠️ **E a tipografia dele é provisória**, presa aos itens 29 e 14, que a **D-09** acabou
de pôr na frente da fila. 📌 **Ele também é o precedente citado no [RFC 000](docs/rfcs/000-rfc-desenho-no-figma.md)**
de imperfeição proposital que não parece gerada, e é o plano B se a ASM-A daquele RFC cair.
📐 [contrato-do-carimbo.md](02-marca/selo-10-anos/contrato-do-carimbo.md)

- [ ] 39. Selo digital, quatro versões
- [ ] 40. Selo aplicado sobre foto
- [ ] 41. Selo físico: adesivo, patch bordado, pin

Sem par de datas. Fundação 2017 completa 10 anos em 2027, e a inauguração é novembro de 2026.

## Fase 6. Aplicações (semana 3)

- [ ] 42. Fachada diurna
- [ ] 43. Letreiro noturno retroiluminado
- [ ] 44. Sinalização interna
- [ ] 45. Grafismo de parede
- [ ] 46. Catraca e credencial `FORA`
- [ ] 47. Camiseta e regata da equipe
- [ ] 48. Moletom e oversized da comunidade
- [ ] 49. Boné `FORA`
- [ ] 50. Toalha de treino `FORA`
- [ ] 51. Garrafa de água 1L
- [ ] 52. Copo de café
- [ ] 53. Shaker `FORA`
- [ ] 54. Ecobag `FORA`
- [ ] 55. Anilha gravada `FORA`

## Fase 7. Arquitetura e expansão (semana 3)

- [ ] 56. Regra de convivência com logo de parceiro (Cimerian, Arotha e outros)
- [ ] 57. Submarca de unidade: CTRC Criciúma
- [ ] 58. Plano de migração por fase
- [ ] 58b. Recomendação de depósito da marca CTRC (classes 41, 25, 28, 32)

## Fase 8. Kit de inauguração Criciúma (semana 3)

- [ ] 59. Convite
- [ ] 60. Contagem regressiva para story
- [ ] 61. Camiseta de inauguração

## Fase 9. Digital (semana 4)

- [ ] 62. Site, 5 telas desenhadas (3 entram no PDF)
- [ ] 63. Avatar e capa de perfil
- [ ] 64. Templates de post e story
- [ ] 65. Selo de recorde pessoal `FORA`
- [ ] 66. Favicon `FORA`
- [ ] 67. Animação do símbolo (quadros no PDF, arquivo fora)
- [ ] 68. Site no ar, só se sobrar tempo `FORA`

## Fase 10. Entrega (semana 4)

- [ ] 69. Manual de marca, PDF separado `FORA`
- [ ] 70. Página de autores e colaboradores `OBR`
- [ ] 71. Página de recursos de terceiros e licenças `OBR`
- [ ] 72. Página de declaração de uso de IA `OBR`
- [ ] 73. Breve explicação do conceito, campo do formulário `OBR`
- [ ] 74. Montagem e compressão do PDF até 10 MB `OBR`
- [ ] 75. Imagem PNG ou JPG complementar (o item 5 diz "poderá ser anexada": é opcional, não `OBR`)
- [ ] 76. Conferência final item a item contra o regulamento

---

## Estratégia de envio

🟢 **O item 2 permite mais de uma proposta, com uma inscrição separada para cada.** Registrado em 2026-10-05, quando o regulamento entrou no repositório. Isso muda o que fazer com as 5 a 8 rotas do item 12: elas deixam de ser só exploração descartável e passam a ser candidatas possíveis a envio. ⚠️ **Decisão de quantas enviar não foi tomada.**

🔴 **Não existe prazo publicado** (item 5: vale enquanto o formulário estiver aberto). Ter uma versão enviável cedo vale mais que ter a versão perfeita tarde.

## Pendências de informação

- [ ] Prazo e link oficiais do formulário
- [ ] Perguntas do formulário de inscrição
- [ ] Reconferir no pePI quando voltar ao ar: apostila e colidência figurativa
