exports.up = function (knex) {
        return knex.schema.createTable("wpp_cadastro_atendentes", table => {
                table.increments("codigo_atendente").primary()
                table.string("nome_atendente", 191).notNull().unique()
                table.string("senha").notNull()
                table.integer("id_empresa").unsigned().notNull().references("codigo_empresa").inTable("wpp_cadastro_empresa")
                table.integer("id_perfil").unsigned().notNull().references("codigo_perfil").inTable("wpp_perfil_permissoes")
                table.boolean("desativado", 1).notNull().defaultTo(0)
                table.timestamp('cadastrado_em').defaultTo(knex.fn.now())
                table.timestamp('excluido_em')
        }).then(function () {
                return knex("wpp_cadastro_atendentes").insert([
                        {
                                nome_atendente: "Help",
                                senha: "1998",
                                id_empresa: 1,
                                id_perfil: 1,
                                desativado: false
                        },
                        {
                                nome_atendente: "Suporte técnico",
                                senha: "1234",
                                id_empresa: 1,
                                id_perfil: 1,
                                desativado: false
                        },

                ])
        })
};

exports.down = function (knex) {
        return knex.schema.dropTable("wpp_cadastro_atendentes")
};
