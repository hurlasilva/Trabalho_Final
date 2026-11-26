
// ========================================
// ELEMENTOS DA INTERFACE
// ========================================

const interfaceDialogo = document.getElementById("interfaceDialogo");
const imagemPersonagem = document.getElementById("imagemPersonagem");
const nomePersonagem = document.querySelector(".nome-personagem");
const textoDialogo = document.querySelector(".texto-dialogo");
const caixaDialogo = document.querySelector(".caixa-dialogo");
const indicadorDialogo = document.querySelector(".indicador-dialogo");

// ========================================
// CRIAR ÁREA DAS OPÇÕES
// ========================================

const opcoesDialogo = document.createElement("div");

opcoesDialogo.id = "opcoesDialogo";
opcoesDialogo.className = "opcoes-dialogo";

caixaDialogo.appendChild(opcoesDialogo);

// ========================================
// CRIAR ÁREA DE APRESENTAÇÃO DE IMAGEM
// ========================================

const apresentacaoImagem = document.createElement("div");

apresentacaoImagem.id = "apresentacaoImagem";
apresentacaoImagem.className = "apresentacao-imagem";

apresentacaoImagem.innerHTML = `
    <img id="imagemDestaque" src="" alt="Imagem apresentada">

    <button type="button"
        id="fecharImagemDestaque"
        aria-label="Fechar imagem">
        ×
    </button>
`;

document.body.appendChild(apresentacaoImagem);

const imagemDestaque = document.getElementById("imagemDestaque");
const botaoFecharImagem = document.getElementById("fecharImagemDestaque");

// ========================================
// CONTROLE DA CONVERSA
// ========================================

let dialogoAtivo = false;
let escolhaAtiva = false;
let imagemDestaqueAtiva = false;

// Armazena uma ação que deverá acontecer
// depois que o jogador fechar uma imagem.
let acaoAposImagem = null;

// ========================================
// REGISTRO DAS ESCOLHAS DO JOGADOR
// ========================================

const escolhasJogador = {
    confiancaEnfermeira: 0,
    abriuCaderno: false,
    encontrouFotografia: false
};

// ========================================
// CONTROLE DAS SEQUÊNCIAS DE DIÁLOGO
// ========================================

// Cada sequência possui seu próprio array de falas
// e seu próprio índice.
//
// Isso permite entrar em uma conversa alternativa
// e depois retornar à história principal.

let pilhaDialogos = [];

// Retorna a sequência que está sendo exibida.
function obterDialogoAtual() {

    return pilhaDialogos[pilhaDialogos.length - 1];
}

// ========================================
// LISTA ORIGINAL DE FALAS
// ========================================

const falas = [

    {
        nome: "Enfermeira",
        imagem: "../assets/imagens/Iara.png",
        texto: "Pode procurar a vontade, mas tenha cuidado"
    },

    {
        nome: "Amélia",
        imagem: "../assets/imagens/personagem.png",
        texto: "Certo, vou tomar cuidado..."
    },

    {
        nome: "Enfermeira",
        imagem: "../assets/imagens/Iara.png",
        texto: "Está conseguindo procurar?",

        // ALTERNATIVAS DO JOGADOR
        opcoes: [

            {
                texto: "...olha só, encontrei! Muito obrigada pela ajuda.", 

                imagemDestaque: "../assets/imagens/papel.png",

            },

            {
                texto: "Sim, obrigada pela gentileza, mas acho que posso procurar sozinha.",

                // DIÁLOGO EXCLUSIVO DESSA ALTERNATIVA
                falas: [

                    {
                        nome: "Amélia",
                        imagem: "../assets/imagens/personagem.png",
                        texto: "Já está quase no fim da manhã, posso procurar sozinha se quiser..."
                    },

                    {
                        nome: "Enfermeira",
                        imagem: "../assets/imagens/Iara.png",
                        texto: "Fim da manhã?"
                    }

                ]
            }

        ]
    },

    {
        nome: "Enfermeira",
        imagem: "../assets/imagens/Iara.png",
        texto: "Posso ver as horas em seu relógio?"
    },

    {
        nome: "Amélia",
        imagem: "../assets/imagens/personagem.png",
        texto: "Sim."
    },

    {
        nome: "Enfermeira",
        imagem: "../assets/imagens/Iara.png",
        texto: "Nossa, olha a hora! Preciso bater meu ponto.."
    },

    {
        nome: "Enfermeira",
        imagem: "../assets/imagens/Iara.png",
        texto: "Até logo, se precisar… sempre estou no período da manhã."
    }

];

