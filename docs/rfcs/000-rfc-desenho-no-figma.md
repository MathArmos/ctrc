# RFC 000 · O desenho do símbolo passa para o Figma, com o driver na mão

| | |
|---|---|
| **Driver** | Matheus Ramos |
| **Aprovador** | Matheus Ramos |
| **Data** | 2026-10-06 |
| **Impacto** | **ALTO**: muda o processo do ativo principal e a ordem de produção dos itens 13, 14 e 29 |
| **Situação** | **DECIDIDO** em 2026-10-06. A seção 7 registra o que foi decidido e o que ficou aberto |

---

## 1. Contexto

Até 2026-10-06 o símbolo vinha de **construção paramétrica em SVG**: um programa desenhava
cada rota por interseção de retas presas a três famílias de ângulo medidas na marca atual,
e um segundo programa media o resultado. O método produziu, em dois dias, **sete rotas**
(item 12) e **onze variantes** de refino (item 13), todas com folha de redução a 48, 24 e
16 px e três medidas por peça.

🔴 **O driver olhou as dezoito e recusou o conjunto inteiro.** A razão, nas palavras dele,
é que elas **"têm cara de gerado"**: geométricas demais, sem mão humana, com aparência de
exercício e não de marca.

⚠️ **Isso não é defeito de uma rota, é leitura do conjunto**, e por isso não se resolve
escolhendo melhor dentro do que existe. Duas evidências sustentam que o problema é de
origem e não de parâmetro:

1. **Nenhuma das dezoito falhou nas medidas.** As três finalistas passam a 16 px, ficam
   longe da forma que a D-07 mata e cabem no teto de tinta. 📌 **A régua estava verde e o
   olho reprovou**, que é exatamente o caso em que a régua não mede o que importa.
2. **Toda forma nasceu de aritmética pura**, sem nenhuma matriz de desenho humano no
   caminho. A **D-03** já previa matriz humana para o *lettering* (fonte SIL OFL convertida
   em curvas), e o símbolo foi construído **sem nenhuma**.

**Por que agora**: o item 13 é o gargalo declarado do projeto (**R-01**), e nada da fase 3
em diante começa antes dele. Continuar escolhendo dentro de um conjunto recusado é gastar o
único recurso escasso, que é tempo, num caminho que o aprovador já rejeitou.

**Custo de não fazer nada**: a proposta vai à comissão com um símbolo que o próprio autor
não defende, e o critério de originalidade do item 6 do regulamento é avaliado por gente que
vê a mesma coisa que o driver viu.

## 2. Suposições

| # | Suposição | Confiança | Se cair |
|---|---|---|---|
| **ASM-A** | A "cara de gerado" vem da **origem puramente geométrica**, sem matriz tipográfica | 🟡 **Média** | Se o símbolo derivado da letra escolhida continuar parecendo exercício, a causa é outra: repertório de referência, peso, ou a própria malha. O RFC precisa de uma segunda rodada |
| **ASM-B** | O driver, não sendo designer, **adapta melhor do que cria do zero** | 🟢 Alta, dita por ele | Se mesmo com o kit montado ele não conseguir começar, o problema é de repertório e não de ferramenta, e a saída é referência externa antes de desenho |
| **ASM-C** | Existe família **SIL OFL** com a cara certa para o CTRC | 🟡 Média-alta | A **D-03** precisa ser revista: fonte comprada com licença de marca, que é dinheiro e um item novo em `logs/licencas.md` |
| **ASM-D** | O que eu exportar é **editável no Figma** sem perda | 🟢 Alta | Os SVG são polígonos puros, sem curva, sem efeito e sem máscara. Se algo se perder, é bug de importação e se resolve no formato |
| **ASM-E** | O driver tem **tempo de mão** para desenhar | 🟡 Média | Sem prazo publicado (ASM-01 do PRD), o risco é o formulário fechar com o símbolo na mesa dele. A mitigação está na seção 6 |

## 3. Critérios de decisão

Definidos **antes** das opções.

| # | Critério | Peso | Tipo |
|---|---|---|---|
| **C1** | O driver consegue **começar**. Opção que o deixa diante de tela em branco falha aqui | **30** | 🔴 Obrigatório |
| **C2** | O ativo principal **deixa de ter cara de gerado**, que é o defeito relatado | **25** | 🔴 Obrigatório |
| **C3** | A **prova medida não se perde**: teste de redução a 48, 24 e 16 px é exigência do item 5 do regulamento e do RNF-02 | **20** | 🔴 Obrigatório |
| **C4** | A **declaração de IA e a rastreabilidade continuam verdadeiras** (item 4 do regulamento, D-04) | **15** | 🔴 Obrigatório |
| **C5** | **Custo de tempo**, com o formulário podendo fechar sem aviso | **10** | Desejável |

