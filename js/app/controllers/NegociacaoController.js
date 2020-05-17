class NegociacaoController {
    constructor() {
        let $ = document.querySelector.bind(document);
        this._inputData = $("#data");
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");
        this._listaNegociacoes = new ListaNegociacoes(model =>
            this._negociacoesView.update(model));
        this._negociacoesView = new NegociacoesView($('#negociacoesView'));
        this._mensagem = new Mensagem(model => 
            this._mensagemView.update(model));
        this._mensagemView = new MensagemView($("#mensagemView"));
    }
    adiciona(event) {
        event.preventDefault();
        this._listaNegociacoes.adiciona(this._criaNegociacao());
        this._limparCampos();
        this._mensagem.texto = "Negociação Incluída com sucesso";
    }
    apagar(event) {
        event.preventDefault();
        this._listaNegociacoes.apagar();
        this._limparCampos();
        this._mensagem.texto = "Lista de negociações apagadas com com sucesso";
    }
    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value);
    }
    _limparCampos() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0;
        this._inputData.focus();
    }
}
