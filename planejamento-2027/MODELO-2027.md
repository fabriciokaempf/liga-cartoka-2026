# Liga Cartoka: Temporada 2027

Documento de decisões, escrito em 20/10/2026 durante a reta final da temporada 2026.

---

## 1. A estrutura do ano

**A liga é a de pontos corridos.** É ela que tem confronto, tabela, site, parciais ao vivo e o Zé Resenha, e é dela que trata este documento. São duas competições por ano:

| competição | rodadas | quando roda |
| --- | --- | --- |
| **Turno** | 1 a 19 | primeiro semestre |
| **Returno** | 20 a 38 | segundo semestre |

Cada uma tem inscrição, classificação, campeão e premiação próprios, e as duas seguem a tabela do Brasileirão.

Existe ainda a **Clássica**, que é um extra: anual, roda dentro do app do Cartola, sem site, sem resenha e sem confronto, valendo só a pontuação acumulada. Ela aparece neste documento onde for inevitável (pagamento e passaporte), mas não é o assunto. A hierarquia vale também para a página e para as mensagens do grupo: **o foco é sempre a pontos corridos**.

Em 2026 cada inscrição custou R$ 100.

---

## 2. O problema que a 2027 precisa resolver

A temporada 2026 funcionou como competição e falhou como operação. Quatro falhas, nesta ordem de gravidade:

1. **Cobrança.** O prazo era 10/08 e houve pagamento até setembro. A multa de R$ 20 e o desconto de pontos foram inventados no meio do campeonato, geraram desgaste e acabaram congelados. Uma inscrição segue pendente.
2. **Duas chaves Pix.** Houve pagamento da clássica feito na chave da pontos corridos, o dinheiro entrou no cofrinho errado e isso gerou marcação equivocada de pendência por semanas.
3. **Time abandonado.** Quem perde a briga do título larga o time, e time largado distorce o confronto de quem ainda briga em cima.
4. **Pontuação sem recompensa.** Dá para ter a segunda maior pontuação acumulada da liga e terminar em nono, sem levar nada.

Vale notar de onde vem a falha 1: **são três cobranças por ano.** O organizador cobra no começo do ano pelo turno e pela clássica, cobra de novo no meio do ano pelo returno, e cada rodada de cobrança é uma novela. É aí que mora o desgaste de 2026, não em má vontade de ninguém.

A 2027 ataca as quatro com quatro mudanças: preço escalonado por data, chave única, passaporte anual e premiação com mais categorias.

---

## 3. A conta de 2026, que é o ponto de partida

Returno de 2026, que é a competição com números fechados:

| item | valor |
| --- | --- |
| Times inscritos | 20 |
| Pagantes (organizador isento, uma pendência) | 18 |
| Arrecadado | R$ 1.800 |
| Premiação distribuída | R$ 1.800 |
| **Margem** | **R$ 0** |

A premiação consome 100% do arrecadado. O único caixa que existe é o rendimento do cofrinho.

Consequência prática: não havia de onde tirar prêmio de artilheiro, prêmio mensal ou qualquer categoria nova. Toda mecânica nova sairia do bolso do campeão.

É isso, e só isso, que justifica o aumento de valor.

---

## 4. As 20 vagas

A pontos corridos tem **exatamente 20 vagas, e isso é limite de estrutura, não escolha**. O robô não monta confronto nenhum: ele busca as 10 partidas reais da rodada na API do Cartola e mapeia cada clube para o dono dele. Como a Série A tem 20 clubes, não existe 21ª vaga. E cada vaga vazia vira bye, porque um confronto com clube sem dono simplesmente não acontece e ninguém pontua.

### Como as 20 vagas se dividem

| | vagas | paga |
| --- | --- | --- |
| Fabricio, organizador | 1 | isento |
| Gustavo, organizador | 1 | meia inscrição, R$ 62,50 |
| Vagas em disputa | 18 | inscrição integral |
| **Total** | **20** | |

