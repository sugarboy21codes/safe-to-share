const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');
const E=new Function(h.split('/*ENGINE-START*/')[1].split('/*ENGINE-END*/')[0]+';return E')();
let seed=31337;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;const pick=a=>a[Math.floor(rnd()*a.length)];
const P={NAME:JSON.parse(fs.readFileSync('tests/holdout2_names.json')),
 EMAIL:["t.wanjiru@example.co.ke","rita.costa@empresa.pt","jl@startup.io","hr-payroll@acme-corp.com","s.nguyen77@yahoo.com","b.haddad@clinic.lb"],
 PHONE:["+254 712 345 678","(613) 555-0144","+61 2 9876 5432","289-555-0102","+351 912 345 678","1-800-555-0199"],
 CARD:["4242 4242 4242 4242","5105105105105100","371449635398431"],
 KEY:["sk-proj-9ZzT4kLq8WmP2xVn6RbYc3Hd","ghp_aB3dE5fG7hJ9kL1mN3pQ5rS7tV9wX1yZ3aB5","xoxp-1234-5678-AbCdEfGh1234","rk_live_51Hx2bQkd93kfJ2mZpq8Yt"],
 PASS:["S3cure#Pass2026","letmein!2025"],IP:["10.12.0.88","100.64.3.7"],POSTAL:["T2P 1J9","E1C 4H3"],
 SSN:["078-05-1120"],IBAN:["NL91 ABNA 0417 1643 00"],CID:["ACCT-551902","INV-77120"],DOB:["14/02/1985"]};
const T=[
 "Hey team,\n{NAME} from procurement needs the PO by Friday.","Spoke to {NAME} this morning; she agreed to the revised scope.","Reviewer: {NAME}\nStatus: blocked",
 "Can someone loop in {NAME}? She owns the vendor relationship.","{NAME} and {NAME} will co-present at the steering committee.","Forwarding on behalf of {NAME}.",
 "Delivery lead is {NAME}.","Shoutout to {NAME} for closing the audit findings.","Original message from {NAME} <{EMAIL}>","{NAME} (Finance) disputes line 4.",
 "Booked a call with {NAME} for Tuesday.","Signed,\n{NAME}\nSenior Analyst","Customer {NAME} ({CID}) wants a callback at {PHONE}.","DOB {DOB}, SSN {SSN}",
 "Charged {CARD} twice.","Leaked token: {KEY}","password: {PASS}","Server {IP} rejected the login.","Postal code {POSTAL}","Pay to {IBAN}.",
 "Invoice {CID} sent to {EMAIL}.","Call {NAME} at {PHONE} after 5."];
const DECOY=["Steering Committee meets in Ottawa.","Deloitte Digital and Accenture Song pitched.","The Bank of Montreal raised rates.","We moved to Microsoft Fabric last quarter.","Labour Day falls on September 1.","Ernst and Young LLP audited the filing.","Lake Ontario levels are high.","The Globe and Mail said housing cooled.","Use Adobe Acrobat to sign.","Sun Life approved the claim.","Read the Harvard Business Review piece.","Toronto Pearson delays hit Air Transat.","We use Looker Studio with BigQuery.","Mount Sinai Hospital expanded its lab.","Canadian Tire reported strong sales.","Status: On Hold until Q1.","Next Steps: Draft the SOW.","Saint John is in New Brunswick.","Victoria Day is a holiday.","Hope Street Capital joined the round."];
const docs=[];
for(let i=0;i<240;i++){const t=pick(T);let text="",lab=[],last=0,m;const re=/\{(\w+)\}/g;while((m=re.exec(t))){text+=t.slice(last,m.index);const v=pick(P[m[1]]);lab.push({s:text.length,e:text.length+v.length,k:m[1]==='NAME'?'NAME':'STRUCTURED'});text+=v;last=m.index+m[0].length}text+=t.slice(last);if(rnd()<.4){const d=pick(DECOY);lab.forEach(l=>{l.s+=d.length+1;l.e+=d.length+1});text=d+" "+text}docs.push({text,lab})}
for(const d of DECOY)docs.push({text:d,lab:[]});
const per={};let fp=0,det=0,items=0,caught=0;const misses=new Set(),fps=new Set();
for(const d of docs){const S=new E.Session();const r=E.scrub(d.text,S,{off:new Set(),custom:[],deny:[],denyType:"ORG",allow:new Set(),keep:new Set()});let pos=0;const sp=[];for(const g of r.segs){if(g.tok)sp.push({s:pos,e:pos+g.v.length,t:g.type});pos+=g.v.length}
 for(const l of d.lab){items++;per[l.k]=per[l.k]||[0,0];per[l.k][1]++;const cov=new Uint8Array(l.e-l.s);for(const s of sp)for(let i=Math.max(s.s,l.s);i<Math.min(s.e,l.e);i++)cov[i-l.s]=1;if(cov.every(x=>x)){caught++;per[l.k][0]++}else misses.add(d.text.slice(l.s,l.e)+"  <= "+d.text.replace(/\n/g," / "))}
 for(const s of sp){det++;if(!d.lab.some(l=>s.s<l.e&&s.e>l.s)){fp++;fps.add(d.text.slice(s.s,s.e)+"  <= "+d.text.replace(/\n/g," / "))}}}
const out={items,caught,recall:+(100*caught/items).toFixed(1),flags:det,falseFlags:fp,precision:+(100*(det-fp)/det).toFixed(1),docs:docs.length,per};
console.log(JSON.stringify(out));fs.writeFileSync('tests/holdout2_result.json',JSON.stringify(out));
console.log("MISSES",[...misses]);console.log("FPS",[...fps]);