// ========================================
// MOSTRAR UMA FALA
// ========================================

function mostrarFala() {

    const dialogo = obterDialogoAtual();

    // VERIFICAR SE A SEQUÊNCIA ATUAL TERMINOU
    if (!dialogo || dialogo.indice >= dialogo.falas.length) {

        // SE EXISTIR UMA SEQUÊNCIA ANTERIOR,
        // RETORNAR PARA ELA.
        if (pilhaDialogos.length > 1) {

            pilhaDialogos.pop();

            mostrarFala();

        } else {

            finalizarDialogo();

        }

        return;
    }

    const fala = dialogo.falas[dialogo.indice];

    // ATUALIZAR INFORMAÇÕES DO PERSONAGEM
    nomePersonagem.textContent = fala.nome;
    textoDialogo.textContent = fala.texto;

    // ATUALIZAR IMAGEM DO PERSONAGEM
    imagemPersonagem.style.display = "none";

    imagemPersonagem.src = fala.imagem;
    imagemPersonagem.alt = fala.nome;

    imagemPersonagem.style.display = "block";

    // LIMPAR OPÇÕES ANTERIORES
    opcoesDialogo.innerHTML = "";
    opcoesDialogo.style.display = "none";

    escolhaAtiva = false;

    // MOSTRAR INDICADOR DE CONTINUAÇÃO
    indicadorDialogo.style.display = "block";

    // VERIFICAR SE A FALA POSSUI IMAGEM DE DESTAQUE
    if (fala.imagemDestaque) {

        abrirApresentacaoImagem(fala.imagemDestaque);

    }

    // VERIFICAR SE A FALA POSSUI OPÇÕES
    if (fala.opcoes) {

        mostrarOpcoes(fala.opcoes);

    }

}

// ========================================
// INICIAR DIÁLOGO ORIGINAL
// ========================================

function iniciarDialogo() {

    // LIMPAR SEQUÊNCIAS ANTERIORES
    pilhaDialogos = [];

    // ADICIONAR A HISTÓRIA PRINCIPAL
    pilhaDialogos.push({

        falas: falas,
        indice: 0

    });

    dialogoAtivo = true;
    escolhaAtiva = false;

    imagemPersonagem.style.display = "none";

    interfaceDialogo.style.display = "block";

    mostrarFala();

}

// ========================================
// INICIAR DIÁLOGO PERSONALIZADO
// ========================================

function iniciarDialogoPersonalizado(novasFalas) {

    if (!Array.isArray(novasFalas)) {

        console.error("As falas precisam estar dentro de um array.");

        return;
    }

    // SE O DIÁLOGO JÁ ESTIVER ATIVO,
    // ADICIONAR UMA NOVA SEQUÊNCIA.
    //
    // A sequência anterior será preservada
    // para que possamos retornar a ela.

    if (!dialogoAtivo) {

        pilhaDialogos = [];

        dialogoAtivo = true;

        interfaceDialogo.style.display = "block";

    }

    pilhaDialogos.push({

        falas: novasFalas,
        indice: 0

    });

    escolhaAtiva = false;

    opcoesDialogo.innerHTML = "";
    opcoesDialogo.style.display = "none";

    imagemPersonagem.style.display = "none";

    mostrarFala();

}

// ========================================
// MOSTRAR OPÇÕES DE DIÁLOGO
// ========================================

function mostrarOpcoes(opcoes) {

    escolhaAtiva = true;

    // ESCONDER INDICADOR DE CONTINUAÇÃO
    indicadorDialogo.style.display = "none";

    opcoesDialogo.innerHTML = "";
    opcoesDialogo.style.display = "flex";

    // CRIAR UM BOTÃO PARA CADA ALTERNATIVA
    opcoes.forEach((opcao, indice) => {

        const botao = document.createElement("button");

        botao.type = "button";
        botao.textContent = opcao.texto;

        botao.addEventListener("click", function(event) {

            event.stopPropagation();

            escolherOpcao(indice, opcoes);

        });

        opcoesDialogo.appendChild(botao);

    });

}

