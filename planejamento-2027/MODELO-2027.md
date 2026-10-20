# Liga Cartoka: Temporada 2027

Documento de decisões, escrito em 20/10/2026 durante a reta final da temporada 2026.

---

## 1. A estrutura do ano

O ano da Cartoka tem **três competições, com três inscrições independentes**:

| competição | rodadas | quando roda | tem site e resenha |
| --- | --- | --- | --- |
| **Turno** | 1 a 19 | primeiro semestre | sim |
| **Returno** | 20 a 38 | segundo semestre | sim |
| **Clássica** | 1 a 38 | o ano inteiro | não, roda no app do Cartola |

Turno e returno são pontos corridos pela tabela do Brasileirão, cada um com classificação própria, campeão próprio e premiação própria. A clássica é anual e vale pontuação acumulada.

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

| | vagas |
| --- | --- |
| Organizador, isento de inscrição | 1 |
| Vagas pagas | 19 |
| **Total** | **20** |

A isenção do organizador é regra da liga e não está em discussão: quem toca o site, o robô, a resenha, a cobrança e a tesouraria não paga inscrição. É por isso que todo cálculo de bolo neste documento usa **19 pagantes, não 20**.

A expectativa para 2027 é de **mais gente querendo entrar do que vaga disponível**. A regra de distribuição das 19 vagas pagas é:

### Preferência de quem já está

Quem jogou a competição em 2026 tem **direito de preferência sobre a própria vaga até 31/12/2026**.

### Fila por ordem de chegada

As vagas que sobrarem em 01/01/2027 vão para a fila de espera, **na ordem de pagamento**. Não é ordem de quem avisou que tinha interesse, é ordem de quem pagou: promessa não segura vaga.

### Por que essa data é a peça central do modelo

Em 2026 o prazo de pagamento não tinha consequência. Por isso virou novela de dois meses, multa improvisada e desgaste.

Agora **31/12 não é só preço, é a vaga**. Quem não confirma até lá não está pagando mais caro, está abrindo o lugar para quem está esperando. É um instrumento muito mais forte do que os R$ 20 de diferença, e tem uma vantagem importante: não usa premiação como argumento de cobrança, usa escassez, que é fato e não pressão.

### Regras de borda, para decidir antes de abrir

1. **Quem está com 2026 em aberto tem preferência?** A sugestão aqui é que não: preferência é privilégio de quem está em dia, e quem tem pendência entra na fila como qualquer um. Isso resolve a cobrança antiga sem cobrar ninguém e sem constranger no grupo.
2. **Devolução de quem paga e não pega vaga.** Se mais gente da fila pagar do que o número de vagas livres, quem ficou de fora recebe de volta na hora, integral. Isso precisa estar dito **antes** de alguém pagar, não depois.
3. **O que acontece com a fila.** A fila não some: quem não entrou no turno tem a inscrição do returno em julho como segunda porta, e a clássica, que não tem teto nenhum, como alternativa imediata.

### O que a escassez não resolve

Vale registrar o que ficou de fora. Uma regra com rebaixamento (o lanterna perde a preferência e vai para o fim da fila) resolveria o problema do time abandonado de forma definitiva, porque largar o time custaria a vaga. Com preferência pura, **esse problema continua existindo** e segue endereçado só pela premiação: o prêmio de maior pontuação de rodada, que qualquer um pode ganhar até a última rodada.

Se o abandono de time virar problema sério em 2027, o rebaixamento de um só (o lanterna perde a preferência, mas entra no topo da fila) é a saída a reconsiderar para 2028.

---

## 5. Valores da inscrição

O corte é a virada do ano. Quem decide antes paga menos. O organizador deixa de precisar cobrar.

### Avulso, por competição

| inscrição | até 31/12/2026 | a partir de 01/01/2027 |
| --- | --- | --- |
| Turno 2027 | R$ 125 | R$ 145 |
| Clássica 2027 | R$ 100 | R$ 115 |
| Returno 2027 | não abre ainda | R$ 145, inscrição abre no meio do ano |

### Passaporte da temporada

| | até 31/12/2026 |
| --- | --- |
| **Passaporte 2027: turno, returno e clássica** | **R$ 350** |

O passaporte é a peça mais importante do modelo, e vale explicar por quê.

