const T=require('../src/engine.js');
const p=(l,v,e)=>console.log(l.padEnd(42), v, e!==undefined? '  esperado '+e:'');
p('Phi(-3)',T.Phi(-3),0.0013498980316301);
p('Phi(-5)',T.Phi(-5),2.866515718791939e-7);
p('Phi(-8)',T.Phi(-8),6.22096057427178e-16);
p('Phi(1.2)',T.Phi(1.2),0.8849303297782918);
p('PhiInv(0.95)',T.PhiInv(0.95),1.6448536269514722);
p('PhiInv(1e-10)',T.PhiInv(1e-10),-6.361340902404056);
const N=T.normal(0,1);
p('CVaR90 N01',T.risk(N,{type:'CVaR',mu:0.1}),1.755428339);
p('CVaR95 N01',T.risk(N,{type:'CVaR',mu:0.05}),2.062712808);
p('SW1 N01',T.risk(N,{type:'SW',a:1}),'1,603621301 (sim)');
p('SDPT1 N01',T.risk(N,{type:'SDPT',a:1}),'0,906229677 (sim)');
p('Expectil0.3 N01',T.risk(N,{type:'Expectil',mu:0.3}),'0,3371 (Excel)');
p('Wang1 N01',T.risk(N,{type:'Wang',a:1}),1);
const N2=T.makeCont(Object.assign({},{mean:0,var:1,cdf:N.cdf,sf:N.sf,qp:N.qp,qs:N.qs}));
p('Wang1 via kernel',T.risk(N2,{type:'Wang',a:1}),1);
p('CVaR95 via generic',T.risk(N2,{type:'CVaR',mu:0.05}),2.062712808);
p('Exp0.3 via generic',T.risk(N2,{type:'Expectil',mu:0.3}));
p('SW1 via generic',T.risk(N2,{type:'SW',a:1}));
p('DPT2 N01 ',T.risk(N,{type:'DPT',a:2}),'E max(Z1,Z2)=0.5641895835');
const nm=T.normal(11.55693385,3.027783536);
p('Expectil 0.15 J25',T.risk(nm,{type:'Expectil',mu:0.15}),13.62906221);
// gamma
const G=T.gammaD(3,70);
p('gamma q(0.95)', G.q(0.95));
p('gamma CVaR95', G.CVaR(0.05));
p('gamma mean grid', G.disc().mean, 210);
const LN=T.lognormalMoments(1000,250);
p('LN CVaR95 closed',LN.CVaR(0.05)); 
const LN2=T.makeCont({mean:LN.mean,var:LN.var,cdf:LN.cdf,sf:LN.sf,lo:0});
p('LN CVaR95 generic',LN2.CVaR(0.05));
console.log(T.parseNum('1.700.000'),T.parseNum('0,3'),T.parseNum('1/4'),T.parseNum('1/(1+0,4)'),T.parseNum('95%'),T.parseNum('2.450.000,5'));
for (const s of ['0,8y − 0,7(y − 2.450.000)+','0,3y+0,7(y-1.600.000)^+','(y-950.000)+ - (y-1.150.000)+','y_r = 0,9y - 0,5(y-1700000)+','min(y; 3000)','0,2y+0,4·max(y-425000;0)'])
  { const t=T.parseTreaty(s); console.log(s,'=>',JSON.stringify(t), T.treatyToString(t)); }