A isenção da organização é regra da liga e não está em discussão: quem toca o site, o robô, a resenha, a cobrança e a tesouraria não paga inscrição cheia. O Fabricio é isento integral e o Gustavo paga metade.

É por isso que o bolo de cada competição é de **R$ 2.312,50**, e não de R$ 2.500: dezoito inscrições integrais mais a meia do Gustavo.

**Quem organiza disputa em condições iguais e concorre à premiação normalmente.** A isenção dispensa do pagamento, não da competição: se terminar em primeiro, recebe o prêmio de campeão como qualquer um, e se terminar em último leva o mico.

Essa regra fica publicada na página desde o primeiro dia, e é justamente isso que a torna tranquila. Regra escrita antes de qualquer resultado é regra; regra inventada depois que alguém terminou em primeiro é confusão.

A expectativa para 2027 é de **mais gente querendo entrar do que vaga disponível**. A regra de distribuição das 18 vagas em disputa é:

### Preferência de quem já está

Quem jogou a competição em 2026 tem **direito de preferência sobre a própria vaga até 20/01/2027**.

### Fila por ordem de chegada

As vagas que sobrarem em 21/01/2027 vão para a fila de espera, **na ordem de pagamento**. Não é ordem de quem avisou que tinha interesse, é ordem de quem pagou: promessa não segura vaga.

### Por que essa data é a peça central do modelo

Em 2026 o prazo de pagamento não tinha consequência. Por isso virou novela de dois meses, multa improvisada e desgaste.

Agora **20/01 não é só preço, é a vaga**. Quem não confirma até lá não está pagando mais caro, está abrindo o lugar para quem está esperando. É um instrumento muito mais forte do que os R$ 20 de diferença, e tem uma vantagem importante: não usa premiação como argumento de cobrança, usa escassez, que é fato e não pressão.

### Regras de borda, para decidir antes de abrir

1. **Quem está com 2026 em aberto não tem preferência.** Decidido: preferência é privilégio de quem está em dia. Quem ficou com inscrição em aberto entra na fila como qualquer um, sem exceção. Resolve a pendência de 2026 sem cobrar ninguém e sem constranger no grupo.
2. **Devolução de quem paga e não pega vaga.** Se mais gente da fila pagar do que o número de vagas livres, quem ficou de fora recebe de volta na hora, integral. Isso precisa estar dito **antes** de alguém pagar, não depois.
3. **O que acontece com a fila.** A fila não some: quem não entrou no turno tem a inscrição do returno em julho como segunda porta, e a clássica, que não tem teto nenhum, como alternativa imediata.

### O que a escassez não resolve

Vale registrar o que ficou de fora. Uma regra com rebaixamento (o lanterna perde a preferência e vai para o fim da fila) resolveria o problema do time abandonado de forma definitiva, porque largar o time custaria a vaga. Com preferência pura, **esse problema continua existindo** e segue endereçado só pela premiação: o prêmio de maior pontuação de rodada, que qualquer um pode ganhar até a última rodada.

Se o abandono de time virar problema sério em 2027, o rebaixamento de um só (o lanterna perde a preferência, mas entra no topo da fila) é a saída a reconsiderar para 2028.

---

## 5. Valores da inscrição

Cada competição tem o mesmo preço e **o seu próprio prazo promocional**. Quem decide antes do prazo daquela competição paga menos. O organizador deixa de precisar cobrar.

### Avulso, por competição

| inscrição | promocional | depois do prazo |
| --- | --- | --- |
| Turno 2027 | R$ 125 até 20/01/2027 | R$ 145 |
| Returno 2027 | R$ 125 até o prazo dele, em julho/2027 | R$ 145 |
| Clássica 2027, o extra | R$ 100 até 20/01/2027 | R$ 115 |

Turno e returno custam o mesmo porque **são o mesmo produto**: 19 rodadas cada, com o mesmo site, a mesma resenha e a mesma premiação. Cobrar mais caro pelo returno só porque a inscrição dele abre depois penalizaria quem joga o segundo semestre por um prazo que ele nunca teve chance de pegar.

