const T=require('../src/engine.js');
const tab=(rows)=>{let m=0,v=0;for(const [n,e,s] of rows){m+=n*e;v+=n*s*s;}return [m,Math.sqrt(v)];};
let [m,s]=tab([[4000,100,1000],[5000,80,900],[2000,150,1200],[6000,100,600]]);
console.log('Enero26 m,s',m,s,'esperado 1700000 114411,5379');
const Y=T.normal(m,s); const sp={type:'CVaR',mu:0.05};
const yr=T.parseTreaty('0,9y − 0,5(y − 1.700.000)+'); const yc=T.plComplement(yr);
console.log('yc',T.treatyToString(yc), JSON.stringify(T.plSlopes(yc)));
const C=T.transformDist(Y,yc);
console.log('E(yc)',C.mean,'esp 192821,7999','CVaR(-yc)',T.risk(C,sp),'esp 311598,8868');
console.log('CVaR(-y)',T.risk(Y,sp),'esp 1935998,145');
const R=T.transformDist(Y,yr); console.log('CVaR(-yr)',T.risk(R,sp),' suma',T.risk(R,sp)+T.risk(C,sp));
console.log('Expectil 0.3 yc (grid)',T.risk(C,{type:'Expectil',mu:0.3}));
// Enero 2024 SDPT1
[m,s]=tab([[2000,150,1000],[5000,250,2000],[3000,300,3000]]); const Y2=T.normal(m,s);
const sp2={type:'SDPT',a:1}; const c2=T.parseTreaty('0,8y − 0,7(y − 2.450.000)+');
const C2=T.transformDist(Y2,c2);
console.log('Enero24 m s',m,s,' SDPT(-y)',T.risk(Y2,sp2),'(exam 2650602,49 sim)');
console.log(' E(y-2.45M)+',Y2.SL(2450000),'(exam 88702 sim)  E(yc)',C2.mean,'(exam 1897908,579) SDPT(-yc)',T.risk(C2,sp2),'(exam 1969925,897)');
console.log(' layer SDPT', T.layerRisk(Y2,sp2,2450000),'(exam 215080,1367)', ' decomposition', 0.8*T.risk(Y2,sp2)-0.7*T.layerRisk(Y2,sp2,2450000));
// Enero 2025 tramos
[m,s]=tab([[1000,100,1000],[500,80,900],[2000,150,1200],[600,100,600]]); const Y3=T.normal(m,s);
const c3=T.parseTreaty('0,2y+0,4(y-425000)+'); const C3=T.transformDist(Y3,c3);
console.log('Enero25 E(yc)',C3.mean,'(exam 131517,53 sim) CVaR90(-yc)',T.risk(C3,{type:'CVaR',mu:0.1}),'(exam 200297,65)');
// Junio 2025 SW1 stop loss 500000 on Junio table
[m,s]=tab([[1000,100,1000],[500,80,900],[2000,150,1200],[600,100,600]]);
const Y4=T.normal(m,s); const sw={type:'SW',a:1}; const C4=T.transformDist(Y4,{a0:0,layers:[{a:1,U:500000}]});
const rc=T.risk(C4,sw), Er=C4.mean; const prim=T.risk(Y4,sw)+1.1*Er-rc;
console.log('Junio25 SW(-y)',T.risk(Y4,sw),'(exam 607586,14)','E yc',Er,'SW yc',rc,'(exam 106253,62) prima global',prim,'(exam 530781,30)');
