module.exports = app => {
        const { existeOuErro, util_console, msgPadraoErro } = app.api.utilitarios
        const { enviarMensagemTexto } = app.api.wppMensagens
        const save = async (req, res) => {
                const campanhaReq = req.body
                const codigoCampanha = req.params.codigo_campanha
                const clientesSelecionados = req.body.selecionados;

                const modelo = {
                        origem: campanhaReq.origem,
                        titulo_campanha: campanhaReq.titulo_campanha,
                        mensagem_texto: campanhaReq.mensagem_texto,
                        nome_atendente: campanhaReq.nome_atendente,
                        status: campanhaReq.status,
                }

                try {
                        existeOuErro(modelo.origem, "[Origem] Não pode ser nulo.")
                        if (codigoCampanha && modelo.origem == 'Gerenciador') existeOuErro(modelo.titulo_campanha, "[titulo_campanha] Não pode ser nulo.")
                        if (codigoCampanha && modelo.origem == 'Gerenciador') existeOuErro(modelo.mensagem_texto, "[Conteudo*] Não pode ser nulo.")
                        if (modelo.origem != 'Gerenciador') existeOuErro(modelo.titulo_campanha, "[titulo_campanha] Não pode ser nulo.")
                        if (modelo.origem != 'Gerenciador') existeOuErro(modelo.titulo_campanha, "[Conteudo*] Não pode ser nulo.")
                        if (modelo.status == 'Confirmado') if (0 >= clientesSelecionados.length) throw "Selecione pelo menos 1 cliente para sua campanha."
                        if (codigoCampanha) {
                                const campnha = await app.db.select().table('wpp_campanha').where({ codigo_campanha: codigoCampanha }).first()
                                if (campnha.confirmado_em) throw "Campanhas Confirmadas/Finalizadas não podem ser alteradas!."
                        }
                } catch (msg) {
                        return res.status(400).send(msg)
                }

                /* Faz o pree-cadastro da campanha. Para ser possivel adicionar os clientes na campanha precisa ter o codigo da campanha[codigo_campanha] */
                if (!codigoCampanha && modelo.origem == 'Gerenciador') {
                        const modeloPreeCadcastro = {
                                origem: modelo.origem,
                                nome_atendente: modelo.nome_atendente,
                                status: modelo.status,
                        }
                        const codigoCampanha = await app.db.insert(modeloPreeCadcastro)
                                .table("wpp_campanha")
                                .returning('codigo_campanha')
                                .then((codigo_campanha) => { return codigo_campanha[0] })
                                .catch(error => {
                                        util_console({ funcao: 'wppCampanha.save', tipo: 'ERRO', mensagem: 'Não foi possível pree-cadastrar a campanha', erro: error, salvarDB: true })
                                        return res.status(500).send(msgPadraoErro)
                                })
                        /* Retorna o [codigo_campanha] da campanha pree-cadastrada. */
                        return res.json(codigoCampanha)
                }


                await app.db.transaction(async trans => {
                        const FronDB = await trans.select().table('wpp_fila_execucao').where({ id_campanha: codigoCampanha }).first()
                        if (FronDB) await trans.delete().table("wpp_fila_execucao").where({ id_campanha: codigoCampanha })

                        /* Se se tiver sido selecionado clientes para campanha adiciona a tabela de fila. */
                        if (clientesSelecionados.length > 0) {
                                await trans.insert(clientesSelecionados)
                                        .table("wpp_fila_execucao")

                                /* Se o status == Confirmado, seta [enviar] como true */
                                if (modelo.status == 'Confirmado') {
                                        modelo.confirmado_em = app.db.fn.now()
                                        await trans.update({ enviar: true })
                                                .table("wpp_fila_execucao")
                                                .where({ id_campanha: codigoCampanha })
                                }
                        }

                        await trans.update(modelo)
                                .table("wpp_campanha")
                                .where({ codigo_campanha: codigoCampanha })
                })
                        .then(() => res.status(204).send())
                        .catch(error => {
                                util_console({ funcao: 'wppCampanha.save', tipo: 'ERRO', mensagem: 'Não foi possível editar a campanha.', erro: error, salvarDB: true })
                                return res.status(500).send(msgPadraoErro)
                        })
        }

        const get = (req, res) => {
                app.db
                        .table("wpp_campanha")
                        .select(
                                "codigo_campanha",
                                "origem",
                                "titulo_campanha",
                                "mensagem_texto",
                                "nome_atendente",
                                "status",
                                "confirmado_em",
                                "cadastrado_em")
                        .whereNotNull("status")
                        .whereNull("excluido_em")
                        .orderBy('codigo_campanha', 'DESC')
                        .then(campanha => res.json(campanha))
                        .catch(error => {
                                util_console({ funcao: 'wppCampanha.get', tipo: 'ERRO-500', mensagem: 'Não foi possível retornar os cadastro de campanhas.', erro: error, salvarDB: true })
                                return res.status(500).send(msgPadraoErro)
                        })
        }

        const getCampanhaClientes = async (req, res) => {
                const codigo_campanha = req.params.codigo_campanha
                let clientes = [];
                try {
                        existeOuErro(codigo_campanha, "[codigo_campanha] Não pode ser nulo")
                } catch (error) {
                        util_console({ funcao: 'wppCampanha.getCampanhaClientes', tipo: 'ERRO-400', mensagem: 'Não foi possível retornar os cadastro dos clientes para carregar na campanha.', erro: error, salvarDB: true })
                        return res.status(500).send(msgPadraoErro)
                }
                try {

                        clientes = await app.db.raw(`SELECT 
                                wpp_view_clientes_integrar.codigo_serial, 
                                wpp_view_clientes_integrar.nome_cliente, 
                                wpp_view_clientes_integrar.nmr_whatsapp, 
                                wpp_view_clientes_integrar.empresa, 
                                wpp_view_clientes_integrar.cpf_cnpj, 
                                wpp_view_clientes_integrar.codigo_integracao, 
                                wpp_view_clientes_integrar.cadastrado_em, 
                                Max(IIf([id_campanha]= ${codigo_campanha},1,0)) AS selecionado
                                FROM wpp_view_clientes_integrar 
                                LEFT JOIN wpp_fila_execucao 
                                ON wpp_view_clientes_integrar.codigo_serial = 
                                wpp_fila_execucao.id_cliente
                                GROUP BY wpp_view_clientes_integrar.codigo_serial, 
                                wpp_view_clientes_integrar.nome_cliente, 
                                wpp_view_clientes_integrar.nmr_whatsapp, 
                                wpp_view_clientes_integrar.empresa, 
                                wpp_view_clientes_integrar.cpf_cnpj, 
                                wpp_view_clientes_integrar.codigo_integracao, 
                                wpp_view_clientes_integrar.cadastrado_em, 
                                wpp_view_clientes_integrar.[desativado], 
                                wpp_view_clientes_integrar.excluido_em
                                HAVING (((wpp_view_clientes_integrar.[desativado])=0) 
                                AND ((wpp_view_clientes_integrar.excluido_em) Is Null))
                                ORDER BY wpp_view_clientes_integrar.nome_cliente, 
                                Max(IIf([id_campanha]= ${codigo_campanha},1,0));`)

                        const CliSelecionados = await app.db
                                .table("wpp_fila_execucao")
                                .select(
                                        "id_campanha",
                                        "id_cliente",
                                        "nome_cliente",
                                        "codigo_integracao",
                                        "nmr_whatsapp",
                                        "msg_result",
                                        "mensagem_texto")
                                .where({ id_campanha: codigo_campanha })
                        return res.json({ clientes, CliSelecionados })
                } catch (error) {
                        util_console({ funcao: 'wppCampanha.getCampanhaClientes', tipo: 'ERRO-500', mensagem: 'Não foi possível retornar os cadastro dos clientes para carregar na campanha.', erro: error, salvarDB: true })
                        return res.status(500).send(msgPadraoErro)
                }
        }

        const remove = async (req, res) => {
                const codigo_campanha = req.params.codigo_campanha
                try {
                        const campanhaFromDB = await app.db("wpp_campanha")
                                .where({ codigo_campanha: codigo_campanha }).first()
                        existeOuErro(campanhaFromDB, "Registro não encontrado. <br> Atualize a página e tente novamente.")
                        /* Se o registro já foi confirmado nao pode ser excluido */
                        if (campanhaFromDB.confirmado_em) {
                                throw "O registro não pode ser excluído."
                        }
                } catch (msg) {
                        return res.status(400).send(msg)
                }
                await app.db("wpp_campanha")
                        .update({ excluido_em: app.db.fn.now(), status: "Excluído" })
                        .where({ codigo_campanha: codigo_campanha })
                        .then(() => res.status(204).send())
                        .catch(error => {
                                util_console({ funcao: 'wppCampanha.remove', tipo: 'ERRO-500', mensagem: 'Não foi possível excluir a campanha.', erro: error, salvarDB: true })
                                return res.status(500).send(msgPadraoErro)
                        })
        }

        /* Função reponsável por consultar 1 registro da fila(wpp_fila_execucao) e executar. */
        async function wpp_fila_execucao() {
                /* Consulta 1 registro na tabela */
                const processo = await app.db.select()
                        .table('wpp_fila_execucao')
                        .where({ enviar: true })
                        .whereNull("enviado_em")
                        .andWhere('nivel_prioridade', '>', -3)
                        .orderBy('nivel_prioridade', 'desc')
                        .orderBy('codigo_processo', 'ASC')
                        .first()

                if (processo) {
                        /* 
                        Seta [enviado_em=true] para evitar que seja chamada novamente e envie a mensagem x2.
                        Ser der erro no envio e setada para Null,  para tentar o envio novamente.
                        Toda vez que for executada, seta a prioridade como negativa(--), para que seja enviado ao final da fila.
                        Se apos 3 tentativas o erro persisitir, nao sera mais enviado para fila.
                        */
                        await setEnviadoNivelPrioridade(processo.codigo_processo, processo.nivel_prioridade)

                        /* Chama a função responsavel por validar qual vai ser o [tipo_executar] 1-mensagem simples; 2-mensagem template; 3-chamar função */
                        tipoExecutarProcesso(processo)
                }

                async function setEnviadoNivelPrioridade(codigo_processo, nivel_prioridade) {
                        if (nivel_prioridade >= 0) {
                                await app.db('wpp_fila_execucao')
                                        .update({ enviado_em: app.db.fn.now(), nivel_prioridade: -1 })
                                        .where({ codigo_processo: codigo_processo })
                                        .then()
                                        .catch(error => {
                                                util_console({ funcao: 'setEnviadoNivelPrioridade', tipo: 'ERRO-500', mensagem: 'Não foi possível atualizar [enviado_em] e [nivel_prioridade]', erro: error, salvarDB: true })
                                        })
                        } else {
                                await app.db('wpp_fila_execucao')
                                        .update({ enviado_em: app.db.fn.now(), nivel_prioridade: --nivel_prioridade })
                                        .where({ codigo_processo: codigo_processo })
                                        .then()
                                        .catch(error => {
                                                util_console({ funcao: 'setEnviadoNivelPrioridade', tipo: 'ERRO-500', mensagem: 'Não foi possível atualizar [enviado_em] e [nivel_prioridade]', erro: error, salvarDB: true })
                                        })
                        }
                }

                function tipoExecutarProcesso(processo) {
                        switch (processo.tipo_executar) {
                                case 1: /* Enviar mensagem simples digitada */
                                        enviarMensagemTexto(processo)
                                        break;

                                case 2: /* Enviar mensagem com template(pree-cadastrada) */

                                        break;

                                case 3: /* Executar função */

                                        break;
                                default:
                                        break;
                        }
                }
        }

        /*     Simples
            novoProcesso({
                tipo_executar: 1,
                mensagem_texto: 'Mensagem teste',
                nmr_whatsapp: '8399675920',
                nivel_prioridade: 0
            })
         
            Template
            novoProcesso({
                tipo_executar: 2,
                nome_template: 'BOAS_VIDNDAS',
                nmr_whatsapp: '8399675920',
                nivel_prioridade: 0
            })
         
            Função
            novoProcesso({
                tipo_executar: 3,
                nome_funcao: 'TRANSFERIR',
                nivel_prioridade: 0
            }) */

        /* Cadastrar um novo processo */
        function novoProcesso({
                tipo_executar,
                mensagem_texto,
                nome_template,
                nome_funcao,
                nmr_whatsapp,
                nome_atendente,
                nivel_prioridade,
        }) {
                const modelo = {
                        tipo_executar,
                        mensagem_texto,
                        nome_template,
                        nome_funcao,
                        nmr_whatsapp,
                        nome_atendente,
                        nivel_prioridade,
                }
                /* 
                [tipo_executar]* Não pode ser nulo, precisa sem preenchida com uma das opçoes: 1, 2 ou 3 
                    [tipo_executar] = 1 - Enviar mensagem simples(texto). [mensagem_texto]* precisa se preenchido com a mensagem a ser enviada.  
                    [tipo_executar] = 2- Enviar mensagem template. [nome_template]* precisa se preenchido com o nome do template a ser enviado.
                    [tipo_executar] = 3- Executar uma função. [nome_funcao]* precisa ser preenchido com o nome da função que sera executada. 
         
                [mensagem_texto] precisa ser preenchida quando [tipo_executar] = 1, a mensagem preenchida vai ser enviada para o cliente.
                [nome_template] precisa ser preenchida quando [tipo_executar] = 2, preencher com o nome do template a ser enviado. [wpp_mensagens_templates > template].
                [nome_funcao] precisa ser preenchida quando [tipo_executar] = 3, preencher com o nome da função a ser executada
                [nmr_whatsapp] preencher com o número de contato destino, 10 digitos(ex: 8399675920), se [tipo_executar] = 1 ou 2, obrigatoriamente precisa ser preenchida.
                [nome_atendente] preencher com o nome do atendente que ta enviando a mensagem.
                [nivel_prioridade] preencher com o nivel de prioridade de envio. 0 menor nivel, 9 maior nivel de prioridade, isso quer dizer que a 9 vai ser enviado primeiro.
                */
                try {
                        existeOuErro(modelo.tipo_executar, "[tipo_executar]* Não pode ser nulo, precisa sem preenchida com uma das opçoes: 1, 2 ou 3")
                        if (tipo_executar != 1 && tipo_executar != 2 && tipo_executar != 3) throw '[tipo_executar]* precisa ser preenchido com: 1, 2 ou 3.'
                        if (tipo_executar == 1 || tipo_executar == 2) {
                                existeOuErro(nmr_whatsapp, "[nmr_whatsapp] preencher com o número de contato destino, 10 digitos(ex: 8399675920), se [tipo_executar] = 1 ou 2, obrigatoriamente precisa ser preenchida.")
                                if (nmr_whatsapp.length != 10) throw '[nmr_whatsapp] precisa ter o tamanho válido de 10 digitos(ex: 8399675920).'
                        }
                } catch (error) {
                        util_console({ funcao: 'novoProcesso', tipo: 'ERRO-400', mensagem: 'Não foi possível adicionar um novo processo.', erro: error, salvarDB: true })
                        return
                }
                switch (tipo_executar) {
                        case 1:
                                try {
                                        existeOuErro(mensagem_texto, "[mensagem_texto] precisa ser preenchida quando [tipo_executar] = 1, a mensagem preenchida vai ser enviada para o cliente.")
                                } catch (error) {
                                        util_console({ funcao: 'novoProcesso[tipo_executar=1]', tipo: 'ERRO-400', mensagem: 'Não foi possível adicionar um novo processo.', erro: error, salvarDB: true })
                                        return
                                }
                                break;
                        case 2:
                                try {
                                        existeOuErro(nome_template, "[nome_template] precisa ser preenchida quando [tipo_executar] = 2, preencher com o nome do template a ser enviado. [wpp_mensagens_templates > template].")
                                } catch (error) {
                                        util_console({ funcao: 'novoProcesso[tipo_executar=2]', tipo: 'ERRO-400', mensagem: 'Não foi possível adicionar um novo processo.', erro: error, salvarDB: true })
                                        return
                                }
                                break;
                        case 3:
                                try {
                                        existeOuErro(nome_funcao, "[nome_funcao] precisa ser preenchida quando [tipo_executar] = 3, preencher com o nome da função a ser executada")
                                } catch (error) {
                                        util_console({ funcao: 'novoProcesso[tipo_executar=3]', tipo: 'ERRO-400', mensagem: 'Não foi possível adicionar um novo processo.', erro: error, salvarDB: true })
                                        return
                                }
                                break;

                        default:
                                /* Improvavel que chege ate aqui, pois tem validação no inicio. */
                                util_console({ funcao: 'novoProcesso[tipo_executar != 1, 2, 3]', tipo: 'ERRO-400', mensagem: 'Não foi possível adicionar um novo processo.', erro: error, salvarDB: true })
                                break;
                }

                app.db.table('wpp_fila_execucao')
                        .insert(modelo)
                        .then()
                        .catch(error => {
                                util_console({ funcao: 'novoProcesso', tipo: 'ERRO-500', mensagem: 'Erro para salvar novoProcesso.', erro: error, salvarDB: true })
                        })
        }

        return { save, get, remove, wpp_fila_execucao, getCampanhaClientes }
}
