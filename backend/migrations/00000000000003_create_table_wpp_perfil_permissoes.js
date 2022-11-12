exports.up = function (knex) {
        return knex.schema.createTable("wpp_perfil_permissoes", table => {
                table.increments("codigo_perfil").primary()
                table.string("nome_perfil", 191).notNull().unique()

                table.boolean("menu_atendentes", 1).notNull().defaultTo(0)
                table.boolean("cadastrar_atendentes", 1).notNull().defaultTo(0)
                table.boolean("alterar_atendentes", 1).notNull().defaultTo(0)
                table.boolean("excluir_atendentes", 1).notNull().defaultTo(0)

                table.boolean("menu_clientes", 1).notNull().defaultTo(0)
                table.boolean("cadastrar_clientes", 1).notNull().defaultTo(0)
                table.boolean("alterar_clientes", 1).notNull().defaultTo(0)
                table.boolean("excluir_clientes", 1).notNull().defaultTo(0)

                table.boolean("menu_permissoes", 1).notNull().defaultTo(0)
                table.boolean("cadastrar_permissoes", 1).notNull().defaultTo(0)
                table.boolean("alterar_permissoes", 1).notNull().defaultTo(0)
                table.boolean("excluir_permissoes", 1).notNull().defaultTo(0)

                table.boolean("menu_campanhas", 1).notNull().defaultTo(0)
                table.boolean("cadastrar_campanhas", 1).notNull().defaultTo(0)
                table.boolean("alterar_campanhas", 1).notNull().defaultTo(0)
                table.boolean("excluir_campanhas", 1).notNull().defaultTo(0)

                table.boolean("menu_empresas", 1).notNull().defaultTo(0)
                table.boolean("alterar_empresas", 1).notNull().defaultTo(0)

                table.boolean("desativado", 1).notNull().defaultTo(0)
                table.timestamp('cadastrado_em').defaultTo(knex.fn.now())
                table.timestamp('excluido_em')
        }).then(function () {
                return knex("wpp_perfil_permissoes").insert([
                        {
                                nome_perfil: 'Administrador',

                                menu_atendentes: 1,
                                cadastrar_atendentes: 1,
                                alterar_atendentes: 1,
                                excluir_atendentes: 1,

                                menu_clientes: 1,
                                cadastrar_clientes: 1,
                                alterar_clientes: 1,
                                excluir_clientes: 1,

                                menu_permissoes: 1,
                                cadastrar_permissoes: 1,
                                alterar_permissoes: 1,
                                excluir_permissoes: 1,

                                menu_campanhas: 1,
                                cadastrar_campanhas: 1,
                                alterar_campanhas: 1,
                                excluir_campanhas: 1,

                                menu_empresas: 1,
                                alterar_empresas: 1,

                                desativado: 0,
                        },
                        {
                                nome_perfil: 'Atendente',

                                menu_atendentes: 0,
                                cadastrar_atendentes: 0,
                                alterar_atendentes: 0,
                                excluir_atendentes: 0,

                                menu_clientes: 1,
                                cadastrar_clientes: 1,
                                alterar_clientes: 1,
                                excluir_clientes: 1,

                                menu_permissoes: 0,
                                cadastrar_permissoes: 0,
                                alterar_permissoes: 0,
                                excluir_permissoes: 0,

                                menu_campanhas: 0,
                                cadastrar_campanhas: 0,
                                alterar_campanhas: 0,
                                excluir_campanhas: 0,

                                menu_empresas: 0,
                                alterar_empresas: 0,

                                desativado: 0,
                        }
                ])
        })
};

exports.down = function (knex) {
        return knex.schema.dropTable("wpp_perfil_permissoes")
};