### Passaporte da temporada

| | até 20/01/2027 |
| --- | --- |
| **Passaporte 2027: turno, returno e clássica** | **R$ 350** |

São exatamente os três preços promocionais somados: 125 + 125 + 100. **Não é desconto, e não precisa ser.** O que o passaporte vende é outra coisa:

- **Vaga garantida o ano inteiro.** Numa liga com fila de espera, quem tem passaporte não disputa vaga de novo em julho. É o benefício real, e vale muito mais do que qualquer desconto.
- **Um pagamento só.** Resolve o ano em um Pix, o que elimina a segunda rodada de cobrança. Agosto foi exatamente onde 2026 desandou.

Para o organizador, cada passaporte vendido é **uma cobrança a menos no meio do ano** e uma vaga do returno já resolvida em dezembro.

### Notas

- **O aumento vai 100% para premiação.** Nenhum centavo do reajuste fica com a organização. Precisa estar escrito na página e dito no grupo, porque é o argumento inteiro.
- **A multa deixa de existir.** Não há mais multa de atraso nem desconto de pontos. O preço cheio depois do prazo cumpre esse papel, e cumpre melhor, porque é anunciado antes e não precisa ser aplicado por ninguém.
- **O passaporte só existe até 20/01.** Depois do prazo, cada competição se vende sozinha, no seu preço e no seu prazo.
- **A urgência de 20/01 é a vaga, não o preço.** Ver a seção 4: quem não confirma até lá abre o lugar para a fila. Esse é o instrumento que faltou em 2026.

### Substituto da antiga penalidade

Mantém-se uma regra só, e ela é de elegibilidade, não de punição:

> A inscrição precisa estar quitada antes da primeira rodada daquela competição: 27/01 para o turno e a clássica, 28/07 para o returno. Quem não estiver quitado não entra na tabela.

Simples, verificável e não exige julgamento no meio do campeonato.

### Como se defende um aumento de 25%

Cada competição tem o mesmo tamanho de 2026, 19 rodadas, então não dá para usar o argumento de preço por rodada mais barato. O que sustenta o aumento é:

1. **O campeão passa dos mil reais.** De R$ 710 em 2026 para R$ 1.017,50, um salto de mais de 40%. É o argumento mais direto que existe, porque aparece no bolso de quem ganha.
2. **Ninguém ganha menos.** Com a liga cheia, nenhuma colocação do 1º ao 5º fica abaixo de 2026.
3. **Cinco prêmios novos**: artilheiro, para quem pontua bem e tem azar nos confrontos, e quatro prêmios de melhor de bloco, um a cada cinco rodadas.
4. **R$ 125 por 19 rodadas dá menos de R$ 7 por rodada**, com resenha, site e parcial ao vivo.
5. **Nada do reajuste fica com a organização.**

---

## 6. Premiação do turno e do returno

Vale igual para as duas competições, cada uma com seu próprio bolo.

A premiação passa a ser publicada **em percentual**, não em reais. Os valores em reais saem quando as inscrições daquela competição fecham, porque o bolo depende de quantos entram.

Isso resolve três coisas de uma vez: permite abrir inscrição sem ter o bolo fechado, alinha com o critério que a clássica já usa, e evita prometer um número que pode mudar.

| categoria | % do bolo |
| --- | --- |
| 1º colocado | 44% |
| 2º colocado | 22,5% |
| 3º colocado | 12,5% |
| 4º colocado | 8,5% |
| 5º colocado | 4,5% |
| Artilheiro (maior PG acumulado nas 19 rodadas) | 2% |
| Melhor de cada bloco de rodadas (4 prêmios de 1,5%) | 6% |
| **Total** | **100%** |

O princípio que organiza essa divisão: **o campeão precisa ganhar bem mais do que o vice.** São 44% contra 22,5%, quase o dobro, para que ser campeão valha a pena de verdade e não seja só um degrau acima do segundo lugar.

