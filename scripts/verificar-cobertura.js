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
const MINUTOS_ENTRE_ATUALIZACOES = 40;

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
  // PORTEIRO PRINCIPAL: a rodada esta mesmo acontecendo?
  // Mercado aberto (statusMercado 1) significa intervalo entre rodadas: os
  // jogos ainda estao a dias de distancia e nao ha nada novo pra contar.
  // ------------------------------------------------------------------
  const rodadaEmCurso = statusMercado === 2 || bolaRolando || jogosIniciados > 0 || temParciais;

  if (!rodadaEmCurso) {
    const proxima = proximaPartida(confrontos);
    return {
      modo: "C",
      motivo:
        "Mercado aberto (statusMercado=" +
        statusMercado +
        ") e nenhum jogo da rodada " +
        rodadaAtual +
        " comecou." +
        (proxima ? " O primeiro jogo e so em " + proxima + "." : "") +
        " Rodada de Cartola nao esta rolando: nada a publicar.",
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

    if (mesmoMercado && mesmoNumeroDeJogos) {
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
