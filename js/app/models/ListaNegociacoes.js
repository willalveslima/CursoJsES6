class ListaNegociacoes {
    constructor() {
        this._negociacoes = [];
    }
    adiciona(negociacao) {
        this._negociacoes.push(negociacao);
    }
    get negociacoes() {
        return [].concat(this._negociacoes);
    }
    get valorTotal() {
        return this._negociacoes.reduce((total, n) => total + n.volume, 0.0)
    }
    apaga() {
        this._negociacoes = [];
    }
}