import {ListaNegociacoes} from '../models/ListaNegociacoes.js';
import {Mensagem} from '../models/Mensagem.js';
import {NegociacoesView} from '../views/NegociacoesView.js';
import {MensagemView} from '../views/MensagemView.js';
import {NegociacaoService} from '../services/NegociacaoService.js';
import {DateHelper} from '../helpers/DateHelper.js';
import {Bind} from '../helpers/Bind.js';
import {Negociacao} from '../models/Negociacao.js';

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
        this._service = new NegociacaoService();
        this._init();
    }
    _init() {
        this._service
            .lista()
            .then(negociacoes =>
                negociacoes.forEach(negociacao =>
                    this._listaNegociacoes.adiciona(negociacao)))
            .catch(erro => this._mensagem.texto = erro);
        setInterval(() => {
            this.importaNegociacoes();
        }, 3000);
    }
    adiciona(event) {
        event.preventDefault();
        let negociacao = this._criaNegociacao();
        this._service.cadastra(negociacao)
        .then(mensagem => {
            this._listaNegociacoes.adiciona(negociacao);
            this._mensagem.texto = mensagem; 
            this._limparCampos();  
        }).catch(erro => this._mensagem.texto = erro);
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
        this._service
            .apaga()
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.apaga();
            })
            .catch(erro => this._mensagem.texto = erro);
    }
    importaNegociacoes(event) {
        //event.preventDefault();
        
         //evitando a piramide da descraça - pyramid doom - utilizando Promise   
         this._service
         .importa(this._listaNegociacoes.negociacoes)
         .then(negociacoes => negociacoes.forEach(negociacao => {
             this._listaNegociacoes.adiciona(negociacao);
             this._mensagem.texto = 'Negociações do período importadas'
           }))
         .catch(erro => this._mensagem.texto = erro);
        
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
let negociacaoController = new NegociacaoController();
export function currentInstance() {
    return negociacaoController;
}
