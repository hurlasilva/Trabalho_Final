
// ELEMENTOS DA INTERFACE
const interfaceDialogo = document.getElementById("interfaceDialogo");
const imagemPersonagem = document.getElementById("imagemPersonagem");
const nomePersonagem = document.querySelector(".nome-personagem");
const textoDialogo = document.querySelector(".texto-dialogo");
const caixaDialogo = document.querySelector(".caixa-dialogo");
const indicadorDialogo = document.querySelector(".indicador-dialogo");

fala2 = 0;


// CRIAR ÁREA DAS OPÇÕES
const opcoesDialogo = document.createElement("div");

opcoesDialogo.id = "opcoesDialogo";
opcoesDialogo.className = "opcoes-dialogo";

caixaDialogo.appendChild(opcoesDialogo);


// CRIAR ÁREA DE APRESENTAÇÃO DE IMAGEM
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


// CONTROLE DA CONVERSA
let dialogoAtivo = false;
let escolhaAtiva = false;
let imagemDestaqueAtiva = false;
let acaoAposImagem = null;


// REGISTRO DAS ESCOLHAS DO JOGADOR
const escolhasJogador = {
    confiancaEnfermeira: 0,
    abriuCaderno: false,
    encontrouFotografia: false
};


// CONTROLE DAS SEQUÊNCIAS DE DIÁLOGO
let pilhaDialogos = [];


// RETORNAR SEQUÊNCIA ATUAL
function obterDialogoAtual() {

    return pilhaDialogos[pilhaDialogos.length - 1];

}


// ==========================================
// REPRODUZIR SOM E INICIAR NOVO DIÁLOGO
// ==========================================

function reproduzirSomEIniciarDialogo() {

    const arquivoSom = "../assets/audio/passos.mp3";

    controlarInventario(true);

    interfaceDialogo.style.display = "none";
    dialogoAtivo = false;

    const efeitosAtivos =
        localStorage.getItem("efeitosAtivos") !== "false";

    if (!efeitosAtivos) {

        iniciarProximoDialogo();

        return;
    }

    const som = new Audio(arquivoSom);

    som.preload = "auto";

    let dialogoIniciado = false;

    function continuarConversa() {

        if (dialogoIniciado) return;

        dialogoIniciado = true;

        iniciarProximoDialogo();

    }

    som.addEventListener("ended", continuarConversa, { once: true });

    som.addEventListener("error", function() {

        console.error(
            "Não foi possível reproduzir o efeito sonoro:",
            arquivoSom,
            som.error
        );

        continuarConversa();

    }, { once: true });

    som.play().catch(function(erro) {

        console.error("Erro ao iniciar o áudio:", erro);

        continuarConversa();

    });

}