A divisão foi calibrada com duas amarras ao mesmo tempo: o campeão passar dos mil reais e **nenhuma colocação ficar abaixo do que recebeu em 2026**. Com o bolo de R$ 2.312,50 as duas cabem, mas por pouco: é a calibragem que equilibra as duas pontas.

### Simulação com a liga cheia, todos no preço promocional

Bolo de R$ 2.312,50 por competição.

| categoria | 2027 | 2026 | diferença |
| --- | --- | --- | --- |
| 1º | R$ 1.017,50 | R$ 710 | mais R$ 307,50 |
| 2º | R$ 520,31 | R$ 520 | mais R$ 0,31 |
| 3º | R$ 289,06 | R$ 285 | mais R$ 4,06 |
| 4º | R$ 196,56 | R$ 190 | mais R$ 6,56 |
| 5º | R$ 104,06 | R$ 95 | mais R$ 9,06 |
| Artilheiro | R$ 46,25 | não existia | nova |
| Melhor de bloco, cada um dos 4 | R$ 34,69 | não existia | nova |

**O campeão passa dos mil reais e ninguém ganha menos do que em 2026.** Esse quadro é a peça de convencimento mais forte que existe, e é o que deve ir na página.

### Cuidado ao comunicar: esses valores são por competição

Os números acima valem para **uma competição, meio ano de liga**, não para o ano inteiro. Como são duas por ano, a tabela acontece duas vezes, com campeões possivelmente diferentes.

| | |
| --- | --- |
| Campeão do turno | R$ 1.017,50 |
| Campeão do returno | R$ 1.017,50 |
| Quem levar as duas | R$ 2.035,00 |
| **Total pago pela liga no ano** | **R$ 4.625** |

Isso precisa estar explícito em toda peça que mostrar valor, porque é exatamente o tipo de número que se lê errado na pressa: o próprio organizador leu a simulação como se fosse anual. Se quem montou leu errado, o grupo lê errado.

### A armadilha da comparação com 2026

Há duas formas de comparar 2027 com 2026, e só uma delas é verdadeira.

| colocação | fatia em 2026 | fatia em 2027 | reais em 2026 | reais em 2027 |
| --- | --- | --- | --- | --- |
| 1º | 39,4% | 44,0% | R$ 710 | R$ 1.017,50 |
| 2º | 28,9% | 22,5% | R$ 520 | R$ 520,31 |
| 3º | 15,8% | 12,5% | R$ 285 | R$ 289,06 |
| 4º | 10,6% | 8,5% | R$ 190 | R$ 196,56 |
| 5º | 5,3% | 4,5% | R$ 95 | R$ 104,06 |

**Do 2º ao 5º, a fatia diminuiu.** Eles só não perdem porque o bolo cresceu de R$ 1.800 para R$ 2.312,50. Então nunca dizer que ninguém perdeu fatia, porque é falso e qualquer um com calculadora derruba. O que se diz é que **ninguém leva menos em reais**.

E mesmo isso tem condição: vale **com a liga cheia**. Toda vaga vazia encolhe o bolo, e com duas ou três vagas abertas as colocações do meio já caem abaixo de 2026. É mais um motivo para a grade de 20 ser prioridade.

### Por que o artilheiro, e por que pouco

**Artilheiro** resolve o caso do time que pontua muito e tem azar nos confrontos. Em 2026 o segundo maior pontuador da liga terminou em nono e não levou nada.

Mas é prêmio de consolo, não de conquista, então vale **2% do bolo**, menos do que qualquer colocação premiada. Quem ganha a liga ganha muito mais do que quem só pontuou bem, e isso está certo assim. Dar peso grande ao artilheiro seria premiar quem não venceu confronto nenhum quase tanto quanto quem venceu o campeonato.

### Nota sobre o prêmio mensal

A ideia original era um prêmio de melhor pontuação do mês. Ela foi descartada e voltou em outra forma, melhor: **o recorte por bloco de rodadas em vez de por mês**.

