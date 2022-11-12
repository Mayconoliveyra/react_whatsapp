exports.up = function (knex) {
        return knex.schema.createTable("wpp_mensagens_templates", table => {
                table.increments("codigo_template").primary()
                table.string("template", 191).notNull().unique() /*ex: BOAS_VINDAS */
                table.text("mensagem").notNull() /* Mensagem a ser enviada */
                table.boolean("desativado", 1).notNull().defaultTo(0)
                table.timestamp('cadastrado_em').defaultTo(knex.fn.now())
                table.timestamp('excluido_em')
        }).then(function () {
                return knex("wpp_mensagens_templates").insert([
                        {
                                template: 'BOAS_VINDAS',
                                mensagem: `Olá! Seja bem-vindo a [nome_empresa].`,
                        },
                ])
        })
};

exports.down = function (knex) {
        return knex.schema.dropTable("wpp_mensagens_templates")
};