// LISTA ORIGINAL DE FALAS
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

        opcoes: [

            {
                texto: "...olha só, encontrei! Muito obrigada pela ajuda.",
                imagemDestaque: "../assets/imagens/papel.png",

                falas: [

                    {
                        nome: "Enfermeira",
                        imagem: "../assets/imagens/Iara.png",
                        texto: "Disponha."
                    }

                ]
            },

            {
                texto: "Sim, obrigada pela gentileza, mas acho que posso procurar sozinha.",

                falas: [

                    {
                        nome: "Amélia",
                        imagem: "../assets/imagens/personagem.png",
                        texto: "Já está quase na hora do almoço, posso procurar sozinha se quiser..."
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
        texto: "Nossa, olha a hora! Preciso ir para meu intervalo.."
    },

    {
        nome: "Enfermeira",
        imagem: "../assets/imagens/Iara.png",
        texto: "Até logo, se precisar… sempre estou por aqui."
    }

];


// MOSTRAR UMA FALA
function mostrarFala() {

    const dialogo = obterDialogoAtual();

    if (!dialogo || dialogo.indice >= dialogo.falas.length) {

        if (pilhaDialogos.length > 1) {

            pilhaDialogos.pop();

            mostrarFala();

        } else {

            finalizarDialogo();

        }

        return;

    }

    const fala = dialogo.falas[dialogo.indice];

    nomePersonagem.textContent = fala.nome;
    textoDialogo.textContent = fala.texto;

    imagemPersonagem.style.display = "none";

    imagemPersonagem.src = fala.imagem;
    imagemPersonagem.alt = fala.nome;

    imagemPersonagem.style.display = "block";

    opcoesDialogo.innerHTML = "";
    opcoesDialogo.style.display = "none";

    escolhaAtiva = false;

    indicadorDialogo.style.display = "block";

    if (fala.imagemDestaque) {

        abrirApresentacaoImagem(fala.imagemDestaque);

    }

    if (fala.opcoes) {

        mostrarOpcoes(fala.opcoes);

    }

}


// INICIAR DIÁLOGO ORIGINAL
function iniciarDialogo() {

    pilhaDialogos = [];

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


// INICIAR DIÁLOGO PERSONALIZADO
function iniciarDialogoPersonalizado(novasFalas) {

    if (!Array.isArray(novasFalas)) {

        console.error("As falas precisam estar dentro de um array.");

        return;

    }

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


// MOSTRAR OPÇÕES DE DIÁLOGO
function mostrarOpcoes(opcoes) {

    escolhaAtiva = true;

    indicadorDialogo.style.display = "none";

    opcoesDialogo.innerHTML = "";

    opcoesDialogo.style.display = "flex";

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


// ESCOLHER UMA OPÇÃO
function escolherOpcao(indice, opcoes) {

    if (!escolhaAtiva) return;

    const opcaoEscolhida = opcoes[indice];

    if (!opcaoEscolhida) return;

    escolhaAtiva = false;

    opcoesDialogo.innerHTML = "";
    opcoesDialogo.style.display = "none";

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

    executarOpcao(opcaoEscolhida);

}


// EXECUTAR CONSEQUÊNCIAS DA ALTERNATIVA
function executarOpcao(opcaoEscolhida) {

    if (opcaoEscolhida.som) {

        reproduzirSomEExecutarOpcao(
            opcaoEscolhida.som,
            opcaoEscolhida
        );

        return;

    }

    continuarOpcao(opcaoEscolhida);

}


// CONTINUAR ALTERNATIVA APÓS O SOM
function reproduzirSomEExecutarOpcao(arquivoSom, opcaoEscolhida) {

    if (localStorage.getItem("efeitosAtivos") === "false") {

        continuarOpcao(opcaoEscolhida);

        return;

    }

    interfaceDialogo.style.display = "none";

    const som = new Audio(arquivoSom);

    som.volume = 1;

    let somFinalizado = false;

    function finalizarSom() {

        if (somFinalizado) return;

        somFinalizado = true;

        continuarOpcao(opcaoEscolhida);

    }

    som.addEventListener("ended", finalizarSom);

    som.addEventListener("error", finalizarSom);

    const resultadoReproducao = som.play();

    if (resultadoReproducao !== undefined) {

        resultadoReproducao.catch(finalizarSom);

    }

}


// CONTINUAR DEPOIS DA ESCOLHA
function continuarOpcao(opcaoEscolhida) {

    if (opcaoEscolhida.imagemDestaque) {

        abrirApresentacaoImagem(

            opcaoEscolhida.imagemDestaque,

            function() {

                iniciarRamificacao(opcaoEscolhida.falas || []);

            }

        );

        return;

    }

    iniciarRamificacao(opcaoEscolhida.falas || []);

}


// INICIAR RAMIFICAÇÃO
function iniciarRamificacao(novasFalas) {

    if (novasFalas.length > 0) {

        iniciarDialogoPersonalizado(novasFalas);

    } else {

        interfaceDialogo.style.display = "block";

        mostrarFala();

    }

}


// APRESENTAR IMAGEM AMPLIADA
function abrirApresentacaoImagem(caminho, aoFechar = null) {

    imagemDestaque.src = caminho;

    imagemDestaque.alt = "Imagem de destaque da história";

    apresentacaoImagem.style.display = "flex";

    imagemDestaqueAtiva = true;

    acaoAposImagem = aoFechar;

}

// FECHAR IMAGEM AMPLIADA
function fecharApresentacaoImagem() {

    if (!imagemDestaqueAtiva) return;

    apresentacaoImagem.style.display = "none";

    imagemDestaqueAtiva = false;


    // ADICIONAR CARTA DE DINALVA AO INVENTÁRIO
    if (imagemDestaque.src.includes("cartalidia.png")) {

        adicionarItemInventario({

            id: "carta_dinalva",

            nome: "Carta de Dinalva",

            imagem: "../assets/imagens/cartalidia.png",

            descricao: "Carta deixada por Dinalva e destinada a Dorothy. O documento pode conter informações sobre a investigação."

        });

    }


    // EXECUTAR AÇÃO APÓS FECHAR A IMAGEM
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


// AVANÇAR PARA A PRÓXIMA FALA
function proximaFala() {

    if (!dialogoAtivo) return;

    if (escolhaAtiva || imagemDestaqueAtiva) return;

    const dialogo = obterDialogoAtual();

    dialogo.indice++;

    mostrarFala();

}


// FINALIZAR DIÁLOGO
function finalizarDialogo() {

    dialogoAtivo = false;

    escolhaAtiva = false;

    imagemDestaqueAtiva = false;

    interfaceDialogo.style.display = "none";

    imagemPersonagem.style.display = "none";

    opcoesDialogo.innerHTML = "";

    opcoesDialogo.style.display = "none";

    apresentacaoImagem.style.display = "none";

    imagemDestaque.src = "";

    acaoAposImagem = null;

    pilhaDialogos = [];

}


// AVANÇAR COM CLIQUE
document.addEventListener("click", function(event) {

    if (!dialogoAtivo) return;

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


// AVANÇAR COM ENTER, ESPAÇO OU FECHAR COM ESC
document.addEventListener("keydown", function(event) {

    if (!dialogoAtivo) return;

    const quadroOverlay = document.getElementById("quadroOverlay");

    const papelOverlay = document.getElementById("papelOverlay");


    if (
        (quadroOverlay && quadroOverlay.style.display === "flex") ||
        (papelOverlay && papelOverlay.style.display === "flex")
    ) {

        return;

    }


    if (imagemDestaqueAtiva && event.key === "Escape") {

        event.preventDefault();

        fecharApresentacaoImagem();

        return;

    }


    if (escolhaAtiva || imagemDestaqueAtiva) return;

    if (event.repeat) return;


    if (
        event.key === "Enter" ||
        event.code === "Space"
    ) {

        event.preventDefault();

        proximaFala();

    }

});

// ==========================================
// DIÁLOGO APÓS ENCONTRAR TODAS AS PISTAS
// PORTA ABRINDO -> PASSOS -> LIDIA E AMÉLIA
// ==========================================

function iniciarDialogoPistas() {

    const falasPistas = [

        {
            nome: "Lidia",
            imagem: "../assets/imagens/Iara.png",
            texto: "Ei? Você! Entrega isso aqui pra Dorothy."
        },

        {
            imagemDestaque: "../assets/imagens/cartalidia.png",
            nome: "Lidia",
            imagem: "../assets/imagens/Iara.png",
            texto: "A Iara foi embora e eu tô sem tempo, aquela louca do quarto 096 fugiu de novo!"
        },

        {
            nome: "Amélia",
            imagem: "../assets/imagens/personagem.png",
            texto: "Preciso organizar todas essas pistas e descobrir o que fazer agora."
        }

    ];


    // OCULTAR O DIÁLOGO ATUAL
    interfaceDialogo.style.display = "none";

    dialogoAtivo = false;


    // VERIFICAR CONFIGURAÇÕES DE ÁUDIO
    const efeitosAtivos =
        localStorage.getItem("efeitosAtivos") !== "false";


    // INICIAR DIÁLOGO COM LIDIA
    function iniciarDialogoLidia() {

        iniciarDialogoPersonalizado(falasPistas);

    }


    // SE OS EFEITOS ESTIVEREM DESATIVADOS,
    // INICIAR DIRETAMENTE O DIÁLOGO
    if (!efeitosAtivos) {

        iniciarDialogoLidia();

        return;

    }


    // REPRODUZIR UM ÁUDIO E AGUARDAR SEU TÉRMINO
    function reproduzirAudio(caminho, aoTerminar) {

        const som = new Audio(caminho);

        som.preload = "auto";

        som.volume = 1;

        let audioFinalizado = false;


        function finalizarAudio() {

            if (audioFinalizado) return;

            audioFinalizado = true;

            som.removeEventListener("ended", finalizarAudio);
            som.removeEventListener("error", finalizarAudio);

            aoTerminar();

        }


        // QUANDO O ÁUDIO TERMINAR
        som.addEventListener("ended", finalizarAudio);


        // CASO OCORRA ALGUM ERRO
        som.addEventListener("error", function() {

            console.error(
                "Erro ao reproduzir áudio:",
                caminho,
                som.error
            );

            finalizarAudio();

        }, { once: true });


        // INICIAR REPRODUÇÃO
        som.play().catch(function(erro) {

            console.error(
                "Erro ao iniciar áudio:",
                caminho,
                erro
            );

            finalizarAudio();

        });

    }


    // PRIMEIRO: SOM DA PORTA ABRINDO
    reproduzirAudio(
        "../assets/audio/porta.mp3",

        function() {


            // SEGUNDO: SOM DOS PASSOS
            reproduzirAudio(
                "../assets/audio/passos.mp3",

                function() {


                    // TERCEIRO: INICIAR DIÁLOGO
                    iniciarDialogoLidia();

                }

            );

        }

    );

}


// AGUARDAR O FADE-IN
window.addEventListener("load", function() {

    const possuiFade = document.documentElement
        .classList.contains("fade-in-historia");

    const duracaoFade = possuiFade ? 1500 : 0;

    setTimeout(function() {

        iniciarDialogo();

    }, duracaoFade);

});
