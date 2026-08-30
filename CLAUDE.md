# Liga Cartoka 2026

Site da liga de Cartola FC entre 20 amigos, publicado via GitHub Pages a partir da pasta `docs/`.

- `docs/data.json`: gerado pelo robô `scripts/update.js` (workflow `.github/workflows/update.yml`, roda a cada 10 min). Não editar à mão.
- `docs/resenhas.json`: array de resenhas do Zé Resenha, comentarista da liga. É o único arquivo que a rotina de resenha altera.
- `docs/app.js` / `docs/index.html` / `docs/styles.css`: front-end estático.

## Regra de cadência da rotina do Zé Resenha

A sessão do Zé Resenha é disparada por um agendamento externo de frequência fixa,
que não conhece o calendário do Brasileirão. Rodada de Cartola só acontece em
alguns dias da semana, então **a maioria dos disparos não deve gerar publicação
nenhuma**. Publicar por publicar gera resenha repetida, commit sem conteúdo novo
e notificação inútil.

**Antes de qualquer outra coisa, rode:**

```
node scripts/verificar-cobertura.js
```

Ele lê `docs/data.json` e `docs/resenhas.json` e responde `MODO: A`, `MODO: B` ou
`MODO: C`. **Essa saída manda.** Não substitua o julgamento dela pelo seu.

- `MODO: C` → encerre imediatamente. Não altere arquivo nenhum, não faça commit,
  não faça push e **não envie notificação**. Silêncio é o resultado correto e
  esperado; é assim que a maior parte dos disparos deve terminar. Basta responder
  em uma linha qual foi o motivo informado pelo script.
- `MODO: A` → escreva a resenha de fechamento da rodada indicada, seguindo o
  prompt da rotina (consuma e remova o item `andamento-rodada-N` se existir).
- `MODO: B` → escreva ou atualize a cobertura ao vivo da rodada indicada. Use o
  `ESTAGIO` que o script informa (ESQUENTA / ANDAMENTO / RETA FINAL) e copie o
  JSON da linha `ESTADO` para dentro do item, no campo `estado`.

### Por que o porteiro barra

- **Bola não está rolando.** Mercado fechado não basta: o mercado fecha horas
  antes do primeiro jogo e nesse intervalo não aconteceu nada que renda
  cobertura. A rodada só conta como em curso quando já existe confronto com
  `placarCasa` preenchido **ou** já há `parciais`. (No Cartola um time pontua
  pelos atletas escalados, então pode pontuar antes do jogo real do confronto
  dele; por isso `parciais` sozinho já libera.)
- **Nada mudou desde a última cobertura**: mesmo número de jogos iniciados e
  parciais idênticas significa que não há notícia nova.
- **Parciais mexeram pouco.** Sem jogo novo, exige-se movimento de pelo menos
  **30 pontos somados na liga inteira** (soma dos deltas absolutos de todos os
  times) desde a última cobertura. Oscilação de meio ponto não rende resenha.
- **Intervalo mínimo de 90 minutos** entre duas atualizações ao vivo da mesma
  rodada quando só as parciais oscilaram. Movimento relevante **e** intervalo
  mínimo, os dois. Se um jogo novo começou, republica na hora, sem esperar
  nenhum dos dois.

O fechamento de rodada (MODO A) nunca é barrado: acontece uma vez por rodada e é
a entrega principal da liga.

### Regra fixa: refresh de 10 em 10 minutos durante rodada em andamento

Pedido do organizador (30/08/2026): enquanto a rodada estiver em andamento
(porteiro respondendo `MODO: B`), a sessão deve manter um loop de refresh a cada
10 minutos: `git pull origin main` (para pegar o `docs/data.json` novo) e rodar
o porteiro de novo. Agende isso com o mecanismo de recorrência disponível na
sessão (cron de `*/10 * * * *`) assim que o primeiro disparo cair em `MODO: B`,
e encerre o loop quando a rodada fechar (MODO A publicado) ou o porteiro voltar
a responder `MODO: C` por não haver mais rodada em curso.

O loop NÃO revoga o porteiro: cada tick continua obedecendo a saída do script
(a maioria dos ticks termina em silêncio; as regras de movimento mínimo e
intervalo de 90 minutos seguem valendo para republicação só de parciais).

### Campo `estado` nos itens de andamento

Todo item `andamento-rodada-M` deve carregar:

```json
"estado": { "mercado": 2, "jogosIniciados": 3, "assinaturaParciais": "423154:61.8|90277:45.2" }
```

É o que permite ao porteiro saber se algo mudou de verdade no disparo seguinte.
O front-end ignora esse campo. Sem ele, o script republica por precaução.

## Estilo e regras da resenha

O prompt da rotina agendada é a fonte das regras de estilo do Zé Resenha
(português do Brasil correto, proibido o travessão U+2014, humor de grupo de
WhatsApp sem ataque pessoal, conferência factual contra `docs/data.json`, nunca
se descrever como robô ou automação). Antes do commit, sempre:

```
node -e "JSON.parse(require('fs').readFileSync('docs/resenhas.json','utf8'))"
grep -n $'—' docs/resenhas.json   # não pode retornar nada
```
