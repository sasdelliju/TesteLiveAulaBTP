sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast'
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("listadecadastromodulename.controller.Lista", {

        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter
                .getTarget("TargetLista") //sempre alterar o target
                .attachDisplay(this.handleRouteMatched, this);
        },

        handleRouteMatched: function () {
            this.createModel(); // <-- FALTAVA ISSO            
            this.getTableCapacity();
        },

        onPress: function (evt) {
            MessageToast.show(evt.getSource().getId() + " Pressed");
        },

        //cria o modelg
        createModel: function () {
            this.getView().setModel(
                new sap.ui.model.json.JSONModel({

                    variavelInput: 1111111,

                    Lista: [
                        {
                            ID: 1,
                            name: "joao"
                        },
                        {
                            ID: 2,
                            name: "fausto"
                        }
                    ]
                }),
                "oModelLista"
            );

            this.oViewModel = this.getView().getModel("oModelLista");
        },

        onDigitando: function (evt) {
            var teste;
        },

        getTableCapacity: async function () {
            let oData;
            let oModel = this.getOwnerComponent().getModel();
            let Service = "/Cadastro"

            let oFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, 2);

            //V4 - Tipo 1
            let oListBinding = oModel.bindList(Service);
            oListBinding.filter([oFilter]);
            let aContext = await oListBinding.requestContexts();

            if (aContext.length > 0) {
                oData = aContext[0].getObject();

                let payload = [
                    {
                        ID: oData.ID,
                        name: oData.nome,
                        cpf: oData.cpf
                    }
                ]

                if (oData) {
                    this.oViewModel.setProperty("/Lista2", payload);
                }
            }

            //V2
            /*return await new Promise(function (resolve, reject){
                oDataModel.read(Service, {
                    success : function (data) {
                        resolve(data);
                    }.bind(this),
                        error : function (oError) {
                            reject(oError);
                        }.bind(this),
                });
            }); */
        },

        onBuscar: async function () {
            const oModel = this.getOwnerComponent().getModel();
            const sID = this.byId("inputID").getValue();

            try {
                const oContext = oModel.bindContext(`/TesteCadastro(ID=${sID})`);

                const oData = await oContext.requestObject();

                const oJson = new sap.ui.model.json.JSONModel({
                    Lista: oData.value
                });

                this.getView().setModel(oJson, "resultado");

            } catch (err) {

                // 🔥 limpa a lista da tela
                this.getView().getModel("resultado")?.setProperty("/Lista", []);

                const sMensagem =
                    err?.error?.message ||
                    err?.cause?.error?.message ||
                    "Erro ao buscar cadastro";

                //sap.m.MessageBox.error(sMensagem);
                MessageToast.show(sMensagem);
            }
        },

        onOpenDialog: function () {
            this.byId("dialogCadastro").open();
        },

        onCloseDialog: function () {
            this.byId("dialogCadastro").close();
        },

        onCriarCadastroDialog: async function () {

            const oModel = this.getOwnerComponent().getModel();

            const iID = parseInt(this.byId("inputIDDialog").getValue());
            const sNome = this.byId("inputNomeDialog").getValue();
            const sCpf = this.byId("inputCpfDialog").getValue();

            try {

                const oContext = oModel.bindContext("/CriarCadastro(...)");

                oContext.setParameter("ID", iID);
                oContext.setParameter("nome", sNome);
                oContext.setParameter("cpf", sCpf);

                await oContext.execute();

                sap.m.MessageToast.show("Cadastro criado com sucesso");

                // 🔥 limpar campos
                this.byId("inputIDDialog").setValue("");
                this.byId("inputNomeDialog").setValue("");
                this.byId("inputCpfDialog").setValue("");

                // 🔥 fechar popup
                this.byId("dialogCadastro").close();

                // 🔥 opcional: atualizar lista
                // this.getTableCapacity(); OU refazer busca

            } catch (err) {

                let sMensagem = "Erro ao criar cadastro";

                if (err?.responseText) {
                    try {
                        sMensagem = JSON.parse(err.responseText).error.message;
                    } catch { }
                }

                sap.m.MessageBox.error(sMensagem);
            }
        },

        onBuscarCEP: function () {
            var sCEP = this.byId("inputCep").getValue();
            var that = this;

            fetch("https://viacep.com.br/ws/" + sCEP + "/json/")
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {

                    // cria model JSON
                    var oModel = new sap.ui.model.json.JSONModel(data);

                    // seta na view com nome "cep"
                    that.getView().setModel(oModel, "cep");

                })
                .catch(function (error) {
                    console.error("Erro na API:", error);
                });
        },

        onCriarCadastro: async function () {

            const oModel = this.getOwnerComponent().getModel();

            const iID = parseInt(this.byId("inputIDD").getValue());
            const sNome = this.byId("inputNome").getValue();
            const sCpf = this.byId("inputCpf").getValue();

            try {

                // 🔥 chamada da ACTION (V4)
                const oContext = oModel.bindContext("/CriarCadastro(...)");

                oContext.setParameter("ID", iID);
                oContext.setParameter("nome", sNome);
                oContext.setParameter("cpf", sCpf);

                const oResult = await oContext.execute();

                sap.m.MessageToast.show("Cadastro criado com sucesso");

                // opcional: limpar inputs
                this.byId("inputIDD").setValue("");
                this.byId("inputNome").setValue("");
                this.byId("inputCpf").setValue("");

            } catch (err) {

                let sMensagem = "Erro ao criar cadastro";

                if (err?.responseText) {
                    try {
                        sMensagem = JSON.parse(err.responseText).error.message;
                    } catch { }
                }

                sap.m.MessageBox.error(sMensagem);
            }
        }

    });
});