// ========================================
// ESCOLHER UMA OPÇÃO
// ========================================

function escolherOpcao(indice, opcoes) {

    if (!escolhaAtiva) return;

    const opcaoEscolhida = opcoes[indice];

    if (!opcaoEscolhida) return;

    escolhaAtiva = false;

    // ESCONDER AS ALTERNATIVAS
    opcoesDialogo.innerHTML = "";
    opcoesDialogo.style.display = "none";

    // AVANÇAR A SEQUÊNCIA PRINCIPAL
    //
    // Assim, depois da alternativa,
    // o jogo continuará na fala seguinte.

    const dialogo = obterDialogoAtual();

    dialogo.indice++;

    // APLICAR ALTERAÇÕES NO REGISTRO DO JOGADOR
    if (opcaoEscolhida.alteracoes) {

        Object.entries(opcaoEscolhida.alteracoes).forEach(
            ([chave, valor]) => {

                if (
                    Object.prototype.hasOwnProperty.call(
                        escolhasJogador,
                        chave
                    )
                ) {

                    if (
                        typeof escolhasJogador[chave] === "number" &&
                        typeof valor === "number"
                    ) {

                        escolhasJogador[chave] += valor;

                    } else {

                        escolhasJogador[chave] = valor;

                    }

                }

            }
        );

    }

    // EXECUTAR A ALTERNATIVA
    executarOpcao(opcaoEscolhida);

}

// ========================================
// EXECUTAR CONSEQUÊNCIAS DA ALTERNATIVA
// ========================================

function executarOpcao(opcaoEscolhida) {

    // VERIFICAR SE A OPÇÃO POSSUI SOM
    if (opcaoEscolhida.som) {

        reproduzirSomEExecutarOpcao(
            opcaoEscolhida.som,
            opcaoEscolhida
        );

        return;
    }

    // CONTINUAR PARA AS PRÓXIMAS AÇÕES
    continuarOpcao(opcaoEscolhida);

}

// ========================================
// CONTINUAR ALTERNATIVA APÓS O SOM
// ========================================

function reproduzirSomEExecutarOpcao(arquivoSom, opcaoEscolhida) {

    // VERIFICAR SE OS EFEITOS SONOROS ESTÃO ATIVOS
    if (localStorage.getItem("efeitosAtivos") === "false") {

        continuarOpcao(opcaoEscolhida);

        return;
    }

    // ESCONDER A INTERFACE DURANTE O SOM
    interfaceDialogo.style.display = "none";

    const som = new Audio(arquivoSom);

    som.volume = 1;

    // EVITAR EXECUTAR A ALTERNATIVA MAIS DE UMA VEZ
    let somFinalizado = false;

    function finalizarSom() {

        if (somFinalizado) return;

        somFinalizado = true;

        continuarOpcao(opcaoEscolhida);

    }

    // INICIAR A ALTERNATIVA QUANDO O SOM TERMINAR
    som.addEventListener("ended", finalizarSom);

    // CASO OCORRA ALGUM ERRO
    som.addEventListener("error", finalizarSom);

    const resultadoReproducao = som.play();

    if (resultadoReproducao !== undefined) {

        resultadoReproducao.catch(finalizarSom);

    }

}

// ========================================
// CONTINUAR DEPOIS DA ESCOLHA
// ========================================

function continuarOpcao(opcaoEscolhida) {

    // VERIFICAR SE A ALTERNATIVA POSSUI IMAGEM
    if (opcaoEscolhida.imagemDestaque) {

        abrirApresentacaoImagem(
            opcaoEscolhida.imagemDestaque,

            function() {

                iniciarRamificacao(opcaoEscolhida.falas || []);

            }
        );

        return;
    }

    // SE NÃO POSSUIR IMAGEM, INICIAR DIRETAMENTE
    iniciarRamificacao(opcaoEscolhida.falas || []);

}

// ========================================
// INICIAR RAMIFICAÇÃO
// ========================================

