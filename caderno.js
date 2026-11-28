
/* ========================================
   CONFIGURAÇÃO DO CADEADO
======================================== */

const senhaCorreta = "547";

let combinacao = [0, 0, 0];
let cadeadoDestravado = false;


/* ========================================
   CONTROLE DAS PISTAS ENCONTRADAS
======================================== */

let contadorPistas = 0;

const totalPistas = 2;

const pistasConcluidas = {
    cadernoRato: false,
    carta: false
};

let dialogoFinalIniciado = false;


/* ========================================
   VERIFICAR ITENS NO INVENTÁRIO
======================================== */

function verificarItemInventario(id) {

    const itens = obterItensSalvosInventario();

    return itens.some(item => item.id === id);

}


/* ========================================
   ESCONDER OBJETOS JÁ COLETADOS
======================================== */

function atualizarObjetosColetados() {

    // CADERNO DOS RATOS
    if (verificarItemInventario("anotacoes_caderno_rato")) {

        const cadernoRato = document.querySelector(".caderno-rato");

        if (cadernoRato) {
            cadernoRato.style.display = "none";
        }

    }

    // CARTA DE IARA
    if (verificarItemInventario("carta_iara")) {

        const cartaFechada = document.querySelector(".carta-fechada");

        if (cartaFechada) {
            cartaFechada.style.display = "none";
        }

    }

}


/* ========================================
   REGISTRAR PISTA CONCLUÍDA
======================================== */

function registrarPistaConcluida(nomePista) {

    if (pistasConcluidas[nomePista]) return;

    pistasConcluidas[nomePista] = true;

    contadorPistas++;

    console.log("Pistas encontradas: " + contadorPistas);

    // VERIFICAR SE TODAS AS PISTAS FORAM ENCONTRADAS
    if (
        contadorPistas === totalPistas &&
        !dialogoFinalIniciado
    ) {

        dialogoFinalIniciado = true;

        iniciarDialogoPistas();

    }

}


/* ========================================
   ABRIR CADERNO CADEADO
======================================== */

function abrirCadernoCadeado() {

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


        setTimeout(function() {

            fecharCadernoCadeado();

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

const paginasRato = [

    "../assets/imagens/cadernoampliado.png",
    "../assets/imagens/pag1.png",
    "../assets/imagens/pag2.png",
    "../assets/imagens/pag3.png",
    "../assets/imagens/pag4.png"

];

let paginaAtual = 0;


/* ========================================
   ABRIR CADERNO DOS RATOS
======================================== */

function abrirCadernoRato() {

    // NÃO PERMITIR COLETAR DUAS VEZES
    if (verificarItemInventario("anotacoes_caderno_rato")) {

        atualizarObjetosColetados();

        return;

    }

    // REGISTRAR A PISTA
    registrarPistaConcluida("cadernoRato");

    // ESCONDER O CADERNO DO CENÁRIO
    const cadernoRato = document.querySelector(".caderno-rato");

    if (cadernoRato) {
        cadernoRato.style.display = "none";
    }

    // DEFINIR A AÇÃO ANTES DE MOSTRAR A NOTIFICAÇÃO
    acaoAposNotificacao = function() {

        paginaAtual = 0;

        document.getElementById("paginasOverlay").style.display = "flex";

        atualizarPagina();

    };

    // ADICIONAR ITEM E MOSTRAR NOTIFICAÇÃO
    adicionarItemComNotificacao({

        id: "anotacoes_caderno_rato",

        nome: "Anotações do caderno",

        imagem: "../assets/imagens/cadernoampliado.png",

        descricao: "Anotações encontradas no caderno dos ratos. Essas informações podem ajudar Amélia durante sua investigação."

    });

}


/* ========================================
   ATUALIZAR IMAGEM E CONTADOR
======================================== */

function atualizarPagina() {

    document.getElementById("imagemPagina").src = paginasRato[paginaAtual];

    document.getElementById("contadorPaginas").textContent =
        (paginaAtual + 1) + " / " + paginasRato.length;

}


/* ========================================
   AVANÇAR OU VOLTAR PÁGINAS
======================================== */

function mudarPagina(direcao) {

    paginaAtual += direcao;

    if (paginaAtual < 0) {
        paginaAtual = paginasRato.length - 1;
    }

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

    overlay.style.display = "none";

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

function abrirCadernoDesbloqueado() {

    if (!cadeadoDestravado) return;

    document.getElementById("cadernoDesbloqueadoOverlay").style.display = "flex";

}


/* ========================================
   FECHAR NOVO CADERNO
======================================== */

function fecharCadernoDesbloqueado() {

    document.getElementById("cadernoDesbloqueadoOverlay").style.display = "none";

}


/* ========================================
   CARTA DE IARA
======================================== */

function abrirCarta() {

    // NÃO PERMITIR COLETAR DUAS VEZES
    if (verificarItemInventario("carta_iara")) {

        atualizarObjetosColetados();

        return;

    }

    // REGISTRAR A PISTA
    registrarPistaConcluida("carta");

    // ESCONDER A CARTA FECHADA
    const cartaFechada = document.querySelector(".carta-fechada");

    if (cartaFechada) {
        cartaFechada.style.display = "none";
    }

    // FECHAR O CADERNO
    document.getElementById("cadernoDesbloqueadoOverlay").style.display = "none";

    // DEFINIR A AÇÃO ANTES DE MOSTRAR A NOTIFICAÇÃO
    acaoAposNotificacao = function() {

        document.getElementById("cartaabertaOverlay").style.display = "flex";

    };

    // ADICIONAR ITEM E MOSTRAR NOTIFICAÇÃO
    adicionarItemComNotificacao({

        id: "carta_iara",

        nome: "Carta de Iara",

        imagem: "../assets/imagens/cartaaberta.png",

        descricao: "Carta deixada por Iara e destinada a Dinalva. O documento pode conter pistas."

    });

}


/* ========================================
   FECHAR CARTA ABERTA
======================================== */

function fecharCartaAberta() {

    document.getElementById("cartaabertaOverlay").style.display = "none";

}


/* ========================================
   FECHAR COM ESC
======================================== */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        // NÃO FECHAR OS OUTROS OVERLAYS
        // ENQUANTO A NOTIFICAÇÃO ESTIVER ABERTA
        const notificacao = document.getElementById(
            "notificacaoItemInventario"
        );

        if (notificacao && notificacao.style.display === "flex") {
            return;
        }

        fecharPaginas();

        fecharCadernoRato();

        fecharCadernoCadeado();

        fecharCadernoDesbloqueado();

        fecharCartaAberta();

    }

});


/* ========================================
   VERIFICAR OBJETOS AO CARREGAR A PÁGINA
======================================== */

atualizarObjetosColetados();
