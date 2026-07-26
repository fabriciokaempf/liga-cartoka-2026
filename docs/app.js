"use strict";

(function () {
  var DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

  function fmt1(n) {
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  function fmtDinheiro(n) {
    return "R$ " + n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
  }

  function el(tag, classe, texto) {
    var elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined && texto !== null) elemento.textContent = texto;
    return elemento;
  }

  function criarEscudo(url, abreviacao) {
    if (!url) return el("span", "escudo-texto", abreviacao || "?");
    var img = el("img", "escudo");
    img.src = url;
    img.alt = "";
    img.loading = "lazy";
    img.addEventListener("error", function () {
      var alternativa = el("span", "escudo-texto", abreviacao || "?");
      if (img.parentNode) img.parentNode.replaceChild(alternativa, img);
    });
    return img;
  }

  function fmtDataPartida(texto) {
    if (!texto || texto.length < 16) return "";
    var dd = texto.slice(8, 10);
    var mm = texto.slice(5, 7);
    var hora = texto.slice(11, 16);
    var dia = "";
    var data = new Date(texto.replace(" ", "T"));
    if (!isNaN(data.getTime())) dia = DIAS_SEMANA[data.getDay()] + " ";
    return dia + dd + "/" + mm + " · " + hora;
  }

  function statusDaRodada(dados) {
    if (dados.gameOver) return "Temporada encerrada · classificação final";
    if (dados.statusMercado === 1) return "Mercado aberto · rodada " + dados.rodadaAtual + " em breve";
    if (dados.bolaRolando) return "Rodada " + dados.rodadaAtual + " em andamento";
    return "Rodada " + dados.rodadaAtual + " · aguardando fechamento";
  }

  function montarClassificacao(dados, jogadoresPorId) {
    var corpo = document.querySelector("#tabela-classificacao tbody");
    dados.classificacao.forEach(function (linha) {
      var jogador = jogadoresPorId[linha.timeId];
      if (!jogador) return;
      var tr = document.createElement("tr");
      if (linha.pos === 1) tr.className = "linha-lider";
      else if (linha.pos >= 17 && linha.pos <= 19) tr.className = "linha-zona";
      else if (linha.pos === 20) tr.className = "linha-lanterna";
      else tr.className = "linha-meio";

      tr.appendChild(el("td", "celula-pos", linha.pos + "º"));

      var celulaTime = el("td", "celula-time");
      var conteudo = el("div", "time-conteudo");
      conteudo.appendChild(criarEscudo(jogador.clube.escudo, jogador.clube.abreviacao));
      conteudo.appendChild(el("span", "time-nome", jogador.nome));
      celulaTime.appendChild(conteudo);
      tr.appendChild(celulaTime);

      tr.appendChild(el("td", "celula-num", String(linha.pg)));
      tr.appendChild(el("td", "celula-num", String(linha.j)));
      tr.appendChild(el("td", "celula-num", String(linha.v)));
      tr.appendChild(el("td", "celula-num", String(linha.e)));
      tr.appendChild(el("td", "celula-num", String(linha.d)));
      tr.appendChild(el("td", "celula-turno", fmt1(linha.pgTurno)));
      corpo.appendChild(tr);
    });

    var partesPremio = dados.liga.premios.map(function (valor, indice) {
      return (indice + 1) + "º " + fmtDinheiro(valor);
    });
    document.getElementById("legenda-premiacao").textContent = "Premiação: " + partesPremio.join(" · ");
  }

  function montarConfrontos(dados, jogadoresPorId) {
    var rodadasPorNumero = {};
    dados.rodadas.forEach(function (rodada) {
      rodadasPorNumero[rodada.rodada] = rodada;
    });

    var selecionada = Math.min(Math.max(dados.rodadaAtual, dados.rodadaInicial), dados.rodadaFinal);
    var botaoAnterior = document.getElementById("botao-rodada-anterior");
    var botaoSeguinte = document.getElementById("botao-rodada-seguinte");

    function linhaDeTime(jogador, pontos, ehVencedor, houveEmpate, rodadaFechada) {
      var linha = el("div", "linha-time" + (ehVencedor ? " linha-vencedor" : ""));
      if (jogador) {
        linha.appendChild(criarEscudo(jogador.clube.escudo, jogador.clube.abreviacao));
        var nome = el("span", "time-nome");
        nome.appendChild(document.createTextNode(jogador.nome + " "));
        nome.appendChild(el("span", "time-clube", "(" + jogador.clube.nome + ")"));
        linha.appendChild(nome);
      } else {
        linha.appendChild(el("span", "time-nome", "Sem jogador"));
      }
      if (rodadaFechada) {
        linha.appendChild(el("span", "pontos", pontos === null ? "-" : fmt1(pontos)));
        if (ehVencedor) linha.appendChild(el("span", "selo selo-vitoria", "V"));
        if (houveEmpate) linha.appendChild(el("span", "selo selo-empate", "E"));
      }
      return linha;
    }

    function renderizar() {
      var rodada = rodadasPorNumero[selecionada];
      var rotulo = document.getElementById("rotulo-rodada");
      var aviso = document.getElementById("aviso-rodada");
      var lista = document.getElementById("lista-confrontos");
      lista.textContent = "";

      var situacao;
      if (!rodada) situacao = "";
      else if (rodada.fechada) situacao = "encerrada";
      else if (selecionada === dados.rodadaAtual) situacao = dados.bolaRolando ? "em andamento" : (dados.statusMercado === 1 ? "mercado aberto" : "aguardando fechamento");
      else situacao = "a disputar";
      rotulo.textContent = "Rodada " + selecionada + (situacao ? " · " + situacao : "");

      botaoAnterior.disabled = selecionada <= dados.rodadaInicial;
      botaoSeguinte.disabled = selecionada >= dados.rodadaFinal;

      if (!rodada || !rodada.confrontos || rodada.confrontos.length === 0) {
        aviso.textContent = "Os confrontos desta rodada ainda não foram divulgados.";
        return;
      }
      aviso.textContent = rodada.fechada ? "" : "As pontuações aparecem aqui depois que a rodada fecha no Cartola.";

      rodada.confrontos.forEach(function (confronto) {
        var casa = confronto.casaTimeId !== null ? jogadoresPorId[confronto.casaTimeId] : null;
        var fora = confronto.foraTimeId !== null ? jogadoresPorId[confronto.foraTimeId] : null;

        var cartao = el("div", "confronto");
        var cabecalho = el("div", "confronto-cabecalho");
        cabecalho.appendChild(el("span", null, fmtDataPartida(confronto.dataPartida)));
        if (confronto.placarCasa !== null && confronto.placarFora !== null) {
          cabecalho.appendChild(el("span", "confronto-placar-real", "Jogo: " + confronto.placarCasa + " x " + confronto.placarFora));
        }
        cartao.appendChild(cabecalho);

        var houveEmpate = confronto.resultado === "empate";
        cartao.appendChild(linhaDeTime(casa, confronto.pontosCasa, confronto.resultado === "casa", houveEmpate, rodada.fechada));
        cartao.appendChild(linhaDeTime(fora, confronto.pontosFora, confronto.resultado === "fora", houveEmpate, rodada.fechada));

        if (confronto.valida === false && confronto.placarCasa === null && confronto.placarFora === null) {
          cartao.appendChild(el("div", "nota-confronto", "Partida real adiada. O confronto vale pela pontuação da rodada."));
        }
        cartao.appendChild(cartaoNota(confronto, rodada));
        lista.appendChild(cartao);
      });
    }

    function cartaoNota(confronto, rodada) {
      var vazio = el("span");
      if (!rodada.fechada || confronto.resultado !== "empate") return vazio;
      var diferenca = Math.abs(confronto.pontosCasa - confronto.pontosFora);
      return el("div", "nota-confronto", "Empate: diferença de " + fmt1(diferenca) + " ponto(s), abaixo de " + fmt1(2) + ".");
    }

    botaoAnterior.addEventListener("click", function () {
      if (selecionada > dados.rodadaInicial) {
        selecionada -= 1;
        renderizar();
      }
    });
    botaoSeguinte.addEventListener("click", function () {
      if (selecionada < dados.rodadaFinal) {
        selecionada += 1;
        renderizar();
      }
    });

    renderizar();
  }

  function montarInscritos(dados) {
    var lista = document.getElementById("lista-inscritos");
    dados.jogadores.forEach(function (jogador) {
      var linha = el("div", "inscrito");
      linha.appendChild(criarEscudo(jogador.clube.escudo, jogador.clube.abreviacao));
      var nomes = el("div", "inscrito-nomes");
      nomes.appendChild(el("div", "inscrito-time", jogador.nome));
      var detalhe = jogador.clube.nome + (jogador.nomeCartola ? " · " + jogador.nomeCartola : "");
      nomes.appendChild(el("div", "inscrito-detalhe", detalhe));
      linha.appendChild(nomes);
      linha.appendChild(el("span", jogador.pago ? "chip chip-pago" : "chip chip-pendente", jogador.pago ? "Pago" : "Pendente"));
      lista.appendChild(linha);
    });
  }

  function montarRegras(dados) {
    var regras = [
      "Cada jogador tem um time no Cartola e representa um clube da Série A. Os confrontos de cada rodada seguem a tabela oficial do Brasileirão.",
      "Vence o confronto quem fizer mais pontos no Cartola na rodada. Vitória vale " + dados.liga.pontosVitoria + " pontos na liga.",
      "Empate quando a diferença entre os dois times na rodada for menor que " + fmt1(dados.liga.empateLimite) + " pontos. Cada um leva " + dados.liga.pontosEmpate + " ponto.",
      "Desempate na classificação: PG turno (soma das pontuações do Cartola no returno).",
      "Inscrição: " + fmtDinheiro(dados.liga.inscricao) + " por jogador."
    ];
    var lista = document.getElementById("lista-regras");
    regras.forEach(function (texto) {
      lista.appendChild(el("li", null, texto));
    });

    var tabela = el("table", "premiacao");
    dados.liga.premios.forEach(function (valor, indice) {
      var tr = document.createElement("tr");
      tr.appendChild(el("td", null, (indice + 1) + "º lugar"));
      tr.appendChild(el("td", null, fmtDinheiro(valor)));
      tabela.appendChild(tr);
    });
    document.getElementById("tabela-premiacao").appendChild(tabela);
  }

  function montarRodape(dados) {
    var quando = new Date(dados.geradoEm);
    var texto = "";
    if (!isNaN(quando.getTime())) {
      texto = "Atualizado em " + quando.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).replace(", ", " às ") + " (horário de Brasília)";
    }
    document.getElementById("rodape-atualizacao").textContent = texto;
  }

  function montar(dados) {
    var jogadoresPorId = {};
    dados.jogadores.forEach(function (jogador) {
      jogadoresPorId[jogador.timeId] = jogador;
    });

    document.getElementById("status-rodada").textContent = statusDaRodada(dados);
    montarClassificacao(dados, jogadoresPorId);
    montarConfrontos(dados, jogadoresPorId);
    montarInscritos(dados);
    montarRegras(dados);
    montarRodape(dados);

    document.getElementById("carregando").hidden = true;
    ["secao-classificacao", "secao-confrontos", "secao-inscritos", "secao-regras"].forEach(function (id) {
      document.getElementById(id).hidden = false;
    });
  }

  function carregar() {
    fetch("data.json?v=" + Date.now(), { cache: "no-store" })
      .then(function (resposta) {
        if (!resposta.ok) throw new Error("HTTP " + resposta.status);
        return resposta.json();
      })
      .then(montar)
      .catch(function () {
        document.getElementById("carregando").textContent = "Não foi possível carregar os dados da liga. Atualize a página em alguns instantes.";
      });
  }

  carregar();
})();
