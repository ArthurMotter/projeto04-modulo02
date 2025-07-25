// Garante que o código só será executado após o carregamento completo do DOM
$(document).ready(function () {
    let clienteId = 1;

    // 1. APLICA A MÁSCARA AO CAMPO CEP
    $('#cep').mask('00000-000');

    // Função para limpar o formulário de endereço
    function limparFormularioEndereco() {
        $('#endereco').val('');
        $('#bairro').val('');
        $('#cidade').val('');
        $('#estado').val('');
    }

    // Função para gerenciar os campos de endereço
    function gerenciarCamposEndereco(habilitar) {
        $('#numero').prop('disabled', !habilitar);
        $('#btn-salvar').prop('disabled', !habilitar);

        if (!habilitar) {
            limparFormularioEndereco();
        }
    }

    // Função para limpar todos os campos
    function resetarFormularioCompleto() {
        $('#form-cliente')[0].reset();
        gerenciarCamposEndereco(false);
        $('#nome').focus();
    }

     // 2. CONFIGURA O EVENTO onBlur PARA O CAMPO CEP
    $('#cep').on('blur', function () {
        const cep = $(this).val().replace('-', '');

        // Validação e montagem de requisição
        if (cep.length === 8) {
            const url = `https://viacep.com.br/ws/${cep}/json/`;
            $('#endereco').val('Buscando...');
            $('#bairro').val('...');
            $('#cidade').val('...');
            $('#estado').val('...');

            // 3. FAZ A REQUISIÇÃO PARA A API VIACEP
            $.getJSON(url, function (response) {
                if ("erro" in response) {
                    alert('CEP não encontrado!');
                    limparFormularioEndereco();
                    gerenciarCamposEndereco(false);
                } else {
                    $('#endereco').val(response.logradouro);
                    $('#bairro').val(response.bairro);
                    $('#cidade').val(response.localidade);
                    $('#estado').val(response.uf);
                    gerenciarCamposEndereco(true);
                    $('#numero').focus();
                }
            }).fail(function () {
                alert('Ocorreu um erro ao buscar o CEP. Tente novamente.');
                limparFormularioEndereco();
                gerenciarCamposEndereco(false);
            });
        } else {
            gerenciarCamposEndereco(false);
        }
    });

  // 4. SALVA O CONTEÚDO DA REQUISIÇÃO
    $('#form-cliente').on('submit', function (event) {
        event.preventDefault();

        const nome = $('#nome').val().trim();
        const sobrenome = $('#sobrenome').val().trim();
        const numero = $('#numero').val().trim();

         // Validação
        if (!nome || !sobrenome || !numero) {
            alert('Por favor, preencha os campos Nome, Sobrenome e Número.');
            return;
        }

        // Objeto costruído
        const cliente = {
            id: clienteId,
            nomeCompleto: `${nome} ${sobrenome}`,
            cep: $('#cep').val(),
            endereco: $('#endereco').val(),
            numero: numero,
            bairro: $('#bairro').val(),
            cidade: $('#cidade').val(),
            estado: $('#estado').val(),
        };

        /*DEBUG*/ //console.log('Cliente capturado:', cliente);

        // 5. ADICIONAR CLIENTE À TABELA
        const novaLinha = `
            <tr>
                <th scope="row">${cliente.id}</th>
                <td>${cliente.nomeCompleto}</td>
                <td>${cliente.endereco}, ${cliente.numero}</td>
                <td>${cliente.cep}</td>
                <td>${cliente.bairro}</td>
                <td>${cliente.cidade}</td>
                <td>${cliente.estado}</td>
            </tr>
        `;
        $('#tabela-clientes').append(novaLinha);

        clienteId++;
        resetarFormularioCompleto();
    });
});