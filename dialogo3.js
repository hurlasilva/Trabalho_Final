
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


// ITEM ATUALMENTE ABERTO NO INVENTÁRIO
let itemVisualizadoAtual = null;


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


/* ==========================================
   SISTEMA DE NOTIFICAÇÃO DO INVENTÁRIO
========================================== */

// RECUPERAR ITENS SALVOS
function obterItensSalvosInventario() {

    try {

        return JSON.parse(
            sessionStorage.getItem("inventarioSantaGloria") || "[]"
        );

    } catch (erro) {

        console.error("Erro ao consultar inventário:", erro);

        return [];

    }

}


// AÇÃO EXECUTADA DEPOIS DE FECHAR A NOTIFICAÇÃO
let acaoAposNotificacao = null;


// ADICIONAR ITEM E MOSTRAR NOTIFICAÇÃO
function adicionarItemComNotificacao(item) {

    if (!item) return;

    // VERIFICAR SE O ITEM JÁ EXISTE
    const itensAtuais = obterItensSalvosInventario();

    const jaExiste = itensAtuais.some(
        existente => existente.id === item.id
    );

    if (jaExiste) return;

    // UTILIZAR A FUNÇÃO ORIGINAL DO INVENTÁRIO
    adicionarItemInventario(item);

    // MOSTRAR NOTIFICAÇÃO
    mostrarNotificacaoItem(item);

}


// MOSTRAR TELA DE ITEM ADICIONADO
function mostrarNotificacaoItem(item) {

    const tela = document.getElementById(
        "notificacaoItemInventario"
    );

    document.getElementById(
        "imagemNotificacaoItem"
    ).src = item.imagem;

    document.getElementById(
        "imagemNotificacaoItem"
    ).alt = item.nome;

    document.getElementById(
        "nomeNotificacaoItem"
    ).textContent = item.nome;

    document.getElementById(
        "descricaoNotificacaoItem"
    ).textContent = item.descricao || "Novo objeto encontrado.";

    tela.style.display = "flex";

}


// FECHAR NOTIFICAÇÃO E EXECUTAR A PRÓXIMA AÇÃO
function fecharNotificacaoItem() {

    document.getElementById(
        "notificacaoItemInventario"
    ).style.display = "none";


    // EXECUTAR AÇÃO DEPOIS DE FECHAR A NOTIFICAÇÃO
    if (acaoAposNotificacao) {

        const acao = acaoAposNotificacao;

        acaoAposNotificacao = null;

        acao();

    }

}


/* ==========================================
   ABRIR OBJETOS DO INVENTÁRIO
========================================== */

// ABRIR OBJETO SELECIONADO
function abrirVisualizacaoItem(item) {

    if (!item) return;

    const tela = document.getElementById(
        "visualizacaoItemInventario"
    );

    // GUARDAR O ITEM QUE ESTÁ SENDO VISUALIZADO
    itemVisualizadoAtual = item;

    document.getElementById(
        "imagemObjetoInventario"
    ).src = item.imagem;

    document.getElementById(
        "imagemObjetoInventario"
    ).alt = item.nome;

    document.getElementById(
        "nomeObjetoInventario"
    ).textContent = item.nome;

    document.getElementById(
        "descricaoObjetoInventario"
    ).textContent = item.descricao ||
        "Nenhuma descrição disponível.";


    // TRANSFORMAR O BOTÃO EM BOTÃO DE REMOÇÃO
    const botaoAcao = document.querySelector(
        ".botao-fechar-objeto"
    );

    if (botaoAcao) {

        botaoAcao.textContent = "Retirar do inventário";

        botaoAcao.onclick = removerItemVisualizado;

    }

    tela.style.display = "flex";

}


// FECHAR OBJETO
function fecharVisualizacaoItem() {

    document.getElementById(
        "visualizacaoItemInventario"
    ).style.display = "none";

    itemVisualizadoAtual = null;

}


// REMOVER OBJETO DO INVENTÁRIO
function removerItemVisualizado() {

    if (!itemVisualizadoAtual) return;

    const idItem = itemVisualizadoAtual.id;

    // UTILIZAR A FUNÇÃO ORIGINAL DO inventario.js
    if (typeof removerItemInventario === "function") {

        removerItemInventario(idItem);

        // FECHAR A VISUALIZAÇÃO
        fecharVisualizacaoItem();

    } else {

        console.error(
            "A função removerItemInventario() não foi encontrada."
        );

    }

}


// IDENTIFICAR CLIQUE NOS ITENS DO INVENTÁRIO
const listaObjetosInventario = document.getElementById(
    "listaItensInventario"
);

