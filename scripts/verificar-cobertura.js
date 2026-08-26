#!/usr/bin/env node
/**
 * Decide se o Ze Resenha deve publicar alguma coisa agora.
 *
 * A sessao agendada roda com frequencia fixa, mas rodada de Cartola so acontece
 * em alguns dias da semana. Este script e o porteiro: le docs/data.json e
 * docs/resenhas.json e responde MODO A (fechamento), MODO B (ao vivo) ou
 * MODO C (nada a fazer), sem depender do calendario do agendamento externo.
 *
 * Uso: node scripts/verificar-cobertura.js
 * Saida: bloco de texto com MODO, MOTIVO e dados de apoio.
 * Codigo de saida: 0 sempre (a decisao vai no texto, nao no exit code).
 */

const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "..");
const CAMINHO_DADOS = path.join(RAIZ, "docs", "data.json");
const CAMINHO_RESENHAS = path.join(RAIZ, "docs", "resenhas.json");

// Intervalo minimo entre duas atualizacoes ao vivo da MESMA rodada quando o
// unico que mudou foram as parciais. Se um jogo novo comecou, republica na hora.
const MINUTOS_ENTRE_ATUALIZACOES = 90;

// Movimento minimo nas parciais (soma dos deltas absolutos de todos os times,
// em pontos) para considerar que houve noticia nova. Oscilacao de meio ponto
// aqui e ali nao rende resenha.
const MOVIMENTO_MINIMO_PARCIAIS = 30;

function lerJson(caminho, padrao) {
  try {
    return JSON.parse(fs.readFileSync(caminho, "utf8"));
  } catch (erro) {
    if (padrao !== undefined) return padrao;
    throw erro;
  }
}

function decidir() {
  const dados = lerJson(CAMINHO_DADOS);
  const resenhas = lerJson(CAMINHO_RESENHAS, []);
  const lista = Array.isArray(resenhas) ? resenhas : [];

  const rodadaAtual = dados.rodadaAtual;
  const ultimaFechada = dados.ultimaRodadaFechada;
  const statusMercado = dados.statusMercado;
  const bolaRolando = dados.bolaRolando === true;
  const gameOver = dados.gameOver === true;

  // ------------------------------------------------------------------
  // MODO A: fechamento pendente. Tem prioridade e nunca e bloqueado.
  // ------------------------------------------------------------------
  if (ultimaFechada !== null && ultimaFechada !== undefined) {
    const jaEscrita = lista.some((item) => item.id === "rodada-" + ultimaFechada);
    if (!jaEscrita) {
      return {
        modo: "A",
        rodada: ultimaFechada,
        motivo:
          "A rodada " +
          ultimaFechada +
          " esta fechada e ainda nao tem resenha de fechamento no array.",
        temAndamento: lista.some((item) => item.id === "andamento-rodada-" + ultimaFechada),
      };
    }
  }

  if (gameOver) {
    return { modo: "C", motivo: "Temporada encerrada (gameOver=true)." };
  }

  const rodada = (dados.rodadas || []).find((r) => r.rodada === rodadaAtual);
  if (!rodada) {
    return {
      modo: "C",
      motivo: "Nao encontrei a rodada atual (" + rodadaAtual + ") em rodadas[].",
    };
  }
  if (rodada.fechada) {
    return {
      modo: "C",
      motivo: "A rodada atual (" + rodadaAtual + ") ja esta fechada e a resenha dela ja existe.",
    };
  }

  const confrontos = rodada.confrontos || [];
  const jogosIniciados = confrontos.filter((c) => c.placarCasa !== null).length;
  const parciais = dados.parciais;
  const temParciais = !!(parciais && parciais.porTime && Object.keys(parciais.porTime).length > 0);

  // ------------------------------------------------------------------
  // PORTEIRO PRINCIPAL: ja tem bola rolando de verdade?
  // Mercado fechado nao basta: o mercado fecha horas antes do primeiro jogo e
  // nesse intervalo nao aconteceu nada que renda cobertura. So conta como
  // rodada em curso quando algum confronto ja comecou OU quando ja existe
  // parcial (no Cartola um time pontua pelos atletas escalados, entao pode
  // pontuar antes do jogo real do confronto dele).
  // ------------------------------------------------------------------
  const rodadaEmCurso = jogosIniciados > 0 || temParciais;

  if (!rodadaEmCurso) {
    const proxima = proximaPartida(confrontos);
    return {
      modo: "C",
      motivo:
        "Nenhum jogo da rodada " +
        rodadaAtual +
        " comecou e nao ha parciais (statusMercado=" +
        statusMercado +
        ", bolaRolando=" +
        bolaRolando +
        ")." +
        (proxima ? " O primeiro jogo e em " + proxima + "." : "") +
        " Sem bola rolando nao ha o que noticiar: nada a publicar.",
    };
  }

  // ------------------------------------------------------------------
  // MODO B: rodada rolando. So republica se algo mudou de verdade.
  // ------------------------------------------------------------------
  const anterior = lista.find((item) => item.id === "andamento-rodada-" + rodadaAtual);
  const estadoAtual = {
    mercado: statusMercado,
    jogosIniciados: jogosIniciados,
    assinaturaParciais: assinar(parciais),
  };

  if (anterior && anterior.estado) {
    const mesmoMercado = anterior.estado.mercado === estadoAtual.mercado;
    const mesmoNumeroDeJogos = anterior.estado.jogosIniciados === estadoAtual.jogosIniciados;
    const mesmasParciais = anterior.estado.assinaturaParciais === estadoAtual.assinaturaParciais;

    // Mercado fechando e noticia por si so: e a vespera virando dia de jogo.
    if (mesmoMercado && mesmoNumeroDeJogos && mesmasParciais) {
      return {
        modo: "C",
        motivo:
          "A cobertura ao vivo da rodada " +
          rodadaAtual +
          " ja esta publicada e nada mudou desde entao (" +
          jogosIniciados +
          " jogos iniciados, parciais identicas).",
      };
    }

    // Nenhum jogo novo comecou: a unica novidade possivel sao as parciais, e ai
    // exigimos as duas coisas, movimento relevante E intervalo minimo.
    if (mesmoMercado && mesmoNumeroDeJogos) {
      const movimento = movimentoParciais(anterior.estado.assinaturaParciais, estadoAtual.assinaturaParciais);

      if (movimento < MOVIMENTO_MINIMO_PARCIAIS) {
        return {
          modo: "C",
          motivo:
            "A cobertura ao vivo da rodada " +
            rodadaAtual +
            " ja esta publicada, nenhum jogo novo comecou e as parciais mexeram so " +
            movimento.toFixed(1) +
            " pontos somados na liga inteira (minimo de " +
            MOVIMENTO_MINIMO_PARCIAIS +
            "). Nao ha noticia nova.",
        };
      }

      const minutos = minutosDesde(anterior.geradaEm);
      if (minutos !== null && minutos < MINUTOS_ENTRE_ATUALIZACOES) {
        return {
          modo: "C",
          motivo:
            "A cobertura ao vivo da rodada " +
            rodadaAtual +
            " foi atualizada ha " +
            minutos +
            " minutos e nenhum jogo novo comecou. Minimo de " +
            MINUTOS_ENTRE_ATUALIZACOES +
            " minutos entre atualizacoes so por variacao de parciais.",
        };
      }
    }
  }

  return {
    modo: "B",
    rodada: rodadaAtual,
    motivo: !anterior
      ? "Rodada " + rodadaAtual + " em curso e ainda nao ha cobertura ao vivo publicada."
      : anterior.estado
        ? "Rodada " + rodadaAtual + " em curso e houve mudanca desde a ultima cobertura ao vivo."
        : "Rodada " +
          rodadaAtual +
          " em curso e a cobertura ao vivo publicada nao tem marcador de estado para comparar.",
    estagio: estagio(jogosIniciados),
    jogosIniciados: jogosIniciados,
    jogosRestantes: confrontos.length - jogosIniciados,
    estado: estadoAtual,
  };
}

