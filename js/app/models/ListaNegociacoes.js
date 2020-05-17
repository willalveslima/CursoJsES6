class ListaNegociacoes {
    constructor(armadilha) {
        this._negociacoes = [];
        this._armadilha = armadilha;
    }
    adiciona(negociacao) {
        this._negociacoes.push(negociacao);
        this._armadilha(this);
    }
    get negociacoes() {
        return [].concat(this._negociacoes);
    }
    get valorTotal() {
        return this._negociacoes.reduce((total, n) => total + n.volume, 0.0)
    }
    apagar() {
        this._negociacoes = [];
        this._armadilha(this);
    }
}