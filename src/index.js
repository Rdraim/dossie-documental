const data = (v) => {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v) || new Date(v+'T00:00:00Z').toISOString().slice(0,10)!==v) throw new TypeError('Invalid ISO date');
  return v;
};
/** Metadata only: no files, personal records or legal decisions. */
export function registrarRevisao(historico, {id, referencia, registradoEm, venceEm = null}) {
  if (!Array.isArray(historico) || typeof id !== 'string' || !id.trim() || typeof referencia !== 'string' || !referencia.trim()) throw new TypeError('Invalid revision');
  data(registradoEm);if (venceEm !== null) data(venceEm);
  if (venceEm !== null && venceEm < registradoEm) throw new RangeError('Expiry precedes registration');
  const anteriores = historico.filter(x=>x.id===id);
  if (anteriores.some(x=>x.registradoEm>registradoEm)) throw new RangeError('Revision out of order');
  const versao = anteriores.reduce((n,x)=>Math.max(n,x.versao),0)+1;
  return [...historico, Object.freeze({id,referencia,registradoEm,venceEm,versao})];
}
export function pendencias(historico, hoje, {diasAlerta = 30} = {}) {
  data(hoje);if (!Number.isSafeInteger(diasAlerta) || diasAlerta < 0) throw new RangeError('Invalid alert window');
  const atuais = new Map();
  for (const r of historico) if (!atuais.has(r.id) || atuais.get(r.id).versao<r.versao) atuais.set(r.id,r);
  return [...atuais.values()].map(r=>{
    const dias = r.venceEm===null ? null : Math.round((Date.parse(data(r.venceEm))-Date.parse(hoje))/86400000);
    return {...r,dias,situacao:dias===null?'sem-vencimento':dias<0?'vencido':dias<=diasAlerta?'atencao':'vigente'};
  });
}
