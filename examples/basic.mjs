import {registrarRevisao, pendencias} from '../src/index.js';
console.log(pendencias(registrarRevisao([],{id:'documento-A',referencia:'revisao-1',registradoEm:'2026-01-01',venceEm:'2026-02-01'}),'2026-01-15'));
