import {currentInstance} from './controllers/NegociacaoController.js';
import {} from './polyfill/fetch.js';

let negociacaoController = currentInstance();

document.querySelector('.form').onsubmit = negociacaoController.adiciona.bind(negociacaoController);
document.querySelector('#deletar').onclick = negociacaoController.apaga.bind(negociacaoController);
