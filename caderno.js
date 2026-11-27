/* ========================================
   CONFIGURAÇÃO DO CADEADO
======================================== */

const senhaCorreta = "547";

let combinacao = [0, 0, 0];
let cadeadoDestravado = false;


/* ========================================
   CONTROLE DAS PISTAS ENCONTRADAS
======================================== */

// Quantidade de pistas concluídas
let contadorPistas = 0;

// Quantidade total de pistas desta fase
const totalPistas = 3;

// Controla se cada pista já foi contabilizada
const pistasConcluidas = {
    cadernoRato: false,
    cadernoDesbloqueado: false,
    carta: false
};

// Impede iniciar o diálogo final mais de uma vez
let dialogoFinalIniciado = false;


/* ========================================
   REGISTRAR PISTA CONCLUÍDA
======================================== */

function registrarPistaConcluida(nomePista) {

    // Impede contabilizar a mesma pista novamente
    if (pistasConcluidas[nomePista]) return;

    // Marca a pista como concluída
    pistasConcluidas[nomePista] = true;

    // Adiciona 1 ao contador
    contadorPistas++;

    console.log("Pistas encontradas: " + contadorPistas);

    // Verifica se todas as pistas foram concluídas
    if (
        contadorPistas === totalPistas &&
        !dialogoFinalIniciado
    ) {

        dialogoFinalIniciado = true;

        // Inicia o diálogo após encontrar todas as pistas
        iniciarDialogoPistas();

    }

}


/* ========================================
   ABRIR CADERNO CADEADO
======================================== */

function abrirCadernoCadeado() {

    // Verifica se o cadeado já foi desbloqueado
    if (cadeadoDestravado) {

        abrirCadernoDesbloqueado();

        return;
    }

    document.getElementById("cadernocadeadoOverlay").style.display = "flex";

    mostrarObjetivo();

    atualizarRoldanas();

}


/* ========================================
   FECHAR CADERNO CADEADO
======================================== */

function fecharCadernoCadeado() {

    document.getElementById("cadernocadeadoOverlay").style.display = "none";

    limparMensagem();

}


// COMPATIBILIDADE COM A FUNÇÃO ANTIGA
function fecharPainel() {

    fecharCadernoCadeado();

}


/* ========================================
   ATUALIZAR NÚMEROS DAS ROLDANAS
======================================== */

function atualizarRoldanas() {

    for (let i = 0; i < 3; i++) {

        document.getElementById("roldana" + i).textContent = combinacao[i];

    }

}


/* ========================================
   GIRAR ROLDANAS
======================================== */

function girarRoldana(indice, direcao) {

    if (cadeadoDestravado) return;

    combinacao[indice] += direcao;

    if (combinacao[indice] > 9) {

        combinacao[indice] = 0;

    }

    if (combinacao[indice] < 0) {

        combinacao[indice] = 9;

    }

    atualizarRoldanas();

    limparMensagem();

}


/* ========================================
   VERIFICAR COMBINAÇÃO
======================================== */

function verificarCombinacao() {

    let tentativa = combinacao.join("");

    const mensagem = document.getElementById("mensagemCadeado");

    const cadeia = document.querySelector(".cadeado-container");


    if (tentativa === senhaCorreta) {

        mensagem.textContent = "CADEADO DESTRANCADO!";

        mensagem.className = "sucesso";

        cadeia.classList.add("destravado");

        cadeadoDestravado = true;


        // Aguarda um instante para mostrar a mensagem
        setTimeout(function() {

            // Fecha o caderno com cadeado
            fecharCadernoCadeado();

            // Abre o novo caderno ampliado
            abrirCadernoDesbloqueado();

        }, 1000);


    } else {

        mensagem.textContent = "Combinação incorreta. Tente novamente.";

        mensagem.className = "erro";

    }

}


/* ========================================
   LIMPAR MENSAGEM
======================================== */

function limparMensagem() {

    const mensagem = document.getElementById("mensagemCadeado");

    if (mensagem) {

        mensagem.textContent = "";

        mensagem.className = "";

    }

}


