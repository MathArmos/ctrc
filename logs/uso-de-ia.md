# Log de uso de IA

Exigido pelo item 4 do regulamento: ferramenta, forma de uso, elementos
gerados e alterações humanas realizadas. Preencher na hora, nunca depois.

| Data | Ferramenta | O que foi gerado | Onde foi usado | Alteração humana |
|---|---|---|---|---|
| 2026-10-02 | Claude (Anthropic) | Medição e renderização da marca atual, análise de contraste e redução | 01-auditoria | Leitura e conclusões revisadas pelo autor |
| 2026-10-03 | Claude (Anthropic) | Levantamento de anterioridade via TMview | 01-auditoria | Verificação pendente no pePI |
| 2026-10-04 | Claude (Anthropic) | Scripts de medição, retificação de perspectiva e construção geométrica do redesenho da marca ATUAL | 02-marca | Parâmetros, ângulos adotados e decisões de regularização revisados pelo autor. Nenhum modelo generativo produziu a geometria: ela é intersecção de retas medidas na fotografia do cliente |
| 2026-10-05 | Claude (Anthropic) | Redação do eixo conceitual: o parágrafo de conceito que vai à página de conceito do PDF e ao campo "breve explicação do conceito" do formulário | 02-marca/eixo-conceitual.md | Argumento, eixo (expansão nacional) e aprovação do parágrafo são do autor, decididos em conversa antes da redação (D-08 do PRD). O texto gerado foi conferido afirmação por afirmação contra as medições do item 6 e do PRD, e três trechos foram corrigidos por excederem o que a medida sustenta, registrados na seção 2 do próprio arquivo |
| 2026-10-05 | Claude (Anthropic) | Máquina de exploração do símbolo (item 12): malha angular com guarda mecânica, construção paramétrica das rotas e script de medição e redução | 02-marca/exploracao-simbolo/ | Nenhum modelo generativo produziu geometria: cada rota é interseção de retas nas três famílias de ângulo medidas no item 6 (D-04 e D-07). Parâmetros, escolha de rota e leitura das folhas de contato são do autor |
| 2026-10-05 | Claude (Anthropic) | Máquina do carimbo do selo de 10 anos (itens 39 a 41): geometria da anilha, campo de água em seis camadas, corte por limiar, folha de contato e base A4 para a passada de caneta | 02-marca/selo-10-anos/ | Conceito, destino da peça (selo e não símbolo) e escolha da prensada são do autor. **Nenhum modelo generativo produziu imagem**: a impressão é aritmética sobre um campo escalar semeado, reproduzível pela semente, e a imperfeição é calculada camada por camada (D-04 e RNF-06). O traço de reforço será feito à mão pelo autor sobre a folha impressa, e vetorizado a partir do escaneado |

| 2026-10-06 | Claude (Anthropic) | Refino das três finalistas (item 13): onze variantes de peso e proporção, mais a medição de vão mínimo entre peças | 02-marca/simbolo/ | Mesma máquina do item 12, sem modelo generativo. A troca do ângulo do corte da barra do T, que corrigiu o vão, é decisão de desenho tomada a partir da medida |
| 2026-10-06 | Claude (Anthropic) | Redação do RFC 000, que registra a mudança de rumo: o desenho do símbolo passa para o Figma, com o driver na mão | docs/rfcs/ | Decisão, critérios de recusa e escolha da opção são do driver. O documento não entra no PDF |
