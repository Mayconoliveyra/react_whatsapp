module.exports = app => {
        const { existeOuErro, naoExisteNoBancoOuErro, util_console, msgPadraoErro, dataAtualFormatadaBR } = app.api.utilitarios

        const save = async (req, res) => {
                const prefilBody = req.body
                const codigoParams = req.params.codigo_perfil
                const modelo = {
                        nome_perfil: prefilBody.nome_perfil,
                        menu_atendentes: prefilBody.menu_atendentes,
                        cadastrar_atendentes: prefilBody.cadastrar_atendentes,
                        alterar_atendentes: prefilBody.alterar_atendentes,
                        excluir_atendentes: prefilBody.excluir_atendentes,
                        menu_clientes: prefilBody.menu_clientes,
                        cadastrar_clientes: prefilBody.cadastrar_clientes,
                        alterar_clientes: prefilBody.alterar_clientes,
                        excluir_clientes: prefilBody.excluir_clientes,
                        menu_permissoes: prefilBody.menu_permissoes,
                        cadastrar_permissoes: prefilBody.cadastrar_permissoes,
                        alterar_permissoes: prefilBody.alterar_permissoes,
                        excluir_permissoes: prefilBody.excluir_permissoes,
                        menu_campanhas: prefilBody.menu_campanhas,
                        cadastrar_campanhas: prefilBody.cadastrar_campanhas,
                        alterar_campanhas: prefilBody.alterar_campanhas,
                        excluir_campanhas: prefilBody.excluir_campanhas,
                        menu_empresas: prefilBody.menu_empresas,
                        alterar_empresas: prefilBody.alterar_empresas,
                        desativado: prefilBody.desativado,
                }
                try {
                        existeOuErro(modelo.nome_perfil, "[Nome*] deve ser preenchido.")

                        if (!codigoParams) {
                                await naoExisteNoBancoOuErro("wpp_perfil_permissoes", "nome_perfil", modelo.nome_perfil, "Já existe cadastro com o [Nome] informado!.")
                        } else {
                                const perfilFromDB = await app.db.raw(`SELECT * FROM wpp_perfil_permissoes WHERE nome_perfil='${modelo.nome_perfil}' AND codigo_perfil != ${codigoParams}`)
                                if (perfilFromDB.length > 0) throw "Já existe cadastro com o [Nome] informado!."
                        }
                } catch (msg) {
                        return res.status(400).send(msg)
                }

                if (codigoParams) {
                        await app.db("wpp_perfil_permissoes")
                                .update(modelo)
                                .where({ codigo_perfil: codigoParams })
                                .then(() => res.status(204).send())
                                .catch(error => {
                                        util_console({ funcao: 'perfilPermissoes.save', tipo: 'ERRO', mensagem: 'Não foi possível editar perfil.', erro: error, salvarDB: true })
                                        return res.status(500).send(msgPadraoErro)
                                })
                } else {
                        await app.db("wpp_perfil_permissoes")
                                .insert(modelo)
                                .then(() => res.status(204).send())
                                .catch(error => {
                                        util_console({ funcao: 'perfilPermissoes.save', tipo: 'ERRO', mensagem: 'Não foi possível cadastrar perfil.', erro: error, salvarDB: true })
                                        return res.status(500).send(msgPadraoErro)
                                })
                }
        }

        const get = (req, res) => {
                app.db
                        .table("wpp_perfil_permissoes")
                        .select()
                        .whereNull("excluido_em")
                        .orderBy('wpp_perfil_permissoes.nome_perfil', 'asc')
                        .then(perfis => res.json(perfis))
                        .catch(error => {
                                util_console({ funcao: 'perfilPermissoes.get', tipo: 'ERRO-500', mensagem: 'Não foi possível retornar os cadastros de perfil..', erro: error, salvarDB: true })
                                return res.status(500).send(msgPadraoErro)
                        })
        }

        const remove = async (req, res) => {
                const codigoParams = req.params.codigo_perfil;

                const perfilFromDB = await app.db("wpp_perfil_permissoes")
                        .where({ codigo_perfil: codigoParams }).first()
                try {
                        existeOuErro(perfilFromDB, "Registro não encontrado. <br> Atualize a página e tente novamente.")
                        await naoExisteNoBancoOuErro("wpp_cadastro_atendentes", "id_perfil", codigoParams, "O registro não pode ser excluído por possuir dependentes.")
                } catch (msg) {
                        return res.status(400).send(msg)
                }
                const nomeExcluido = `${perfilFromDB.nome_perfil}[${dataAtualFormatadaBR()}]`
                await app.db("wpp_perfil_permissoes")
                        .update({ nome_perfil: nomeExcluido, excluido_em: app.db.fn.now() })
                        .where({ codigo_perfil: codigoParams })
                        .then(() => res.status(204).send())
                        .catch(error => {
                                util_console({ funcao: 'perfilPermissoes.remove', tipo: 'ERRO-500', mensagem: 'Não foi possível excluir o perfil.', erro: error, salvarDB: true })
                                return res.status(500).send(msgPadraoErro)
                        })
        }

        return { save, get, remove }
}
