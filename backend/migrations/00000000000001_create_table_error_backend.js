exports.up = function (knex) {
        return knex.schema.createTable("error_backend", table => {
                table.increments("codigo").primary()
                table.string("funcao")
                table.string("tipo")
                table.string("mensagem")
                table.text("erro")
                table.timestamp('cadastrado_em').defaultTo(knex.fn.now())
        })
};

exports.down = function (knex) {
        return knex.schema.dropTable("error_backend")
};