Blocos de rodada são superiores ao mês por dois motivos práticos. Não dependem do calendário do Brasileirão, que tem meses com três rodadas e meses com cinco, nem da pausa de junho e julho. E dividem a competição em partes iguais, o que torna os quatro prêmios comparáveis entre si.

### Melhor de cada bloco de rodadas

As 19 rodadas da competição são divididas em **quatro blocos: 5, 5, 5 e 4 rodadas**. Em cada bloco, quem somar mais pontos no Cartola leva o prêmio daquele bloco.

No turno são as rodadas 1 a 5, 6 a 10, 11 a 15 e 16 a 19. No returno, 20 a 24, 25 a 29, 30 a 34 e 35 a 38.

Por que isso resolve o time abandonado melhor do que as alternativas:

- **Nunca morre.** A cada cinco rodadas tudo recomeça do zero, então são quatro largadas novas dentro da mesma competição. Quem perdeu a briga do título na rodada 8 ainda tem três blocos pela frente.
- **Qualquer um pode ganhar, inclusive o lanterna.** Não depende de posição na tabela, só de cinco rodadas boas seguidas.
- **Dá assunto para o Zé Resenha a cada cinco rodadas**, com um campeão novo para anunciar e um bloco novo abrindo.
- **Custa 6% do bolo**, R$ 34,69 por bloco.

Essa foi a ideia que substituiu o prêmio de maior pontuação em uma única rodada, que chegou a ser cogitado. O problema daquele é que **podia morrer cedo**: bastava alguém cravar uma pontuação muito alta na rodada 3 para ninguém mais correr atrás. O prêmio de bloco não tem esse defeito.

São prêmios pequenos de propósito. O valor deles não está no dinheiro, está em manter todo mundo com algo em jogo até a última rodada.

### O que ainda não está resolvido

O problema do time abandonado agora é atacado por três frentes ao mesmo tempo: duas competições por ano com largada nova, quatro blocos de rodada dentro de cada uma, e o grupo fechado, que faz a vaga valer em convívio e não só em dinheiro.

Mesmo assim não está eliminado: quem larga o time de vez continua distorcendo o confronto de quem briga em cima. Se virar problema sério em 2027, a saída a considerar é dar peso ao mico da lanterna, criando disputa por não ser o último.

### Mico da lanterna

Prenda simbólica para o último colocado, sem dinheiro envolvido. A definir com o grupo, e de preferência escolhida pelo próprio grupo, que é metade da graça.

---

## 7. Premiação da clássica

Segue paralela e sem alteração de formato: roda dentro do app do Cartola, sem site e sem resenha.

| colocação | % do bolo |
| --- | --- |
| 1º | 55% |
| 2º | 30% |
| 3º | 15% |

Com 15 inscritos a R$ 100, o bolo fica em R$ 1.500: R$ 825, R$ 450 e R$ 225.

---

## 8. Pagamento: chave única

Essa é a correção mais barata e a de maior impacto da temporada.

- **Uma chave Pix só** para as três competições.
- **A chave nunca aparece em grupo nem em página pública.** Só no privado, uma pessoa por vez.
- Quem leva o passaporte manda **um Pix só**, de R$ 350, e está resolvido o ano inteiro. A separação entre os cofrinhos é feita na mão, do lado da organização, e deixa de ser problema de quem paga.
- **Todo comprovante tem a data conferida** contra o período da competição antes de ser marcado como pago. Em 2026 houve comprovante de um período apresentado como pagamento de outro, e esse é um erro que o passaporte praticamente elimina, porque passa a existir um pagamento só por pessoa no ano.

### Controle

Planilha ou o próprio `config.json`, com cinco campos por participante: competições contratadas, se é passaporte ou avulso, valor, data do pagamento e faixa de preço aplicada. A faixa importa para fechar o bolo da premiação no fim das inscrições.

---

## 9. Arquitetura dos grupos de WhatsApp

São dois grupos, com funções separadas:

