class NegociacaoController {
    constructor() {
        let $ = document.querySelector.bind(document);
        this._inputData = $("#data");
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')),
            'adiciona', 'apaga', 'ordena','inverteOrdem');
        this._mensagem = new Bind(new Mensagem(),
            new MensagemView($("#mensagemView")), 'texto');
        this._ordemAtual = '';
        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .then(negociacoes =>
                negociacoes.forEach(negociacao =>
                    this._listaNegociacoes.adiciona(negociacao)))
            .catch(erro => {
                this._mensagem.texto = erro;});
    }
    adiciona(event) {
        event.preventDefault();
        ConnectionFactory
            .getConnection()
            .then(conexao => {
                let negociacao = this._criaNegociacao();
                new NegociacaoDao(conexao)
                    .adiciona(negociacao)
                    .then(() => {
                        this._listaNegociacoes.adiciona(negociacao);
                        this._mensagem.texto = 'Negociação adicionada com sucesso';
                        this._limparCampos();   
                    });
        })
        .catch(erro => this._mensagem.texto = erro);
    }    
    ordena(coluna) {
        if(this._ordemAtual == coluna) {
          this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna;   
    }
    apaga(event) {
        event.preventDefault();
        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.apaga();
            });
    }
    importaNegociacoes(event) {
        event.preventDefault();
        let service = new NegociacaoService();
         //evitando a piramide da descraça - pyramid doom - utilizando Promise   

         service
          .obterNegociacoes()
          .then(negociacoes => {
             negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
             this._mensagem.texto = 'Negociações do período importadas com sucesso';
          })
          .catch(error => this._mensagem.texto = error);
        
        
        /* obterNoegociações com Call back 
        service.obterNegociacoesDaSemana((err, negociacoes) => {
            if(err) {
                this._mensagem.texto = err;
                return;
            }
            negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociações importadas com sucesso';
        });
        */
    }
    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value));
    }
    _limparCampos() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0;
        this._inputData.focus();
    }
}