## 4. Opções consideradas

### Opção 1: seguir como está

Escolher entre A-3, D-5 e B-1 e levar adiante.

✅ Custo zero e o item 13 fecha hoje. ❌ **Reprova no C2 por definição**: o aprovador já
recusou o conjunto. ❌ Reprova no C1, porque não existe começo nenhum para ele.

**Custo**: zero. **Avaliação: descartada.**

### Opção 2: o driver desenha no Figma do zero

A máquina para, o acervo vira registro, e o símbolo nasce da mão dele numa tela vazia.

✅ Máximo de C2: o que sair é dele. ❌ **Reprova no C1**, que é o motivo pelo qual este RFC
existe: ele mesmo disse que não sabe dar o start. ⚠️ Risco alto no C5, porque tela em branco
sem repertório é onde projeto de identidade mais empaca.

**Custo**: imprevisível, e é o problema. **Avaliação: descartada.**

### Opção 3: mudar os parâmetros e seguir paramétrico

Manter o método e atacar a "cara de gerado" com repertório novo: outra malha, outros pesos,
cantos quebrados, imperfeição controlada.

✅ Barata e mede igual. ✅ Tem precedente **dentro deste repositório**: o carimbo de anilha
dos itens 39 a 41 produz imperfeição de propósito e não parece gerado. ❌ **Não resolve o
C1**: a escolha continua sendo entre coisas que eu produzo. 🟡 **E a ASM-A diz que o defeito
é de origem**, não de parâmetro: mexer em parâmetro é tratar sintoma.

**Custo**: um a dois dias. **Avaliação: não descartada, fica como plano B se a ASM-A cair.**

### Opção 4, recomendada: a máquina continua produzindo matéria, a ordem inverte, e o Figma vira o lugar de trabalho

Três mudanças de uma vez:

1. 🔴 **A ordem inverte: a palavra vem antes do símbolo.** Hoje a fila é item 13 (símbolo) e
   depois 14 (lettering). Passa a ser **item 29** (famílias SIL OFL candidatas), **item 14**
   (lettering) e só então **item 13** (símbolo **derivado da letra**). 📌 **É isto que ataca
   a causa que a ASM-A aponta**: fonte tem desenho humano dentro, e um símbolo tirado de uma
   letra herda esse desenho em vez de nascer de aritmética.
2. 🟢 **O Figma deixa de ser destino e vira lugar de trabalho**, e o driver recebe um **kit
   montado, nunca um arquivo vazio**: guias de 0°, ±51° e 19° que ligam e desligam, CTRC
   escrito nas famílias candidatas já em curvas, as sete rotas e as onze variantes como peças
   soltas para cortar e combinar, a assinatura em três arranjos, e uma prancha de teste com
   tudo a 48, 24 e 16 px.
3. 🟢 **A medição deixa de gerar forma e vira régua** (decisão do driver, 2026-10-06): ele
   desenha, eu exporto, meço redução, vão entre peças, distância da marca atual e tinta, e
   devolvo o número. Reprovou, a decisão do ajuste é dele.

✅ **C1**: ele começa editando, não criando. ✅ **C2**: a matriz passa a ser tipográfica.
✅ **C3**: a régua continua inteira, apenas muda de papel. ✅ **C4**: o ativo principal passa
a ter **menos** IA, não mais, o que reforça a **D-04**.
🟡 **C5**: custa um dia a mais que a opção 1 e devolve esse dia no item 14, que já estava na
fila e passa a ser feito antes.

**Custo**: um a dois dias até o kit estar na mão dele. **Avaliação: recomendada.**

## 5. Comparação

| | C1 começar (30) | C2 sem cara de gerado (25) | C3 medida (20) | C4 IA e rastro (15) | C5 tempo (10) | Total |
|---|---|---|---|---|---|---|
| 1. seguir como está | ❌ 0 | ❌ 0 | ✅ 20 | ✅ 15 | ✅ 10 | **45** |
| 2. Figma do zero | ❌ 0 | ✅ 25 | 🟡 10 | ✅ 15 | ❌ 0 | **50** |
| 3. parâmetros novos | ❌ 0 | 🟡 12 | ✅ 20 | ✅ 15 | 🟡 7 | **54** |
| **4. matéria, inversão e kit** | ✅ 30 | ✅ 22 | ✅ 20 | ✅ 15 | 🟡 7 | **94** |