/* ========================================
   CADERNO DOS RATOS
======================================== */

/* LISTA DE IMAGENS DAS PÁGINAS */

const paginasRato = [

    "../assets/imagens/cadernoampliado.png",
    "../assets/imagens/pag1.png",
    "../assets/imagens/pag2.png",
    "../assets/imagens/pag3.png",
    "../assets/imagens/pag4.png"

];


/* PÁGINA ATUAL */

let paginaAtual = 0;


/* ABRIR CARROSSEL DAS PÁGINAS */

function abrirCadernoRato() {

    paginaAtual = 0;

    document.getElementById("paginasOverlay").style.display = "flex";

    atualizarPagina();

}


/* ATUALIZAR IMAGEM E CONTADOR */

function atualizarPagina() {

    document.getElementById("imagemPagina").src = paginasRato[paginaAtual];

    document.getElementById("contadorPaginas").textContent =
        (paginaAtual + 1) + " / " + paginasRato.length;

}


/* AVANÇAR OU VOLTAR PÁGINAS */

function mudarPagina(direcao) {

    paginaAtual += direcao;

    // Volta para a última página se estiver na primeira
    if (paginaAtual < 0) {

        paginaAtual = paginasRato.length - 1;

    }

    // Volta para a primeira página se estiver na última
    if (paginaAtual >= paginasRato.length) {

        paginaAtual = 0;

    }

    atualizarPagina();

}


/* ========================================
   FECHAR CARROSSEL
======================================== */

function fecharPaginas() {

    const overlay = document.getElementById("paginasOverlay");

    // Verifica se o carrossel realmente estava aberto
    const estavaAberto = overlay.style.display === "flex";

    overlay.style.display = "none";

    // REGISTRAR A PRIMEIRA PISTA
    if (estavaAberto) {

        registrarPistaConcluida("cadernoRato");

    }

}


/* ========================================
   FECHAR CADERNO RATO
======================================== */

function fecharCadernoRato() {

    fecharPaginas();

}


/* ========================================
   NOVO CADERNO DESBLOQUEADO
======================================== */

/* ABRIR NOVO CADERNO */

function abrirCadernoDesbloqueado() {

    if (!cadeadoDestravado) return;

    document.getElementById("cadernoDesbloqueadoOverlay").style.display = "flex";

}


/* ========================================
   FECHAR NOVO CADERNO
======================================== */

function fecharCadernoDesbloqueado() {

    const overlay = document.getElementById("cadernoDesbloqueadoOverlay");

    // Verifica se o caderno realmente estava aberto
    const estavaAberto = overlay.style.display === "flex";

    overlay.style.display = "none";

    // REGISTRAR A SEGUNDA PISTA
    if (estavaAberto) {

        registrarPistaConcluida("cadernoDesbloqueado");

    }

}


/* ========================================
   CARTA
======================================== */

/* ABRIR CARTA */

function abrirCarta() {

    const caderno = document.getElementById("cadernoDesbloqueadoOverlay");

    // Verifica se o caderno estava aberto
    const cadernoEstavaAberto = caderno.style.display === "flex";

    // Fecha o caderno para apresentar a carta
    caderno.style.display = "none";

    // Registra o fechamento do caderno
    if (cadernoEstavaAberto) {

        registrarPistaConcluida("cadernoDesbloqueado");

    }

    // Abre a carta
    document.getElementById("cartaabertaOverlay").style.display = "flex";

}


/* ========================================
   FECHAR CARTA ABERTA
======================================== */

function fecharCartaAberta() {

    const overlay = document.getElementById("cartaabertaOverlay");

    // Verifica se a carta realmente estava aberta
    const estavaAberta = overlay.style.display === "flex";

    overlay.style.display = "none";

    // REGISTRAR A TERCEIRA PISTA
    if (estavaAberta) {

        registrarPistaConcluida("carta");

    }

}


/* ========================================
   FECHAR COM ESC
======================================== */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        fecharPaginas();

        fecharCadernoRato();

        fecharCadernoCadeado();

        fecharCadernoDesbloqueado();

        fecharCartaAberta();

    }

});