| grupo | quem entra | para que serve |
| --- | --- | --- |
| **Cartoka FC** (o atual, sem o ano no nome) | aberto: participante, ex-participante, quem só assiste | a clássica, que é do ano inteiro, e o funil de novos |
| **Grupo da liga** (novo, fechado) | só os 20 inscritos na pontos corridos | resenha, parciais ao vivo, fechamento de rodada, zoeira |

Decisões tomadas:

- O **grupo da liga é fechado** e só entra quem está inscrito na pontos corridos daquela temporada.
- O **grupo atual fica aberto** e passa a ser a casa da clássica, que é mais fácil de vender e roda o ano inteiro. É também onde se recruta para as vagas que abrirem.
- O grupo atual **perde o ano do nome**. "Cartoka FC 2026" nasceu com prazo de validade.
- Hoje são **27 membros para 20 times**, ou seja, há pelo menos sete pessoas que não jogam a pontos corridos. Elas ficam no grupo aberto, que é exatamente o lugar delas.

### Por que o grupo fechado

A versão anterior deste documento previa grupo aberto único. Mudou, e a razão é boa: **com grupo fechado, a vaga na liga passa a valer também em convívio, não só em competição.**

Quem não se inscreve fica fora da resenha, das parciais ao vivo e da zoeira da rodada. Isso é pressão social sem o organizador precisar cobrar ninguém, sem multa e sem usar premiação como argumento. Em 2026 pagar ou não pagar dava no mesmo até o fim do campeonato, e era justamente essa a falha.

Somado à fila de espera, o efeito fica forte: quem está fora vê a clássica rolando no grupo aberto e sabe que a resenha boa está do outro lado da porta.

### A migração

Criar grupo e migrar gente é a parte chata, então a ordem importa:

1. O **grupo atual permanece** com todo mundo, e vira o grupo da clássica. Ninguém é removido de lugar nenhum, o que evita o constrangimento de tirar sete pessoas na mão.
2. O **grupo novo nasce** conforme as inscrições são confirmadas, com os 20 da pontos corridos. Nasce pequeno e vai enchendo, e cada entrada é uma confirmação de pagamento.
3. Entrar no grupo novo vira, na prática, **o recibo de que a vaga está garantida**.

### A lista de confirmados muda de lugar

> A lista de quem já confirmou é publicada no **grupo aberto**, não no fechado. No fechado ela não serve para nada, porque todo mundo ali já pagou. No aberto ela mostra à fila quantas vagas ainda podem abrir, e mostra a quem está enrolando que o prazo é real.

Nunca citar quem falta, nunca citar valor, nunca citar premiação.

---

## 10. Calendário

### O calendário oficial da CBF para 2027

Divulgado em 09/10/2026, e é ele que manda em todas as nossas datas:

| | |
| --- | --- |
| Série A | 27/01/2027 a 01/12/2027 |
| Pausa pela Copa do Mundo Feminina | 17/06 a 28/07/2027 |

A pausa cai no meio da temporada e **separa naturalmente o turno do returno**: a ida termina antes de 17/06 e a volta recomeça em 28/07. É o que confirma a janela de inscrição do returno em julho.

A tabela com as rodadas ainda não saiu, então não dá para cravar qual rodada fecha o turno nem a data exata da rodada 20. Isso sai depois e precisa ser conferido.

### As datas da liga

| data | o que acontece |
| --- | --- |
| outubro/2026 | abertura interna: Gustavo começa a chamar no privado quem jogou a 2026 |
| 02/12/2026 | fim do returno de 2026, rodada 38 |
| dezembro/2026 | segue a confirmação no privado, sem anúncio no grupo |
| início de janeiro/2027 | com o número de vagas já conhecido, abre para a fila |
| **20/01/2027** | **último dia da preferência, do preço promocional e do passaporte** |
| 21 a 26/01/2027 | vagas não confirmadas liberadas na ordem de pagamento, valor cheio |
| **27/01/2027** | rodada 1: começam o turno e a clássica |
| 26/01/2027 | fecham as inscrições do turno e da clássica |
| antes de 17/06/2027 | última rodada do turno, antes da pausa |
| julho/2027 | abre a inscrição do returno, preferência de quem jogou o turno |
| 27/07/2027 | fecha a inscrição do returno |
| **28/07/2027** | rodada 20: começa o returno |
| 01/12/2027 | rodada 38, fim da temporada |