**Ele não é desconto, é trava de preço.** Quem leva o passaporte paga R$ 125 pelo turno, R$ 125 pelo returno e R$ 100 pela clássica, os três no preço promocional, mesmo que a inscrição do returno só vá abrir dali a seis meses. Quem for pagando avulso paga R$ 125 pelo turno agora e R$ 145 pelo returno em agosto, porque lá não existe mais preço promocional.

A diferença na ponta é R$ 20. O que o organizador ganha com isso não é dinheiro, é **uma cobrança a menos no ano inteiro**: quem tem passaporte não precisa ser cobrado em agosto, e agosto foi exatamente onde 2026 desandou.

### Notas

- **O aumento vai 100% para premiação.** Nenhum centavo do reajuste fica com a organização. Precisa estar escrito na página e dito no grupo, porque é o argumento inteiro.
- **A multa deixa de existir.** Não há mais multa de atraso nem desconto de pontos. O preço cheio a partir de 01/01 cumpre esse papel, e cumpre melhor, porque é anunciado antes e não precisa ser aplicado por ninguém.
- **O passaporte só existe até 31/12.** Depois da virada, cada competição se vende sozinha, no seu preço e no seu prazo. Isso é o que dá urgência real à data, em vez de urgência inventada.
- **Se quiser um incentivo mais forte**, o botão a girar é o preço do passaporte: R$ 330 em vez de R$ 350 o transforma em desconto de verdade. A troca é R$ 20 por participante contra o risco de ter que cobrar o returno no meio do ano. A recomendação aqui é manter R$ 350 e deixar a data ser o único desconto, mas a decisão é sua.

### Substituto da antiga penalidade

Mantém-se uma regra só, e ela é de elegibilidade, não de punição:

> A inscrição precisa estar quitada antes da primeira rodada daquela competição. Quem não estiver quitado não entra na tabela.

Simples, verificável e não exige julgamento no meio do campeonato.

### Como se defende um aumento de 25%

Cada competição tem o mesmo tamanho de 2026, 19 rodadas, então não dá para usar o argumento de preço por rodada mais barato. O que sustenta o aumento é:

1. **O campeão passa dos mil reais.** De R$ 710 em 2026 para R$ 1.068,75, um salto de mais de 50%. É o argumento mais direto que existe, porque aparece no bolso de quem ganha.
2. **Ninguém ganha menos.** Do 1º ao 5º, nenhuma colocação fica abaixo de 2026, e só o 4º fica igual.
3. **Dois prêmios novos**: artilheiro, para quem pontua bem e tem azar nos confrontos, e maior pontuação de uma única rodada, que qualquer um pode ganhar em qualquer rodada.
4. **R$ 125 por 19 rodadas dá menos de R$ 7 por rodada**, com resenha, site e parcial ao vivo.
5. **Nada do reajuste fica com a organização.**

---

## 6. Premiação do turno e do returno

Vale igual para as duas competições, cada uma com seu próprio bolo.

A premiação passa a ser publicada **em percentual**, não em reais. Os valores em reais saem quando as inscrições daquela competição fecham, porque o bolo depende de quantos entram.

Isso resolve três coisas de uma vez: permite abrir inscrição sem ter o bolo fechado, alinha com o critério que a clássica já usa, e evita prometer um número que pode mudar.

| categoria | % do bolo |
| --- | --- |
| 1º colocado | 45% |
| 2º colocado | 22% |
| 3º colocado | 12% |
| 4º colocado | 8% |
| 5º colocado | 5% |
| Artilheiro (maior PG acumulado nas 19 rodadas) | 5% |
| Maior pontuação em uma única rodada | 3% |
| **Total** | **100%** |

O princípio que organiza essa divisão: **o campeão precisa ganhar bem mais do que o vice.** São 45% contra 22%, mais do que o dobro, para que ser campeão valha a pena de verdade e não seja só um degrau acima do segundo lugar.

### Simulação com 20 times, organizador isento, todos no preço promocional

Bolo de R$ 2.375 por competição.

| categoria | 2027 | 2026 | diferença |
| --- | --- | --- | --- |
| 1º | R$ 1.068,75 | R$ 710 | mais R$ 358,75 |
| 2º | R$ 522,50 | R$ 520 | mais R$ 2,50 |
| 3º | R$ 285,00 | R$ 285 | igual |
| 4º | R$ 190,00 | R$ 190 | igual |
| 5º | R$ 118,75 | R$ 95 | mais R$ 23,75 |
| Artilheiro | R$ 118,75 | não existia | nova |
| Maior pontuação de rodada | R$ 71,25 | não existia | nova |

