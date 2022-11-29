module.exports = (app) => {
    const { existeOuErro, util_console, msgPadraoErro, formatBody, notExistOrErrorDB } = app.api.utilitarios;
    const { LimitOFFSET, orderBy, whereNullExcluido } = app.api.queries;

    const table = "cadastro_clientes";

    const save = async (req, res) => {
        const body = formatBody(req.body)
        const idParams = Number(req.params.id);

        const modelo = {
            nome: body.nome,
            nmr_contato: body.nmr_contato,
            email: body.email,
            cpf_cnpj: body.cpf_cnpj,
            codigo_integracao: body.codigo_integracao,
            sexo: body.sexo,
            nascimento: body.nascimento,
            id_dispositivo: body.id_dispositivo,
            id_categoria: body.id_categoria,
        };

        try {
            existeOuErro(modelo.nome, "Nome é obrigatório");
            existeOuErro(modelo.nmr_contato, "Número de contato é obrigatório");
            if (modelo.nmr_contato.length != 14)
                throw "O número de contato é inválido.";

            const prefixo = "Já existe cadastro para o "
            await notExistOrErrorDB({ table: table, column: 'nmr_contato', data: modelo.nmr_contato, id: idParams }, `${prefixo}[Número de contato*].`)
            await notExistOrErrorDB({ table: table, column: 'email', data: modelo.email, id: idParams }, `${prefixo}[E-mail*].`)
            await notExistOrErrorDB({ table: table, column: 'codigo_integracao', data: modelo.codigo_integracao, id: idParams }, `${prefixo}[Cód. integrar].`)
        } catch (msg) {
            return res.status(400).send(msg);
        }

        if (idParams) {
            app.db(table)
                .update(modelo)
                .where({ id: idParams })
                .then(() => res.status(204).send())
                .catch((error) => {
                    util_console({
                        funcao: "save",
                        tipo: "ERRO",
                        mensagem: "Não foi possível editar cliente.",
                        erro: error,
                        salvarDB: true,
                    });
                    return res.status(500).send(msgPadraoErro);
                });
        } else {
            app.db(table)
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
    };

    const get = async (req, res) => {
        const page = req.query._page;
        const limit = req.query._limit;
        const id = req.query._id;

        if (id) {
            await app.db(table).where({ id: id }).whereNull("excluido_em").first()
                .then(cliente => res.json(cliente))
                .catch((error) => {
                    util_console({
                        funcao: "clientes.getID",
                        tipo: "ERRO-500",
                        mensagem: "Não foi possível consultar p cliente.",
                        erro: error,
                        salvarDB: true,
                    });
                    return res.status(500).send(msgPadraoErro);
                });

            return
        }

        const dados = await app.db.raw(
            `SELECT * FROM ${table} 
            ${whereNullExcluido}
            ${orderBy("id", "ASC")}
            ${LimitOFFSET(page, limit)}`
        );

        const { total } = await app
            .db(table)
            .count({ total: "*" })
            .whereNull("excluido_em")
            .first();

        const { ativos } = await app
            .db(table)
            .count({ ativos: "*" })
            .where({ desativado: false })
            .whereNull("excluido_em")
            .first();

        const { inativos } = await app
            .db(table)
            .count({ inativos: "*" })
            .where({ desativado: true })
            .whereNull("excluido_em")
            .first();

        res.json({ dados: dados[0], total, ativos, inativos });
    };

    const remove = async (req, res) => {
        const codigoParams = req.params.id;
        try {
            const clienteFromDB = await app
                .db(table)
                .where({ id: codigoParams })
                .first();
            existeOuErro(
                clienteFromDB,
                "Registro não encontrado. <br> Atualize a página e tente novamente."
            );
        } catch (msg) {
            return res.status(400).send(msg);
        }
        await app
            .db(table)
            .update({ excluido_em: app.db.fn.now() })
            .where({ id: codigoParams })
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
