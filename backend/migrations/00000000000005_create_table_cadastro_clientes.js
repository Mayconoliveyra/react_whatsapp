exports.up = function (knex) {
    return knex.schema
        .createTable("cadastro_clientes", (table) => {
            table.increments("id").primary();
            table.string("nome");
            table.string("nmr_contato", 10).notNull(); /* xx xxxx xxxx */
            table.string("email");
            table.string("cpf_cnpj");
            table.string("codigo_integracao");

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
                    nmr_contato: "8398575993",
                    sexo: "Feminino",
                },
                {
                    nome: "Caline",
                    nmr_contato: "8398382198",
                    sexo: "Feminino",
                },
                {
                    nome: "Deposito Cazimi",
                    nmr_contato: "8399847569",
                    sexo: "Masculino",
                },
                {
                    nome: "Depósito Cazimi",
                    nmr_contato: "8399847569",
                    sexo: "Masculino",
                },
                {
                    nome: "Jose Irmão",
                    nmr_contato: "8396468517",
                    sexo: "Masculino",
                },
                {
                    nome: "Anny",
                    nmr_contato: "8181374480",
                    sexo: "Feminino",
                },
                {
                    nome: "Mayla",
                    nmr_contato: "8387967390",
                    sexo: "Feminino",
                },
            ]);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable("cadastro_clientes");
};
