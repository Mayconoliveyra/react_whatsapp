exports.up = function (knex) {
        return knex.schema.createTable("wpp_fila_execucao", table => {
                table.increments("codigo_processo").primary()
                table.boolean("enviar", 1).notNull().defaultTo(0) /* Se for = True e [enviado_em]=Null, vai ser executado na fila de processo 'função wpp_fila_execucao()'. */

                table.integer("id_campanha") /* Codigo da campanha */
                table.string("id_cliente", 191) /* String porque quando vem da api ele vem como string. ex: API-4, API-5... */

                table.string("nome_cliente", 191) /* String porque quando vem da api ele vem como string. ex: API-4, API-5... */
                table.string("codigo_integracao", 191) /* String porque quando vem da api ele vem como string. ex: API-4, API-5... */

                table.integer("tipo_executar").notNull().defaultTo(1) /* 1=Envia mensagem digitada; 2= envia mensagem com template; 3= chama função */

                table.text("mensagem_texto") /* Se [tipo_executar = 1], essa campo obrigatoriamente precisa ser preenchido com a mensagem a ser enviada */

                table.string("nome_template", 191) /* Se [tipo_executar = 2], esse campo obrigatoriamente precisa ser preenchido com nome do template*/

                table.string("nome_funcao", 191) /* Se [tipo_executar = 3], esse campo obrigatoriamente precisa ser preenchido com o nome da função a ser executada */

                table.string("contato_empresa", 12) /* Número que enviou a mensagem(origem) */
                table.string("nmr_whatsapp", 10) /* Número que vai receber a mensagem(destino) */

                /* Prioridade que a mensagem será enviada:*/
                /* 9 = maior prioridade */
                /* 0 = padrão */
                /* -4 = [finalizado] recebe true e a mensagem nao vai ser enviada */
                /* Toda vez que der erro para enviar a prioridade vai ser definida negativa:(-1, -2, -3) */
                table.integer("nivel_prioridade").notNull().defaultTo(0)

                table.text("msg_result") /* status do envio da mensagem/ erro de envio */

                table.timestamp('enviado_em') /* Quando a mensagen é enviado com sucesso é setado a data do envio. */
        })
};

exports.down = function (knex) {
        return knex.schema.dropTable("wpp_fila_execucao")
};