## 6. Itens de ação

| # | Ação | Quem |
|---|---|---|
| 1 | Levantar 6 a 8 famílias **SIL OFL** candidatas, cada licença registrada em `logs/licencas.md` **no momento do download** (item 29) | agente |
| 2 | Compor **CTRC** nas candidatas, preto sobre branco, lado a lado, mais a mesma folha a 16 px | agente |
| 3 | **Escolher a família** | driver |
| 4 | Lettering em curvas a partir dela, modificado (item 14) | agente |
| 5 | Derivar duas ou três saídas de símbolo **a partir da letra** (item 13) | agente |
| 6 | Montar o **arquivo Figma kit**, com guias, peças soltas, assinatura e prancha de redução | agente |
| 7 | **Desenhar e adaptar no Figma** | driver |
| 8 | Exportar, medir e devolver números a cada rodada | agente |
| 9 | Decidir a **malha** com a letra escolhida na frente (ver seção 7) | driver |

🔴 **Mitigação do C5, e ela não é opcional**: enquanto o símbolo estiver na mão do driver, o
agente **não fica parado**. Avançam os itens que não dependem do símbolo: paleta e contraste
(27, 28), tipografia de números (30), quadro de concorrentes (9), auditoria escrita (7) e as
páginas obrigatórias de autoria, licenças e IA (70 a 72). Assim o PDF existe quase inteiro no
dia em que o símbolo fechar.

## 7. Resultado

✅ **Decidido em 2026-10-06, pelo driver: opção 4.** A exploração paramétrica deixa de ser o
caminho do ativo principal, a ordem inverte, e o Figma passa a ser onde o símbolo é desenhado.

✅ **A medição vira conferência**, decidido no mesmo dia: a máquina não gera mais forma,
e passa a medir o que o driver desenhar.

🔴 **Fica aberta a questão da malha, e de propósito.** A **D-07** diz que da marca atual
sobrevive só o ângulo, e o parágrafo do item 11 promete isso por escrito ao avaliador. O
driver respondeu que não sabe se consegue desenhar respeitando a regra. 📌 **A decisão foi
adiada para quando a família tipográfica estiver escolhida**, porque ali ela deixa de ser
gosto e vira evidência: ou a letra conversa com os 19° e a malha se sustenta, ou ela briga, e
a malha cai com motivo. **Nasce a P-09** no PRD. ⚠️ **Até lá o parágrafo do item 11 está
congelado**, porque a frase central dele depende dessa resposta.

❌ **Nada foi apagado.** As sete rotas, as onze variantes, as folhas de contato, os dois
contratos e os três programas ficam onde estão, em `02-marca/exploracao-simbolo/` e
`02-marca/simbolo/`. Eles passam a ser **acervo e matéria-prima do kit**, e o registro de
por que este caminho foi tentado. 📌 **O que se perdeu é o papel deles como origem do ativo
principal, e nada mais.**

🟡 **A opção 3 fica como plano B declarado**, acionada se a **ASM-A** cair, ou seja, se o
símbolo derivado da letra continuar parecendo exercício.

## 8. Dados que sustentam este RFC

| Evidência | Onde está |
|---|---|
| as 18 formas recusadas, medidas uma a uma | [exploracao-simbolo/resultado.md](../../02-marca/exploracao-simbolo/resultado.md) e [simbolo/refino-resultado.md](../../02-marca/simbolo/refino-resultado.md) |
| as três finalistas passando em todas as medidas e reprovando no olho | `02-marca/simbolo/verificacao/01-tres-em-reducao.png` |
| a regra que a máquina obedecia | [contrato-da-rota.md](../../02-marca/exploracao-simbolo/contrato-da-rota.md) |
| a origem dos três ângulos | [marca-atual-medicoes.md](../../02-marca/marca-atual-medicoes.md) §3 |
| a promessa escrita que a malha sustenta | [eixo-conceitual.md](../../02-marca/eixo-conceitual.md) §1 |
| **D-03** (fonte OFL), **D-04** (IA fora do ativo), **D-07** (só o ângulo sobrevive) | [000-prd.md](../prds/000-prd.md) §9 |
| precedente de imperfeição proposital que **não** parece gerada | [contrato-do-carimbo.md](../../02-marca/selo-10-anos/contrato-do-carimbo.md) |
