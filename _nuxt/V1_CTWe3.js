import{aj as S,ae as z,bR as j,_ as p,z as Z,y as q,A as H,B as J,U as K,T as Q,E as F,C as X,a5 as Y,a9 as ee,at as te,F as ae,Z as re,a7 as ne}from"#entry";import{p as ie}from"./BD1KfGdN.js";import{p as se}from"./DOdMlmSn.js";import{d as I}from"./CFXO7OIT.js";import{o as le}from"./CmKTTxBW.js";import"./DJVjbGr9.js";import"./CvQF_-mV.js";import"./DsBtZNF1.js";import"./Gi6I4Gst.js";function oe(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function ce(e){return e}function ue(){var e=ce,a=oe,f=null,y=S(0),s=S(z),o=S(0);function l(t){var n,c=(t=j(t)).length,d,x,h=0,u=new Array(c),i=new Array(c),v=+y.apply(this,arguments),A=Math.min(z,Math.max(-z,s.apply(this,arguments)-v)),m,D=Math.min(Math.abs(A)/c,o.apply(this,arguments)),$=D*(A<0?-1:1),g;for(n=0;n<c;++n)(g=i[u[n]=n]=+e(t[n],n,t))>0&&(h+=g);for(a!=null?u.sort(function(w,C){return a(i[w],i[C])}):f!=null&&u.sort(function(w,C){return f(t[w],t[C])}),n=0,x=h?(A-c*$)/h:0;n<c;++n,v=m)d=u[n],g=i[d],m=v+(g>0?g*x:0)+$,i[d]={data:t[d],index:n,value:g,startAngle:v,endAngle:m,padAngle:D};return i}return l.value=function(t){return arguments.length?(e=typeof t=="function"?t:S(+t),l):e},l.sortValues=function(t){return arguments.length?(a=t,f=null,l):a},l.sort=function(t){return arguments.length?(f=t,a=null,l):f},l.startAngle=function(t){return arguments.length?(y=typeof t=="function"?t:S(+t),l):y},l.endAngle=function(t){return arguments.length?(s=typeof t=="function"?t:S(+t),l):s},l.padAngle=function(t){return arguments.length?(o=typeof t=="function"?t:S(+t),l):o},l}var pe=ne.pie,G={sections:new Map,showData:!1},T=G.sections,N=G.showData,de=structuredClone(pe),ge=p(()=>structuredClone(de),"getConfig"),fe=p(()=>{T=new Map,N=G.showData,re()},"clear"),me=p(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(e)||(T.set(e,a),F.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),he=p(()=>T,"getSections"),ve=p(e=>{N=e},"setShowData"),Se=p(()=>N,"getShowData"),L={getConfig:ge,clear:fe,setDiagramTitle:Q,getDiagramTitle:K,setAccTitle:J,getAccTitle:H,setAccDescription:q,getAccDescription:Z,addSection:me,getSections:he,setShowData:ve,getShowData:Se},ye=p((e,a)=>{ie(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),xe={parse:p(async e=>{const a=await se("pie",e);F.debug(a),ye(a,L)},"parse")},Ae=p(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),we=Ae,Ce=p(e=>{const a=[...e.values()].reduce((s,o)=>s+o,0),f=[...e.entries()].map(([s,o])=>({label:s,value:o})).filter(s=>s.value/a*100>=1).sort((s,o)=>o.value-s.value);return ue().value(s=>s.value)(f)},"createPieArcs"),De=p((e,a,f,y)=>{F.debug(`rendering pie chart
`+e);const s=y.db,o=X(),l=Y(s.getConfig(),o.pie),t=40,n=18,c=4,d=450,x=d,h=ee(a),u=h.append("g");u.attr("transform","translate("+x/2+","+d/2+")");const{themeVariables:i}=o;let[v]=te(i.pieOuterStrokeWidth);v??=2;const A=l.textPosition,m=Math.min(x,d)/2-t,D=I().innerRadius(0).outerRadius(m),$=I().innerRadius(m*A).outerRadius(m*A);u.append("circle").attr("cx",0).attr("cy",0).attr("r",m+v/2).attr("class","pieOuterCircle");const g=s.getSections(),w=Ce(g),C=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let E=0;g.forEach(r=>{E+=r});const R=w.filter(r=>(r.data.value/E*100).toFixed(0)!=="0"),b=le(C);u.selectAll("mySlices").data(R).enter().append("path").attr("d",D).attr("fill",r=>b(r.data.label)).attr("class","pieCircle"),u.selectAll("mySlices").data(R).enter().append("text").text(r=>(r.data.value/E*100).toFixed(0)+"%").attr("transform",r=>"translate("+$.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),u.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const W=[...g.entries()].map(([r,M])=>({label:r,value:M})),k=u.selectAll(".legend").data(W).enter().append("g").attr("class","legend").attr("transform",(r,M)=>{const P=n+c,B=P*W.length/2,U=12*n,V=M*P-B;return"translate("+U+","+V+")"});k.append("rect").attr("width",n).attr("height",n).style("fill",r=>b(r.label)).style("stroke",r=>b(r.label)),k.append("text").attr("x",n+c).attr("y",n-c).text(r=>s.getShowData()?`${r.label} [${r.value}]`:r.label);const _=Math.max(...k.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),O=x+t+n+c+_;h.attr("viewBox",`0 0 ${O} ${d}`),ae(h,d,O,l.useMaxWidth)},"draw"),$e={draw:De},Re={parser:xe,db:L,renderer:$e,styles:we};export{Re as diagram};
