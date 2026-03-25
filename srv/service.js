const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {

    this.on('TesteCadastro', async (req) => {
        
        const { Cadastro } = this.entities;

        const variavelID = req?.data?.ID;

        if (!variavelID){
            return req.error(400, 'nao foi digitado o campo chave')
        }

        const cadastro = await SELECT.from(Cadastro).where({ ID : variavelID })

        return cadastro;
    })
})

