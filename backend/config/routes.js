module.exports = app => {
      app.route("/autenticacao-status")
            .post(app.api.whatsappMain.login)

      app.route("/autenticacao-whatsapp")
            .get(app.api.whatsappMain.mainWppAutenticar)

      app.route("/get-status-whatsapp")
            .get(app.api.whatsappMain.getStatusAutenticacao)


      app.route("/atendentes")
            .get(app.api.atendentes.get)
            .post(app.api.atendentes.save)
      app.route("/atendentes/:codigo_atendente")
            .put(app.api.atendentes.save)
            .delete(app.api.atendentes.remove)

      app.route("/clientes")
            .get(app.api.clientes.get)
            .post(app.api.clientes.save)
      app.route("/clientes/:codigo_serial")
            .put(app.api.clientes.save)
            .delete(app.api.clientes.remove)

      app.route("/perfil-permissoes")
            .get(app.api.perfilPermissoes.get)
            .post(app.api.perfilPermissoes.save)
      app.route("/perfil-permissoes/:codigo_perfil")
            .put(app.api.perfilPermissoes.save)
            .delete(app.api.perfilPermissoes.remove)

      app.route("/campanhas")
            .get(app.api.wppCampanha.get)
            .post(app.api.wppCampanha.save)
      app.route("/campanhas/:codigo_campanha")
            .get(app.api.wppCampanha.getCampanhaClientes)
            .put(app.api.wppCampanha.save)
            .delete(app.api.wppCampanha.remove)




      app.route("/empresas")
            .get(app.api.empresas.get)
            .post(app.api.empresas.save)
      app.route("/empresas/:codigo_empresa")
            .put(app.api.empresas.save)
            .delete(app.api.empresas.remove) /* APENAS DESATIVA/ATIVA O CADASTRO */



}
