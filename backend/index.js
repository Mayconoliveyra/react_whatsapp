const app = require("express")() /*servidor O Express é uma estrutura de aplicativo Web, usada como uma estrutura de servidor do Node.js para criação de aplicativos Web. */
const consign = require("consign"); /* facilita a importação dos elemetos vc salva suas requisição nele como se fosse uma variavel, é na hora de importa basta referenciala */
const db = require("./config/db") /* configuração do meu banco*/

/* Armazena todas as propriedades do whatsapp apos ser autenticado  */
app.whatasappData = {};

app.db = db // ligação do banco com meu sevidor
consign()
    .include('./config/passport.js')
    .then("./config/middlewares.js")
    .then("./api/utilitarios.js")
    .then("./api/queries.js")
    .then("./api/wppMensagens.js")
    .then("./api/wppCampanha.js")
    .then("./api/wppMonitorProcessos.js")
    .then("./api/whatsappMain.js")
    .then("./api")
    .then("./config/routes.js")
    .into(app) /* into = dentro */

app.listen(process.env.PORT || 3030, () => {
    console.log("Backend executando....")
})

/* 'monitorProcessos' é uma função 'SetIntaval', que fica executando o tempo todo a cada x segundos. */
/* Essa função é reponsavel por:; */
/* Verifica se o whatassap esta auteticado e atualizar os status caso perda conexao ou algo do tipo; */
/* Enviar mensagens que estão na fina de processamento 'wpp_fila_execucao'  */
const { monitorProcessos } = app.api.wppMonitorProcessos
monitorProcessos()