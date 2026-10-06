# Log de licenças

Exigido pelos itens 3 e 5: fontes, imagens, mockups, ilustrações e demais
recursos de terceiros precisam ter licença compatível com o uso apresentado.

| Recurso | Tipo | Origem | Licença | Link | Onde foi usado |
|---|---|---|---|---|---|
| Helvetica | fonte | sistema macOS | 🟡 **provisória, não entra na entrega** | — | `02-marca/selo-10-anos/`, só para ocupar o lugar do "10 ANOS" e medir enquanto os itens 14 e 29 não decidem a família |
| Malha territorial dos estados (SP 35, SC 42, MG 31) | dado geoespacial | IBGE, API de malhas v3, baixada em 2026-10-06 | dado público do IBGE, uso livre com citação da fonte | `servicodados.ibge.gov.br/api/v3/malhas/estados/{uf}` | `02-marca/selo-10-anos/origem/`, os três contornos que viram as aberturas da anilha no selo de 10 anos |

## Fontes candidatas do item 29

🟢 **Baixadas em 2026-10-06**, todas do diretorio `ofl/` do repositorio oficial
[google/fonts](https://github.com/google/fonts), que so contem familias sob SIL OFL. De
cada uma veio, no mesmo download, o arquivo `OFL.txt` e o `METADATA.pb` com o campo
`license: "OFL"`, e os dois estao commitados ao lado do `.ttf`. 📌 **A licenca nao foi lida
de memoria: ela veio junto com o arquivo e esta no repositorio.**

⚠️ **Nenhuma destas oito e a fonte da marca ainda.** Elas sao candidatas do item 29, e a
escolhida vira matriz do lettering do item 14, convertida em curvas e modificada (**D-03**).
A OFL rege o arquivo da fonte, e nao o desenho feito com ela.

🔴 **Roboto Slab foi cogitada e REPROVOU na licenca**, nao no desenho: ela mora em
`apache/robotoslab` e e **Apache 2.0**, que a **D-03** e o **RNF-05** nao admitem. Entrou
Alfa Slab One no lugar dela, que ocupa a mesma natureza serifada mecanica e e OFL.

| Recurso | Tipo | Autor | Licenca | Link | Onde foi usado |
|---|---|---|---|---|---|
| Anton | fonte | Vernon Adams | **SIL OFL 1.1** | https://github.com/googlefonts/AntonFont | `02-marca/tipografia/fontes/anton/` · Version 2.116 · 167 KB |
| Oswald (instancia wght 700) | fonte | Vernon Adams, Kalapi Gajjar, Cyreal | **SIL OFL 1.1** | https://github.com/googlefonts/OswaldFont | `02-marca/tipografia/fontes/oswald/` · Version 4.103 · 168 KB |
| Archivo Black | fonte | Omnibus-Type | **SIL OFL 1.1** | https://github.com/Omnibus-Type/Archivo | `02-marca/tipografia/fontes/archivoblack/` · Version 1.006 · 89 KB |
| Big Shoulders Display (instancia wght 800) | fonte | Patric King | **SIL OFL 1.1** | https://github.com/xotypeco/big_shoulders | `02-marca/tipografia/fontes/bigshouldersdisplay/` · Version 2.002 · 214 KB |
| Chakra Petch | fonte | Cadson Demak | **SIL OFL 1.1** | https://github.com/cadsondemak/chakra-petch | `02-marca/tipografia/fontes/chakrapetch/` · Version 1.000 · 77 KB |
| Teko (instancia wght 700) | fonte | Indian Type Foundry | **SIL OFL 1.1** | https://github.com/googlefonts/teko | `02-marca/tipografia/fontes/teko/` · Version 2.000 · 285 KB |
| Inter (instancia wght 900, opsz 32) | fonte | Rasmus Andersson | **SIL OFL 1.1** | https://github.com/rsms/inter | `02-marca/tipografia/fontes/inter/` · Version 4.001 · 856 KB |
| Alfa Slab One | fonte | JM Sole | **SIL OFL 1.1** | https://github.com/Alfa-Slab/AlfaSlabOne | `02-marca/tipografia/fontes/alfaslabone/` · Version 2.000 · 95 KB |

⚠️ **A Inter tem um segundo papel, e ele e declarado**: ela desenha tambem os ROTULOS das
folhas de contato do item 29, por contorno de glifo e nunca por `<text>` com fonte do
sistema. 📌 **O motivo e de licenca**: se a folha virar pagina do PDF, tudo que esta nela
precisa estar nesta tabela, e fonte do sistema nao estaria.

🟡 **A Helvetica da linha acima continua provisoria e continua fora da entrega.** Ela sai no
dia em que o item 14 fechar e o selo de 10 anos puder usar a familia escolhida.
