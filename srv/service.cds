using aulas from '../db/schema';

service AulasBTP {

    entity Cadastro as projection on aulas.Cadastro;   
    entity Teste as projection on aulas.Teste;

    function TesteCadastro(ID : Integer) returns array of Cadastro;

    action CriarCadastro(
        ID   : Integer,
        nome : String,
        cpf  : String
    ) returns Cadastro;

}