### Por que o prazo saiu de 31/12 para 20/01

O 31/12 era data escolhida por ser fácil de lembrar, não por ser boa. Entre o fim do Brasileirão 2026 e a virada do ano a galera está sem dinheiro e sem cabeça: Natal, férias e gasto de fim de ano.

Mover para 20/01 resolve isso sem perder nada:

- Dá **janeiro inteiro** para confirmar, depois do aperto de dezembro e já com salário novo.
- Cai **uma semana antes da rodada 1**, quando o assunto Brasileirão volta sozinho e a liga vira pauta natural.
- Mantém intacto o instrumento que importa: prazo com consequência de vaga.

Vale registrar que a ideia original era colocar o prazo um mês antes do início do Brasileirão. Com a data real, 27 de janeiro, isso daria 27 de dezembro, ou seja, seria mais apertado do que o 31/12 que se queria evitar. Por isso a solução foi puxar para dentro de janeiro em vez de empurrar para fevereiro.

### Os dois públicos, e por que isso muda a comunicação

Existem **duas conversas acontecendo ao mesmo tempo**, em lugares diferentes, e misturar as duas é erro:

- **Os 20 de 2026** são chamados **no privado, um por um**, e o que se pede é confirmação de vaga, nunca adesão. Eles já estão dentro.
- **A fila** fica sabendo **no grupo aberto**, e só depois que o número de vagas livres já é conhecido. Prometer vaga antes disso é o jeito mais rápido de criar confusão.

Essa é a mudança de método mais importante: **o anúncio público vem depois da contagem, não antes.** Em vez de anunciar escassez e torcer para dar certo, primeiro se sabe quantas vagas sobraram e só então se abre, com número na mão.

---

## 11. Riscos conhecidos

1. **Intervalo entre pagar e jogar.** Quem leva o passaporte em dezembro só vê a bola rolar na rodada 1, e só joga o returno no segundo semestre. A mitigação é tratar o passaporte como o que ele é, reserva de vaga para o ano inteiro, e não como pagamento de algo que começa amanhã.
2. **Pedido de devolução.** Com pagamento antecipado alguém vai pedir o dinheiro de volta. **Política escrita antes de abrir**, em vez de improvisada quando o primeiro pedir. Sugestão: devolução integral até a véspera da primeira rodada da competição em questão, zero depois disso.
3. **Quem leva passaporte e abandona o time no turno.** O passaporte garante a vaga no returno de quem talvez já tenha perdido o interesse. A premiação nova do returno ajuda a reativar, mas não resolve inteiramente.
4. **Concentração de caixa.** Receber quase tudo em dezembro significa segurar dinheiro de terceiros por muitos meses. O cofrinho resolve a parte operacional e o rendimento é da organização, mas exige disciplina para não misturar.

---

## 12. Pendências

1. **Tamanho da fila que vale a pena manter.** Fila de 3 é saudável, fila de 15 é gente que nunca vai jogar e que desanima. Vale pensar em um limite para não criar expectativa falsa.
3. **Data exata do prazo promocional do returno.** Depende do calendário do Brasileirão 2027. A referência é algumas semanas antes da rodada 20.
4. **Critério de desempate do bilhete de loteria.** Se dois times fizerem exatamente a mesma pontuação na maior rodada da competição, quem leva? Sugestão: quem fez primeiro, pela rodada mais antiga.
5. **Política de devolução.** Ver a seção 11.
6. **Mico da lanterna.** Qual é a prenda, e quem decide.
7. **Divisão organizacional.** A dupla 50/50 com o dono do Resina Club vale para as três competições ou só para a clássica?
