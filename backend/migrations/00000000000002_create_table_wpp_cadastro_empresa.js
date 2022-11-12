exports.up = function (knex) {
        return knex.schema.createTable("wpp_cadastro_empresa", table => {
                table.increments("codigo_empresa").primary()
                table.string("nome_empresa", 191).notNull().unique()
                table.string("contato_empresa", 12).notNull().unique()

                table.text("url_imagem")
                table.text("nome_display")

                table.string("ultimo_nmr_autenticado", 191)
                table.text("status_atual")
                table.text("falha_autenticar")

                table.text("is_business")
                table.text("wts_version")

                table.timestamp('cadastrado_em').defaultTo(knex.fn.now())
        }).then(function () {
                return knex("wpp_cadastro_empresa").insert([
                        {
                                nome_empresa: 'Matriz',
                                contato_empresa: "558399675920",
                                nome_display: null,
                                status_atual: null,
                                falha_autenticar: null,
                                wts_version: null
                        }
                ])
        })
};

exports.down = function (knex) {
        return knex.schema.dropTable("wpp_cadastro_empresa")
};
