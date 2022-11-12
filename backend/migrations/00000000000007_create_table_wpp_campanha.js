exports.up = function (knex) {
        return knex.schema.createTable("wpp_campanha", table => {
                table.increments("codigo_campanha").primary()
                table.string("origem", 191).notNull()  /* Gerenciador/PDV/Emissor/API */
                table.string("titulo_campanha", 191) /* Descrição da campanha. Ex: Cobrança de titulo, Promoção, Promoção aniversariante, API */

                table.text("mensagem_texto") /* Mensagem que foi enviado na campanha */
                
                table.string("nome_atendente", 191) /* preencher com nome do funcionario que enviou a mensagem */

                table.string("status", 191) /* Excluido, Pendente, Finalizado, Finalizado com Erros. */

                table.timestamp('confirmado_em')
                table.timestamp('cadastrado_em').defaultTo(knex.fn.now()).notNull()
                table.timestamp('excluido_em')
        })
};

exports.down = function (knex) {
        return knex.schema.dropTable("wpp_campanha")
};