if (listaObjetosInventario) {

    listaObjetosInventario.addEventListener("click", function(event) {

        const botao = event.target.closest(".item-inventario");

        if (!botao || !listaObjetosInventario.contains(botao)) {
            return;
        }

        // RECUPERAR O ITEM CLICADO
        const itens = obterItensSalvosInventario();

        const itemSelecionado = itens.find(
            item => item.nome === botao.title
        );

        if (!itemSelecionado) return;

        // ABRIR VISUALIZAÇÃO
        abrirVisualizacaoItem(itemSelecionado);

    });

}


// FECHAR JANELAS COM ESC
document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        const visualizacao = document.getElementById(
            "visualizacaoItemInventario"
        );

        const notificacao = document.getElementById(
            "notificacaoItemInventario"
        );

        if (visualizacao && visualizacao.style.display === "flex") {

            event.preventDefault();
            event.stopImmediatePropagation();

            fecharVisualizacaoItem();

        } else if (notificacao && notificacao.style.display === "flex") {

            event.preventDefault();
            event.stopImmediatePropagation();

            fecharNotificacaoItem();

        }

    }

});


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


    // VERIFICAR SE A FALA POSSUI IMAGEM DE DESTAQUE
    if (fala.imagemDestaque) {

        // VERIFICAR SE A IMAGEM É A CARTA DA LÍDIA
        if (fala.imagemDestaque.includes("cartalidia.png")) {

            const cartaLidia = {

                id: "carta_dinalva",

                nome: "Carta de Dinalva",

                imagem: "../assets/imagens/cartalidia.png",

                descricao: "Carta deixada por Dinalva e destinada a Dorothy. O documento pode conter informações sobre a investigação."

            };


            // VERIFICAR SE A CARTA JÁ ESTÁ NO INVENTÁRIO
            const itensAtuais = obterItensSalvosInventario();

            const cartaJaExiste = itensAtuais.some(
                item => item.id === cartaLidia.id
            );


            if (!cartaJaExiste) {

                // BLOQUEAR O AVANÇO DO DIÁLOGO
                imagemDestaqueAtiva = true;

                // DEFINIR A AÇÃO ANTES DA NOTIFICAÇÃO
                acaoAposNotificacao = function() {

                    abrirApresentacaoImagem(fala.imagemDestaque);

                };

                // ADICIONAR A CARTA E MOSTRAR A NOTIFICAÇÃO
                adicionarItemComNotificacao(cartaLidia);

            } else {

                // SE JÁ EXISTIR, ABRIR A IMAGEM NORMALMENTE
                abrirApresentacaoImagem(fala.imagemDestaque);

            }

        } else {

            // OUTRAS IMAGENS CONTINUAM FUNCIONANDO NORMALMENTE
            abrirApresentacaoImagem(fala.imagemDestaque);

        }

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

    // IDENTIFICAR A CARTA DA LÍDIA
    imagemDestaque.classList.toggle(
        "carta-lidia-destaque",
        caminho.includes("cartalidia.png")
    );

    apresentacaoImagem.style.display = "flex";

    imagemDestaqueAtiva = true;

    acaoAposImagem = aoFechar;

}


// FECHAR IMAGEM AMPLIADA
function fecharApresentacaoImagem() {

    if (!imagemDestaqueAtiva) return;

    apresentacaoImagem.style.display = "none";

    imagemDestaqueAtiva = false;


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
    imagemDestaque.classList.remove("carta-lidia-destaque");

    acaoAposImagem = null;

    pilhaDialogos = [];


    // VERIFICAR CONFIGURAÇÕES DE ÁUDIO
    const efeitosAtivos =
        localStorage.getItem("efeitosAtivos") !== "false";


    // SE OS EFEITOS ESTIVEREM DESATIVADOS,
    // NÃO REPRODUZIR OS ÁUDIOS
    if (!efeitosAtivos) return;


    // REPRODUZIR ÁUDIO E AGUARDAR SEU TÉRMINO
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

        som.addEventListener("ended", finalizarAudio);

        som.addEventListener("error", function() {

            console.error(
                "Erro ao reproduzir áudio:",
                caminho,
                som.error
            );

            finalizarAudio();

        }, { once: true });

        som.play().catch(function(erro) {

            console.error("Erro ao iniciar áudio:", erro);

            finalizarAudio();

        });

    }


    // PRIMEIRO: PASSOS
    reproduzirAudio(
        "../assets/audio/passos.mp3",

        function() {

            // SEGUNDO: PORTA
            reproduzirAudio(
                "../assets/audio/porta.mp3",

                function() {

                    // AGUARDAR O JOGADOR ENCONTRAR AS DUAS PISTAS.

                }
            );

        }
    );

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

    // NÃO INTERFERIR NO FECHAMENTO DA NOTIFICAÇÃO
    const notificacao = document.getElementById(
        "notificacaoItemInventario"
    );

    if (notificacao && notificacao.style.display === "flex") {

        return;

    }

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