function iniciarRamificacao(novasFalas) {

    // SE EXISTIR UMA CONVERSA ALTERNATIVA,
    // ADICIONAR ESSA CONVERSA À PILHA.

    if (novasFalas.length > 0) {

        iniciarDialogoPersonalizado(novasFalas);

    } else {

        // SE NÃO EXISTIR OUTRA CONVERSA,
        // RETORNAR À HISTÓRIA PRINCIPAL.

        interfaceDialogo.style.display = "block";

        mostrarFala();

    }

}

// ========================================
// APRESENTAR IMAGEM AMPLIADA
// ========================================

function abrirApresentacaoImagem(caminho, aoFechar = null) {

    imagemDestaque.src = caminho;

    apresentacaoImagem.style.display = "flex";

    imagemDestaqueAtiva = true;

    // ARMAZENAR A AÇÃO QUE SERÁ EXECUTADA
    // DEPOIS QUE O JOGADOR FECHAR A IMAGEM.

    acaoAposImagem = aoFechar;

}

// ========================================
// FECHAR IMAGEM AMPLIADA
// ========================================

function fecharApresentacaoImagem() {

    apresentacaoImagem.style.display = "none";

    imagemDestaqueAtiva = false;

    // EXECUTAR A AÇÃO PENDENTE, SE EXISTIR
    if (acaoAposImagem) {

        const acao = acaoAposImagem;

        acaoAposImagem = null;

        acao();

    }

}

// BOTÃO PARA FECHAR A IMAGEM
botaoFecharImagem.addEventListener("click", function(event) {

    event.stopPropagation();

    fecharApresentacaoImagem();

});

// ========================================
// AVANÇAR PARA A PRÓXIMA FALA
// ========================================

function proximaFala() {

    if (!dialogoAtivo) return;

    // NÃO AVANÇAR SE EXISTIREM OPÇÕES OU IMAGEM ABERTA
    if (escolhaAtiva || imagemDestaqueAtiva) return;

    const dialogo = obterDialogoAtual();

    dialogo.indice++;

    mostrarFala();

}

// ========================================
// FINALIZAR DIÁLOGO
// ========================================

function finalizarDialogo() {

    dialogoAtivo = false;
    escolhaAtiva = false;
    imagemDestaqueAtiva = false;

    interfaceDialogo.style.display = "none";

    imagemPersonagem.style.display = "none";

    opcoesDialogo.innerHTML = "";
    opcoesDialogo.style.display = "none";

    apresentacaoImagem.style.display = "none";

    acaoAposImagem = null;

    // LIMPAR TODAS AS SEQUÊNCIAS
    pilhaDialogos = [];

}

// ========================================
// AVANÇAR COM CLIQUE
// ========================================

document.addEventListener("click", function(event) {

    if (!dialogoAtivo) return;

    // IGNORAR CLIQUES EM ELEMENTOS INTERATIVOS
    if (
        event.target.closest("button") ||
        event.target.closest("input") ||
        event.target.closest(".overlay") ||
        event.target.closest(".papel-overlay") ||
        event.target.closest("#opcoesDialogo") ||
        event.target.closest("#apresentacaoImagem")
    ) {

        return;
    }

    proximaFala();

});

// ========================================
// AVANÇAR COM ENTER OU ESPAÇO
// ========================================

document.addEventListener("keydown", function(event) {

    if (!dialogoAtivo) return;

    const quadroOverlay = document.getElementById("quadroOverlay");
    const papelOverlay = document.getElementById("papelOverlay");

    // IMPEDIR AVANÇO SE UM ELEMENTO ESTIVER ABERTO
    if (
        (quadroOverlay && quadroOverlay.style.display === "flex") ||
        (papelOverlay && papelOverlay.style.display === "flex")
    ) {

        return;
    }

    // NÃO AVANÇAR DURANTE ESCOLHAS OU IMAGENS
    if (escolhaAtiva || imagemDestaqueAtiva) return;

    // EVITAR REPETIÇÃO DO EVENTO
    if (event.repeat) return;

    if (
        event.key === "Enter" ||
        event.code === "Space"
    ) {

        event.preventDefault();

        proximaFala();

    }

});

// ========================================
// AGUARDAR O FADE-IN
// ========================================

window.addEventListener("load", function() {

    const possuiFade = document.documentElement
        .classList.contains("fade-in-historia");

    const duracaoFade = possuiFade ? 1500 : 0;

    setTimeout(function() {

        iniciarDialogo();

    }, duracaoFade);

});
