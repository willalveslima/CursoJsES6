import {HttpService} from './HttpService.js';
import {ConnectionFactory} from './ConnectionFactory.js';
import {NegociacaoDao} from '../dao/NegociacaoDao.js';
import {Negociacao} from '../models/Negociacao.js';

export class NegociacaoService {
    //negociacao Service retorna a Promisse de HttpService

    constructor() {

        this._http = new HttpService();
    }

    obterNegociacoes() {
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
    cadastra(negociacao) {
        return ConnectionFactory
           .getConnection()
           .then(connection => new NegociacaoDao(connection))
           .then(dao => dao.adiciona(negociacao))
           .then(() => 'Negociação cadastrada com sucesso')
           .catch(erro => {
              console.log(erro);
              throw new Error('Não foi possível adicionar a negociação')
           });
   }
    lista() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações')
            })
    }
    apaga() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(() => 'Negociações apagadas com sucesso')
            .catch(erro => {
                  console.log(erro);
                  throw new Error('Não foi possível apagar as negociações')
            });
    }
    importa(listaAtual) {
        return this.obterNegociacoes()
            .then(negociacoes =>
                negociacoes.filter(negociacao =>
                    !listaAtual.some(negociacaoExistente =>
                        negociacao.isEquals(negociacaoExistente) ))
            )
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível importar as negociações");
            });
    }
}