**O campeão passa dos mil reais e ninguém ganha menos do que em 2026.** Esse quadro é a peça de convencimento mais forte que existe, e é o que deve ir na página.

### Por que o artilheiro, e por que pouco

**Artilheiro** resolve o caso do time que pontua muito e tem azar nos confrontos. Em 2026 o segundo maior pontuador da liga terminou em nono e não levou nada.

Mas é prêmio de consolo, não de conquista, então vale **o mesmo que o 5º lugar**: 5% do bolo. Quem ganha a liga ganha muito mais do que quem só pontuou bem, e isso está certo assim. Dar peso grande ao artilheiro seria premiar quem não venceu confronto nenhum quase tanto quanto quem venceu o campeonato.

### Prêmio mensal: fica para depois

A ideia de um prêmio de melhor pontuação do mês foi avaliada e **não entra em 2027**. Numa estrutura de turno e returno separados, cada competição já tem só 19 rodadas, e fatiar isso em quatro minicompetições mensais esvazia a disputa principal sem resolver nada que o artilheiro não resolva. Além disso tiraria verba justamente do prêmio do campeão, que é o contrário do que a liga precisa.

Fica anotada como possibilidade futura, caso em algum momento a liga passe a disputar a temporada inteira de 38 rodadas, onde um recorte mensal faria mais sentido.

### Maior pontuação de rodada, o bilhete de loteria

É o prêmio que faz o trabalho que o mensal faria, por um terço do custo e sem nenhuma apuração extra: vai para o maior PG que qualquer time fizer em qualquer rodada da competição.

Por que funciona para o problema do time abandonado:

- **Qualquer um pode ganhar, inclusive o lanterna.** Não depende de posição na tabela nem de sequência boa, depende de uma rodada só.
- **Fica em disputa até a rodada 19.** Diferente do título, que costuma estar decidido antes do fim, esse só fecha na última rodada, porque sempre pode aparecer uma pontuação maior.
- **Custa 3% do bolo**, cerca de R$ 71, e não encosta no prêmio do campeão: os 3% saíram do 2º e do 3º lugar, que mesmo assim continuam acima de 2026.
- **Dá assunto para o Zé Resenha toda rodada**, porque existe um recorde vigente a ser batido e um dono atual para provocar.

É prêmio pequeno de propósito. O valor dele não está no dinheiro, está em manter todo mundo com algo em jogo.

### O que ainda não está resolvido

A estrutura de turno e returno já ajuda bastante com o time abandonado, porque são duas competições por ano e quem vai mal no turno recomeça do zero no returno, com premiação nova. Com o bilhete de loteria somado a isso, o problema fica bem endereçado, mas não eliminado: quem larga o time de vez continua distorcendo o confronto de quem briga em cima. Se virar problema sério em 2027, a saída a considerar é dar peso ao mico da lanterna, criando disputa por não ser o último.

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

| grupo | quem entra | para que serve |
| --- | --- | --- |
| **Cartoka FC** (o atual, sem o ano no nome) | aberto: participante, ex-participante e quem só assiste | resenha, parciais ao vivo, fechamento de rodada, zoeira |

Decisões tomadas:

- O grupo é **aberto** e é da **pontos corridos**, turno e returno. A clássica não ganha grupo próprio.
- O grupo atual **perde o ano do nome**. "Cartoka FC 2026" nasceu com prazo de validade. O grupo é permanente, a temporada é que muda.
- Hoje são **27 membros para 20 times**. Há pelo menos sete pessoas no grupo que não jogam a pontos corridos, e elas ficam: são o funil de 2027 e 2028.

### O que grupo aberto custa, e com o que se compensa

Com grupo aberto não existe consequência prática para quem não paga: quem não se inscreve segue vendo a resenha e participando socialmente. **O preço escalonado e o passaporte passam a ser os únicos instrumentos de cobrança**, e por isso o corte de 31/12 não pode ser flexibilizado para ninguém.

O instrumento que sobra, e que funciona melhor em grupo aberto do que em grupo fechado:

> **Lista pública de confirmados.** Conforme a gurizada confirma, publica-se no grupo a lista de quem já está dentro. Nunca quem falta, nunca valor, nunca premiação. É placar de status, e em grupo aberto quem está de fora está vendo.

---

## 10. Calendário

