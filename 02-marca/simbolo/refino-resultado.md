# Refino das finalistas · item 13

Onze variantes de peso e proporção das três finalistas do item 12 (A, D e B), na mesma
malha e com a mesma guarda. Folha das nove primeiras em
[verificacao/00-finalistas.png](verificacao/00-finalistas.png); as três escolhidas, em
grande, 48, 24 e 16 px, em [verificacao/01-tres-em-reducao.png](verificacao/01-tres-em-reducao.png).

## 1. A medida nova: vão mínimo entre peças

🔴 **O item 12 tinha um buraco de medição, e ele só apareceu aqui.** As medidas de lá eram
todas da silhueta inteira, e nenhuma olhava a **distância entre duas peças separadas**. A
rota D é um T dentro da boca de um C, e a pergunta que decide se ela existe é se as duas
peças continuam separadas quando a marca encolhe.

✅ **Entrou `vaoMinimo()`**: distância exata de ponto a segmento entre todos os pares de
peças, em unidades de caixa alta, convertida para pixels na largura de 16 px. É geometria,
não raster.

| Variante | vão | a 16 px |
|---|---|---|
| D-1, T pequeno | 42,3 | 0,50 px |
| D-2, T cheio | **12,1** | **0,14 px** |
| D-3, leve | 20,4 | 0,24 px |
| D-4, folga de 90 | 38,1 | 0,46 px |
| **D-5, ponta na oblíqua** | **90,0** | **1,08 px** |
| B-1 | 100 | 1,13 px |

🔴 **As quatro primeiras soldam o T no C a 16 px**, e **o IoU não acusou nenhuma delas**
(a D-2 mede 0,838, dentro do piso). 📌 **É a limitação que o contrato já declarava
acontecendo na prática: a fidelidade mede borda, e um vão que fecha quase não muda a
silhueta.** Guarda nova para quem vier depois: **rota de mais de uma peça se mede pelo
vão, nunca pelo IoU.**

🟢 **E a correção não foi afastar o T, foi trocar o ÂNGULO do corte.** Na D-4 eu tinha
dado 90 unidades de folga em volta do T e o vão medido continuou 38: as pontas da barra
eram cortadas na **diagonal** e a haste do C é **oblíqua**, então as duas retas convergem
para baixo e o vão afunila sem que ninguém veja. Cortando as pontas da barra na **mesma
oblíqua da haste**, as duas ficam paralelas e o vão passa a ser constante: os 90 unidades
pretendidos viram 90 medidos, e 1,08 px a 16. ⚠️ **Custo declarado**: o T perdeu 11% de
largura e a marca ficou 10% mais leve que a D-1.

## 2. As três que vão à decisão

| | Variante | razão | tinta | 16 px | chevron | vão a 16 px |
|---|---|---|---|---|---|---|
| **A-3** | C aberto, leve | 1,17 | 39,8% | 0,885 | 0,360 | peça única |
| **D-5** | CT travado, ponta na oblíqua | 1,34 | 38,7% | 0,806 | 0,274 | 1,08 px |
| **B-1** | Escada, quatro degraus | 1,42 | 26,9% | 0,844 | 0,259 | 1,13 px |

⚠️ **A A-3 ganhou da A-1 em tudo**: menos tinta (39,8 contra 44,2), mais longe do chevron
(0,360 contra 0,390) e razão melhor para avatar (1,17 contra 1,23), com a mesma leitura. A
haste entra 20% mais pesada que os braços, que é compensação óptica corrente e **não é
herança da marca velha**: lá a diferença medida era de 9,05%.

⚠️ **A D-5 e a B-1 ficam abaixo do piso de 0,85 em redução** (0,806 e 0,844), e as duas
**passam na folha de contato**, que é quem decide pelo contrato. A 16 px o T da D-5
continua solto e as quatro barras da B-1 continuam separadas.

## 3. O que falta para fechar o item 13

🔴 **A escolha é do driver**, e é entre três leituras, não entre três números:
**A-3** é a letra sozinha, **D-5** é como as pessoas chamam o lugar, **B-1** não é letra
nenhuma. ⚠️ **Nenhuma das três foi vista ao lado do lettering** (item 14), e ele muda as
três: a A-3 pode virar redundante com a palavra, e a D-5 pode brigar com ela.
