"use strict";

/*
 * Robô da Liga Cartoka de pontos corridos 2026 (2º turno).
 *
 * Busca dados na API pública do Cartola FC e gera docs/data.json,
 * que é a única fonte de dados do site estático.
 *
 * Uso:
 *   node scripts/update.js
 *       Modo normal: atualiza docs/data.json com as rodadas fechadas
 *       do intervalo configurado em config.json (20 a 38).
 *
 *   node scripts/update.js --simular 1 19 [--saida simulacao.json]
 *       Modo de validação: roda o mesmo motor sobre outro intervalo de
 *       rodadas (por exemplo o 1º turno) e escreve em um arquivo separado,
 *       sem tocar em docs/data.json. Quando o intervalo começa na rodada 1,
 *       confere a soma de cada time contra o acumulado oficial da API.
 */

const fs = require("fs");
const path = require("path");

const RAIZ = path.join(__dirname, "..");
const ARQ_CONFIG = path.join(RAIZ, "config.json");
const ARQ_DADOS = path.join(RAIZ, "docs", "data.json");
const API = "https://api.cartola.globo.com";
const ESPERA_MS = 150;

function pausa(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function limparTexto(valor) {
  return typeof valor === "string" ? valor.trim() : valor;
}

function lerJson(arquivo) {
  return JSON.parse(fs.readFileSync(arquivo, "utf8"));
}

function lerJsonSeguro(arquivo) {
  try {
    return lerJson(arquivo);
  } catch (erro) {
    console.warn("Aviso: nao foi possivel ler " + arquivo + " (" + erro.message + "). Seguindo sem cache.");
    return null;
  }
}

async function buscarJson(caminho, opcoes = {}) {
  const { permitir404 = false, tentativas = 3 } = opcoes;
  let ultimoErro = null;
  for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
    try {
      const resposta = await fetch(API + caminho, {
        headers: {
          "User-Agent": "liga-cartoka-2026 (pagina estatica de liga entre amigos)",
          "Accept": "application/json"
        },
        signal: AbortSignal.timeout(15000)
      });
      if (permitir404 && resposta.status === 404) return null;
      if (!resposta.ok) throw new Error("HTTP " + resposta.status);
      return await resposta.json();
    } catch (erro) {
      ultimoErro = erro;
      if (tentativa < tentativas) await pausa(700 * tentativa);
    }
  }
  throw new Error("Falha ao buscar " + caminho + ": " + (ultimoErro ? ultimoErro.message : "erro desconhecido"));
}

function processarArgumentos(argv) {
  const args = { simular: null, saida: null };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--simular") {
      const ini = parseInt(argv[i + 1], 10);
      const fim = parseInt(argv[i + 2], 10);
      if (!Number.isInteger(ini) || !Number.isInteger(fim) || ini < 1 || fim > 38 || ini > fim) {
        throw new Error("Uso: --simular <rodadaInicial> <rodadaFinal> (entre 1 e 38)");
      }
      args.simular = { ini, fim };
      i += 2;
    } else if (arg === "--saida") {
      if (!argv[i + 1]) throw new Error("Informe o arquivo apos --saida");
      args.saida = argv[i + 1];
      i += 1;
    } else {
      throw new Error("Argumento desconhecido: " + arg);
    }
  }
  if (args.saida && !args.simular) {
    throw new Error("--saida so pode ser usado junto com --simular");
  }
  return args;
}