| data | o que acontece |
| --- | --- |
| 20/10/2026 | abre a temporada 2027: preferência dos atuais, clássica e passaporte |
| 02/12/2026 | fim do returno de 2026, rodada 38 |
| 15/12/2026 | lembrete de confirmação de vaga |
| 29/12/2026 | último aviso aos atuais |
| 31/12/2026 | **último dia da preferência**, do preço promocional e do passaporte |
| 01/01/2027 | as vagas não confirmadas abrem para a fila, por ordem de pagamento, no valor cheio |
| a confirmar | rodada 1 do Brasileirão 2027: começam o turno e a clássica |
| véspera da rodada 1 | fecham as inscrições do turno e da clássica |
| por volta de julho de 2027 | abre a inscrição do returno: primeiro os de 2027, depois a fila |
| véspera da rodada 20 | fecha a inscrição do returno |
| ao fechar cada inscrição | divulgação da premiação em reais daquela competição |

A abertura em outubro é deliberada: o grupo está no pico de atenção, com cinco times separados por três pontos na briga do título. Em janeiro o grupo está morno.

### Os dois públicos, e por que isso muda a comunicação

Até 31/12 existem **duas conversas acontecendo ao mesmo tempo**, e misturar as duas é erro:

- **Os 20 de 2026** precisam ouvir "confirma a tua vaga", nunca "vem jogar". Eles já estão dentro, o que se pede é confirmação.
- **A fila** precisa ouvir "anota teu nome, as vagas que sobrarem saem em janeiro por ordem de pagamento". Prometer vaga a essa gente antes de 01/01 é o jeito mais rápido de criar confusão.

A lista pública de confirmados serve aos dois ao mesmo tempo: mostra ao atual que o prazo é real e mostra à fila quantas vagas ainda podem abrir.

---

## 11. Riscos conhecidos

1. **Intervalo entre pagar e jogar.** Quem leva o passaporte em dezembro só vê a bola rolar na rodada 1, e só joga o returno em agosto. A mitigação é tratar o passaporte como o que ele é, trava de preço e vaga garantida, e não como pagamento de algo que começa amanhã. A clássica, que começa na rodada 1, ajuda a encurtar essa percepção.
2. **Pedido de devolução.** Com pagamento antecipado alguém vai pedir o dinheiro de volta. **Política escrita antes de abrir**, em vez de improvisada quando o primeiro pedir. Sugestão: devolução integral até a véspera da primeira rodada da competição em questão, zero depois disso.
3. **Quem leva passaporte e abandona o time no turno.** O passaporte garante a vaga no returno de quem talvez já tenha perdido o interesse. A premiação nova do returno ajuda a reativar, mas não resolve inteiramente.
4. **Concentração de caixa.** Receber quase tudo em dezembro significa segurar dinheiro de terceiros por muitos meses. O cofrinho resolve a parte operacional e o rendimento é da organização, mas exige disciplina para não misturar.

---

## 12. Pendências

1. **A pendência de 2026 tem direito de preferência?** Com fila de espera a pergunta ficou mais fácil de responder sem atrito: quem está com 2026 em aberto perde a preferência e entra na fila como qualquer um. Precisa ser decidido antes da abertura, não depois que a pessoa pedir a vaga. Ver a seção 4.
2. **Organizador isento recebe premiação?** A isenção em si é regra fechada, ver a seção 4. O que falta é deixar escrito se quem é isento concorre aos prêmios em dinheiro. Vale decidir e publicar agora, enquanto a pergunta é hipotética, porque decidir depois que o isento terminar em primeiro é conversa muito pior.
3. **Tamanho da fila que vale a pena manter.** Fila de 3 é saudável, fila de 15 é gente que nunca vai jogar e que desanima. Vale pensar em um limite para não criar expectativa falsa.
4. **Preço do passaporte.** R$ 350, que é a soma exata, ou R$ 330, que vira desconto de verdade. Ver a seção 5.
5. **Critério de desempate do bilhete de loteria.** Se dois times fizerem exatamente a mesma pontuação na maior rodada da competição, quem leva? Sugestão: quem fez primeiro, pela rodada mais antiga.
6. **Política de devolução.** Ver a seção 11.
7. **Mico da lanterna.** Qual é a prenda, e quem decide.
8. **Divisão organizacional.** A dupla 50/50 com o dono do Resina Club vale para as três competições ou só para a clássica?
