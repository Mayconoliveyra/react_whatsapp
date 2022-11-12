module.exports = (app) => {
    const { existeOuErro, util_console, msgPadraoErro } = app.api.utilitarios;
    const { LimitOFFSET, orderBy, whereNullExcluido } = app.api.queries;

    const save = (req, res) => {
        const clienteBody = req.body;
        const codigoSerialParams = Number(
            req.params.codigo_serial
        ); /* quando vem da api fica codigo-API, função Number remover texto deixando apenas numeros */

        const modelo = {
            nmr_whatsapp: clienteBody.nmr_whatsapp,
            nome_cliente: clienteBody.nome_cliente,
            empresa: clienteBody.empresa,
            cpf_cnpj: clienteBody.cpf_cnpj,
            codigo_integracao: clienteBody.codigo_integracao,
            desativado: clienteBody.desativado,
        };

        try {
            existeOuErro(
                modelo.nmr_whatsapp,
                "[Número WhatsApp*] deve ser preenchido."
            );
            /* Se o numero de contato tiver 11 digitos remove o 9. */
            if (modelo.nmr_whatsapp.length == 11) {
                modelo.nmr_whatsapp = `${modelo.nmr_whatsapp.substr(
                    0,
                    2
                )}${modelo.nmr_whatsapp.substr(3, 10)}`;
            }
            if (modelo.nmr_whatsapp.length != 10)
                throw "[Número WhatsApp*] deve ser preenchido com 10 dígito.";
            existeOuErro(
                modelo.nome_cliente,
                "[Nome do contato*] deve ser preenchido."
            );
        } catch (msg) {
            return res.status(400).send(msg);
        }

        /* Se api = true, atualiza o cadastro na retaguarda(softshop) */
        if (clienteBody.api && codigoSerialParams) {
            const modeloSoftshop = {
                Fone: modelo.nmr_whatsapp.substr(2, 10),
                NomeContato: modelo.nome_cliente,
                DDD: modelo.nmr_whatsapp.substr(0, 2),
            };
            app.db("cadastro de Clientes_Fones")
                .update(modeloSoftshop)
                .where({ Sequencia: codigoSerialParams })
                .then(() => res.status(204).send())
                .catch((error) => {
                    util_console({
                        funcao: "clientes.save",
                        tipo: "ERRO",
                        mensagem:
                            "Não foi possível editar cliente(modeloSoftshop).",
                        erro: error,
                        salvarDB: true,
                    });
                    return res.status(500).send(msgPadraoErro);
                });
        } else {
            if (codigoSerialParams) {
                app.db("cadastro_clientes")
                    .update(modelo)
                    .where({ codigo_serial: codigoSerialParams })
                    .then(() => res.status(204).send())
                    .catch((error) => {
                        util_console({
                            funcao: "clientes.save",
                            tipo: "ERRO",
                            mensagem: "Não foi possível editar cliente.",
                            erro: error,
                            salvarDB: true,
                        });
                        return res.status(500).send(msgPadraoErro);
                    });
            } else {
                app.db("cadastro_clientes")
                    .insert(modelo)
                    .then(() => res.status(204).send())
                    .catch((error) => {
                        util_console({
                            funcao: "clientes.save",
                            tipo: "ERRO",
                            mensagem: "Não foi possível cadastrar cliente.",
                            erro: error,
                            salvarDB: true,
                        });
                        return res.status(500).send(msgPadraoErro);
                    });
            }
        }
    };

    const get = async (req, res) => {
        const page = req.query._page;
        const limit = req.query._limit;
        console.log(`page: ${page}; limit ${limit}`);
        const dados = await app.db.raw(
            `SELECT * FROM cadastro_clientes 
            ${whereNullExcluido}
            ${orderBy("codigo", "ASC")}
            ${LimitOFFSET(page, limit)}`
        );

        const { total } = await app
            .db("cadastro_clientes")
            .count({ total: "*" })
            .whereNull("excluido_em")
            .first();

        const { ativos } = await app
            .db("cadastro_clientes")
            .count({ ativos: "*" })
            .where({ desativado: false })
            .whereNull("excluido_em")
            .first();

        const { inativos } = await app
            .db("cadastro_clientes")
            .count({ inativos: "*" })
            .where({ desativado: true })
            .whereNull("excluido_em")
            .first();

        res.json({ dados: dados[0], total, ativos, inativos });
    };

    const remove = async (req, res) => {
        const codigoParams = req.params.codigo_serial;
        try {
            const clienteFromDB = await app
                .db("cadastro_clientes")
                .where({ codigo_serial: codigoParams })
                .first();
            existeOuErro(
                clienteFromDB,
                "Registro não encontrado. <br> Atualize a página e tente novamente."
            );
        } catch (msg) {
            return res.status(400).send(msg);
        }
        await app
            .db("cadastro_clientes")
            .update({ excluido_em: app.db.fn.now() })
            .where({ codigo_serial: codigoParams })
            .then(() => res.status(204).send())
            .catch((error) => {
                util_console({
                    funcao: "clientes.remove",
                    tipo: "ERRO-500",
                    mensagem: "Não foi possível excluir o cliente.",
                    erro: error,
                    salvarDB: true,
                });
                return res.status(500).send(msgPadraoErro);
            });
    };

    return { save, get, remove };
};
