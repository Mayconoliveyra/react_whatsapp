exports.up = function (knex) {
    return knex.schema
        .createTable("cadastro_clientes", (table) => {
            table.increments("codigo").primary();
            table.string("nome");
            table.string("nmr_whatsapp", 10).notNull(); /* xx xxxx xxxx */

            table.string("cpf_cnpj");
            table.string("codigo_integracao");

            table.string("email");
            table
                .enu("sexo", ["SELECIONE", "MASCULINO", "FEMININO"])
                .defaultTo("SELECIONE");

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
                    nmr_whatsapp: "8398575993",
                    sexo: "MASCULINO",
                },
                {
                    nome: "Caline",
                    nmr_whatsapp: "8398382198",
                    sexo: "MASCULINO",
                },
                {
                    nome: "Deposito Cazimi",
                    nmr_whatsapp: "8399847569",
                    sexo: "MASCULINO",
                },
                {
                    nome: "Depósito Cazimi",
                    nmr_whatsapp: "8399847569",
                    sexo: "MASCULINO",
                },
                {
                    nome: "Jose Irmão",
                    nmr_whatsapp: "8396468517",
                    sexo: "MASCULINO",
                },
                {
                    nome: "Anny",
                    nmr_whatsapp: "8181374480",
                    sexo: "MASCULINO",
                },
                {
                    nome: "Mayla",
                    nmr_whatsapp: "8387967390",
                    sexo: "MASCULINO",
                },
            ]);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable("cadastro_clientes");
};
