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

  function fmtPrazo(texto) {
    if (!texto || texto.length < 10) return "";
    return texto.slice(8, 10) + "/" + texto.slice(5, 7);
  }

  function fmtHora(iso) {
    var data = new Date(iso);
    if (isNaN(data.getTime())) return "";
    return data.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" });
  }

  function statusDaRodada(dados) {
    if (dados.gameOver) return "Temporada encerrada · classificação final";
    if (dados.statusMercado === 1) return "Mercado aberto · rodada " + dados.rodadaAtual + " em breve";
    if (dados.bolaRolando) {
      return dados.parciais ? "Rodada " + dados.rodadaAtual + " em andamento · parciais ao vivo" : "Rodada " + dados.rodadaAtual + " em andamento";
    }
    return "Rodada " + dados.rodadaAtual + " · aguardando fechamento";
  }

  function montarHero(dados) {
    document.getElementById("status-rodada").textContent = statusDaRodada(dados);
    document.getElementById("chip-rodadas").textContent = "🗓️ Rodadas " + dados.rodadaInicial + " a " + dados.rodadaFinal;
    document.getElementById("chip-times").textContent = "👥 " + dados.jogadores.length + " times";
    var total = dados.liga.premios.reduce(function (soma, valor) { return soma + valor; }, 0);
    document.getElementById("chip-premio").textContent = "💰 " + fmtDinheiro(total) + " em prêmios";
  }

  function classeDaPosicao(pos, totalPremios) {
    if (pos === 1) return "zona-ouro";
    if (pos <= totalPremios) return "zona-premio";
    if (pos === 20) return "zona-lanterna";
    if (pos >= 17) return "zona-risco";
    return "zona-neutra";
  }

  function montarClassificacao(dados, jogadoresPorId) {
    var corpo = document.querySelector("#tabela-classificacao tbody");
    var totalPremios = dados.liga.premios.length;

    dados.classificacao.forEach(function (linha) {
      var jogador = jogadoresPorId[linha.timeId];
      if (!jogador) return;
      var tr = document.createElement("tr");
      tr.className = classeDaPosicao(linha.pos, totalPremios);

      var celulaPos = el("td", "celula-pos");
      celulaPos.appendChild(el("span", "badge-pos", String(linha.pos)));
      tr.appendChild(celulaPos);

      var celulaTime = el("td", "celula-time");
      var conteudo = el("div", "time-conteudo");
      conteudo.appendChild(criarEscudo(jogador.clube.escudo, jogador.clube.abreviacao));
      conteudo.appendChild(el("span", "time-nome", jogador.nome));
      celulaTime.appendChild(conteudo);
      tr.appendChild(celulaTime);

      tr.appendChild(el("td", "celula-pg", String(linha.pg)));
      tr.appendChild(el("td", "celula-num", String(linha.j)));
      tr.appendChild(el("td", "celula-num", String(linha.v)));
      tr.appendChild(el("td", "celula-num", String(linha.e)));
      tr.appendChild(el("td", "celula-num", String(linha.d)));
      tr.appendChild(el("td", "celula-turno", fmt1(linha.pgTurno)));
      corpo.appendChild(tr);
    });

    var legenda = document.getElementById("legenda-zonas");
    var itens = [
      ["ponto-ouro", "1º · campeão"],
      ["ponto-premio", "1º a " + totalPremios + "º · zona de premiação"],
      ["ponto-risco", "17º a 19º"],
      ["ponto-lanterna", "20º · lanterna"]
    ];
    itens.forEach(function (par) {
      var item = el("span", "legenda-item");
      item.appendChild(el("span", "ponto " + par[0]));
      item.appendChild(el("span", null, par[1]));
      legenda.appendChild(item);
    });
  }

  function montarConfrontos(dados, jogadoresPorId) {
    var rodadasPorNumero = {};
    dados.rodadas.forEach(function (rodada) {
      rodadasPorNumero[rodada.rodada] = rodada;
    });

    var parciaisRodada = dados.parciais && typeof dados.parciais.rodada === "number" ? dados.parciais.rodada : null;
    var rodadaPadrao = parciaisRodada || dados.ultimaRodadaFechada || dados.rodadaAtual;
    var selecionada = Math.min(Math.max(rodadaPadrao, dados.rodadaInicial), dados.rodadaFinal);
    var botaoAnterior = document.getElementById("botao-rodada-anterior");
    var botaoSeguinte = document.getElementById("botao-rodada-seguinte");

    function lerParcial(timeId) {
      if (!dados.parciais || timeId === null) return null;
      var valor = dados.parciais.porTime[String(timeId)];
      return typeof valor === "number" ? valor : null;
    }

    function linhaDeTime(jogador, pontos, ehVencedor, houveEmpate, modo) {
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
      if (modo === "fechada") {
        linha.appendChild(el("span", "pontos", pontos === null ? "-" : fmt1(pontos)));
        if (ehVencedor) linha.appendChild(el("span", "selo selo-vitoria", "V"));
        if (houveEmpate) linha.appendChild(el("span", "selo selo-empate", "E"));
      } else if (modo === "parcial") {
        linha.appendChild(el("span", "pontos pontos-parcial", pontos === null ? "-" : fmt1(pontos)));
      }
      return linha;
    }

    function renderizar() {
      var rodada = rodadasPorNumero[selecionada];
      var rotulo = document.getElementById("rotulo-rodada");
      var aviso = document.getElementById("aviso-rodada");
      var lista = document.getElementById("lista-confrontos");
      lista.textContent = "";

      var parciaisAtivas = Boolean(rodada && !rodada.fechada && parciaisRodada === selecionada);

      var situacao;
      if (!rodada) situacao = "";
      else if (rodada.fechada) situacao = "encerrada";
      else if (selecionada === dados.rodadaAtual) situacao = dados.bolaRolando ? (parciaisAtivas ? "em andamento · parcial" : "em andamento") : (dados.statusMercado === 1 ? "mercado aberto" : "aguardando fechamento");
      else situacao = "a disputar";
      rotulo.textContent = "Rodada " + selecionada + (situacao ? " · " + situacao : "");

      botaoAnterior.disabled = selecionada <= dados.rodadaInicial;
      botaoSeguinte.disabled = selecionada >= dados.rodadaFinal;

      if (!rodada || !rodada.confrontos || rodada.confrontos.length === 0) {
        aviso.textContent = "Os confrontos desta rodada ainda não foram divulgados.";
        return;
      }
      if (rodada.fechada) {
        aviso.textContent = "";
      } else if (parciaisAtivas) {
        var hora = fmtHora(dados.parciais.atualizadoEm);
        aviso.textContent = "Pontuações parciais, sem substituições automáticas. A pontuação oficial sai no fechamento da rodada." + (hora ? " Atualizadas às " + hora + "." : "");
      } else {
        aviso.textContent = "As pontuações aparecem aqui depois que a rodada fecha no Cartola.";
      }

      var modo = rodada.fechada ? "fechada" : (parciaisAtivas ? "parcial" : "sem");

      rodada.confrontos.forEach(function (confronto) {
        var casa = confronto.casaTimeId !== null ? jogadoresPorId[confronto.casaTimeId] : null;
        var fora = confronto.foraTimeId !== null ? jogadoresPorId[confronto.foraTimeId] : null;

        var cartao = el("div", "confronto");
        var cabecalho = el("div", "confronto-cabecalho");
        cabecalho.appendChild(el("span", null, fmtDataPartida(confronto.dataPartida)));
        if (modo === "parcial") {
          cabecalho.appendChild(el("span", "selo selo-parcial", "Parcial"));
        }
        if (confronto.placarCasa !== null && confronto.placarFora !== null) {
          cabecalho.appendChild(el("span", "confronto-placar-real", "Jogo: " + confronto.placarCasa + " x " + confronto.placarFora));
        }
        cartao.appendChild(cabecalho);

        var houveEmpate = confronto.resultado === "empate";
        var pontosCasa = modo === "parcial" ? lerParcial(confronto.casaTimeId) : confronto.pontosCasa;
        var pontosFora = modo === "parcial" ? lerParcial(confronto.foraTimeId) : confronto.pontosFora;
        cartao.appendChild(linhaDeTime(casa, pontosCasa, confronto.resultado === "casa", houveEmpate, modo));
        cartao.appendChild(linhaDeTime(fora, pontosFora, confronto.resultado === "fora", houveEmpate, modo));

        if (confronto.valida === false && confronto.placarCasa === null && confronto.placarFora === null) {
          cartao.appendChild(el("div", "nota-confronto", "Partida real adiada. O confronto vale pela pontuação da rodada."));
        }
        if (rodada.fechada && houveEmpate && confronto.pontosCasa !== null && confronto.pontosFora !== null) {
          var diferenca = Math.abs(confronto.pontosCasa - confronto.pontosFora);
          cartao.appendChild(el("div", "nota-confronto", "Empate: diferença de " + fmt1(diferenca) + " ponto(s), abaixo de " + fmt1(dados.liga.empateLimite) + "."));
        }
        lista.appendChild(cartao);
      });
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
    var pagos = dados.jogadores.filter(function (jogador) { return jogador.pago; }).length;
    var total = dados.jogadores.length;

    var textoInscricao = "Inscrição: " + fmtDinheiro(dados.liga.inscricao);
    var prazo = fmtPrazo(dados.liga.prazoPagamento);
    if (prazo) textoInscricao += " · até " + prazo;
    document.getElementById("texto-inscricao").textContent = textoInscricao;

    var contagem = document.getElementById("contagem-pagos");
    contagem.appendChild(el("strong", null, String(pagos)));
    contagem.appendChild(document.createTextNode("/" + total + " pagos"));
    document.getElementById("barra-pagos").style.width = (total > 0 ? Math.round((pagos / total) * 100) : 0) + "%";

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
    var prazo = fmtPrazo(dados.liga.prazoPagamento);
    var regras = [
      ["⚽", "Cada jogador tem um time no Cartola e representa um clube da Série A. Os confrontos de cada rodada seguem a tabela oficial do Brasileirão."],
      ["🏆", "Vence o confronto quem fizer mais pontos no Cartola na rodada. Vitória vale " + dados.liga.pontosVitoria + " pontos na liga."],
      ["🤝", "Empate quando a diferença entre os dois times na rodada for menor que " + fmt1(dados.liga.empateLimite) + " pontos. Cada um leva " + dados.liga.pontosEmpate + " ponto."],
      ["📊", "Desempate na classificação: PG turno (soma das pontuações do Cartola no returno)."],
      ["💰", "Inscrição: " + fmtDinheiro(dados.liga.inscricao) + " por jogador" + (prazo ? ", pagamento até " + prazo : "") + "."]
    ];
    var lista = document.getElementById("lista-regras");
    regras.forEach(function (par) {
      var item = el("li");
      item.appendChild(el("span", "regra-icone", par[0]));
      item.appendChild(el("span", null, par[1]));
      lista.appendChild(item);
    });

    var medalhas = ["🥇", "🥈", "🥉"];
    var quadro = document.getElementById("tabela-premiacao");
    dados.liga.premios.forEach(function (valor, indice) {
      var linha = el("div", "linha-premio" + (indice === 0 ? " linha-premio-ouro" : ""));
      var rotulo = el("span", "premio-rotulo");
      if (indice < medalhas.length) {
        rotulo.appendChild(el("span", "premio-icone", medalhas[indice]));
      } else {
        rotulo.appendChild(el("span", "premio-ordem", (indice + 1) + "º"));
      }
      rotulo.appendChild(el("span", null, (indice + 1) + "º lugar"));
      linha.appendChild(rotulo);
      linha.appendChild(el("span", "premio-valor", fmtDinheiro(valor)));
      quadro.appendChild(linha);
    });
  }

  function montarResenha(resenhas) {
    var conteudo = document.getElementById("conteudo-resenha");
    var seletor = document.getElementById("seletor-resenha");

    if (!Array.isArray(resenhas) || resenhas.length === 0) {
      var aviso = el("div", "resenha-teaser");
      aviso.appendChild(el("div", "resenha-teaser-icone", "🎤"));
      aviso.appendChild(el("p", null, "O Zé Resenha está aquecendo o microfone. A primeira resenha sai assim que a rodada fechar!"));
      conteudo.appendChild(aviso);
      return;
    }

    var indice = resenhas.length - 1;
    var botaoAnterior = document.getElementById("botao-resenha-anterior");
    var botaoSeguinte = document.getElementById("botao-resenha-seguinte");
    seletor.hidden = resenhas.length < 2;

    function renderizarResenha() {
      var resenha = resenhas[indice];
      conteudo.textContent = "";

      var rotulo = document.getElementById("rotulo-resenha");
      rotulo.textContent = resenha.rodada ? "Rodada " + resenha.rodada : "Abertura do returno";
      botaoAnterior.disabled = indice <= 0;
      botaoSeguinte.disabled = indice >= resenhas.length - 1;

      if (resenha.titulo) conteudo.appendChild(el("h3", "resenha-titulo", resenha.titulo));
      (resenha.blocos || []).forEach(function (bloco) {
        var cartao = el("div", "bloco-resenha");
        var topo = el("div", "bloco-resenha-topo");
        if (bloco.icone) topo.appendChild(el("span", "bloco-resenha-icone", bloco.icone));
        if (bloco.titulo) topo.appendChild(el("span", null, bloco.titulo));
        cartao.appendChild(topo);
        cartao.appendChild(el("p", null, bloco.texto || ""));
        conteudo.appendChild(cartao);
      });
      conteudo.appendChild(el("p", "resenha-assinatura", "Zé Resenha 🎙️ · comentarista oficial da liga"));
    }

    botaoAnterior.addEventListener("click", function () {
      if (indice > 0) {
        indice -= 1;
        renderizarResenha();
      }
    });
    botaoSeguinte.addEventListener("click", function () {
      if (indice < resenhas.length - 1) {
        indice += 1;
        renderizarResenha();
      }
    });

    renderizarResenha();
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

  function ativarNavegacao() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".navega a"));
    if (!("IntersectionObserver" in window)) return;
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle("ativo", link.getAttribute("href") === "#" + entrada.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section").forEach(function (secao) {
      observador.observe(secao);
    });
  }

  function montar(dados, resenhas) {
    var jogadoresPorId = {};
    dados.jogadores.forEach(function (jogador) {
      jogadoresPorId[jogador.timeId] = jogador;
    });

    montarHero(dados);
    montarClassificacao(dados, jogadoresPorId);
    montarResenha(resenhas);
    montarConfrontos(dados, jogadoresPorId);
    montarInscritos(dados);
    montarRegras(dados);
    montarRodape(dados);

    document.getElementById("carregando").hidden = true;
    ["secao-classificacao", "secao-resenha", "secao-confrontos", "secao-inscritos", "secao-regras"].forEach(function (id) {
      document.getElementById(id).hidden = false;
    });
    ativarNavegacao();

    // Durante os jogos a pagina se recarrega sozinha para acompanhar as parciais.
    if (dados.bolaRolando) {
      setTimeout(function () {
        window.location.reload();
      }, 300000);
    }
  }

  function carregar() {
    var buscaDados = fetch("data.json?v=" + Date.now(), { cache: "no-store" })
      .then(function (resposta) {
        if (!resposta.ok) throw new Error("HTTP " + resposta.status);
        return resposta.json();
      });
    var buscaResenhas = fetch("resenhas.json?v=" + Date.now(), { cache: "no-store" })
      .then(function (resposta) {
        if (!resposta.ok) return [];
        return resposta.json();
      })
      .catch(function () {
        return [];
      });

    Promise.all([buscaDados, buscaResenhas])
      .then(function (resultados) {
        montar(resultados[0], resultados[1]);
      })
      .catch(function () {
        document.getElementById("carregando").textContent = "Não foi possível carregar os dados da liga. Atualize a página em alguns instantes.";
      });
  }

  carregar();
})();
