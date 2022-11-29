exports.up = function (knex) {
    return knex.schema
        .createTable("cadastro_clientes", (table) => {
            table.increments("id").primary();
            table.string("nome").notNull();
            table.string("nmr_contato", 14).notNull().unique(); /* (xx) xxxx-xxxx */
            table.string("email").unique();
            table.string("cpf_cnpj");
            table.string("codigo_integracao").unique();

            table
                .enu("sexo", ["Selecione", "Masculino", "Feminino"])
                .defaultTo("Selecione");
            table.string("nascimento", 10);

            table.integer("id_dispositivo");
            table.integer("id_categoria");

            table.boolean("desativado", 1).notNull().defaultTo(0);

            table.timestamp("cadastrado_em").defaultTo(knex.fn.now());
            table
                .timestamp("alterado_em")
                .defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
            table.timestamp("excluido_em").nullable();
        })
        .then(function () {
            return knex("cadastro_clientes").insert([
                {
                    nome: "Mãe",
                    nmr_contato: "(83) 9857-5991",
                    sexo: "Feminino",
                },
                {
                    nome: "Caline",
                    nmr_contato: "(83) 9857-5992",
                    sexo: "Feminino",
                },
                {
                    nome: "Deposito Cazimi",
                    nmr_contato: "(83) 9857-5993",
                    sexo: "Masculino",
                }

            ]);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable("cadastro_clientes");
};
