const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {

    this.on('TesteCadastro', async (req) => {
        debugger;
        const { Cadastro } = this.entities;

        const variavelID = req?.data?.ID;

        if (!variavelID) {
            req.error(400, 'Informe o ID');
        }

        const cadastro = await SELECT.from(Cadastro).where({ ID: variavelID });

        if (!cadastro.length) {
            req.error(404, 'Cadastro não encontrado');
        }

        return cadastro;
    });

    const { Cadastro } = this.entities;

    this.on('CriarCadastro', async (req) => {

        const { ID, nome, cpf } = req.data;

        // validações
        if (!ID || !nome || !cpf) {
            req.error(400, "Preencha todos os campos");
        }

        // verifica se já existe
        const existe = await SELECT.from(Cadastro).where({ ID });

        if (existe.length) {
            req.error(400, "Cadastro já existe");
        }

        // cria
        const novo = { ID, nome, cpf };

        await INSERT.into(Cadastro).entries(novo);

        return novo;
    });    

})

