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

- **Mercado aberto** (`statusMercado` 1) é o intervalo entre rodadas: os jogos
  ainda estão a dias de distância e não há absolutamente nada novo pra contar.
  A rodada só conta como em curso quando `statusMercado` é 2, ou `bolaRolando`
  é true, ou já existe jogo com `placarCasa` preenchido, ou já há `parciais`.
- **Nada mudou desde a última cobertura**: mesmo número de jogos iniciados e
  parciais idênticas significa que não há notícia nova.
- **Intervalo mínimo de 40 minutos** entre duas atualizações ao vivo da mesma
  rodada quando só as parciais oscilaram. Se um jogo novo começou, republica na
  hora, sem esperar.

O fechamento de rodada (MODO A) nunca é barrado: acontece uma vez por rodada e é
a entrega principal da liga.

### Campo `estado` nos itens de andamento

Todo item `andamento-rodada-M` deve carregar:

```json
"estado": { "jogosIniciados": 3, "assinaturaParciais": "423154:61.8|90277:45.2" }
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
