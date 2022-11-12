const venom = require('venom-bot');

module.exports = app => {
        const { util_console, existeOuErro } = app.api.utilitarios

        /* ARMAZENA AS PROPRIEDADES DO WHATASSAP APOS SER AUTENTICADO */
        /* ATRAVES DESSE OBJETO VOCE CONSEGUE MANILUAR O WHATASSAPP(EX: ENVIAR MENSAGEM...) */
        const mainWppAutenticar = async (req, res) => {
                await venom
                        .create(
                                /* sessao= numero de contato da empresa */
                                /* Vem da tabela cadastro de empresa */
                                'wpp-main',
                                /* So entra aqui se ainda não tiver autenticado */
                                (base64Qr, asciiQR, attempts, urlCode) => {
                                        return res.json(urlCode) /* retornar o token */
                                },
                                // statusFind
                                (statusSession, session) => {
                                        /*  console.log('Status Session: ', statusSession);  *///return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser
                                },
                                // options
                                {
                                        multidevice: false, // for version not multidevice use false.(default: true)
                                        folderNameToken: 'tokens', //folder name when saving tokens
                                        mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
                                        headless: true, // Headless chrome
                                        devtools: false, // Open devtools by default
                                        useChrome: true, // If false will use Chromium instance
                                        debug: false, // Opens a debug session
                                        logQR: false, // Logs QR automatically in terminal
                                        browserWS: '', // If u want to use browserWSEndpoint
                                        browserArgs: [''], // Original parameters  ---Parameters to be added into the chrome browser instance
                                        addBrowserArgs: [''], // Add broserArgs without overwriting the project's original
                                        puppeteerOptions: {}, // Will be passed to puppeteer.launch
                                        disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
                                        disableWelcome: true, // Will disable the welcoming message which appears in the beginning
                                        updatesLog: true, // Logs info updates automatically in terminal
                                        autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
                                        createPathFileToken: false, // creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
                                        chromiumVersion: '818858', // Version of the browser that will be used. Revision strings can be obtained from omahaproxy.appspot.com.
                                        addProxy: [''], // Add proxy server exemple : [e1.p.webshare.io:01, e1.p.webshare.io:01]
                                        userProxy: '', // Proxy login username
                                        userPass: '' // Proxy password
                                },
                        )
                        .then((client) => {
                                /* Atualiza as informações do cadastro de empresa */
                                atualizarCadastroEmpresa(client);
                        })
                        .catch(error => {
                                util_console({ funcao: 'mainWppAutenticar', tipo: 'ERRO-500', mensagem: 'Não foi possível autenticar. Se for Error [ERR_HTTP_HEADERS_SENT] é porque no tempo que o qrcode é vigente.', erro: error, salvarDB: true })
                                return
                        })
        }

        /* Retorna os dados de autenticação do usuario, ex: nome, id, permissões...*/
        const login = async (req, res) => {
                const modeloLogin = {
                        nome_atendente: req.body.nome_atendente,
                        senha: req.body.senha,
                }
                try {
                        existeOuErro(modeloLogin.nome_atendente, "[Usuário] deve ser preenchido.")
                        existeOuErro(modeloLogin.senha, "[Senha] deve ser preenchido.")

                        const atendente = await app.db.raw(`
                        SELECT
                        wpp_cadastro_atendentes.codigo_atendente,
                        wpp_cadastro_atendentes.nome_atendente,
                        wpp_cadastro_atendentes.senha,
                        wpp_cadastro_atendentes.desativado,
                        wpp_cadastro_atendentes.excluido_em,
                      
                        wpp_cadastro_empresa.nome_empresa,
                        wpp_cadastro_empresa.contato_empresa,
			wpp_cadastro_empresa.url_imagem,
			wpp_cadastro_empresa.nome_display,
                        wpp_cadastro_empresa.status_atual,
                        wpp_cadastro_empresa.falha_autenticar,

                        wpp_perfil_permissoes.nome_perfil,
                        wpp_perfil_permissoes.menu_atendentes,
                        wpp_perfil_permissoes.cadastrar_atendentes,
                        wpp_perfil_permissoes.alterar_atendentes,
                        wpp_perfil_permissoes.excluir_atendentes,
                        wpp_perfil_permissoes.menu_clientes,
                        wpp_perfil_permissoes.cadastrar_clientes,
                        wpp_perfil_permissoes.alterar_clientes,
                        wpp_perfil_permissoes.excluir_clientes,
                        wpp_perfil_permissoes.menu_permissoes,
                        wpp_perfil_permissoes.cadastrar_permissoes,
                        wpp_perfil_permissoes.alterar_permissoes,
                        wpp_perfil_permissoes.excluir_permissoes,
                        wpp_perfil_permissoes.menu_campanhas,
                        wpp_perfil_permissoes.cadastrar_campanhas,
                        wpp_perfil_permissoes.alterar_campanhas,
                        wpp_perfil_permissoes.excluir_campanhas,
        
                        wpp_perfil_permissoes.menu_empresas,
                        wpp_perfil_permissoes.alterar_empresas
                        FROM wpp_cadastro_atendentes
                        INNER JOIN wpp_perfil_permissoes
                        ON wpp_cadastro_atendentes.id_perfil = wpp_perfil_permissoes.codigo_perfil
                        INNER JOIN wpp_cadastro_empresa ON wpp_cadastro_atendentes.id_empresa = wpp_cadastro_empresa.codigo_empresa
                        WHERE (((wpp_cadastro_atendentes.nome_atendente)='${modeloLogin.nome_atendente}')
                        AND ((wpp_cadastro_atendentes.senha)='${modeloLogin.senha}'));`)

                        existeOuErro(atendente[0], "Senha/Usuário inválido.")
                        if (atendente[0].desativado) throw 'Usuário desativado.'
                        if (atendente[0].excluido_em) throw 'Usuário Excluido.'
                        const modelo = { ...atendente[0] }
                        /* Se o codigo do atendente for =1, seta todas permissao como true*/
                        if (modelo.codigo_atendente == 1) {
                                modelo.menu_atendentes = true;
                                modelo.cadastrar_atendentes = true;
                                modelo.alterar_atendentes = true;
                                modelo.excluir_atendentes = true;
                                modelo.menu_clientes = true;
                                modelo.cadastrar_clientes = true;
                                modelo.alterar_clientes = true;
                                modelo.excluir_clientes = true;
                                modelo.menu_permissoes = true;
                                modelo.cadastrar_permissoes = true;
                                modelo.alterar_permissoes = true;
                                modelo.excluir_permissoes = true;
                                modelo.menu_campanhas = true;
                                modelo.cadastrar_campanhas = true;
                                modelo.alterar_campanhas = true;
                                modelo.excluir_campanhas = true;
                                modelo.menu_empresas = true;
                                modelo.alterar_empresas = true;
                                modelo.status_atual = "CONNECTED"
                        }
                        return res.json(modelo)
                } catch (msg) {
                        return res.status(400).send(msg)
                }
        }

        async function atualizarCadastroEmpresa(client) {
                let getWAVersion
                let getHostDevice
                let nmrAutenticado

                try {
                        getWAVersion = await client.getWAVersion();
                        getHostDevice = await client.getHostDevice();

                        /* Número do whatsapp que foi autenticado */
                        nmrAutenticado = getHostDevice.id.user

                } catch (error) {
                        util_console({ funcao: 'atualizarCadastroEmpresa', tipo: 'ERRO-500', mensagem: '[TRY 1] Não foi possível o cadastro de empresa.', erro: error, salvarDB: true })
                }

                const modeloStatusEmpresa = {
                        url_imagem: getHostDevice.imgUrl,
                        nome_display: getHostDevice.displayName,
                        ultimo_nmr_autenticado: nmrAutenticado,
                        status_atual: null,
                        falha_autenticar: null,
                        is_business: getHostDevice.isBusiness,
                        wts_version: getWAVersion,
                }

                const empresaFromDB = await app.db("wpp_cadastro_empresa").where({ contato_empresa: nmrAutenticado }).first()
                if (!empresaFromDB) {
                        try {
                                client.close();
                                modeloStatusEmpresa.falha_autenticar = "WhatsApp não condiz com o cadastro da empresa.";
                                util_console({ funcao: 'atualizarCadastroEmpresa', tipo: 'ERRO-400', mensagem: 'WhatsApp não condiz com o cadastro da empresa.', erro: 'WhatsApp não condiz com o cadastro da empresa.', salvarDB: true })
                        } catch (error) {
                                util_console({ funcao: 'atualizarCadastroEmpresa', tipo: 'ERRO-500', mensagem: '[TRY 2] Não foi possível o cadastro de empresa.', erro: error, salvarDB: true })
                        }
                } else {
                        /* main data autenticacao */
                        app.whatasappData = client;
                }
                app.db('wpp_cadastro_empresa')
                        .update(modeloStatusEmpresa)
                        .then()
                        .catch(error => {
                                util_console({ funcao: 'atualizarCadastroEmpresa', tipo: 'ERRO-500', mensagem: '[TRY 3] Não foi possível o cadastro de empresa.', erro: error, salvarDB: true })
                                return
                        })
        }

        const getStatusAutenticacao = async (req, res) => {
                app.db
                        .table("wpp_cadastro_empresa")
                        .select(
                                "nome_empresa",
                                "contato_empresa",
                                "url_imagem",
                                "nome_display",
                                "ultimo_nmr_autenticado",
                                "status_atual",
                                "falha_autenticar")
                        .first()
                        .then(empresa => res.json(empresa))
                        .catch(error => {
                                util_console({ funcao: 'getStatusAutenticacao', tipo: 'ERRO-500', mensagem: 'Não foi possível atualizar o status da empresa.', erro: error, salvarDB: true })
                                return res.status(500).send(error)
                        })

        }

        return { mainWppAutenticar, login, getStatusAutenticacao }
}