async function principal() {
  const args = processarArgumentos(process.argv);
  const config = lerJson(ARQ_CONFIG);
  const simulacao = args.simular !== null;
  const rodadaIni = simulacao ? args.simular.ini : config.liga.rodadaInicial;
  const rodadaFim = simulacao ? args.simular.fim : config.liga.rodadaFinal;
  const arqDestino = simulacao ? path.resolve(RAIZ, args.saida || "simulacao.json") : ARQ_DADOS;

  const anterior = !simulacao && fs.existsSync(ARQ_DADOS) ? lerJsonSeguro(ARQ_DADOS) : null;
  const cacheValido = Boolean(
    anterior &&
    anterior.temporada === config.temporada &&
    anterior.rodadaInicial === rodadaIni &&
    anterior.rodadaFinal === rodadaFim
  );

  console.log("Consultando situacao do mercado...");
  const status = await buscarJson("/mercado/status");
  if (status.temporada !== config.temporada) {
    throw new Error("Temporada da API (" + status.temporada + ") diferente da configurada (" + config.temporada + "). Abortando.");
  }
  const rodadaAtual = status.rodada_atual;
  const gameOver = status.game_over === true;
  const rodadaEstaFechada = (r) => r < rodadaAtual || gameOver;
  console.log("Temporada " + status.temporada + " | rodada atual: " + rodadaAtual + " | mercado: " + status.status_mercado + " | fim de temporada: " + (gameOver ? "sim" : "nao"));

  console.log("Resolvendo clubes...");
  await pausa(ESPERA_MS);
  const clubesApi = await buscarJson("/clubes");
  const clubesPorSlug = new Map();
  for (const clube of Object.values(clubesApi)) {
    if (clube && clube.slug) clubesPorSlug.set(clube.slug, clube);
  }

  const jogadores = config.jogadores.map((j) => {
    const clube = clubesPorSlug.get(j.clubeSlug);
    if (!clube) throw new Error("Clube nao encontrado na API para o slug: " + j.clubeSlug);
    const antigo = cacheValido && Array.isArray(anterior.jogadores)
      ? anterior.jogadores.find((x) => x.timeId === j.timeId)
      : null;
    return {
      timeId: j.timeId,
      nome: limparTexto((antigo && antigo.nome) || j.nome),
      nomeCartola: limparTexto((antigo && antigo.nomeCartola) || null),
      escudoTime: (antigo && antigo.escudoTime) || null,
      pago: j.pago === true,
      pagoEmRodada: typeof j.pagoEmRodada === "number" ? j.pagoEmRodada : null,
      clube: {
        id: clube.id,
        slug: j.clubeSlug,
        nome: j.clubeNome,
        abreviacao: clube.abreviacao || "",
        escudo: (clube.escudos && (clube.escudos["60x60"] || clube.escudos["45x45"] || clube.escudos["30x30"])) || null
      }
    };
  });

  const clubesUsados = new Set(jogadores.map((j) => j.clube.id));
  if (clubesUsados.size !== jogadores.length) {
    throw new Error("Ha clubes repetidos na configuracao dos jogadores.");
  }
  const jogadorPorClubeId = new Map(jogadores.map((j) => [j.clube.id, j]));

  // Cache incremental de pontuacoes: { "timeId": { "rodada": pontos } }
  const pontuacoes = {};
  if (cacheValido && anterior.pontuacoes) {
    for (const jogador of jogadores) {
      const doCache = anterior.pontuacoes[String(jogador.timeId)];
      if (!doCache) continue;
      for (const [chaveRodada, pontos] of Object.entries(doCache)) {
        const r = parseInt(chaveRodada, 10);
        if (r >= rodadaIni && r <= rodadaFim && typeof pontos === "number" && isFinite(pontos)) {
          if (!pontuacoes[String(jogador.timeId)]) pontuacoes[String(jogador.timeId)] = {};
          pontuacoes[String(jogador.timeId)][r] = pontos;
        }
      }
    }
  }

  const rodadasAnteriores = new Map();
  if (cacheValido && Array.isArray(anterior.rodadas)) {
    for (const rod of anterior.rodadas) rodadasAnteriores.set(rod.rodada, rod);
  }

  // Confrontos por rodada. Rodadas ja fechadas no cache ficam congeladas
  // (a tabela do Brasileirao nao muda depois que a rodada termina).
  // Rodadas futuras distantes sao reaproveitadas do cache e renovadas uma
  // vez por dia (na janela de 9h UTC), para o robo de 10 em 10 minutos nao
  // bombardear a API; a rodada atual e a seguinte sao renovadas sempre.
  const atualizacaoCompleta = simulacao || !cacheValido || new Date().getUTCHours() === 9;
  const fixtureRenovaSempre = (r) => r === rodadaAtual || r === rodadaAtual + 1;
  const temConfrontosNoCache = (registro) => registro && Array.isArray(registro.confrontos) && registro.confrontos.length > 0;

  const rodadas = [];
  for (let r = rodadaIni; r <= rodadaFim; r++) {
    const fechada = rodadaEstaFechada(r);
    const antesR = rodadasAnteriores.get(r);
    let confrontos = null;

    const reaproveitaAberta = !fechada && temConfrontosNoCache(antesR) && !atualizacaoCompleta && !fixtureRenovaSempre(r);
    if ((fechada && antesR && antesR.fechada === true && Array.isArray(antesR.confrontos) && antesR.confrontos.length > 0) || reaproveitaAberta) {
      confrontos = antesR.confrontos.map((c) => ({
        casaClubeId: c.casaClubeId,
        foraClubeId: c.foraClubeId,
        casaTimeId: typeof c.casaTimeId === "number" ? c.casaTimeId : null,
        foraTimeId: typeof c.foraTimeId === "number" ? c.foraTimeId : null,
        dataPartida: c.dataPartida || null,
        valida: c.valida !== false,
        placarCasa: typeof c.placarCasa === "number" ? c.placarCasa : null,
        placarFora: typeof c.placarFora === "number" ? c.placarFora : null
      }));
    } else {
      await pausa(ESPERA_MS);
      console.log("Buscando partidas da rodada " + r + "...");
      const dados = await buscarJson("/partidas/" + r);
      const partidas = dados && Array.isArray(dados.partidas) ? dados.partidas : [];
      confrontos = partidas.map((p) => {
        const casa = jogadorPorClubeId.get(p.clube_casa_id) || null;
        const fora = jogadorPorClubeId.get(p.clube_visitante_id) || null;
        return {
          casaClubeId: p.clube_casa_id,
          foraClubeId: p.clube_visitante_id,
          casaTimeId: casa ? casa.timeId : null,
          foraTimeId: fora ? fora.timeId : null,
          dataPartida: p.partida_data || null,
          valida: p.valida !== false,
          placarCasa: Number.isFinite(p.placar_oficial_mandante) ? p.placar_oficial_mandante : null,
          placarFora: Number.isFinite(p.placar_oficial_visitante) ? p.placar_oficial_visitante : null
        };
      });
      if (confrontos.length !== 10) {
        console.warn("Aviso: rodada " + r + " retornou " + confrontos.length + " partidas (esperado: 10).");
      }
      for (const c of confrontos) {
        if (c.casaTimeId === null || c.foraTimeId === null) {
          console.warn("Aviso: rodada " + r + " tem clube sem jogador atribuido (clubes " + c.casaClubeId + " x " + c.foraClubeId + ").");
        }
      }
    }
    rodadas.push({ rodada: r, fechada, confrontos });
  }

  // Pontuacoes das rodadas fechadas que ainda nao estao no cache.
  const numerosRodadasFechadas = rodadas.filter((rod) => rod.fechada).map((rod) => rod.rodada);
  for (const r of numerosRodadasFechadas) {
    for (const jogador of jogadores) {
      const chave = String(jogador.timeId);
      if (pontuacoes[chave] && typeof pontuacoes[chave][r] === "number") continue;
      await pausa(ESPERA_MS);
      console.log("Pontuacao da rodada " + r + ": " + jogador.nome + "...");
      const resposta = await buscarJson("/time/id/" + jogador.timeId + "/" + r, { permitir404: true });
      let pontos = 0;
      if (resposta && typeof resposta.pontos === "number" && isFinite(resposta.pontos)) {
        pontos = resposta.pontos;
      } else {
        console.warn("Aviso: sem pontuacao de " + jogador.nome + " na rodada " + r + " (registrado 0,0).");
      }
      if (!pontuacoes[chave]) pontuacoes[chave] = {};
      pontuacoes[chave][r] = round2(pontos);
      if (resposta && resposta.time) {
        if (resposta.time.nome) jogador.nome = limparTexto(resposta.time.nome);
        if (resposta.time.nome_cartola) jogador.nomeCartola = limparTexto(resposta.time.nome_cartola);
        if (resposta.time.url_escudo_png) jogador.escudoTime = resposta.time.url_escudo_png;
      }
    }
  }

  // Preenche nome do cartoleiro e escudo de quem ainda nao apareceu em
  // nenhuma rodada fechada (primeira execucao da temporada, por exemplo).
  for (const jogador of jogadores) {
    if (jogador.nomeCartola) continue;
    await pausa(ESPERA_MS);
    console.log("Buscando dados do time " + jogador.nome + "...");
    const resposta = await buscarJson("/time/id/" + jogador.timeId, { permitir404: true });
    if (resposta && resposta.time) {
      if (resposta.time.nome) jogador.nome = limparTexto(resposta.time.nome);
      if (resposta.time.nome_cartola) jogador.nomeCartola = limparTexto(resposta.time.nome_cartola);
      if (resposta.time.url_escudo_png) jogador.escudoTime = resposta.time.url_escudo_png;
    } else {
      console.warn("Aviso: nao foi possivel obter os dados do time " + jogador.timeId + ".");
    }
  }

  const lerPontuacao = (timeId, r) => {
    const porTime = pontuacoes[String(timeId)];
    return porTime && typeof porTime[r] === "number" ? porTime[r] : null;
  };

  // Parciais ao vivo da rodada em andamento: escalacoes congeladas no
  // fechamento do mercado (buscadas uma unica vez por rodada e mantidas em
  // cache) somadas com /atletas/pontuados. Capitao vale 1,5x (validado
  // contra a pontuacao oficial das 20 equipes na rodada 20).
  //
  // Substituicao automatica de banco: quando um titular nao pontua e a
  // partida do clube dele ja acabou (ou nao vale para a rodada, caso de
  // jogo antecipado antes do fechamento do mercado), entra o reserva da
  // mesma posicao que pontuou, cada reserva valendo uma vez so. Enquanto a
  // partida do titular nao terminou o slot fica em aberto, porque ele ainda
  // pode entrar em campo. Reserva que substitui capitao nao leva o 1,5x.
  const MULTIPLICADOR_CAPITAO = 1.5;
  let escalacoes = null;
  let parciais = null;

  if (!simulacao && !gameOver && status.status_mercado === 2) {
    escalacoes = (cacheValido && anterior.escalacoes && anterior.escalacoes.rodada === rodadaAtual && anterior.escalacoes.times)
      ? anterior.escalacoes
      : { rodada: rodadaAtual, times: {} };

    for (const jogador of jogadores) {
      const chave = String(jogador.timeId);
      // Entradas antigas do cache nao tem titulares/reservas: refaz a busca
      // para que a substituicao automatica funcione tambem nelas.
      if (escalacoes.times[chave] && Array.isArray(escalacoes.times[chave].reservas)) continue;
      await pausa(ESPERA_MS);
      console.log("Escalacao da rodada " + rodadaAtual + ": " + jogador.nome + "...");
      const resposta = await buscarJson("/time/id/" + jogador.timeId, { permitir404: true });
      if (resposta && Array.isArray(resposta.atletas) && resposta.atletas.length > 0) {
        const mapear = (lista) => (Array.isArray(lista) ? lista : [])
          .filter((a) => a && typeof a.atleta_id === "number")
          .map((a) => ({
            id: a.atleta_id,
            clubeId: typeof a.clube_id === "number" ? a.clube_id : null,
            posicaoId: typeof a.posicao_id === "number" ? a.posicao_id : null
          }));
        const titulares = mapear(resposta.atletas);
        escalacoes.times[chave] = {
          atletas: titulares.map((a) => a.id),
          titulares,
          reservas: mapear(resposta.reservas),
          capitaoId: typeof resposta.capitao_id === "number" ? resposta.capitao_id : null
        };
      } else {
        escalacoes.times[chave] = { atletas: [], titulares: [], reservas: [], capitaoId: null };
        console.warn("Aviso: " + jogador.nome + " sem escalacao na rodada " + rodadaAtual + ".");
      }
    }

    await pausa(ESPERA_MS);
    const pontuados = await buscarJson("/atletas/pontuados", { permitir404: true });
    if (pontuados && pontuados.rodada === rodadaAtual && pontuados.atletas && Object.keys(pontuados.atletas).length > 0) {
      // Situacao da partida de cada clube nesta rodada, para saber se um
      // titular que nao pontuou ainda pode entrar em campo ou se o slot ja
      // esta fechado e cabe substituicao.
      const situacaoClube = new Map();
      const rodadaEmCurso = rodadas.find((r) => r.rodada === rodadaAtual);
      if (rodadaEmCurso) {
        for (const c of rodadaEmCurso.confrontos) {
          const encerrada = typeof c.placarCasa === "number" && typeof c.placarFora === "number";
          const situacao = { valida: c.valida !== false, encerrada };
          situacaoClube.set(c.casaClubeId, situacao);
          situacaoClube.set(c.foraClubeId, situacao);
        }
      }
      const slotFechado = (clubeId) => {
        const s = situacaoClube.get(clubeId);
        if (!s) return false;
        return s.valida === false || s.encerrada === true;
      };
      const pontuacaoDe = (atletaId) => {
        const a = pontuados.atletas[String(atletaId)];
        return a && typeof a.pontuacao === "number" && isFinite(a.pontuacao) ? a.pontuacao : null;
      };

      const porTime = {};
      for (const jogador of jogadores) {
        const escalacao = escalacoes.times[String(jogador.timeId)];
        const titulares = Array.isArray(escalacao.titulares) && escalacao.titulares.length > 0
          ? escalacao.titulares
          : (escalacao.atletas || []).map((id) => ({ id, clubeId: null, posicaoId: null }));
        const reservas = Array.isArray(escalacao.reservas) ? escalacao.reservas : [];
        const reservasUsadas = new Set();
        let total = 0;

        for (const titular of titulares) {
          const pontos = pontuacaoDe(titular.id);
          if (pontos !== null) {
            total += titular.id === escalacao.capitaoId ? pontos * MULTIPLICADOR_CAPITAO : pontos;
            continue;
          }
          // Titular sem pontuacao: so vale substituir quando a partida do
          // clube dele acabou ou nao conta para a rodada.
          if (titular.posicaoId === null || !slotFechado(titular.clubeId)) continue;
          const reserva = reservas.find((r) =>
            r.posicaoId === titular.posicaoId &&
            !reservasUsadas.has(r.id) &&
            pontuacaoDe(r.id) !== null
          );
          if (!reserva) continue;
          reservasUsadas.add(reserva.id);
          total += pontuacaoDe(reserva.id);
        }

        porTime[String(jogador.timeId)] = round2(total);
      }
      parciais = {
        rodada: rodadaAtual,
        atualizadoEm: new Date().toISOString(),
        porTime
      };
      console.log("Parciais da rodada " + rodadaAtual + " calculadas para " + Object.keys(porTime).length + " times.");
    } else {
      console.log("Sem parciais no momento (jogos da rodada " + rodadaAtual + " ainda nao comecaram).");
    }
  }

  // Resultados dos confrontos e classificacao (sempre recalculados do zero,
  // assim qualquer correcao de regra vale tambem para rodadas antigas).
  const estatisticas = new Map(jogadores.map((j) => [j.timeId, { pg: 0, j: 0, v: 0, e: 0, d: 0, pgTurno: 0 }]));
  const limiteEmpate = config.liga.empateLimite;

  for (const rod of rodadas) {
    if (!rod.fechada) {
      for (const c of rod.confrontos) {
        c.pontosCasa = null;
        c.pontosFora = null;
        c.resultado = null;
      }
      continue;
    }
    for (const c of rod.confrontos) {
      const pontosCasa = c.casaTimeId !== null ? lerPontuacao(c.casaTimeId, rod.rodada) : null;
      const pontosFora = c.foraTimeId !== null ? lerPontuacao(c.foraTimeId, rod.rodada) : null;
      c.pontosCasa = pontosCasa;
      c.pontosFora = pontosFora;
      if (pontosCasa === null || pontosFora === null) {
        c.resultado = null;
        continue;
      }
      const diferenca = round2(Math.abs(pontosCasa - pontosFora));
      if (diferenca < limiteEmpate) {
        c.resultado = "empate";
      } else {
        c.resultado = pontosCasa > pontosFora ? "casa" : "fora";
      }
      const estCasa = estatisticas.get(c.casaTimeId);
      const estFora = estatisticas.get(c.foraTimeId);
      estCasa.j += 1;
      estFora.j += 1;
      if (c.resultado === "empate") {
        estCasa.e += 1;
        estFora.e += 1;
        estCasa.pg += config.liga.pontosEmpate;
        estFora.pg += config.liga.pontosEmpate;
      } else if (c.resultado === "casa") {
        estCasa.v += 1;
        estCasa.pg += config.liga.pontosVitoria;
        estFora.d += 1;
      } else {
        estFora.v += 1;
        estFora.pg += config.liga.pontosVitoria;
        estCasa.d += 1;
      }
    }
    for (const jogador of jogadores) {
      const pontos = lerPontuacao(jogador.timeId, rod.rodada);
      if (pontos !== null) estatisticas.get(jogador.timeId).pgTurno += pontos;
    }
  }

  // Penalidade por inscricao em atraso: a partir da rodada definida em
  // config.liga.penalidade, cada rodada fechada disputada com a inscricao
  // pendente desconta pontos na tabela. Quem pagou para de acumular a
  // partir da rodada informada em pagoEmRodada, mas nao recupera o que
  // ja perdeu. Quem quitou dentro do prazo nunca entra nessa conta.
  const regraPenalidade = config.liga.penalidade || null;
  // Times dispensados do desconto de pontos por decisao da organizacao.
  // A marca fica so no config, nunca vai para o data.json publico.
  const semPenalidade = new Set(
    config.jogadores.filter((j) => j.semPenalidade === true).map((j) => j.timeId)
  );
  const penalidadePorTime = new Map();
  for (const jogador of jogadores) {
    let rodadasPendente = 0;
    if (regraPenalidade && regraPenalidade.rodadaInicioDesconto && !semPenalidade.has(jogador.timeId)) {
      for (const r of numerosRodadasFechadas) {
        if (r < regraPenalidade.rodadaInicioDesconto) continue;
        const pendenteNaRodada = !jogador.pago ||
          (typeof jogador.pagoEmRodada === "number" && jogador.pagoEmRodada > r);
        if (pendenteNaRodada) rodadasPendente += 1;
      }
    }
    const pontos = regraPenalidade ? (regraPenalidade.pontosPorRodada || 0) : 0;
    penalidadePorTime.set(jogador.timeId, rodadasPendente * pontos);
  }

  const classificacao = jogadores
    .map((jogador) => {
      const est = estatisticas.get(jogador.timeId);
      const penalidade = penalidadePorTime.get(jogador.timeId) || 0;
      return {
        timeId: jogador.timeId,
        pg: est.pg - penalidade,
        pgBruto: est.pg,
        penalidade,
        j: est.j,
        v: est.v,
        e: est.e,
        d: est.d,
        pgTurno: round2(est.pgTurno)
      };
    })
    .sort((a, b) => {
      if (b.pg !== a.pg) return b.pg - a.pg;
      if (b.pgTurno !== a.pgTurno) return b.pgTurno - a.pgTurno;
      if (b.v !== a.v) return b.v - a.v;
      const nomeA = jogadores.find((x) => x.timeId === a.timeId).nome;
      const nomeB = jogadores.find((x) => x.timeId === b.timeId).nome;
      return nomeA.localeCompare(nomeB, "pt-BR", { sensitivity: "base" });
    })
    .map((linha, indice) => ({ pos: indice + 1, ...linha }));

  const saida = {
    geradoEm: new Date().toISOString(),
    temporada: config.temporada,
    liga: {
      nome: config.liga.nome,
      turno: config.liga.turno,
      inscricao: config.liga.inscricao,
      prazoPagamento: config.liga.prazoPagamento || null,
      penalidade: config.liga.penalidade || null,
      premios: config.liga.premios,
      pontosVitoria: config.liga.pontosVitoria,
      pontosEmpate: config.liga.pontosEmpate,
      empateLimite: config.liga.empateLimite
    },
    rodadaInicial: rodadaIni,
    rodadaFinal: rodadaFim,
    rodadaAtual,
    statusMercado: status.status_mercado,
    bolaRolando: status.bola_rolando === true,
    gameOver,
    ultimaRodadaFechada: numerosRodadasFechadas.length > 0 ? Math.max(...numerosRodadasFechadas) : null,
    jogadores,
    escalacoes,
    parciais,
    pontuacoes,
    rodadas,
    classificacao
  };

  // Conferencia do modo de simulacao: soma das rodadas contra o acumulado
  // oficial da API (so faz sentido quando o intervalo comeca na rodada 1).
  if (simulacao && rodadaIni === 1) {
    console.log("");
    console.log("Conferencia contra o acumulado oficial da API na rodada " + rodadaFim + ":");
    let divergencias = 0;
    for (const jogador of jogadores) {
      await pausa(ESPERA_MS);
      const resposta = await buscarJson("/time/id/" + jogador.timeId + "/" + rodadaFim, { permitir404: true });
      const oficial = resposta && typeof resposta.pontos_campeonato === "number" ? round2(resposta.pontos_campeonato) : null;
      const soma = round2(estatisticas.get(jogador.timeId).pgTurno);
      let situacao;
      if (oficial === null) {
        situacao = "sem dado oficial";
      } else if (Math.abs(oficial - soma) <= 0.2) {
        situacao = "OK";
      } else {
        situacao = "DIVERGE (oficial " + oficial + ")";
        divergencias += 1;
      }
      console.log("  " + jogador.nome + ": soma " + soma + " | " + situacao);
    }
    console.log(divergencias === 0 ? "Conferencia concluida sem divergencias." : "Conferencia com " + divergencias + " divergencia(s)!");
  }

  // So reescreve quando o conteudo realmente mudou (ignorando os carimbos
  // de horario), para o workflow nao gerar commits vazios.
  const semCarimbos = (objeto) => JSON.stringify({
    ...objeto,
    geradoEm: null,
    parciais: objeto.parciais ? { ...objeto.parciais, atualizadoEm: null } : null
  });
  if (!simulacao && anterior) {
    if (semCarimbos(saida) === semCarimbos(anterior)) {
      console.log("Sem mudancas nos dados. Arquivo mantido como esta.");
      return;
    }
  }

  fs.mkdirSync(path.dirname(arqDestino), { recursive: true });
  const arquivoTemporario = arqDestino + ".tmp";
  fs.writeFileSync(arquivoTemporario, JSON.stringify(saida, null, 2) + "\n", "utf8");
  fs.renameSync(arquivoTemporario, arqDestino);
  console.log("Arquivo gerado: " + arqDestino);
}

principal().catch((erro) => {
  console.error("ERRO: " + (erro && erro.message ? erro.message : erro));
  process.exit(1);
});
