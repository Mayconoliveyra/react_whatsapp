exports.up = function (knex) {
        return knex.schema.createTable("wpp_mensagens_backend", table => {
                table.increments("codigo").primary()
                table.string("funcao", 191)
                table.string("tipo", 191)
                table.string("mensagem", 191)
                table.text("erro")
                table.timestamp('cadastrado_em').defaultTo(knex.fn.now())
        })
};

exports.down = function (knex) {
        return knex.schema.dropTable("wpp_mensagens_backend")
};
