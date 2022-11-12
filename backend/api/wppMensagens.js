module.exports = app => {
        const { util_console } = app.api.utilitarios

        async function enviarMensagemTexto(processo) {
                const codigo_processo = processo.codigo_processo
                const nmr_whatsapp = processo.nmr_whatsapp
                const mensagem_texto = processo.mensagem_texto

                await app.whatasappData
                        .sendText(`55${nmr_whatsapp}@c.us`, mensagem_texto)
                        .then(() => {
                                /* Seta [enviado_em = DataAtual], já tava definido antes, mas por garantia seta novamente. */
                                setEnviado({ codigo_processo, enviado_em: app.db.fn.now(), msg_result: 'Success.' })
                        })
                        .catch((error) => {
                                /* Como deu erro seta [enviado_em==null] para voltar para a fila de envio */
                                setEnviado({ codigo_processo, enviado_em: null, msg_result: error.text })
                                util_console({ funcao: 'enviarMensagemTexto', tipo: 'ERRO-500', mensagem: '[sendText] Não foi possível enviar mensagem de texto.', erro: JSON.stringify(error), salvarDB: true })
                                return
                        });
                /*  setEnviado({ codigo_processo, enviado_em: null, msg_error: JSON.stringify(error), msg_result: null }) */
        }

        async function setEnviado({ codigo_processo, enviado_em, msg_result }) {
                /* Senta o número de contato da empresa que ta enviado a mensagem/autenticada na coluna [contato_empresa] */
                const empresaFromDB = await app.db("wpp_cadastro_empresa").first()
                const modelo = {
                        enviado_em,
                        msg_result,
                        contato_empresa: empresaFromDB.contato_empresa
                }
                app.db('wpp_fila_execucao')
                        .update(modelo)
                        .where({ codigo_processo: codigo_processo })
                        .then()
                        .catch(error => {
                                util_console({ funcao: 'setEnviado', tipo: 'ERRO-500', mensagem: 'Não foi possível atualizar [enviado_em]', erro: error, salvarDB: true })
                        })
        }
        async function setNivelPrioridade(codigo_processo, setNivel = 0) {
                app.db('wpp_fila_execucao')
                        .update({ nivel_prioridade: setNivel })
                        .where({ codigo_processo: codigo_processo })
                        .then()
                        .catch(error => {
                                util_console({ funcao: 'setNivelPrioridade', tipo: 'ERRO-500', mensagem: 'Não foi possível atualizar [nivel_prioridade]', erro: error, salvarDB: true })
                        })
        }

        return { enviarMensagemTexto }
}