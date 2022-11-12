module.exports = app => {
        const { existeOuErro, util_console, naoExisteNoBancoOuErro, msgPadraoErro, dataAtualFormatadaBR } = app.api.utilitarios

        const save = async (req, res) => {
                const atendenteBody = req.body
                const codigoAtendenteParams = req.params.codigo_atendente
                const modelo = {
                        nome_atendente: atendenteBody.nome_atendente,
                        senha: atendenteBody.senha,
                        id_empresa: 1,
                        id_perfil: atendenteBody.id_perfil,
                        desativado: atendenteBody.desativado,
                }

                try {
                        existeOuErro(modelo.nome_atendente, "[Nome*] deve ser preenchido.")
                        existeOuErro(modelo.senha, "[Senha*] deve ser preenchido.")
                        existeOuErro(modelo.id_empresa, "[Empresa*] deve ser preenchido.")
                        existeOuErro(modelo.id_perfil, "[Perfil de permissões*] deve ser preenchido.")
                        if (!codigoAtendenteParams) {
                                await naoExisteNoBancoOuErro("wpp_cadastro_atendentes", "nome_atendente", modelo.nome_atendente, "Já existe cadastro com o [Nome] informado!.")
                        } else {
                                const atendenteFromDB = await app.db.raw(`SELECT * FROM wpp_cadastro_atendentes WHERE nome_atendente='${modelo.nome_atendente}' AND codigo_atendente != ${codigoAtendenteParams}`)
                                if (atendenteFromDB.length > 0) throw "Já existe cadastro com o [Nome] informado!."
                        }
                } catch (msg) {
                        return res.status(400).send(msg)
                }

                if (codigoAtendenteParams) {
                        await app.db("wpp_cadastro_atendentes")
                                .update(modelo)
                                .where({ codigo_atendente: codigoAtendenteParams })
                                .then(() => res.status(204).send())
                                .catch(error => {
                                        util_console({ funcao: 'atendentes.save', tipo: 'ERRO', mensagem: 'Não foi possível editar atendente.', erro: error, salvarDB: true })
                                        return res.status(500).send(msgPadraoErro)
                                })
                } else {
                        await app.db("wpp_cadastro_atendentes")
                                .insert(modelo)
                                .then(() => res.status(204).send())
                                .catch(error => {
                                        util_console({ funcao: 'atendentes.save', tipo: 'ERRO', mensagem: 'Não foi possível cadastrar atendente.', erro: error, salvarDB: true })
                                        return res.status(500).send(msgPadraoErro)
                                })
                }
        }

        const get = (req, res) => {
                app.db.raw(`SELECT 
                wpp_cadastro_atendentes.codigo_atendente, 
                wpp_cadastro_atendentes.nome_atendente, 
                wpp_cadastro_atendentes.senha,
                wpp_cadastro_atendentes.desativado, 
                wpp_cadastro_atendentes.id_perfil, 
                wpp_cadastro_atendentes.cadastrado_em,  
                wpp_perfil_permissoes.nome_perfil 
                FROM wpp_cadastro_atendentes 
                INNER JOIN wpp_perfil_permissoes 
                ON wpp_cadastro_atendentes.id_perfil = wpp_perfil_permissoes.codigo_perfil
                WHERE wpp_cadastro_atendentes.codigo_atendente != 1
                AND wpp_cadastro_atendentes.excluido_em IS NULL
                ORDER BY wpp_cadastro_atendentes.codigo_atendente;`)
                        .then(atendentes => res.json(atendentes))
                        .catch(error => {
                                util_console({ funcao: 'atendentes.get', tipo: 'ERRO-500', mensagem: 'Não foi possível retornar cadastro de atendentes.', erro: error, salvarDB: true })
                                return res.status(500).send(msgPadraoErro)
                        })
        }

        const remove = async (req, res) => {
                const codigoParams = req.params.codigo_atendente;

                const atendenteFromDB = await app.db("wpp_cadastro_atendentes")
                        .where({ codigo_atendente: codigoParams }).first()
                try {
                        existeOuErro(atendenteFromDB, "Registro não encontrado. <br> Atualize a página e tente novamente.")
                } catch (msg) {
                        return res.status(400).send(msg)
                }
                const nomeExcluido = `${atendenteFromDB.nome_atendente}[${dataAtualFormatadaBR()}]`
                await app.db("wpp_cadastro_atendentes")
                        .update({ nome_atendente: nomeExcluido, excluido_em: app.db.fn.now() })
                        .where({ codigo_atendente: codigoParams })
                        .then(() => res.status(204).send())
                        .catch(error => {
                                util_console({ funcao: 'atendentes.remove', tipo: 'ERRO-500', mensagem: 'Não foi possível excluir o atendente.', erro: error, salvarDB: true })
                                return res.status(500).send(msgPadraoErro)
                        })
        }

        return { save, get, remove }
}
