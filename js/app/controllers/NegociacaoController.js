class NegociacaoController {
    constructor() {
        let $ = document.querySelector.bind(document);
        this._inputData = $("#data");
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");
        let self = this;
        this._listaNegociacoes = new Proxy(new ListaNegociacoes(), {
            get(target, prop, receiver) {
                if(['adiciona', 'apaga'].includes(prop) && typeof(target[prop]) == typeof(Function)) {   
                    return function(){
                        console.log(`método '${prop}' interceptado`);
                        Reflect.apply(target[prop], target, arguments);
                        self._negociacoesView.update(target);
                    }
                }
                return Reflect.get(target, prop, receiver);
            }
        });
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
    apaga(event) {
        event.preventDefault();
        this._listaNegociacoes.apaga();
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
