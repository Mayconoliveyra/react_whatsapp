module.exports = app => {
    const { util_console } = app.api.utilitarios
    const { wpp_fila_execucao } = app.api.wppCampanha

    /* Essa funão será executada a cada x segundos 'SetInteval' */
    /* Nela será verificado/atualizado status de conexão */
    /* Tambêm sera executada a fila de processamento, roda 1 registro a cada execução. */
    function monitorProcessos() {
        /*  let index = 1; */
        setInterval(async () => {
            /*     console.log("processo " + index)
                index++ */
            await atualizaStatusAtualEmpresa()
        }, 2000)
    }

    /* Verifica se o whatsapp ainda está autenticado com a aplicação */
    async function atualizaStatusAtualEmpresa() {
        /* try/catch é necessario, pois, se a 'getConnectionState', não existir ou der erro, seta o status de autenticação como 'DISCONNECTED' */
        try {
            /* 'getConnectionState' retorna o status atual de conexão: 'CONNECTED', 'DISCONNECTED'.... */
            const getConnectionState = await app.whatasappData.getConnectionState();
            if (getConnectionState) {
                atualizarStatusConexao(getConnectionState)
                /* Se o whatsapp tiver autenticado corretamente envia mensagem que estão na fila */
                if (getConnectionState == 'CONNECTED') {
                    wpp_fila_execucao()
                }
            } else {
                atualizarStatusConexao('DISCONNECTED')
                app.whatasappData = {}
            }
        } catch (error) {
            atualizarStatusConexao('DISCONNECTED')
            app.whatasappData = {}
        }
    }

    /* Seta o novo status de conexão('CONNECTED', 'DISCONNECTED'.... ) */
    function atualizarStatusConexao(novoStatus) {
        /* Atualiza o status_atual. Não utilizo where para que seja aplicado em todos cadastros, em wpp_cadastro_empresa' o certo é que tenha apenas 1 cadastro */
        app.db('wpp_cadastro_empresa')
            .update({ status_atual: novoStatus })
            .then()
            .catch(error => {
                util_console({ funcao: 'atualizarStatusConexao', tipo: 'ERRO-500', mensagem: 'Não foi possível atualizar wpp_cadastro_empresa.', erro: error, salvarDB: true })
            })
    }

    return { monitorProcessos }
}