sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast'
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("listadecadastromodulename.controller.Lista", {

        onInit : function (){
            this.createModel(); // <-- FALTAVA ISSO
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter
            .getTarget("TargetLista") //sempre alterar o target
            .attachDisplay(this.handleRouteMatched, this);
        },

        handleRouteMatched: function () {
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

        onDigitando : function(evt){
            var teste;
        },

        //somente no V2
        getTableCapacity : async function() {
            let oDataModel = this.getOwnerComponent().getModel();
            let Service = "/Cadastro"
            //let Service = "/RequisicaoCadastro"

            return await new Promise(function (resolve, reject){
                oDataModel.read(Service, {
                    success : function (data) {
                        resolve(data);
                    }.bind(this),
                        error : function (oError) {
                            reject(oError);
                        }.bind(this),
                });
            });
        }

    });
});