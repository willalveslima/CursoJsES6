class NegociacaoService {
    //negociacao Service retorna a Promisse de HttpService

    constructor() {

        this._http = new HttpService();
    }

    obterNegociacoes(cb) {
        return Promise.all([
            this._obterNegociacoesDaSemana(),
            this._obterNegociacoesDaSemanaAnterior(),
            this._obterNegociacoesDaSemanaRetrasada()]
        ).then(negociacoes => {
            return negociacoes
                .reduce((arrayAchatado, array) => arrayAchatado.concat(array), [])
        })
            .catch(erro => {throw new Error(erro)});
    }
    _obterNegociacoesDaSemana() {
        return this._http
            .get('negociacoes/semana')
            .then(negociacoes => {
                console.log(negociacoes);
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana');
            });
    }
    _obterNegociacoesDaSemanaAnterior() {
        return this._http
            .get('negociacoes/anterior')
            .then(negociacoes => {
                console.log(negociacoes);
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana anterior');
            });
    }
    _obterNegociacoesDaSemanaRetrasada() {
        return this._http
            .get('negociacoes/retrasada')
            .then(negociacoes => {
                console.log(negociacoes);
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana retrasada');
            });
    }
}