function estagio(jogosIniciados) {
  if (jogosIniciados <= 1) return "ESQUENTA";
  if (jogosIniciados <= 6) return "ANDAMENTO";
  return "RETA FINAL";
}

function assinar(parciais) {
  if (!parciais || !parciais.porTime) return "sem-parciais";
  return Object.keys(parciais.porTime)
    .sort()
    .map((timeId) => timeId + ":" + Number(parciais.porTime[timeId]).toFixed(1))
    .join("|");
}

// Soma dos deltas absolutos entre duas assinaturas de parciais, em pontos.
// Time que aparece so de um lado conta o valor cheio.
function movimentoParciais(antes, depois) {
  const mapaAntes = desassinar(antes);
  const mapaDepois = desassinar(depois);
  const times = new Set([...Object.keys(mapaAntes), ...Object.keys(mapaDepois)]);
  let total = 0;
  times.forEach((timeId) => {
    total += Math.abs((mapaDepois[timeId] || 0) - (mapaAntes[timeId] || 0));
  });
  return total;
}

function desassinar(assinatura) {
  const mapa = {};
  if (!assinatura || assinatura === "sem-parciais") return mapa;
  assinatura.split("|").forEach((par) => {
    const [timeId, valor] = par.split(":");
    if (timeId && valor !== undefined) mapa[timeId] = Number(valor) || 0;
  });
  return mapa;
}

function minutosDesde(iso) {
  if (!iso) return null;
  const quando = Date.parse(iso);
  if (Number.isNaN(quando)) return null;
  return Math.round((Date.now() - quando) / 60000);
}

function proximaPartida(confrontos) {
  const datas = confrontos.map((c) => c.dataPartida).filter(Boolean).sort();
  return datas.length > 0 ? datas[0] : null;
}

const decisao = decidir();

console.log("MODO: " + decisao.modo);
console.log("MOTIVO: " + decisao.motivo);
if (decisao.rodada !== undefined) console.log("RODADA: " + decisao.rodada);
if (decisao.estagio) console.log("ESTAGIO: " + decisao.estagio);
if (decisao.jogosIniciados !== undefined) {
  console.log("JOGOS INICIADOS: " + decisao.jogosIniciados);
  console.log("JOGOS RESTANTES: " + decisao.jogosRestantes);
}
if (decisao.temAndamento) {
  console.log("ATENCAO: existe andamento-rodada-" + decisao.rodada + " para consumir e remover.");
}
if (decisao.estado) {
  console.log("ESTADO (copie para o campo estado do item de andamento):");
  console.log(JSON.stringify(decisao.estado));
}
if (decisao.modo === "C") {
  console.log("ACAO: encerrar sem alterar arquivos, sem commit e sem notificacao.");
}
