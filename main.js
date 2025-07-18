// Garante que o código só será executado após o carregamento completo do DOM
$(document).ready(function () {

    // Aplica a máscara ao campo de CEP
    $('#cep').mask('00000-000', {
        // A função onComplete é chamada quando o usuário termina de digitar o CEP
        onComplete: function (cep) {
            console.log('CEP completo:', cep);
            // O próximo passo (Issue #3) será fazer a chamada da API aqui.
        }
    });

});