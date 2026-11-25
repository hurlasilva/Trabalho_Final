/* CONFIGURAÇÃO DO CADEADO */
const senhaCorreta = "547";

let combinacao = [0, 0, 0];
let cadeadoDestravado = false;


/* ABRIR CADERNO CADEADO */
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


/* FECHAR CADERNO CADEADO */
function fecharCadernoCadeado() {

    document.getElementById("cadernocadeadoOverlay").style.display = "none";

    limparMensagem();
}


// COMPATIBILIDADE COM A FUNÇÃO ANTIGA
function fecharPainel() {

    fecharCadernoCadeado();
}


/* ATUALIZAR NÚMEROS DAS ROLDANAS */
function atualizarRoldanas() {

    for (let i = 0; i < 3; i++) {

        document.getElementById("roldana" + i).textContent = combinacao[i];

    }

}


/* GIRAR ROLDANAS */
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


/* VERIFICAR COMBINAÇÃO */
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


/* LIMPAR MENSAGEM */
function limparMensagem() {

    const mensagem = document.getElementById("mensagemCadeado");

    if (mensagem) {

        mensagem.textContent = "";

        mensagem.className = "";

    }

}


/* ABRIR CADERNO DOS RATOS */
function abrirCadernoRato() {

    document.getElementById("cadernoratoOverlay").style.display = "flex";

}

/* ABRIR CADERNO DOS RATOS */
function abrirCadernoRato2() {
    document.getElementById("cadernoratoOverlay").style.display = "flex";
}

/* ABRIR NOVO CADERNO DESBLOQUEADO */
function abrirCadernoDesbloqueado() {
    if (!cadeadoDestravado) return;

    document.getElementById("cadernoDesbloqueadoOverlay").style.display = "flex";
}

/* FECHAR NOVO CADERNO DESBLOQUEADO */
function fecharCadernoDesbloqueado() {
    document.getElementById("cadernoDesbloqueadoOverlay").style.display = "none";
}

/* FECHAR COM ESC */
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {

        fecharCadernoRato();

        fecharCadernoCadeado();

        fecharCadernoDesbloqueado();

    }
});
