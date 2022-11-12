module.exports = app => {
        const { existeOuErro, naoExisteNoBancoOuErro } = app.api.utilitarios

        const save = async (req, res) => {
                const modelo = {
                        nome_empresa: req.body.nome_empresa,
                        contato_empresa: req.body.contato_empresa,
                }
                if (req.params.codigo_empresa) modelo.codigo_empresa = req.params.codigo_empresa

                try {
                        existeOuErro(modelo.nome_empresa, "[Nome da empresa*] deve ser preenchido.")
                        existeOuErro(modelo.contato_empresa, "[Número de contato*] deve ser preenchido.")
                        if (modelo.contato_empresa.length != 12) throw "[Número de contato*] deve conter 12 dígitos."


                        if (!modelo.codigo_empresa) {
                                await naoExisteNoBancoOuErro("wpp_cadastro_empresa", "nome_empresa", modelo.nome_empresa, "Já existe cadastro com o [Nome da empresa*] informado!.")
                                await naoExisteNoBancoOuErro("wpp_cadastro_empresa", "contato_empresa", modelo.contato_empresa, "Já existe cadastro com o [Número de contato*] informado!.")
                        } else {
                                const nomeFromDB = await app.db.raw(`SELECT * FROM wpp_cadastro_empresa WHERE nome_empresa='${modelo.nome_empresa}' AND codigo_empresa != ${modelo.codigo_empresa}`)
                                if (nomeFromDB[0].length > 0) throw "Já existe cadastro com o [Nome da empresa*] informado!."
                                const contatoFromDB = await app.db.raw(`SELECT * FROM wpp_cadastro_empresa WHERE contato_empresa='${modelo.contato_empresa}' AND codigo_empresa != ${modelo.codigo_empresa}`)
                                if (contatoFromDB[0].length > 0) throw "Já existe cadastro com o [Número de contato*] informado!."
                        }
                } catch (msg) {
                        return res.status(400).send(msg)
                }

                if (modelo.codigo_empresa) {
                        await app.db("wpp_cadastro_empresa")
                                .update(modelo)
                                .where({ codigo_empresa: modelo.codigo_empresa })
                                .then(() => res.status(204).send())
                                .catch(err => res.status(500).send(err))
                } else {
                        await app.db("wpp_cadastro_empresa")
                                .insert(modelo)
                                .then(() => res.status(204).send())
                                .catch(err => res.status(500).send(err))
                }
        }

        const get = (req, res) => {
                app.db
                        .table("wpp_cadastro_empresa")
                        .select()
                        .orderBy('codigo_empresa', 'asc')
                        .then(empresas => res.json(empresas))
                        .catch(err => res.status(500).send(err))
        }

        const remove = async (req, res) => {
                const codigoParams = req.params.codigo_empresa;
                try {
                        const fromDB = await app.db("wpp_cadastro_empresa")
                                .where({ codigo_empresa: codigoParams }).first()
                        existeOuErro(fromDB, "Registro não encontrado. <br> Atualize a página e tente novamente.")

                        /* Se ativa/desativar empresa, seta a empresa como desconectada  */
                        app.whatasappData = {}
                        await app.db("wpp_cadastro_empresa")
                                .update({ desativado: !fromDB.desativado, status_atual: 'DISCONNECTED', falha_autenticar: null })
                                .where({ codigo_empresa: codigoParams })
                                .then(() => res.status(204).send())
                                .catch(err => res.status(500).send(err))
                } catch (msg) {
                        res.status(400).send(msg)
                }
        }

        return { save, get, remove }
}
