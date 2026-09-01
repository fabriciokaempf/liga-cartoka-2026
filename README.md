# Liga Cartoka de pontos corridos 2026 (2º turno)

Site de acompanhamento automático da liga: classificação, confrontos por rodada, inscritos e regras.

Página publicada: https://fabriciokaempf.github.io/liga-cartoka-2026/

## Como funciona

- Cada jogador tem um time no Cartola FC e representa um clube da Série A. Os confrontos de cada rodada seguem a tabela oficial do Brasileirão (rodadas 20 a 38).
- Vence o confronto quem fizer mais pontos no Cartola na rodada. Vitória vale 3 pontos na liga. Empate quando a diferença for menor que 2,0 pontos (1 ponto para cada).
- Desempate na classificação: PG turno (soma das pontuações do Cartola no returno), depois vitórias.
- Um robô (GitHub Actions) busca os dados na API pública do Cartola a cada 30 minutos, recalcula tudo e republica o arquivo `docs/data.json` quando algo muda. A página lê apenas esse arquivo.
- Durante os jogos, os confrontos da rodada em andamento mostram pontuações parciais (escalação congelada no fechamento do mercado, capitão valendo 1,5x, sem substituições automáticas de banco). A pontuação oficial e a classificação entram logo após o Cartola consolidar a rodada.

## Como marcar um pagamento de inscrição

1. Abra o arquivo `config.json` aqui no GitHub e clique no lápis (editar).
2. Localize o jogador e troque `"pago": false` por `"pago": true`.
3. Salve (commit direto na main). O robô roda sozinho e a página atualiza em 1 a 2 minutos.

## Como forçar uma atualização manual

Na aba Actions do repositório, abra o workflow "Atualiza dados da liga" e clique em "Run workflow". Pelo terminal, com o GitHub CLI:

```bash
gh workflow run update.yml
```

## Rodar localmente

```bash
node scripts/update.js
```

Gera `docs/data.json`. Para testar a página, sirva a pasta docs em um servidor local:

```bash
python -m http.server 8123 -d docs
```

Modo de validação (roda o motor sobre outro intervalo de rodadas e confere as somas contra o acumulado oficial da API, sem tocar nos dados do site):

```bash
node scripts/update.js --simular 1 19 --saida simulacao.json
```

## Gerar imagem de uma resenha para compartilhar

O script abaixo transforma qualquer resenha do Zé em um card vertical (1080px) pronto para mandar no WhatsApp:

```bash
python scripts/gerar-imagem-resenha.py <id-da-resenha> <arquivo.png> <data-exibida>
```

Exemplo: `python scripts/gerar-imagem-resenha.py rodada-23 rodada-23.png 18/08/2026`. Os ids ficam em `docs/resenhas.json` e as imagens saem na pasta `imagens/`, que não vai para o repositório. Precisa do Pillow instalado (`pip install pillow`).

## Estrutura

| Arquivo | Papel |
|---|---|
| `config.json` | Jogadores (time do Cartola, clube, pagamento) e regras da liga |
| `scripts/update.js` | Robô: busca API do Cartola, calcula confrontos e classificação |
| `docs/` | Site estático publicado no GitHub Pages |
| `docs/data.json` | Dados gerados pelo robô (não editar na mão) |
| `.github/workflows/update.yml` | Agendamento do robô |

## Observações

- O GitHub pausa agendamentos de repositórios sem atividade por 60 dias. Qualquer commit (por exemplo, marcar um pagamento) reativa. Se pausar, rode `gh workflow enable update.yml`.
- Dados obtidos da API pública do Cartola FC. Projeto sem vínculo com a Globo.
