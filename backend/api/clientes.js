module.exports = (app) => {
    const { existeOuErro, naoExisteOuErro, util_console, msgPadraoErro } =
        app.api.utilitarios;
    const { LimitOFFSET, orderBy, whereNullExcluido } = app.api.queries;

    const save = async (req, res) => {
        const body = req.body;
        const idParams = Number(req.params.id);

        const modelo = {
            nome: body.nome,
            nmr_contato: body.nmr_contato,
            email: body.email,
            cpf_cnpj: body.cpf_cnpj,
            codigo_integracao: body.codigo_integracao,
            sexo: body.sexo,
            id_dispositivo: body.id_dispositivo,
            id_categoria: body.id_categoria,
        };

        try {
            existeOuErro(modelo.nome, "Nome é obrigatório");
            existeOuErro(modelo.nmr_contato, "Número de contato é obrigatório");
            modelo.nmr_contato = modelo.nmr_contato
                .normalize("NFD")
                .replace(/[^a-zA-Z0-9s]/g, "");
            if (modelo.nmr_contato.length != 10)
                throw "Número de contato deve ter exatamente 10 caracteres";

            const contatoDB = await app
                .db("cadastro_clientes")
                .where({ nmr_contato: modelo.nmr_contato })
                .andWhere("id", "!=", `'${idParams}'`)
                .first();
            naoExisteOuErro(
                contatoDB,
                "Já existe cadastro para o [Número de contato*]."
            );
        } catch (msg) {
            return res.status(400).send(msg);
        }

        if (idParams) {
            app.db("cadastro_clientes")
                .update(modelo)
                .where({ id: idParams })
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
    };

    const get = async (req, res) => {
        const table = "cadastro_clientes";
        const page = req.query._page;
        const limit = req.query._limit;

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
                .db("cadastro_clientes")
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
            .db("cadastro_clientes")
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
