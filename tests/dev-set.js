const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');
const eng=h.split('/*ENGINE-START*/')[1].split('/*ENGINE-END*/')[0];
const E=new Function(eng+';return E')();
let seed=7;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;const pick=a=>a[Math.floor(rnd()*a.length)];
const P={
 NAME_COMMON:["Daniel Okafor","Sarah Mitchell","Priya Raman","Kevin Tran","Fatima Hassan","Michael Chen","Emeka Obi","Laura Gómez","Ravi Patel","Hannah Brooks"],
 NAME_RARE:["Oluwadamilare Akinsanya","Siobhan Kearney","Thandiwe Mokoena","Bartholomew Finch","Xiomara Quintero","Rajeshwari Iyer","Leif Halvorsen","Nkechi Umeh","Ines Duarte","Gwendolyn Ashby"],
 EMAIL:["d.okafor@acme.io","sarah.mitchell@globex.com","rk92@gmail.com","finance-team@northwind.ca","x.quintero@hospital.org","jbrown+billing@outlook.com"],
 PHONE:["(416) 555-0101","416-555-0142","416.555.0199","+1 647 555 0110","+44 20 7946 0958","4165550123","+234 803 555 0147"],
 CARD:["4111 1111 1111 1111","5555-5555-5555-4444","378282246310005","6011111111111117","4012 8888 8888 1881"],
 SIN:["046 454 286","130 692 544"],SSN:["123-45-6789","219-09-9999"],
 IBAN:["GB82 WEST 1234 5698 7654 32","DE89 3704 0044 0532 0130 00"],
 IP:["10.0.4.27","192.168.1.104","203.0.113.45","2001:0db8:85a3:0000:0000:8a2e:0370:7334"],
 KEY:["sk-proj-Ab3dEf9GhIjK2LmNoPq7RsTuVw","AKIAIOSFODNN7EXAMPLE","ghp_16C7e42F292c6912E7710c838347Ae178B4a","xoxb-2048-1111-AbCdEfGhIjKl","sk_test_FAKEKEYTESTONLY0000"],
 JWT:["eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.dBjftJeZ4CVPmB92K27uhbUJU1p1r"],
 PASS:["Winter2025!","p@ssw0rd123","hunter2hunter2"],
 ADDR:["220 King Street","88 Queen Street West","15 Lakeshore Road","1200 Bay Street, Suite 400"],
 POSTAL:["M5H 1K4","L5B 3C2","K1A 0B1"],
 CID:["CUST-004517","ACCT-88213","ORD-120044","cus_N8f2kLm4Pq9Rs1"],
 DOB:["1987-04-12","March 3, 1990"]
};
const T=[ // [template, type map]; types: N=common name, R=rare name
 ["Please contact {N} at {EMAIL} or {PHONE}."],["From: {R}\nSubject: refund request"],["{R} mentioned the outage started at 9am."],
 ["We spoke with {R} yesterday about the invoice."],["Regards,\n{N}"],["Dr. {R} approved the change."],["Card on file: {CARD}, exp 09/28."],
 ["Customer {CID} called from {PHONE}."],["Wire to IBAN {IBAN} by Friday."],["SIN {SIN} was entered in the wrong field."],["SSN: {SSN}"],
 ["Request from {IP} was blocked."],["export OPENAI_API_KEY={KEY}"],["Authorization: Bearer {JWT}"],["db_password = {PASS}"],
 ["Ship to {ADDR}, Toronto ON {POSTAL}."],["Patient DOB: {DOB}"],["cc {N}; escalate to {R} if unresolved."],["{N} and {R} both reviewed ticket 4471."],
 ["Send the deck to {EMAIL} before the 2:30 call."],["Key leaked in logs: {KEY}"],["Login from {IP} for user {EMAIL}."]
];
const NEG=["Revenue grew 12.5% to $4,200,000 in Q3 2026.","Version 3.14.159 shipped on 2026-11-13 at 10:30.","The Team met Monday in Toronto to review Azure and Power BI.","Order total was 1234.56 across 18 SKUs.","Please call Support if the API returns 502.","Microsoft Teams and Google Drive were down for 40 minutes.","Invoice 2026-0044 covers 120 hours at the standard rate.","The Ontario Ministry published guidance in March.","Port 5432 was open on the staging host.","Build 20931 passed all 412 tests."];
const map={N:"NAME_COMMON",R:"NAME_RARE"};
const docs=[];
for(let i=0;i<120;i++){const t=pick(T)[0];let text="",lab=[],last=0;const re=/\{(\w+)\}/g;let m;
 while((m=re.exec(t))){text+=t.slice(last,m.index);const k=map[m[1]]||m[1];const v=pick(P[k]);lab.push({s:text.length,e:text.length+v.length,k});text+=v;last=m.index+m[0].length}
 text+=t.slice(last);if(rnd()<.5){const n=pick(NEG);text=n+" "+text.split("").join("");lab.forEach(l=>{l.s+=n.length+1;l.e+=n.length+1})}docs.push({text,lab})}
for(const n of NEG)docs.push({text:n,lab:[]});
const per={};let fp=0,det=0,items=0,caught=0;const misses=[];const fps=[];
for(const d of docs){const S=new E.Session();const r=E.scrub(d.text,S,{off:new Set(),custom:[],deny:[],denyType:"ORG",allow:new Set(),keep:new Set()});
 let pos=0;const spans=[];for(const g of r.segs){if(g.tok)spans.push({s:pos,e:pos+g.v.length,t:g.type});pos+=g.v.length}
 for(const l of d.lab){items++;per[l.k]=per[l.k]||[0,0];per[l.k][1]++;const cov=new Uint8Array(l.e-l.s);for(const s of spans)for(let i=Math.max(s.s,l.s);i<Math.min(s.e,l.e);i++)cov[i-l.s]=1;const ok=cov.every(x=>x);if(ok){caught++;per[l.k][0]++}else misses.push(l.k+": "+d.text.slice(l.s,l.e))}
 for(const s of spans){det++;if(!d.lab.some(l=>s.s<l.e&&s.e>l.s)){fp++;fps.push(d.text.slice(s.s,s.e))}}}
console.log("items",items,"caught",caught,(100*caught/items).toFixed(1)+"%");
console.log("flags",det,"false",fp,"precision",(100*(det-fp)/det).toFixed(1)+"%");
for(const [k,[c,n]] of Object.entries(per))console.log(k.padEnd(12),c+"/"+n,(100*c/n).toFixed(0)+"%");
console.log("MISSES",[...new Set(misses)]);console.log("FPS",[...new Set(fps)]);
