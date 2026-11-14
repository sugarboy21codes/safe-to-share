const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');
const E=new Function(h.split('/*ENGINE-START*/')[1].split('/*ENGINE-END*/')[0]+';return E')();
let seed=99;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;const pick=a=>a[Math.floor(rnd()*a.length)];
const NAMES=JSON.parse(fs.readFileSync('tests/holdout_names.json')).filter(n=>!/\bGh\b/.test(n));
const P={NAME:NAMES,
 EMAIL:["m.adeyemi@contoso.ng","ana.lopez@banco-ejemplo.mx","k.nakamura@example.jp","ops+alerts@fabrikam.co.uk","zheng.li88@qq.com"],
 PHONE:["647 555 0123","+33 1 42 68 53 00","(905) 555-0177","+91 98765 43210","+81 3-1234-5678","0803 555 0199"],
 CARD:["4000 0566 5566 5556","2223003122003222","3530111333300000","5200828282828210"],
 KEY:["sk-ant-api03-Xy7Pq2Lm9Rt4Vb8Nc1Zk","AKIAJ7Q2EXAMPLEKEY12","github_pat_11ABCDEFG0123456789_abcdefghijklmnopqrstu","AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY"],
 IP:["198.51.100.23","172.31.0.5"],POSTAL:["H3B 4W8","V6B 1A1"],SIN:["193 456 787"],IBAN:["FR14 2004 1010 0505 0001 3M02 606"]};
const T=[
 "Account owner: {NAME}","{NAME}, account owner, flagged the duplicate charge.","Escalation path is {NAME} then {NAME}.","Notes from the call with {NAME}: wants a refund.",
 "Per {NAME}, the migration slipped a week.","{NAME} will send the contract on Monday.","Attendees: {NAME}, {NAME}","Owner {NAME} (ext 4471)",
 "Approved by {NAME} on 2026-11-02.","I copied {NAME} and {NAME} on the thread.","{NAME} said the vendor can't hit the date.","The request came from {NAME} in Lagos.",
 "{NAME}'s laptop was reimaged.","Interview panel includes {NAME}.","Contact: {EMAIL} / {PHONE}","Paid with {CARD}.","Rotate {KEY} today.","VPN logs show {IP}.",
 "Mail it to {POSTAL}.","Employee SIN {SIN}","Remit to {IBAN}","Reach {NAME} on {PHONE} or {EMAIL}."];
const DECOY=["Meeting with Microsoft Teams admins at 3pm.","Ask Google Cloud support about quotas.","Thanks to Air Canada for the upgrade.","We met Royal Bank of Canada on Tuesday.","Data from Power BI and Snowflake Cortex was stale.","Traffic is routed by Kubernetes Ingress.","Offices on Bay Street reopened.","The New York Times said rates may fall.","Canada Revenue Agency approved the filing.","Hugging Face released new weights.","Deutsche Bank said margins improved.","Tata Consultancy has the contract.","Contact Customer Success for renewals.","Sync with Product Ops before launch.","Escalate to Legal if the vendor declines.","Grace period ends Friday.","Will Smith Barney merge? Unclear.","Model results from Azure OpenAI were cached.","Hi Team, the release is Thursday.","Version 4.2 ships with Dark Mode.","Rogers Communications reported an outage.","Tim Hortons opened two stores.","Shoppers Drug Mart extended hours.","Visit Niagara Falls in June.","Built on Next.js with Tailwind CSS.","Ernst Young and Bain both bid.","Sunday Times coverage was positive.","Amazon Web Services credits expire."];
const docs=[];
for(let i=0;i<220;i++){const t=pick(T);let text="",lab=[],last=0,m;const re=/\{(\w+)\}/g;while((m=re.exec(t))){text+=t.slice(last,m.index);const v=pick(P[m[1]]);lab.push({s:text.length,e:text.length+v.length,k:m[1]==='NAME'?'NAME':'STRUCT_'+m[1]});text+=v;last=m.index+m[0].length}text+=t.slice(last);if(rnd()<.4){const d=pick(DECOY);lab.forEach(l=>{l.s+=d.length+1;l.e+=d.length+1});text=d+" "+text}docs.push({text,lab})}
for(const d of DECOY)docs.push({text:d,lab:[]});
const per={};let fp=0,det=0,items=0,caught=0;const misses=new Set(),fps=new Set();
for(const d of docs){const S=new E.Session();const r=E.scrub(d.text,S,{off:new Set(),custom:[],deny:[],denyType:"ORG",allow:new Set(),keep:new Set()});let pos=0;const sp=[];for(const g of r.segs){if(g.tok)sp.push({s:pos,e:pos+g.v.length});pos+=g.v.length}
 for(const l of d.lab){items++;const k=l.k.startsWith('STRUCT')?'STRUCTURED':'NAME';per[k]=per[k]||[0,0];per[k][1]++;const cov=new Uint8Array(l.e-l.s);for(const s of sp)for(let i=Math.max(s.s,l.s);i<Math.min(s.e,l.e);i++)cov[i-l.s]=1;if(cov.every(x=>x)){caught++;per[k][0]++}else misses.add(d.text.slice(l.s,l.e)+"  <= "+d.text)}
 for(const s of sp){det++;if(!d.lab.some(l=>s.s<l.e&&s.e>l.s)){fp++;fps.add(d.text.slice(s.s,s.e)+"  <= "+d.text)}}}
console.log("HELD-OUT items",items,"caught",caught,(100*caught/items).toFixed(1)+"%","| flags",det,"false",fp,"precision",(100*(det-fp)/det).toFixed(1)+"%");
for(const [k,[c,n]] of Object.entries(per))console.log(k,c+"/"+n,(100*c/n).toFixed(1)+"%");
console.log("MISSES",[...misses].slice(0,40));console.log("FPS",[...fps]);
