(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function money(n){return "$"+Math.round(n).toLocaleString("en-US")}
function hm(m){var h=Math.floor(m/60),r=m%60;return h?(h+" h"+(r?" "+r+" m":"")):(r+" min")}
var TAG={ai:["t-ai","AI does it"],auto:["t-auto","Automation does it"],human:["t-human","Human approves"],manual:["t-manual","Stays manual"]};
function tag(k,txt){return '<span class="tag '+TAG[k][0]+'">'+esc(txt||TAG[k][1])+'</span>'}
function phase(p){return '<span class="tag t-phase">'+esc(p)+'</span>'}
var SUS='<span class="tag t-sus">AI suspicion, not confirmed</span>';


/* ---------------- workspace tables (demo data) ---------------- */
var PEOPLE={OW:["av-ow","OW","Owner"],SE:["av-se","SE","Secretary"],SP:["av-sp","SP","Salesperson"],AI:["av-ai","AI","AI"],AU:["av-au","⚡","Automation"]};
function av(k,nameToo){var p=PEOPLE[k];if(!p)return "";return '<span class="who"><span class="av '+p[0]+'" aria-hidden="true">'+p[1]+'</span>'+(nameToo===false?'<span class="sr">'+p[2]+'</span>':p[2])+'</span>'}
var PCOL={green:"p-green",red:"p-red",amber:"p-amber",blue:"p-blue",purple:"p-purple",teal:"p-teal",gray:"p-gray",navy:"p-navy",pink:"p-pink",orange:"p-orange"};
var STATUS={
 "Onboarding":"teal","Rating & history":"blue","Collecting documents":"orange","Document review":"purple","AI review":"purple","Owner review":"amber","Dispute ready":"pink","Dispute open":"navy","Recovered – invoice":"green","Invoiced":"green","Closed – no dispute":"gray","Waiting on client":"gray",
 "Active":"green","New":"teal","Recovered":"purple",
 "Filed":"green","Filed OK":"green","Needs review":"amber","Failed":"red","Waiting on broker":"blue","Waiting on NYCIRB/carrier":"teal","Needs check":"amber","Missing":"red","Requested":"blue","Paid":"green","Closed – paid":"gray",
 "Waiting for reply":"blue","Reply received":"green","Escalated to secretary":"red","Received":"green",
 "Open":"navy","Overdue":"red","Insurer replied":"amber","Follow-up scheduled":"blue","Credit confirmed":"green","Draft – needs approval":"pink","Sent":"navy",
 "To do":"blue","Done":"green","Waiting on owner":"amber"
};
function pill(s){return '<span class="pill '+(PCOL[STATUS[s]]||"p-gray")+'">'+esc(s)+'</span>'}
var MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var TODAY="2026-11-10";
function fdate(d){if(!d)return "—";var p=d.split("-");return MON[+p[1]-1]+" "+(+p[2])}
function chip(table,key,label){return '<span class="chip'+(table==="documents"?" file":"")+'" role="button" tabindex="0" data-rec="'+table+'|'+esc(key)+'">'+esc(label||key)+'</span>'}

var CLIENTS=[
 {id:"Brightline Masonry Corp",fein:"12-3456789",broker:"Coastline Brokerage",carrier:"Meridian Shield Insurance",status:"Active",sp:"SP",signed:"2026-10-06",city:"Bronx, NY"},
 {id:"Hudson Valley Bakery Inc",fein:"98-7654321",broker:"Main Street Insurance Agency",carrier:"Granite Ridge Casualty",status:"Active",sp:"SP",signed:"2026-10-19",city:"Kingston, NY"},
 {id:"Greenpoint Staffing Group",fein:"45-1029384",broker:"Main Street Insurance Agency",carrier:"Meridian Shield Insurance",status:"Active",sp:"SP",signed:"2026-08-24",city:"Brooklyn, NY"},
 {id:"Empire Kitchen Supply",fein:"33-8765012",broker:"Harborview Insurance Group",carrier:"Granite Ridge Casualty",status:"Recovered",sp:"SP",signed:"2026-06-02",city:"Queens, NY"},
 {id:"Atlas Roofing & Siding",fein:"27-5566102",broker:"Harborview Insurance Group",carrier:"Meridian Shield Insurance",status:"Active",sp:"SP",signed:"2026-07-14",city:"Yonkers, NY"},
 {id:"Queens Plaza Auto Body",fein:"61-2048817",broker:"Five Boroughs Insurance",carrier:"Hudson Mutual",status:"Active",sp:"SP",signed:"2026-08-03",city:"Queens, NY"},
 {id:"Kingsbridge HVAC LLC",fein:"84-3302915",broker:"Coastline Brokerage",carrier:"AmTrust",status:"Active",sp:"SP",signed:"2026-07-01",city:"Bronx, NY"},
 {id:"Bay Ridge Electrical",fein:"19-7741203",broker:"Five Boroughs Insurance",carrier:"Granite Ridge Casualty",status:"Active",sp:"SP",signed:"2026-08-18",city:"Brooklyn, NY"},
 {id:"Astoria Cleaning Services",fein:"52-6630184",broker:"Harborview Insurance Group",carrier:"Hudson Mutual",status:"Active",sp:"SP",signed:"2026-09-21",city:"Queens, NY"},
 {id:"Riverside Home Care Agency",fein:"71-4485520",broker:"Main Street Insurance Agency",carrier:"Meridian Shield Insurance",status:"Active",sp:"SP",signed:"2026-10-27",city:"Manhattan, NY"},
 {id:"Flatbush Bagel Co",fein:"38-9910457",broker:"Five Boroughs Insurance",carrier:"Granite Ridge Casualty",status:"New",sp:"SP",signed:"2026-11-03",city:"Brooklyn, NY"},
 {id:"Northshore Landscaping Inc",fein:"(read from PDF)",broker:"(AI is finding it)",carrier:"(WCB lookup pending)",status:"New",sp:"SP",signed:"2026-11-10",city:"Huntington, NY"}
];
var CASES0=[
 {id:"WCR-1041",client:"Brightline Masonry Corp",stage:"Owner review",who:"OW",due:"2026-11-12",amt:13559,years:"2021-2024",appr:"a1",docs:7,next:"Review AI case brief"},
 {id:"WCR-1047",client:"Hudson Valley Bakery Inc",stage:"Owner review",who:"OW",due:"2026-11-12",amt:4106,years:"2022",appr:"a2",docs:4,next:"Review AI case brief"},
 {id:"WCR-1033",client:"Greenpoint Staffing Group",stage:"Dispute ready",who:"OW",due:"2026-11-11",amt:7420,years:"2023",appr:"a3",docs:6,next:"Approve dispute letter"},
 {id:"WCR-1019",client:"Empire Kitchen Supply",stage:"Recovered – invoice",who:"OW",due:"2026-11-11",amt:9840,years:"2023",appr:"a4",docs:8,next:"Approve invoice"},
 {id:"WCR-1028",client:"Atlas Roofing & Siding",stage:"Dispute open",who:"OW",due:"2026-11-03",amt:5200,years:"2022-2023",docs:6,next:"Approve follow-up #2",follow:"f1"},
 {id:"WCR-1036",client:"Queens Plaza Auto Body",stage:"Dispute open",who:"OW",due:"2026-11-09",amt:3800,years:"2023",docs:5,next:"Approve follow-up #1",follow:"f2"},
 {id:"WCR-1022",client:"Kingsbridge HVAC LLC",stage:"Dispute open",who:"OW",due:"2026-11-11",amt:6150,years:"2022-2024",docs:5,next:"Send payroll records",follow:"f3"},
 {id:"WCR-1039",client:"Bay Ridge Electrical",stage:"Dispute open",who:"OW",due:"2026-11-13",amt:2900,years:"2023",docs:6,next:"Automatic follow-up Nov 13",follow:"f4"},
 {id:"WCR-1044",client:"Astoria Cleaning Services",stage:"Document review",who:"SE",due:"2026-11-13",amt:0,years:"2021-2024",docs:9,next:"Secretary checks the case pack"},
 {id:"WCR-1050",client:"Riverside Home Care Agency",stage:"Collecting documents",who:"SE",due:"2026-11-14",amt:0,years:"2020-2025",docs:3,next:"Broker follow-up #1 on Nov 14"},
 {id:"WCR-1049",client:"Flatbush Bagel Co",stage:"Rating & history",who:"SE",due:"2026-11-12",amt:0,years:"2019-2025",docs:1,next:"NYCIRB reply expected"},
 {id:"WCR-1052",client:"Northshore Landscaping Inc",stage:"Onboarding",who:"SE",due:"2026-11-11",amt:0,years:"2019-2025",docs:1,next:"Confirm new record (1 click)"}
];
var DOCS=[
 {id:"2023 Audit.pdf",client:"Brightline Masonry Corp",year:"2023",type:"Audit",src:"Broker email",by:"AI",status:"Filed"},
 {id:"2023 Audit Worksheet.pdf",client:"Brightline Masonry Corp",year:"2023",type:"Audit worksheet",src:"Broker email",by:"AI",status:"Filed"},
 {id:"2024 Loss Runs.pdf",client:"Brightline Masonry Corp",year:"2024",type:"Loss runs",src:"Broker email",by:"AI",status:"Filed"},
 {id:"NYCIRB Experience Rating Worksheet 2024.pdf",client:"Brightline Masonry Corp",year:"2024",type:"Rating data",src:"NYCIRB email",by:"AU",status:"Filed"},
 {id:"2021 Audit Worksheet",client:"Brightline Masonry Corp",year:"2021",type:"Audit worksheet",src:"Broker Request BR-318 · Coastline Brokerage",by:"AU",status:"Waiting on broker",next:"2026-11-13"},
 {id:"2022 Audit.pdf",client:"Hudson Valley Bakery Inc",year:"2022",type:"Audit",src:"Broker email",by:"AI",status:"Filed"},
 {id:"2023 Audit Worksheet",client:"Atlas Roofing & Siding",year:"2023",type:"Audit worksheet",src:"AmTrust portal (manual, secretary today) + loss-run desk email BR-327",by:"SE",status:"Waiting on NYCIRB/carrier",next:"2026-11-11"},
 {id:"2022-2024 Loss Runs",client:"Kingsbridge HVAC LLC",year:"2022-2024",type:"Loss runs",src:"Broker Request BR-311 · Coastline Brokerage (no reply after 2 follow-ups)",by:"AU",status:"Overdue",next:"2026-11-10"},
 {id:"Scan_0091.pdf",client:"Greenpoint Staffing Group",year:"2022?",type:"Loss runs?",src:"Fax-to-email",by:"AI",status:"Needs review"},
 {id:"2021 Audit",client:"Greenpoint Staffing Group",year:"2021",type:"Audit",src:"Broker Request BR-320 · Main Street Insurance Agency (“sending this week”)",by:"AU",status:"Waiting on broker",next:"2026-11-13"},
 {id:"Revised 2023 Audit.pdf",client:"Empire Kitchen Supply",year:"2023",type:"Insurer response",src:"Insurer email",by:"AI",status:"Filed"},
 {id:"NYCIRB rating worksheet",client:"Queens Plaza Auto Body",year:"2024",type:"Rating data",src:"NYCIRB request (sent Nov 3)",by:"AU",status:"Waiting on NYCIRB/carrier",next:"2026-11-13"},
 {id:"Signed agreement.pdf",client:"Northshore Landscaping Inc",year:"2026",type:"Agreement",src:"Signed by email",by:"AU",status:"Filed"}
];
var BROKERS=[
 {id:"BR-311",client:"Kingsbridge HVAC LLC",broker:"Coastline Brokerage",docs:"2022-2024 Loss Runs",sent:"2026-10-30",fu:2,status:"Escalated to secretary",next:"2026-11-10",exc:"e1"},
 {id:"BR-318",client:"Brightline Masonry Corp",broker:"Coastline Brokerage",docs:"2021 Audit Worksheet",sent:"2026-11-03",fu:1,status:"Waiting for reply",next:"2026-11-13"},
 {id:"BR-320",client:"Greenpoint Staffing Group",broker:"Main Street Insurance Agency",docs:"2021 Audit",sent:"2026-11-02",fu:1,status:"Reply received",next:"2026-11-13"},
 {id:"BR-322",client:"Queens Plaza Auto Body",broker:"Five Boroughs Insurance",docs:"2023 Loss Runs",sent:"2026-11-05",fu:1,status:"Waiting for reply",next:"2026-11-15"},
 {id:"BR-325",client:"Riverside Home Care Agency",broker:"Main Street Insurance Agency",docs:"2020-2025 Audits, Worksheets, Loss Runs",sent:"2026-11-09",fu:0,status:"Waiting for reply",next:"2026-11-14"},
 {id:"BR-301",client:"Brightline Masonry Corp",broker:"Coastline Brokerage",docs:"2022-2024 Audits, Loss Runs",sent:"2026-10-08",fu:1,status:"Received",next:""},
 {id:"BR-327",client:"Atlas Roofing & Siding",broker:"AmTrust loss-run desk (email)",docs:"2023 Loss Runs",sent:"2026-11-06",fu:0,status:"Waiting for reply",next:"2026-11-11"}
];
var DISPUTES=[
 {id:"DSP-207",client:"Atlas Roofing & Siding",carrier:"Meridian Shield Insurance",sent:"2026-10-27",last:"2026-11-03",next:"2026-11-10",status:"Overdue",amt:5200,follow:"f1"},
 {id:"DSP-211",client:"Queens Plaza Auto Body",carrier:"Hudson Mutual",sent:"2026-11-02",last:"2026-11-02",next:"2026-11-10",status:"Overdue",amt:3800,follow:"f2"},
 {id:"DSP-198",client:"Kingsbridge HVAC LLC",carrier:"AmTrust (audit dispute portal)",sent:"2026-10-20",last:"2026-11-09",next:"2026-11-11",status:"Insurer replied",amt:6150,follow:"f3"},
 {id:"DSP-214",client:"Bay Ridge Electrical",carrier:"Granite Ridge Casualty",sent:"2026-11-06",last:"2026-11-06",next:"2026-11-13",status:"Follow-up scheduled",amt:2900,follow:"f4"},
 {id:"DSP-190",client:"Empire Kitchen Supply",carrier:"Granite Ridge Casualty",sent:"2026-09-15",last:"2026-11-09",next:"",status:"Credit confirmed",amt:9840},
 {id:"DSP-216",client:"Greenpoint Staffing Group",carrier:"Meridian Shield Insurance",sent:"",last:"",next:"",status:"Draft – needs approval",amt:7420,appr:"a3"}
];
var TASKS0=[
 {id:"Review case brief: Brightline Masonry",case:"WCR-1041",who:"OW",due:"2026-11-12",by:"AI",appr:"a1"},
 {id:"Review case brief: Hudson Valley Bakery",case:"WCR-1047",who:"OW",due:"2026-11-12",by:"AI",appr:"a2"},
 {id:"Approve dispute letter: Greenpoint Staffing",case:"WCR-1033",who:"OW",due:"2026-11-11",by:"AI",appr:"a3"},
 {id:"Approve invoice: Empire Kitchen Supply",case:"WCR-1019",who:"OW",due:"2026-11-11",by:"AU",appr:"a4"},
 {id:"Approve follow-up #2: Atlas Roofing",case:"WCR-1028",who:"OW",due:"2026-11-10",by:"AU",follow:"f1"},
 {id:"Approve follow-up #1: Queens Plaza",case:"WCR-1036",who:"OW",due:"2026-11-10",by:"AU",follow:"f2"},
 {id:"Send payroll records: Kingsbridge HVAC",case:"WCR-1022",who:"OW",due:"2026-11-11",by:"AI",follow:"f3"},
 {id:"Call broker: Coastline (Kingsbridge loss runs)",case:"WCR-1022",who:"SE",due:"2026-11-10",by:"AU",exc:"e1"},
 {id:"AmTrust download: Atlas 2023 worksheet",case:"WCR-1028",who:"SE",due:"2026-11-10",by:"AU",exc:"e2"},
 {id:"WCB 7-year lookup: Hudson Valley Bakery",case:"WCR-1047",who:"SE",due:"2026-11-10",by:"AU",exc:"e3"},
 {id:"Match file Scan_0091.pdf",case:"WCR-1033",who:"SE",due:"2026-11-10",by:"AI",exc:"e4"},
 {id:"Verify 2 AI numbers: Brightline 2023 audit",case:"WCR-1041",who:"SE",due:"2026-11-10",by:"AI",exc:"e5"},
 {id:"Confirm new client record: Northshore",case:"WCR-1052",who:"SE",due:"2026-11-11",by:"AU",done:true}
];


/* ---------------- full demo data set (generated, fixed seed) ---------------- */
(function(){
 var s=20261110;function rnd(){s=(s*1103515245+12345)%2147483648;return s/2147483648}
 function pick(a){return a[Math.floor(rnd()*a.length)]}
 function day(off){var d=new Date(Date.UTC(2026,10,10+off));return d.toISOString().slice(0,10)}
 var PRE=["Bronx","Queens","Harbor","Empire State","Liberty","Metro","Kings County","Hudson","Atlantic","Union Square","Park Slope","Crown Heights","Summit","Eastside","Westchester","Long Island","Staten Island","Gotham","Midtown","Riverdale","Sunset Park","Jamaica","Flushing","Bushwick","Inwood","Pelham","Astoria","Canarsie"];
 var TRD=["Plumbing","Carpentry","Painting","Trucking","Deli","Security","Concrete","Moving","Electric","Glass","Flooring","Catering","Home Health","Steel","Signs","Printing","Auto Repair","Tile & Stone","Demolition","Windows","Pharmacy","Laundry","Fencing","Courier"];
 var SUF=["LLC","Inc","Corp","Co"],CITY=["Bronx, NY","Brooklyn, NY","Queens, NY","Manhattan, NY","Staten Island, NY","Yonkers, NY","Hempstead, NY","White Plains, NY","Newburgh, NY"];
 var BROK=["Coastline Brokerage","Main Street Insurance Agency","Harborview Insurance Group","Five Boroughs Insurance"],CARR=["Meridian Shield Insurance","Granite Ridge Casualty","Hudson Mutual","AmTrust"];
 var used={};CLIENTS.forEach(function(c){used[c.id]=1});
 function name(){for(;;){var n=pick(PRE)+" "+pick(TRD)+" "+pick(SUF);if(!used[n]){used[n]=1;return n}}}
 var PLAN=[["Onboarding",13,"SE","Confirm the new record (1 click)",[-2,-1]],["Rating & history",20,"SE","NYCIRB reply expected",[-12,-4]],["Collecting documents",37,"SE","Waiting for broker documents",[-40,-10]],["Document review",18,"SE","Secretary checks the case pack",[-70,-40]],["Owner review",6,"OW","Owner reviews the case pack",[-90,-60]],["Dispute open",13,"OW","Waiting for the insurer",[-150,-90]],["Waiting on client",8,"SE","Client to send payroll records",[-120,-50]],["Paid",5,"OW","Closed: fee paid",[-260,-180]]];
 var potTarget=412600-CASES0.reduce(function(t,c){return t+(["Owner review","Dispute ready","Dispute open"].indexOf(c.stage)>-1?c.amt:0)},0);
 var potCases=[],n=901;
 PLAN.forEach(function(p){for(var i=0;i<p[1];i++){
  var cl=name(),br=pick(BROK),ca=pick(CARR),signed=day(p[4][0]+Math.floor(rnd()*(p[4][1]-p[4][0]))),y0=2019+Math.floor(rnd()*3);
  var due=day(Math.floor(rnd()*9)-(rnd()<0.12?6:0)+1);
  CLIENTS.push({id:cl,fein:(10+Math.floor(rnd()*89))+"-"+(1000000+Math.floor(rnd()*8999999)),broker:br,carrier:ca,status:p[0]==="Paid"?"Recovered":p[0]==="Onboarding"?"New":"Active",sp:"SP",signed:signed,city:pick(CITY)});
  var c={id:"WCR-0"+(n++),client:cl,stage:p[0],who:p[2],due:p[0]==="Paid"?"":due,amt:0,years:y0+"-"+(p[0]==="Onboarding"?2025:2024),docs:0,next:p[3],gen:1};
  if(p[0]==="Owner review"||p[0]==="Dispute open"){c.amt=Math.round((4000+rnd()*26000)/10)*10;potCases.push(c)}
  if(p[0]==="Paid"){c.credit=Math.round((8000+rnd()*30000)/10)*10;c.fee=Math.round(c.credit*0.25)}
  if(p[0]==="Dispute open"){var st=rnd()<0.18?"Insurer replied":rnd()<0.5?"Follow-up scheduled":"Open",sent=day(-40-Math.floor(rnd()*40));DISPUTES.push({id:"DSP-"+(100+n),client:cl,carrier:ca,sent:sent,last:st==="Insurer replied"?day(-1-Math.floor(rnd()*4)):day(-6-Math.floor(rnd()*6)),next:day(1+Math.floor(rnd()*6)),status:st,amt:c.amt,resp:st==="Insurer replied"?pick(["Asked for the 2023 payroll ledger.","Proposed a partial credit. Owner to decide.","Confirmed it is reviewing the audit.","Asked for officer documentation."]):""})}
  if(p[0]==="Paid")DISPUTES.push({id:"DSP-"+(100+n),client:cl,carrier:ca,sent:day(-200),last:day(-30),next:"",status:"Closed – paid",amt:c.credit});
  CASES0.push(c);
 }});
 var tot=potCases.reduce(function(t,c){return t+c.amt},0),diff=potTarget-tot;potCases[potCases.length-1].amt+=diff;
 DISPUTES.forEach(function(d){var cc=CASES0.filter(function(x){return x.client===d.client})[0];if(cc&&cc.gen&&cc.stage==="Dispute open")d.amt=cc.amt});
 CASES0.forEach(function(c){if(c.client==="Empire Kitchen Supply")c.credit=9840});
 /* missing documents for generated cases */
 var k=1;
 CASES0.forEach(function(c){if(!c.gen)return;var cl=CLIENTS.filter(function(x){return x.id===c.client})[0];
  if(c.stage==="Rating & history")DOCS.push({id:"NYCIRB rating worksheet",client:c.client,year:"2024",type:"Rating data",src:"NYCIRB request (Letter of Authority)",by:"AU",status:"Waiting on NYCIRB/carrier",next:day(1+Math.floor(rnd()*4))});
  if(c.stage==="Collecting documents"){var m=1+(rnd()<0.4?1:0);for(var j=0;j<m;j++){var y=2021+Math.floor(rnd()*4),t=pick(["Audit","Audit Worksheet","Loss Runs"]),od=rnd()<0.14,carr=rnd()<0.2;
   DOCS.push({id:y+" "+t,client:c.client,year:String(y),type:t,src:carr?"Carrier loss-run desk · "+cl.carrier:"Broker Request BR-4"+(10+k++)+" · "+cl.broker+(od?" (no reply after 3 follow-ups)":""),by:"AU",status:od?"Overdue":carr?"Waiting on NYCIRB/carrier":"Waiting on broker",next:od?day(0):day(1+Math.floor(rnd()*5))})}}
 });
})();
/* every received file, per case */
var ALLDOCS=[];
(function(){
 var did=1;
 DOCS.forEach(function(d){d.key="doc-"+(did++)});
 CASES0.forEach(function(c){
  var have=DOCS.filter(function(d){return d.client===c.client&&d.status==="Filed"}).map(function(d){return d.id});
  var ys=String(c.years).split("-"),y0=+ys[0],y1=+(ys[1]||ys[0]),gen=[["Signed agreement.pdf","Agreement","2026"],["Authorization form.pdf","Authorization","2026"]];
  var want=c.gen?({"Onboarding":2,"Rating & history":3,"Collecting documents":5,"Document review":9,"Owner review":10,"Dispute open":11,"Waiting on client":8,"Paid":12})[c.stage]:c.docs;
  gen.push(["NYCIRB Experience Rating Worksheet "+y1+".pdf","Rating data",String(y1)]);
  for(var y=y1;y>=y0;y--){gen.push([y+" Audit.pdf","Audit",String(y)]);gen.push([y+" Audit Worksheet.pdf","Audit worksheet",String(y)]);gen.push([y+" Loss Runs.pdf","Loss runs",String(y)])}
  var missingNames=DOCS.filter(function(d){return d.client===c.client&&d.status!=="Filed"}).map(function(d){return d.id.replace(".pdf","")});
  for(var i=0;i<gen.length&&have.length<want;i++){var nm=gen[i][0];if(have.indexOf(nm)>-1||missingNames.indexOf(nm.replace(".pdf",""))>-1)continue;have.push(nm);DOCS.push({id:nm,client:c.client,year:gen[i][2],type:gen[i][1],src:i<2?"Signed by email":i===2?"NYCIRB email":"Broker email",by:i<3?"AU":(i%4===0?"SE":"AI"),status:"Filed",key:"doc-"+(did++)})}
 });
})();
function docCount(cl){return DOCS.filter(function(d){return d.client===cl&&(docStatus(d)==="Filed"||docStatus(d)==="Needs review")}).length}
var MISSING_ST=["Overdue","Waiting on broker","Waiting on NYCIRB/carrier"];
function missingDocs(){return DOCS.filter(function(d){return MISSING_ST.indexOf(docStatus(d))>-1})}

/* ---------------- activity feeds ---------------- */
var ALAB={AU:"Automation:",AI:"AI:",OW:"Owner",SE:"Secretary",SP:"Salesperson"};
var ACT0={
 "WCR-1041":[
  ["AI","Prepared the case brief: 3 possible errors, ≈ $13,559. Review task created for the owner, due Nov 12.","Nov 9, 10:50 AM"],
  ["AU","Rules check in code: overtime, payroll caps, premium math and mod. 3 possible issues flagged.","Nov 9, 10:42 AM"],
  ["AI","Extracted payroll from 2023 Audit.pdf p.3 (class 5022: $612,400). Confidence 74%, sent to the secretary to verify.","Nov 9, 10:40 AM"],
  ["AI","Read NYCIRB Experience Rating Worksheet 2024.pdf: mod 1.08, claim C-1187 valued at $18,400.","Nov 9, 10:38 AM"],
  ["AU","Follow-up #1 sent to Coastline Brokerage for the 2021 Audit Worksheet.","Nov 8, 9:30 AM"],
  ["AI","Classified and filed 6 broker attachments in OneDrive › Brightline Masonry Corp › Policies.","Oct 21, 2:12 PM"],
  ["AU","Requested loss runs from broker (Coastline Brokerage), 2021-2024 audits and worksheets too.","Oct 8, 9:31 AM"],
  ["AU","NYCIRB request with Letter of Authority sent to RatingServices.","Oct 6, 4:05 PM"],
  ["AU","Signed agreement detected. Client, case and OneDrive folders created.","Oct 6, 3:58 PM"]],
 "WCR-1047":[
  ["AI","Prepared the case brief: 2 possible errors, ≈ $4,106. Review task created for the owner.","Nov 9, 11:20 AM"],
  ["AU","Premium math checked by code: class 8017 line billed $3,410, expected $1,383.","Nov 9, 11:12 AM"],
  ["AI","Extracted payroll and officer data from 2022 Audit.pdf p.2.","Nov 9, 11:10 AM"],
  ["AU","WCB 7-year coverage lookup added to the secretary's list (stays manual).","Oct 20, 9:00 AM"],
  ["AU","Requested loss runs from broker (Main Street Insurance Agency).","Oct 20, 8:45 AM"],
  ["AU","Signed agreement detected. Client, case and OneDrive folders created.","Oct 19, 1:14 PM"]],
 "WCR-1033":[
  ["AI","Drafted the dispute letter to Meridian Shield Insurance from the 2 approved findings.","Nov 9, 4:02 PM"],
  ["OW","approved findings 1 and 2 for a dispute.","Nov 9, 3:55 PM"],
  ["SE","verified the overtime total ($61,800) against 2023 Audit Worksheet.pdf p.2.","Nov 9, 2:30 PM"],
  ["AI","Extracted payroll from 2023 Audit.pdf p.4 (class 7380) and overtime from the worksheet.","Nov 6, 10:15 AM"],
  ["AU","Requested the missing 2021 audit from broker (Main Street Insurance Agency).","Nov 2, 9:30 AM"]],
 "WCR-1019":[
  ["AU","Invoice INV-1043 drafted: $9,840 credit × 25% (demo rate) = $2,460. Waiting for owner approval.","Nov 9, 3:10 PM"],
  ["AI","Read insurer letter: revised 2023 audit confirms a $9,840 credit.","Nov 9, 3:05 PM"],
  ["OW","approved and sent the dispute letter.","Sep 15, 11:20 AM"],
  ["OW","approved finding 1 (overtime premium pay) for a dispute.","Sep 14, 5:40 PM"],
  ["AI","Extracted payroll from 2023 Audit.pdf p.3 and flagged overtime included in class 8810.","Sep 12, 10:02 AM"]],
 "WCR-1028":[
  ["AU","No insurer reply in 14 days. Follow-up #2 drafted for owner approval.","Nov 10, 7:00 AM"],
  ["AU","AmTrust download of the 2023 worksheet added to the secretary's manual list (portal terms ban bots).","Nov 6, 9:00 AM"],
  ["AU","Follow-up #1 sent to Meridian Shield Insurance. Next Outlook reminder Nov 10.","Nov 3, 9:00 AM"],
  ["OW","approved and sent the dispute letter.","Oct 27, 2:15 PM"]],
 "WCR-1036":[["AU","Follow-up #1 drafted (day 8, no reply). Waiting for owner approval.","Nov 10, 7:00 AM"],["AU","Outlook reminder created for Nov 10.","Nov 2, 3:01 PM"],["OW","approved and sent the dispute letter to Hudson Mutual.","Nov 2, 3:00 PM"]],
 "WCR-1022":[["AI","Insurer replied asking for 2023 payroll records. Summary added; the records are already in OneDrive.","Nov 9, 4:40 PM"],["AU","Follow-up #2 sent to Coastline Brokerage for 2022-2024 loss runs. No reply, escalated to the secretary.","Nov 9, 9:31 AM"],["OW","submitted the dispute in AmTrust's audit dispute portal (manual).","Oct 20, 11:00 AM"]],
 "WCR-1039":[["AU","Outlook reminder set for the next follow-up on Nov 13.","Nov 6, 3:20 PM"],["OW","approved and sent the dispute letter to Granite Ridge Casualty.","Nov 6, 3:18 PM"],["AU","Duplicate of “2022 Audit.pdf” detected and skipped.","Nov 10, 9:02 AM"]],
 "WCR-1044":[["AI","Extracted payroll, class codes, rates, mod and claims from 9 PDFs with page numbers.","Nov 10, 8:30 AM"],["AU","All 2021-2024 documents received. Case moved to AI review.","Nov 9, 5:10 PM"]],
 "WCR-1050":[["AU","Requested loss runs from broker (Main Street Insurance Agency) for 2020-2025. Follow-up #1 set for Nov 14.","Nov 9, 9:30 AM"],["AU","Signed agreement detected. Client, case and OneDrive folders created.","Oct 27, 10:00 AM"]],
 "WCR-1049":[["AU","NYCIRB request with Letter of Authority sent. Follow-up set for Nov 12.","Nov 4, 9:10 AM"],["AU","Signed agreement detected. Client, case and OneDrive folders created.","Nov 3, 4:40 PM"]],
 "WCR-1052":[["AU","NYCIRB request with Letter of Authority sent for Northshore Landscaping.","Nov 10, 8:03 AM"],["AI","Read company name, FEIN and address from the signed PDF. No typing.","Nov 10, 8:01 AM"],["AU","Signed agreement detected. SmartSuite client and case created, OneDrive folders made, task list set.","Nov 10, 7:58 AM"]]
};
function actItem(a){var p=PEOPLE[a[0]];return '<li'+(a[3]?' class="new"':'')+'><span class="av '+p[0]+'" aria-hidden="true">'+p[1]+'</span><div><div class="a-t"><b>'+ALAB[a[0]]+'</b> '+esc(a[1])+'</div><div class="a-d">'+esc(a[2])+'</div></div></li>'}
function activityHtml(key){var L=(S.activity[key]||[]);return '<div class="sec-title">Activity</div><ul class="act" id="actList">'+(L.length?L.map(actItem).join(""):'<li><span class="av av-au">⚡</span><div class="a-t">Record created automatically.</div></li>')+'</ul><div class="comment"><input type="text" id="cmtIn" placeholder="Add a comment…" aria-label="Add a comment" data-key="'+esc(key)+'"><button type="button" class="btn small primary" id="cmtBtn">Comment</button></div>'}
function logAct(key,who,text){if(!S.activity[key])S.activity[key]=[];S.activity[key].forEach(function(a){a[3]=false});S.activity[key].unshift([who,text,"Just now",true])}

/* ---------------- table definitions ---------------- */
function caseByClient(n){return S.cases.filter(function(c){return c.client===n})[0]}
function taskStatus(t){
 if(t.done)return "Done";
 if(t.appr)return S.decided[t.appr]?"Done":(t.due<TODAY?"Overdue":"To do");
 if(t.follow)return S.followDone[t.follow]?"Done":(t.due<=TODAY&&t.who==="OW"?"Overdue":"To do");
 if(t.exc)return S.doneExc[t.exc]?"Done":"To do";
 return "To do";
}
function disputeStatus(d){if(d.follow&&S.followDone[d.follow])return d.status==="Insurer replied"?"Open":"Follow-up scheduled";if(d.appr&&S.decided[d.appr])return S.decided[d.appr].k==="ok"?"Sent":S.decided[d.appr].k==="no"?"Closed – no dispute":"Draft – needs approval";return d.status}
function brokerStatus(b){if(b.exc&&S.doneExc[b.exc])return "Waiting for reply";return b.status}
function docStatus(d){if(d.id==="Scan_0091.pdf"&&S.doneExc.e4)return S.doneExc.e4.indexOf("Filed")===0?"Filed":"Needs review";if(d.client==="Atlas Roofing & Siding"&&d.id==="2023 Audit Worksheet"&&S.doneExc.e2)return "Filed";return d.status}
var TABLES={
 clients:{name:"Clients",rows:function(){return CLIENTS},status:"status",
  cols:[["id","Client","title"],["status","Status","pill"],["fein","FEIN","text"],["city","Location","text"],["broker","Broker","text"],["carrier","Carrier","text"],["cases","Cases","cases"],["sp","Sold by","av"],["signed","Signed","date"]],
  sorts:[["id","Client"],["signed","Signed date"],["status","Status"]],groups:[["status","Status"],["broker","Broker"],["carrier","Carrier"]]},
 cases:{name:"Cases",rows:function(){return S.cases},status:"stage",
  cols:[["id","Case","title"],["client","Client","client"],["stage","Stage","pill"],["who","Assigned to","av"],["due","Due date","due"],["amt","Possible recovery","money"],["credit","Confirmed credit","money"],["years","Policy years","text"],["docs","Documents","docs"],["next","Next step","text"]],
  sorts:[["due","Due date"],["amt","Possible recovery"],["client","Client"],["stage","Stage"]],groups:[["stage","Stage"],["who","Assigned to"]]},
 documents:{name:"Documents",rows:function(){return DOCS},status:"status",
  cols:[["id","File","title"],["client","Client","client"],["status","Status","pill"],["type","Type","text"],["year","Year","text"],["src","Source / chased by","text"],["next","Next auto follow-up","due"],["by","Filed by","av"]],
  sorts:[["client","Client"],["year","Year"],["status","Status"]],groups:[["status","Status"],["type","Type"],["client","Client"],["by","Filed by"]]},
 brokers:{name:"Broker Requests",rows:function(){return BROKERS},status:"status",
  cols:[["id","Request","title"],["client","Client","client"],["status","Status","pill"],["broker","Broker","text"],["docs","Documents requested","text"],["sent","Sent","date"],["fu","Auto follow-ups","num"],["next","Next follow-up","due"]],
  sorts:[["next","Next follow-up"],["sent","Sent"],["client","Client"]],groups:[["status","Status"],["broker","Broker"]]},
 disputes:{name:"Disputes",rows:function(){return DISPUTES},status:"status",
  cols:[["id","Dispute","title"],["client","Client","client"],["status","Status","pill"],["carrier","Insurer","text"],["sent","Sent","date"],["last","Last contact","date"],["next","Next follow-up","due"],["amt","Est. amount","money"]],
  sorts:[["next","Next follow-up"],["amt","Est. amount"],["client","Client"]],groups:[["status","Status"],["carrier","Insurer"]]},
 tasks:{name:"Tasks",rows:function(){return TASKS0},status:"status",
  cols:[["id","Task","title"],["case","Case","case"],["status","Status","pill"],["who","Assigned to","av"],["due","Due date","due"],["by","Created by","av"]],
  sorts:[["due","Due date"],["status","Status"],["who","Assigned to"]],groups:[["status","Status"],["who","Assigned to"],["by","Created by"]]}
};
function val(tk,r,k){
 if(k==="status"){if(tk==="tasks")return taskStatus(r);if(tk==="disputes")return disputeStatus(r);if(tk==="brokers")return brokerStatus(r);if(tk==="documents")return docStatus(r)}
 if(k==="cases"&&tk==="clients")return S.cases.filter(function(c){return c.client===r.id}).map(function(c){return c.id});
 return r[k];
}
function cell(tk,r,c){
 var v=val(tk,r,c[0]);
 switch(c[2]){
  case "title":return esc(v);
  case "pill":return pill(v);
  case "av":return av(v);
  case "date":return fdate(v);
  case "due":{if(!v)return "—";var done=(tk==="tasks"&&taskStatus(r)==="Done");return '<span class="due'+(!done&&v<TODAY?" late":"")+'">'+fdate(v)+'</span>'}
  case "money":return v?'<span class="money">'+money(v)+'</span>':'<span class="item-sub">—</span>';
  case "num":return String(v);
  case "client":return chip("clients",v);
  case "case":return chip("cases",v);
  case "cases":return '<span class="cells">'+v.map(function(x){return chip("cases",x)}).join("")+'</span>';
  case "docs":{var dc=docCount(r.client);return '<span class="chip file" role="button" tabindex="0" data-rec="documents|'+esc(r.client)+'">'+dc+(dc===1?' file':' files')+'</span>'}
 }
 return esc(v);
}
function plain(tk,r,c){var v=val(tk,r,c[0]);if(c[2]==="av")return PEOPLE[v]?PEOPLE[v][2]:v;return Array.isArray(v)?v.join(","):String(v==null?"":v)}

/* ---------------- table view state ---------------- */
var VS={};
function vs(tk){if(!VS[tk])VS[tk]={vt:"grid",filter:[],sort:null,group:null,client:null,overdue:false,all:false};return VS[tk]}
var LIMIT=100;
function isOverdueCase(c){return !!c.due&&c.due<TODAY&&["Paid","Invoiced","Closed – no dispute"].indexOf(c.stage)<0}
function rowsFor(tk){
 var T=TABLES[tk],st=vs(tk),R=T.rows().slice();
 if(st.client)R=R.filter(function(r){return r.client===st.client});
 if(st.overdue)R=R.filter(isOverdueCase);
 if(st.filter.length)R=R.filter(function(r){return st.filter.indexOf(val(tk,r,T.status))>-1});
 if(st.sort){var k=st.sort;R.sort(function(a,b){var x=val(tk,a,k),y=val(tk,b,k);if(typeof x==="number"&&typeof y==="number")return y-x;x=String(x||"~");y=String(y||"~");return x<y?-1:x>y?1:0})}
 return R;
}
function groupsOf(tk,R,k){var g={},order=[];R.forEach(function(r){var v=plain(tk,r,[k,"",TABLES[tk].cols.filter(function(c){return c[0]===k})[0][2]]);if(!g[v]){g[v]=[];order.push(v)}g[v].push(r)});var SO=Object.keys(STATUS);if(k===TABLES[tk].status)order.sort(function(a,b){return SO.indexOf(a)-SO.indexOf(b)});return order.map(function(v){return [v,g[v]]})}
function renderTable(tk){
 var T=TABLES[tk],st=vs(tk),R=rowsFor(tk),all=T.rows().length,RT=R.length,cut=!st.all&&R.length>LIMIT;if(cut)R=R.slice(0,LIMIT);
 var mf=(st.client?'<span class="active-f">Client: <b>'+esc(st.client)+'</b> <button type="button" class="linkbtn" data-clear="client">Clear</button></span>':'')+(st.filter.length?'<span class="active-f">Filtered: '+st.filter.map(pill).join("")+' <button type="button" class="linkbtn" data-clear="filter">Clear</button></span>':'');
 $("#tblMeta").innerHTML='<span>Showing <b>'+R.length+'</b> of '+RT+(RT!==all?' matching ('+all+' in table)':'')+' · <span class="pill p-amber">Demo data</span>'+(cut?' <button type="button" class="linkbtn" data-showall="1">Show all '+RT+'</button>':'')+'</span>'+(st.overdue?'<span class="active-f">Only overdue <button type="button" class="linkbtn" data-clear="overdue">Clear</button></span>':'')+mf;
 var h="";
 if(!R.length){h='<div class="empty">No records match this filter. <button type="button" class="linkbtn" data-clear="filter">Clear filter</button></div>'}
 else if(st.vt==="grid"){
  var head='<tr>'+T.cols.map(function(c,i){return '<th'+(i===0?' class="first"':'')+'>'+esc(c[1])+'</th>'}).join("")+'</tr>';
  function row(r,i){return '<tr class="row" data-rec="'+tk+'|'+esc(r.key||r.id)+'" tabindex="0">'+T.cols.map(function(c,j){return '<td'+(j===0?' class="first"':'')+'>'+(j===0?'<span class="rn">'+(i+1)+'</span>':'')+cell(tk,r,c)+'</td>'}).join("")+'</tr>'}
  var body="";
  if(st.group){var n=0;groupsOf(tk,R,st.group).forEach(function(g){body+='<tr class="grp"><td colspan="'+T.cols.length+'">'+esc(g[0])+' <span class="item-sub">· '+g[1].length+'</span></td></tr>';g[1].forEach(function(r){body+=row(r,n++)})})}
  else body=R.map(row).join("");
  h='<div class="gridwrap"><table class="grid"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>';
 }else if(st.vt==="kanban"){
  var gk=st.group||T.status;
  h='<div class="kanban">'+groupsOf(tk,R,gk).map(function(g){return '<div class="kcol"><div class="kcol-h">'+(gk===T.status?pill(g[0]):esc(g[0]))+'<span class="n">'+g[1].length+'</span></div>'+g[1].map(function(r){return card(tk,r)}).join("")+'</div>'}).join("")+'</div>';
 }else if(st.vt==="card"){
  h='<div class="cards">'+R.map(function(r){return card(tk,r,true)}).join("")+'</div>';
 }else{
  var G=groupsOf(tk,R,T.status),mx=Math.max.apply(null,G.map(function(g){return g[1].length}));
  var colors=["#5b5bd6","#3a86ff","#2fa9a9","#f2a33a","#ec5b5b","#8663d5","#3eac6a","#9b9fb0"];
  h='<div class="kpis" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))"><div class="kpi"><div class="k-label">Records shown</div><div class="k-num">'+R.length+'</div><div class="k-sub">of '+T.rows().length.toLocaleString("en-US")+' in this table</div></div>'+G.slice(0,3).map(function(g){return '<div class="kpi"><div class="k-label">'+esc(g[0])+'</div><div class="k-num">'+g[1].length+'</div><div class="k-sub">in this sample</div></div>'}).join("")+'</div>';
  h+='<div class="tdash"><div class="widget"><div class="w-head"><h2>Records by status</h2></div>'+G.map(function(g,i){return '<div class="hbar"><span class="hl">'+esc(g[0])+'</span><span class="ht"><span style="width:'+(g[1].length/mx*100)+'%;background:'+colors[i%colors.length]+'"></span></span><span class="hv">'+g[1].length+'</span></div>'}).join("")+'</div>'+
   '<div class="widget"><div class="w-head"><h2>Share by status</h2></div>'+donut(G.map(function(g,i){return [g[0],g[1].length,colors[i%colors.length]]}))+'</div></div>';
 }
 $("#tblBody").innerHTML=h;
 ["filter","sort","group"].forEach(function(k){var on=k==="filter"?st.filter.length:(k==="sort"?st.sort:st.group);$("#"+k+"Btn").classList.toggle("on",!!on);var b=$("#"+k+"Badge");b.hidden=!on;b.textContent=k==="filter"?st.filter.length:"1"});
}
function card(tk,r,big){
 var T=TABLES[tk],st=val(tk,r,T.status);
 var f=T.cols.slice(1).filter(function(c){return c[0]!==T.status}).slice(0,big?5:3);
 return '<div class="rcard" data-rec="'+tk+'|'+esc(r.key||r.id)+'" tabindex="0" role="button">'+(big?'<div class="rc-band" style="background:var(--accent)"></div>':'')+'<div class="rc-t">'+esc(r.id)+'</div>'+(big||(vs(tk).group&&vs(tk).group!==T.status)?pill(st):"")+f.map(function(c){return '<div class="rc-f"><span>'+esc(c[1])+'</span><span>'+cell(tk,r,c)+'</span></div>'}).join("")+'</div>';
}
function donut(parts){
 var tot=parts.reduce(function(s,p){return s+p[1]},0)||1,a=0,R=52,C=2*Math.PI*R,segs="";
 parts.forEach(function(p){var l=p[1]/tot*C;segs+='<circle r="'+R+'" cx="70" cy="70" fill="none" stroke="'+p[2]+'" stroke-width="22" stroke-dasharray="'+l.toFixed(2)+' '+(C-l).toFixed(2)+'" stroke-dashoffset="'+(-a).toFixed(2)+'" transform="rotate(-90 70 70)"/>';a+=l});
 return '<div class="donut-wrap"><svg viewBox="0 0 140 140" role="img" aria-label="Donut chart">'+segs+'<text x="70" y="68" text-anchor="middle" font-size="22" font-weight="700" fill="#383c57">'+tot+'</text><text x="70" y="86" text-anchor="middle" font-size="10" fill="#73788f">total</text></svg><div class="dleg">'+parts.map(function(p){return '<div><i style="background:'+p[2]+'"></i>'+esc(p[0])+'<b>'+p[1]+'</b></div>'}).join("")+'</div></div>';
}
/* popovers */
function closePops(){$$(".pop").forEach(function(p){p.hidden=true;p.innerHTML=""});$$(".tbtn[aria-expanded]").forEach(function(b){b.setAttribute("aria-expanded","false")})}
function openPop(k){
 var tk=curTable;if(!tk)return;var T=TABLES[tk],st=vs(tk),p=$("#"+k+"Pop"),wasOpen=!p.hidden;closePops();if(wasOpen)return;
 var h="";
 if(k==="filter"){var vals=[];T.rows().forEach(function(r){var v=val(tk,r,T.status);if(vals.indexOf(v)<0)vals.push(v)});
  h='<h5>Show records where status is</h5>'+vals.map(function(v){return '<label><input type="checkbox" data-fv="'+esc(v)+'"'+(st.filter.indexOf(v)>-1?" checked":"")+'>'+pill(v)+'</label>'}).join("")+'<div class="pop-foot"><button type="button" class="linkbtn" data-clear="filter">Clear</button><button type="button" class="linkbtn" data-popclose="1">Done</button></div>'}
 else if(k==="sort"){h='<h5>Sort by</h5><button type="button" class="opt'+(!st.sort?" on":"")+'" data-sort="">Default order</button>'+T.sorts.map(function(s){return '<button type="button" class="opt'+(st.sort===s[0]?" on":"")+'" data-sort="'+s[0]+'">'+esc(s[1])+'</button>'}).join("")}
 else{h='<h5>Group by</h5><button type="button" class="opt'+(!st.group?" on":"")+'" data-group="">No grouping</button>'+T.groups.map(function(g){return '<button type="button" class="opt'+(st.group===g[0]?" on":"")+'" data-group="'+g[0]+'">'+esc(g[1])+'</button>'}).join("")}
 p.innerHTML=h;p.hidden=false;$("#"+k+"Btn").setAttribute("aria-expanded","true");
}

/* ---------------- record panel ---------------- */
var curRec=null,curTable=null;
function fieldRow(l,v){return '<div class="field"><div class="fl">'+esc(l)+'</div><div class="fv">'+v+'</div></div>'}
function caseFields(a){
 var c=caseByClient(a.client);if(!c)return "";
 var cl=CLIENTS.filter(function(x){return x.id===c.client})[0]||{};
 return '<div class="rp-tabs"><button type="button" class="on" data-jump=".fields">Fields</button><button type="button" data-jump="#actList">Activity</button><button type="button" data-rec="documents|'+esc(c.client)+'">Files ('+docCount(c.client)+')</button></div><div class="fields">'+
  fieldRow("Case",'<b>'+esc(c.id)+'</b>')+fieldRow("Client",chip("clients",c.client))+fieldRow("Stage",pill(c.stage))+fieldRow("Assigned to",av(c.who))+
  fieldRow("Due date",'<span class="due'+(c.due<TODAY?" late":"")+'">'+fdate(c.due)+', 2026</span>')+fieldRow("Carrier",esc(cl.carrier||a.carrier||""))+fieldRow("Broker",esc(cl.broker||""))+
  fieldRow("Documents",'<span class="chip file" role="button" tabindex="0" data-rec="documents|'+esc(c.client)+'">'+docCount(c.client)+(docCount(c.client)===1?' file':' files')+' in OneDrive</span>')+'</div>';
}
function openPanel(){var p=$("#sheet");p.classList.add("open");p.setAttribute("aria-hidden","false");$("#backdrop").hidden=false;document.body.style.overflow="hidden";$("#sheetBody").scrollTop=0;setTimeout(function(){$("#sheetClose").focus()},60)}
function closeSheet(){var p=$("#sheet");if(!p.classList.contains("open"))return;p.classList.remove("open");p.setAttribute("aria-hidden","true");$("#backdrop").hidden=true;document.body.style.overflow="";curRec=null;if(lastFocus&&lastFocus.focus&&document.body.contains(lastFocus))lastFocus.focus()}
function refreshPanel(scrollTo){
 if(!curRec)return;var st=$("#sheetBody").scrollTop;
 if(curRec.kind==="appr")openSheet(curRec.id,true);else if(curRec.kind==="info")openInfo(curRec.fn,true);else openRec(curRec.tk,curRec.id,true);
 var t=scrollTo&&$(scrollTo);if(t)$("#sheetBody").scrollTop=Math.max(0,t.offsetTop-80);else $("#sheetBody").scrollTop=st;
}
function openRec(tk,id,keep,force){
 var T=TABLES[tk];if(!T)return;
 var r=T.rows().filter(function(x){return (x.key||x.id)===id})[0];
 if(tk==="documents"&&!r){var s=vs("documents");s.client=id;s.filter=[];closeSheet();show("t-documents");toast("Documents for "+id);return}
 if(!r)return;
 if(tk==="cases"&&r.appr&&findAppr(r.appr)&&!force&&!(curRec&&curRec.kind==="rec"&&curRec.force))return openSheet(r.appr,keep);
 if(!keep)lastFocus=document.activeElement;
 curRec={kind:"rec",tk:tk,id:id,force:force||(keep&&curRec&&curRec.force)};
 $("#rpTable").textContent=T.name;$("#rpNav").textContent="Demo data";
 var key=tk==="cases"?r.id:(tk+":"+(r.key||r.id));
 if(!S.activity[key])S.activity[key]=defaultAct(tk,r);
 var h='<div class="rp-title" id="sheetTitle">'+esc(r.id)+'</div><div class="rp-sub">'+(r.client&&tk!=="clients"?esc(r.client)+' · ':'')+'Demo data</div>';
 h+='<div class="rp-tabs"><button type="button" class="on" data-jump=".fields">Fields</button><button type="button" data-jump="#actList">Activity</button><button type="button" data-jump="#cmtIn">Comment</button></div><div class="fields">'+T.cols.slice(1).map(function(c){return fieldRow(c[1],cell(tk,r,c))}).join("")+'</div>';
 h+=recActions(tk,r);
 if(tk==="cases")h+=casePage(r);
 if(tk==="clients"){var cc=caseByClient(r.id);if(cc)h+='<div class="sec-title">Case '+esc(cc.id)+' · '+pill(cc.stage)+'</div>'+casePage(cc)}
 h+=activityHtml(key);
 $("#sheetBody").innerHTML=h;
 if(!keep)openPanel();
}
function recActions(tk,r){
 var b="";
 if(r.follow){var f=S.follow.filter(function(x){return x.id===r.follow})[0];if(f&&f.btn&&!S.followDone[f.id])b='<div class="why">'+esc(f.note)+'</div><div class="btn-row"><button type="button" class="btn primary" data-follow="'+f.id+'">'+esc(f.btn)+'</button></div>';else if(f)b='<div class="why">'+esc(S.followDone[f.id]||f.note)+'</div>'}
 if(r.exc){var e=allExc().filter(function(x){return x.id===r.exc})[0];if(e){b=S.doneExc[e.id]?'<div class="decided t-green">'+esc(S.doneExc[e.id])+'</div>':'<div class="why '+(e.whyk==="ai"?"ai":"")+'">'+esc(e.why)+'</div><div class="btn-row">'+e.btns.map(function(x,i){return '<button type="button" class="btn small '+(i===0?"primary":"")+'" data-exc="'+e.id+'" data-b="'+i+'">'+esc(x[0])+'</button>'}).join("")+'</div>'}}
 if(r.appr&&findAppr(r.appr)&&!S.decided[r.appr])b='<div class="btn-row"><button type="button" class="btn primary" data-open="'+r.appr+'">Open for approval ›</button></div>';
 return b?'<div class="sec-title">Needs action</div>'+b:"";
}
function defaultAct(tk,r){
 if(tk==="clients"){var c=caseByClient(r.id);return [["AU","Case "+(c?c.id:"")+" created, OneDrive folders "+r.id+" › Policies made.",fdate(r.signed)+", 2026"],["AI","Read company name, FEIN and address from the signed agreement.",fdate(r.signed)+", 2026"],["SP","sent the agreement and authorization form.",fdate(r.signed)+", 2026"]]}
 if(tk==="documents"){var L=[];if(r.status==="Filed")L.push([r.by==="AI"?"AI":"AU",(r.by==="AI"?"Recognised as “"+r.type+"”, renamed and filed in ":"Saved to ")+"OneDrive › "+r.client+" › Policies › "+r.id,"Nov 9, 2026"]);if(r.status==="Requested")L.push(["AU","Requested from "+r.src+". Follow-ups go out automatically.","Nov 8, 2026"]);if(r.status==="Missing")L.push(["AU","Flagged missing. "+(/manual/.test(r.src)?"Stays manual: added to the secretary's list.":"Escalated after 2 automatic follow-ups."),"Nov 9, 2026"]);if(r.status==="Needs check")L.push(["AI","Only 41% sure which client this is, so it asks a person instead of guessing.","Nov 10, 2026"]);return L}
 if(tk==="brokers"){var L2=[];if(r.status==="Received")L2.push(["AI","Broker reply read: all requested documents attached and filed.","Oct 21, 2026"]);if(r.status==="Reply received")L2.push(["AI","Broker reply read: “sending this week”. Next check set for Nov 13.","Nov 10, 10:05 AM"]);for(var i=r.fu;i>=1;i--)L2.push(["AU","Automatic follow-up #"+i+" sent to "+r.broker+".","Day "+(i*5)]);L2.push(["AU","Requested "+r.docs+" from broker ("+r.broker+").",fdate(r.sent)+", 2026"]);if(r.status==="Escalated to secretary")L2.unshift(["AU","No reply after 2 automatic follow-ups. Sent to the secretary's exceptions list.","Nov 10, 7:00 AM"]);return L2}
 if(tk==="disputes"){var L3=[];if(r.status==="Credit confirmed")L3.push(["AI","Insurer letter read: credit of $9,840 confirmed. Invoice drafted for owner approval.","Nov 9, 2026"]);if(r.status==="Insurer replied")L3.push(["AI","Insurer replied asking for 2023 payroll records. Summary added.","Nov 9, 2026"]);if(r.status==="Overdue")L3.push(["AU","No reply yet. Follow-up drafted for owner approval.","Nov 10, 7:00 AM"]);if(r.sent){L3.push(["AU","Outlook reminder created 7 days out.",fdate(r.sent)+", 2026"]);L3.push(["OW","approved and sent the dispute letter.",fdate(r.sent)+", 2026"])}else L3.push(["AI","Dispute letter drafted from the owner's approved findings.","Nov 9, 2026"]);return L3}
 if(tk==="tasks"){return [[r.by,"created this task and assigned it to the "+PEOPLE[r.who][2].toLowerCase()+", due "+fdate(r.due)+".","Nov 9, 2026"]]}
 return [];
}
/* owner widgets */
function renderOwnerCharts(){
 var ST=[["Onboarding","#2fa9a9"],["Rating & history","#3a86ff"],["Collecting documents","#f0923d"],["Document review","#8663d5"],["Owner review","#f2a33a"],["Dispute ready","#d9559a"],["Dispute open","#4b4f73"],["Waiting on client","#9b9fb0"],["Recovered – invoice","#3eac6a"],["Invoiced","#3eac6a"],["Paid","#2e9e5b"],["Closed – no dispute","#c4c7d3"]];
 var cnt=ST.map(function(s){return [s[0],S.cases.filter(function(c){return c.stage===s[0]}).length,s[1]]}).filter(function(s){return s[1]>0});
 var mx=Math.max.apply(null,cnt.map(function(s){return s[1]}));
 $("#stageSub").textContent=S.cases.length+" cases · demo data";
 $("#stageChart").innerHTML=cnt.map(function(s){return '<button type="button" class="hbar" data-stage="'+esc(s[0])+'"><span class="hl">'+s[0]+'</span><span class="ht"><span style="width:'+(s[1]/mx*100)+'%;background:'+s[2]+'"></span></span><span class="hv">'+s[1]+'</span></button>'}).join("")+'<div class="btn-row"><button type="button" class="btn small" data-goto="t-cases|kanban">Open Cases as Kanban ›</button></div>';
 var c={ai:0,auto:0};S.auto.forEach(function(a){c[a[2]]++});var ex=allExc(),hu=ex.filter(function(e){return e.kind==="human"}).length,ma=ex.filter(function(e){return e.kind==="manual"}).length;
 $("#donut").innerHTML='<p class="w-note">Today\u2019s '+(S.auto.length+ex.length)+' back-office tasks, by who did them.</p>'+donut([["Automation does it",c.auto,"#3a86ff"],["AI does it",c.ai,"#8663d5"],["Human checks",hu,"#f2a33a"],["Stays manual",ma,"#9b9fb0"]]);
}
/* this week's automation log (fixed demo data) */
var WEEK=(function(){
 var s=777;function rnd(){s=(s*1103515245+12345)%2147483648;return s/2147483648}
 var days=["Nov 4","Nov 5","Nov 6","Nov 9","Nov 10"],filed=DOCS.filter(function(d){return d.status==="Filed"&&d.src!=="Signed by email"});
 var docs=[];for(var i=0;i<46;i++){var d=filed[Math.floor(rnd()*filed.length)];docs.push([days[Math.floor(i/10)]+", "+(8+Math.floor(rnd()*9))+":"+(10+Math.floor(rnd()*49)),d.client,d.id,"Filed OK","Renamed and filed in OneDrive › "+d.client+" › Policies"])}
 docs[7]=["Nov 5, 2:14",docs[7][1],"Statement_Q3.pdf","Failed","Password-protected PDF from the insurer. Could not open; sent to the secretary."];
 docs[31]=["Nov 9, 11:02",docs[31][1],"IMG_2231.jpg","Needs review","Photo of a page, not a full document. Secretary to check."];
 docs[45]=["Nov 10, 9:40","Greenpoint Staffing Group","Scan_0091.pdf","Needs review","AI only 41% sure which client this is. On the secretary's list."];
 var targets=CASES0.filter(function(c){return c.stage==="Collecting documents"||c.stage==="Rating & history"}),fups=[];
 for(var j=0;j<23;j++){var c=targets[Math.floor(rnd()*targets.length)],cl=CLIENTS.filter(function(x){return x.id===c.client})[0];fups.push([days[Math.floor(j/5)]+", 9:"+(10+j),c.client,(c.stage==="Rating & history"?"NYCIRB":cl.broker),"Follow-up #"+(1+Math.floor(rnd()*3))+" sent"])}
 var packs=CASES0.filter(function(c){return c.stage==="Owner review"||c.stage==="Dispute ready"}).map(function(c,i){return [days[i%5]+", 10:"+(10+i*4),c.client,c.id,"Case pack ready: documents, gaps and timeline on one page"]});
 var hours=[["Documents renamed and filed",docs.filter(function(d){return d[3]==="Filed OK"}).length,10],["Follow-up emails sent",fups.length,10],["Case packs prepared for the owner",packs.length,100],["New clients set up from signed agreements",3,30],["NYCIRB replies matched and saved",4,20],["Outlook reminders created",5,5],["Missing-year and duplicate checks",12,5]];
 return {docs:docs,fups:fups,packs:packs,hours:hours};
})();



/* ---------------- info panels: money, logs, about ---------------- */
function openInfo(fn,keep){if(!keep)lastFocus=document.activeElement;curRec={kind:"info",fn:fn};var o=fn();$("#rpTable").textContent=o[0];$("#rpNav").textContent="Demo data";$("#sheetBody").innerHTML='<div class="rp-title" id="sheetTitle">'+esc(o[1])+'</div>'+o[2];if(!keep)openPanel()}
function tbl(head,rows,foot){return '<div class="gridwrap"><table class="grid mini-grid"><thead><tr>'+head.map(function(x,i){return '<th'+(i===0?' class="first"':'')+'>'+esc(x)+'</th>'}).join("")+'</tr></thead><tbody>'+rows.join("")+'</tbody>'+(foot?'<tfoot><tr>'+foot.map(function(x,i){return '<td'+(i===0?' class="first"':'')+'><b>'+x+'</b></td>'}).join("")+'</tr></tfoot>':'')+'</table></div>'}
function moneyPanel(kind){return function(){
 var L=kind==="pot"?potCases():kind==="conf"?confCases():paidCases(),k=kind==="pot"?"amt":kind==="conf"?"credit":"fee";
 var T={pot:["Potential recoveries","Possible errors found and being pursued. Identified, not confirmed by the insurer."],conf:["Confirmed credits","The insurer agreed to a credit or refund. The fee invoice is drafted or sent."],paid:["Collected fees","Fees invoiced and paid by the client (25% demo rate on the confirmed credit)."]}[kind];
 var rows=L.map(function(c){return '<tr class="row" data-rec="cases|'+c.id+'"><td class="first">'+esc(c.client)+'</td><td>'+c.id+'</td><td>'+pill(c.stage)+'</td><td class="money">'+money(c[k])+'</td></tr>'});
 return ["Cases",T[0],'<div class="rp-sub">'+T[1]+' Demo data.</div><div class="sum-line">'+L.length+' cases add up to <b>'+money(sum(L,k))+'</b></div>'+tbl(["Client","Case","Stage",kind==="paid"?"Fee collected":"Amount"],rows,["Total","","",money(sum(L,k))])];
}}
function logPanel(kind){return function(){
 if(kind==="docs"){var ok=WEEK.docs.filter(function(d){return d[3]==="Filed OK"}).length,bad=WEEK.docs.length-ok;return ["Automation log","Documents processed this week",'<div class="sum-line"><b>'+WEEK.docs.length+'</b> documents: '+ok+' filed OK, '+WEEK.docs.filter(function(d){return d[3]==="Needs review"}).length+' need review, '+WEEK.docs.filter(function(d){return d[3]==="Failed"}).length+' failed</div>'+tbl(["When","Client","File","Status","What happened"],WEEK.docs.map(function(d){return '<tr class="'+(d[3]==="Filed OK"?"":"hl-bad")+'"><td class="first">'+esc(d[0])+'</td><td>'+esc(d[1])+'</td><td>'+esc(d[2])+'</td><td>'+pill(d[3])+'</td><td>'+esc(d[4])+'</td></tr>'}))]}
 if(kind==="fups")return ["Automation log","Follow-ups sent this week",'<div class="sum-line"><b>'+WEEK.fups.length+'</b> follow-up emails sent automatically</div>'+tbl(["When","Client","To","Status"],WEEK.fups.map(function(d){return '<tr><td class="first">'+esc(d[0])+'</td><td>'+esc(d[1])+'</td><td>'+esc(d[2])+'</td><td>'+pill("Sent")+' '+esc(d[3])+'</td></tr>'}))];
 if(kind==="packs")return ["Automation log","Case packs prepared this week",'<div class="sum-line"><b>'+WEEK.packs.length+'</b> case packs ready for the owner</div>'+tbl(["When","Client","Case","Contents"],WEEK.packs.map(function(d){return '<tr class="row" data-rec="cases|'+d[2]+'"><td class="first">'+esc(d[0])+'</td><td>'+esc(d[1])+'</td><td>'+esc(d[2])+'</td><td>'+esc(d[3])+'</td></tr>'}))];
 var tm=WEEK.hours.reduce(function(t,x){return t+x[1]*x[2]},0);
 return ["Automation log","Work saved this week (estimate)",'<div class="rp-sub">Planning assumptions per task, not measured. To be validated in the 2-week time study.</div>'+tbl(["Task","Times","Min each (assumed)","Minutes"],WEEK.hours.map(function(x){return '<tr><td class="first">'+esc(x[0])+'</td><td>'+x[1]+'</td><td>'+x[2]+'</td><td>'+(x[1]*x[2])+'</td></tr>'}),["Total","","",tm+" min ≈ "+Math.round(tm/60)+" h"])];
}}
function aboutPanel(){return ["WCR Operations","About this demo",'<div class="ss-note"><b>This is a demonstration of the workflow we intend to configure inside your existing SmartSuite account.</b></div><ul class="about"><li>It is <b>not a new or replacement system</b>. Your Clients, Cases, Documents and Tasks stay in the SmartSuite you already use.</li><li>Integrations and automations are <b>added on top</b>: Gmail, Outlook Calendar and OneDrive connect to it.</li><li>Nothing goes to an insurer or a client without the owner\u2019s approval.</li><li>The AmTrust portal and WCB lookups stay manual (their terms).</li><li>AI Audit Assist is an <b>optional Phase 2</b> module, separate from the admin automation.</li><li>All names, amounts and documents here are <b>demo data</b>. Time savings are estimates to validate with a 2-week time study.</li></ul><div class="btn-row"><button type="button" class="btn primary" id="aboutOk">Got it</button></div>']}

/* ---------------- case page ---------------- */
function casePage(c){
 var all=DOCS.filter(function(d){return d.client===c.client});
 var rec=all.filter(function(d){return docStatus(d)==="Filed"||docStatus(d)==="Needs review"}),miss=all.filter(function(d){return MISSING_ST.indexOf(docStatus(d))>-1});
 var tasks=TASKS0.filter(function(t){return t.case===c.id});
 var cl=CLIENTS.filter(function(x){return x.id===c.client})[0]||{};
 var h='<div class="next-act"><div class="na-l">Next action</div><div class="na-t">'+esc(c.next)+'</div><div class="na-m">'+av(c.who)+(c.due?'<span class="due'+(isOverdueCase(c)?" late":"")+'">Due '+fdate(c.due)+'</span>':'')+'</div></div>';
 h+='<div class="sec-title">Client info</div><div class="facts"><div><b>Client</b>'+esc(c.client)+'</div><div><b>FEIN</b>'+esc(cl.fein||"")+'</div><div><b>Location</b>'+esc(cl.city||"")+'</div><div><b>Broker</b>'+esc(cl.broker||"")+'</div><div><b>Carrier</b>'+esc(cl.carrier||"")+'</div><div><b>Signed</b>'+fdate(cl.signed)+'</div></div>';
 h+='<div class="sec-title">Documents received · '+rec.length+'</div>'+(rec.length?'<ul class="mini">'+rec.map(function(d){var p=PEOPLE[d.by];return '<li class="tap" data-rec="documents|'+d.key+'" role="button" tabindex="0"><span class="ic">📄</span><span><b>'+esc(d.id)+'</b><span class="item-sub"> · '+esc(d.year)+' · '+esc(d.type)+'</span><br><span class="item-sub">Filed by '+(p?p[2]:"")+(docStatus(d)==="Needs review"?' · needs review':'')+'</span></span></li>'}).join("")+'</ul>':'<div class="item-sub">Nothing received yet.</div>');
 h+='<div class="sec-title">Missing documents · '+miss.length+'</div>'+(miss.length?'<ul class="mini">'+miss.map(function(d){return '<li class="tap" data-rec="documents|'+d.key+'" role="button" tabindex="0">'+pill(docStatus(d))+'<span><b>'+esc(d.id)+'</b><br><span class="item-sub">Chased by: '+esc(d.src)+(d.next?' · next automatic follow-up '+fdate(d.next):'')+'</span></span></li>'}).join("")+'</ul>':'<div class="item-sub">✅ Nothing missing.</div>');
 h+='<div class="sec-title">Pending tasks · '+tasks.filter(function(t){return taskStatus(t)!=="Done"}).length+'</div>'+(tasks.length?'<ul class="mini">'+tasks.map(function(t){var s=taskStatus(t);return '<li class="tap" data-rec="tasks|'+esc(t.id)+'" role="button" tabindex="0">'+pill(s)+'<span'+(s==="Done"?' class="done-t"':'')+'>'+esc(t.id)+'<br><span class="item-sub">'+PEOPLE[t.who][2]+' · due '+fdate(t.due)+'</span></span></li>'}).join("")+'</ul>':'<div class="item-sub">No open tasks. '+(c.stage==="Paid"?"Case closed.":"The workflow is waiting on the next reply.")+'</div>');
 return h;
}
/* ---------------- automation center ---------------- */
var AUTOS=[
 ["auto","New client from a signed agreement","A signed agreement arrives","Create the client and case in SmartSuite, make the OneDrive folders, set the task list","SmartSuite · OneDrive","Day 1-30",3],
 ["auto","Read the signed PDF","A new agreement is filed","AI reads company name, FEIN and address into the client record. Unsure fields go to the secretary.","Document AI","Day 1-30",3],
 ["auto","Broker follow-ups","A document request has no reply after 5 days","Send follow-up on day 5, 10 and 15, then hand it to the secretary","Gmail · SmartSuite","Day 1-30",23],
 ["auto","File incoming documents","An attachment arrives from a broker, insurer or NYCIRB","Recognise the document, rename it (“2023 Audit Worksheet.pdf”), file it in OneDrive, link it to the case","Document AI · OneDrive","Day 1-30",46],
 ["auto","Missing year and duplicate check","Any document is filed","Flag missing policy years and missing pages, skip duplicates, create the request","SmartSuite","Day 1-30",12],
 ["auto","NYCIRB reply matching","NYCIRB answers by email","Match the reply to the case, save the worksheet, record the mod and losses","Gmail · SmartSuite","Day 31-60",4],
 ["auto","Dispute reminders","A dispute is sent","Create the Outlook reminder 7 days out and draft the follow-up email","Outlook · Gmail","Day 1-30",5],
 ["auto","Stalled case alert","A case has no movement for 10 days","Create a task for the secretary with what is stuck","SmartSuite","Day 1-30",2],
 ["sec","First email to a new broker","A broker contact is used for the first time","Draft the request; the secretary checks it and sends","Gmail","Day 1-30",3],
 ["sec","NYCIRB request","A new client is created","Prepare the request with the Letter of Authority; the secretary approves each send in the first month","Gmail","Day 1-30",3],
 ["sec","Files AI is unsure about","AI is less than 80% sure which client a file belongs to","Ask the secretary instead of guessing","Exceptions list","Day 1-30",1],
 ["sec","Numbers from blurry scans","AI reads a number with low confidence","Secretary compares with the PDF and confirms","Exceptions list","Day 31-60",2],
 ["sec","WCB coverage history","A new case needs 7 years of coverage","Stays manual: the secretary runs the WCB search (site terms). The saved PDF is read into SmartSuite.","wcb.ny.gov","Day 1-30",2],
 ["sec","AmTrust documents","Records are needed from AmTrust","Stays manual: the secretary downloads from the portal (terms ban bots). The file is renamed and filed for her.","AmTrust portal","Day 1-30",2],
 ["owner","Dispute letters","A dispute letter is drafted","Owner edits and approves. Nothing goes to an insurer without him.","Gmail","Day 31-60",1],
 ["owner","Follow-ups to insurers","An insurer follow-up is due","Owner approves the drafted wording in one tap","Gmail · Outlook","Day 1-30",4],
 ["owner","Settlements and responses","An insurer answers or offers a settlement","AI summarises; the owner decides","Owner Dashboard","Day 31-60",1],
 ["owner","Invoices","An insurer confirms a credit or refund","Fee calculated from the agreement and invoice drafted; owner approves every invoice","SmartSuite · accounting","Day 61-90",1],
 ["owner","AI audit findings (optional, Phase 2)","AI flags a possible error in an audit","Owner reviews the evidence and decides; suspicions are never sent as facts","AI Audit Assist","Phase 2 · optional",2]
];
var AUTOGRP=[["auto","Runs automatically","Nobody needs to click anything","p-blue"],["sec","Needs the secretary's OK","She checks it, or does the step that must stay manual","p-teal"],["owner","Always needs the owner's OK","Anything that goes to an insurer or a client","p-amber"]];
var LOCK={14:"Anything sent to an insurer stays with the owner.",15:"Anything sent to an insurer stays with the owner.",16:"Settlement decisions stay with the owner.",17:"Invoices to clients stay with the owner.",18:"AI suspicions are never acted on without the owner.",12:"Stays manual: the WCB site's terms allow informational use only.",13:"Stays manual: AmTrust's site terms do not allow bots."};
var MODEN=[["auto","Automatic"],["sec","Secretary OK"],["owner","Owner OK"]];
function modeOf(i){return S.mode[i]||AUTOS[i][0]}
function renderAutos(){
 $("#autoLegend").innerHTML=AUTOGRP.map(function(g){var n=AUTOS.filter(function(a,i){return modeOf(i)===g[0]}).length;return '<span class="pill '+g[3]+'">'+g[1]+' · '+n+'</span>'}).join("")+'<span class="item-sub">🔒 = locked, with the reason</span>';
 $("#autoCols").innerHTML=AUTOGRP.map(function(g){var rows=AUTOS.map(function(a,i){return [a,i]}).filter(function(x){return modeOf(x[1])===g[0]});return '<div class="agroup"><div class="acol-h"><span class="pill '+g[3]+'">'+g[1]+' · '+rows.length+'</span><span class="item-sub">'+g[2]+'</span></div>'+rows.map(function(x){var a=x[0],i=x[1],lk=LOCK[i],off=S.autoOff[i];
  return '<div class="arule'+(off?" off":"")+'"><div class="ar-top"><div class="ar-name">'+(lk?"🔒 ":"")+esc(a[1])+'</div><div class="seg mini-seg" role="group" aria-label="Mode for '+esc(a[1])+'">'+MODEN.map(function(m){return '<button type="button" class="seg-btn'+(modeOf(i)===m[0]?" active":"")+'" data-mode-i="'+i+'" data-mode-v="'+m[0]+'"'+(lk&&m[0]!==modeOf(i)?' disabled':'')+'>'+m[1]+'</button>'}).join("")+'</div></div>'+
  '<div class="ar-grid"><div><span class="ar-k">Trigger</span>'+esc(a[2])+'</div><div><span class="ar-k">Does</span>'+esc(a[3])+'</div><div><span class="ar-k">Tools</span>'+esc(a[4])+'</div><div><span class="ar-k">Runs</span>'+a[6]+' this week · last run '+(["Nov 10, 9:40","Nov 10, 9:31","Nov 10, 8:03","Nov 9, 4:02"][i%4])+'</div></div>'+
  (lk?'<div class="lock-note">🔒 '+esc(lk)+'</div>':'')+
  '<details class="runlog"><summary>Run log</summary><ul>'+[0,1,2].slice(0,Math.min(3,a[6])).map(function(n){return '<li>'+["Nov 10","Nov 9","Nov 6"][n]+' · '+(n===2&&i===3?'<span class="tag t-red">Failed</span> password-protected PDF, sent to secretary':'<span class="tag t-green">OK</span> '+esc(a[3].split(",")[0]))+'</li>'}).join("")+'</ul></details></div>'}).join("")+'</div>'}).join("");
}
/* ---------------- your day ---------------- */
var DAY=[
 ["Owner",
  [["7:30","Scroll Gmail and Outlook to see which insurers answered"],["8:15","Re-read scattered SmartSuite notes and PDFs to understand a case"],["10:00","Write a dispute email from scratch"],["11:30","Make Outlook reminders one by one"],["2:00","Chase follow-ups that slipped a week"],["4:00","Work out a fee and build an invoice"]],
  [["8:00","Open the Owner Dashboard: everything waiting is in one list"],["8:10","Approve a drafted follow-up and a drafted invoice"],["8:25","Read a one-page case pack and decide"],["8:45","Admin done. The rest of the day: clients, big disputes, growth"]]],
 ["Secretary",
  [["8:30","Search for broker contacts and email document requests"],["10:00","Keep a list in her head of who to chase, make SmartSuite tasks by hand"],["11:00","Download, rename and file every PDF into OneDrive"],["1:30","Type carriers, policies and notes into SmartSuite"],["3:00","WCB lookups and AmTrust downloads"]],
  [["8:00","Open the Secretary Workspace: 14 tasks already done automatically"],["8:10","Handle 5 exceptions: 1 broker call, 1 AmTrust download, 1 WCB lookup, 2 quick checks"],["9:30","Done with the routine. Time for more clients and better follow-through"]]]
];
function renderDay(){
 var sT=0,sA=0,oT=0,oA=0;STEPS.forEach(function(s){if(s.who==="Owner"){oT+=s.today;oA+=s.auto}else{sT+=s.today;sA+=s.auto}});
 $("#dayKpis").innerHTML='<div class="kpi wide"><div class="k-num">'+hm(oT)+' → '+hm(oA)+'</div><div class="k-label">Owner time per case (est.)</div><div class="k-sub">−'+Math.round((1-oA/oT)*100)+'%, to validate with real cases</div></div><div class="kpi wide2"><div class="k-num">'+hm(sT)+' → '+hm(sA)+'</div><div class="k-label">Secretary time per case (est.)</div><div class="k-sub">−'+Math.round((1-sA/sT)*100)+'%, to validate with real cases</div></div><div class="kpi good"><div class="k-num">'+AUTOS.filter(function(a){return a[0]==="auto"}).length+'</div><div class="k-label">Steps that run by themselves</div><div class="k-sub">See the Automation Center</div></div><div class="kpi warn"><div class="k-num">'+AUTOS.filter(function(a){return a[0]==="owner"}).length+'</div><div class="k-label">Kinds of decision kept for the owner</div><div class="k-sub">Disputes, settlements, invoices</div></div>';
 $("#dayCols").innerHTML=DAY.map(function(d){return '<div class="widget"><div class="w-head"><h2>'+d[0]+'</h2></div><div class="daycmp"><div><div class="dc-h before">Today</div>'+d[1].map(function(x){return '<div class="dc-i"><span>'+x[0]+'</span>'+esc(x[1])+'</div>'}).join("")+'</div><div><div class="dc-h after">With automation</div>'+d[2].map(function(x){return '<div class="dc-i"><span>'+x[0]+'</span>'+esc(x[1])+'</div>'}).join("")+'</div></div></div>'}).join("");
 $("#noLonger").innerHTML=["Typing new clients into SmartSuite","Making follow-up tasks and remembering who to chase","Renaming and filing PDFs into OneDrive folders","Creating Outlook reminders for every dispute","Writing follow-up emails from scratch","Hunting through notes to see where a case stands"].map(function(x){return '<li>✓ '+esc(x)+'</li>'}).join("");
}

/* ---------------- navigation ---------------- */
var DASH={owner:["Owner Dashboard","cases"],details:["Owner: all numbers","cases"],secretary:["Secretary Workspace","tasks"]};
var PLAN={day:"Your day: before vs after",autos:"Automation Center",who:"Who does what",time:"Time saved",flow:"Watch a case",audit:"Optional: AI Audit Assist (Phase 2)"};
var curView="owner";
function setSidebar(open){document.body.classList.toggle("sb-open",open);$("#sbBackdrop").hidden=!open;$("#menuBtn").setAttribute("aria-expanded",open?"true":"false")}
function show(v){
 if(!(DASH[v]||PLAN[v]||(v.indexOf("t-")===0&&TABLES[v.slice(2)])))v="owner";
 curView=v;closePops();
 $$(".nav").forEach(function(t){var on=t.dataset.view===v;t.classList.toggle("active",on);if(on)t.setAttribute("aria-current","page");else t.removeAttribute("aria-current")});
 var isT=v.indexOf("t-")===0,tk=isT?v.slice(2):null;curTable=tk;
 var sec=isT?"table":v;
 $$(".view").forEach(function(s){s.classList.toggle("active",s.id==="view-"+sec)});
 var title=isT?TABLES[tk].name:(DASH[v]?DASH[v][0]:PLAN[v]);
 $("#hdrText").textContent=title;
 $("#hdrIcon").className="ht-ic "+(isT?"ni-table":DASH[v]?"ni-dash":v==="who"?"ni-flow":v==="time"?"ni-clock":v==="day"?"ni-sun":v==="autos"?"ni-bolt":v==="audit"?"ni-ai":"ni-play");
 $("#crumbCur").textContent=isT?"Tables":DASH[v]?"Dashboards":v==="day"?"Start here":v==="audit"?"Optional add-on":"Automation plan";
 $(".hdr-bar").hidden=!!PLAN[v];
 $(".tools").hidden=!isT;
 var vt=isT?vs(tk).vt:"dashboard";
 $$(".vtab").forEach(function(b){var on=b.dataset.vt===vt;b.classList.toggle("active",on);b.setAttribute("aria-selected",on?"true":"false")});
 if(isT)renderTable(tk);
 if(v!=="flow")stopFlow();renderFlow();
 setSidebar(false);
 window.scrollTo(0,0);
 if(history.replaceState)history.replaceState(null,"","#"+v);
}
function setVT(vt){
 if(curTable){vs(curTable).vt=vt;show("t-"+curTable);return}
 if(DASH[curView]){if(vt==="dashboard")return;var tk=DASH[curView][1];vs(tk).vt=vt;show("t-"+tk);toast(TABLES[tk].name+" · "+vt.charAt(0).toUpperCase()+vt.slice(1)+" view")}
}
/* ---------------- demo data ---------------- */
var INITIAL={
 approvals:[
  {id:"b1",type:"batch",client:"Outgoing request batch",what:"7 emails drafted for 4 cases",years:"brokers + NYCIRB",amount:0,phase:"Day 1-30",
   items:[["Flatbush Bagel Co","Five Boroughs Insurance","2019-2025 audits and audit worksheets"],["Flatbush Bagel Co","Five Boroughs Insurance","2019-2025 loss runs"],["Riverside Home Care Agency","Main Street Insurance Agency","2020-2022 audit worksheets (still missing)"],["Riverside Home Care Agency","NYCIRB","Experience rating worksheet, with Letter of Authority"],["Astoria Cleaning Services","Harborview Insurance Group","2021 loss runs, page 4 missing from the copy received"],["Astoria Cleaning Services","Hudson Mutual (premium audit dept.)","2024 audit worksheet"],["Northshore Landscaping Inc","Broker found by AI on the declarations page","2019-2025 audits, worksheets and loss runs"]]},
  {id:"a1",type:"findings",client:"Brightline Masonry Corp",what:"Case brief: 3 possible errors found",years:"2021-2024 audits",amount:13559,phase:"Day 31-60",
   fein:"12-3456789",carrier:"Meridian Shield Insurance",policies:"WC-4471-21 to WC-4471-24",contact:"Coastline Brokerage",opened:"Oct 6, 2026",
   docs:[["ok","2021 Audit.pdf"],["ok","2022 Audit.pdf"],["ok","2022 Audit Worksheet.pdf"],["ok","2023 Audit.pdf"],["ok","2023 Audit Worksheet.pdf"],["ok","2024 Loss Runs.pdf"],["ok","NYCIRB Experience Rating Worksheet 2024.pdf"],["miss","2021 Audit Worksheet (requested from broker, auto follow-up #1 sent Nov 8)"]],
   findings:[
    {t:"Overtime premium pay may be included in payroll",yr:"2023 · Class 5022 Masonry",ev:["2023 Audit.pdf, page 3, line 4: class 5022 payroll $612,400","2023 Audit Worksheet.pdf, page 2: total overtime pay $84,300"],rule:"NY Workers' Comp Manual, Rule V(E): when only total overtime pay is shown, one-third of it is excluded",calc:"Excludable = $84,300 ÷ 3 = $28,100\nEffect = $28,100 ÷ 100 × $14.10 rate × 1.08 mod ≈ $4,279",amt:4279,conf:82,on:true},
    {t:"Office employee may be coded as masonry",yr:"2022-2023 · Class 5022 → 8810?",ev:["2023 Audit Worksheet.pdf, page 4: employee listed as \u201cbookkeeper\u201d, $46,000 under class 5022"],rule:"NYCIRB Classification rules: clerical office staff may qualify for 8810 if they meet the standard exception. Job duties must be confirmed with the client.",calc:"Effect = $46,000 ÷ 100 × ($14.10 − $0.21) × 1.08 mod ≈ $6,900",amt:6900,conf:64,on:false},
    {t:"Experience mod may use an outdated claim value",yr:"2024 mod",ev:["NYCIRB Worksheet 2024, page 2: claim C-1187 valued at $18,400","2024 Loss Runs.pdf, page 5: claim C-1187 closed at $2,150"],rule:"NY Experience Rating Plan: Mod = (actual primary losses + expected excess losses) ÷ expected losses. Depends on the valuation date.",calc:"Recomputed mod: 1.08 → 1.03 (estimate)\nEffect ≈ 5% × $47,600 standard premium ≈ $2,380",amt:2380,conf:71,on:true}],
   next:"Approve findings 1 and 3 for a dispute. Confirm the bookkeeper's duties with the client before using finding 2."},
  {id:"a2",type:"findings",client:"Hudson Valley Bakery Inc",what:"Case brief: 2 possible errors found",years:"2022 audit",amount:4106,phase:"Day 31-60",
   fein:"98-7654321",carrier:"Granite Ridge Casualty",policies:"GRC-20981-22",contact:"Main Street Insurance Agency",opened:"Oct 19, 2026",
   docs:[["ok","2022 Audit.pdf"],["ok","2022 Audit Worksheet.pdf"],["ok","2023 Loss Runs.pdf"],["ok","NYCIRB Experience Rating Worksheet 2023.pdf"],["miss","7-year coverage history (WCB lookup is on the secretary's list today)"]],
   findings:[
    {t:"Premium on one class line doesn't add up",yr:"2022 · Class 8017",ev:["2022 Audit.pdf, page 2, line 7: payroll $88,000, premium billed $3,410"],rule:"Premium = payroll ÷ 100 × rate × mod (checked by code, not AI)",calc:"$88,000 ÷ 100 × $1.62 × 0.97 = $1,383\nBilled $3,410 − $1,383 = $2,027 difference",amt:2027,conf:88,on:true},
    {t:"Executive officer payroll may be above the weekly cap",yr:"2022 · Class 2003",ev:["2022 Audit.pdf, page 2: officer payroll $210,000","2022 Audit Worksheet.pdf, page 1: officer listed as president"],rule:"NY Workers' Comp Manual, Rule V(F): executive officer payroll is limited to a weekly maximum",calc:"$210,000 − $150,800 capped (demo figure) = $59,200 over\nEffect = $59,200 ÷ 100 × $3.62 × 0.97 ≈ $2,079",amt:2079,conf:77,on:true}],
   next:"Approve finding 1 (pure arithmetic). Approve finding 2 once officer status for 2022 is confirmed."},
  {id:"a3",type:"letter",client:"Greenpoint Staffing Group",what:"Dispute letter ready to send",years:"2023 audit",amount:7420,phase:"Day 31-60",
   carrier:"Meridian Shield Insurance",letter:"To: Premium Audit Department, Meridian Shield Insurance\nRe: Greenpoint Staffing Group · Policy MSI-55120-23 · 2023 final audit\n\nWe represent Greenpoint Staffing Group under the attached authorization. Our review of the 2023 final audit shows:\n\n1. Overtime premium of $61,800 appears to be included in class 7380 payroll. Under Rule V(E) of the NY Manual, one-third of total overtime pay ($20,600) should be excluded.\n2. The audit applies a 1.14 experience mod; the NYCIRB worksheet on file shows 1.09 for this period.\n\nPlease review and issue a revised audit. Supporting pages are attached.\n\n[Owner's name]\nWorkers Comp Recovery LLC"},
  {id:"a4",type:"invoice",client:"Empire Kitchen Supply",what:"Invoice ready: insurer confirmed a credit",years:"2023 audit",amount:2460,phase:"Day 61-90",
   carrier:"Granite Ridge Casualty",credit:9840,rate:25}
 ],
 follow:[
  {id:"f1",client:"Atlas Roofing & Siding",carrier:"Meridian Shield Insurance",sent:"Oct 27",days:14,state:"overdue",note:"No reply in 14 days. Follow-up #2 is drafted.",btn:"Approve & send follow-up"},
  {id:"f2",client:"Queens Plaza Auto Body",carrier:"Hudson Mutual",sent:"Nov 2",days:8,state:"overdue",note:"Follow-up #1 due today. Draft is ready.",btn:"Approve & send follow-up"},
  {id:"f3",client:"Kingsbridge HVAC LLC",carrier:"AmTrust (audit dispute portal)",sent:"Oct 20",days:21,state:"reply",note:"Insurer replied Nov 9 asking for 2023 payroll records. AI summary on the case; the records are already in OneDrive.",btn:"OK, send the records"},
  {id:"f4",client:"Bay Ridge Electrical",carrier:"Granite Ridge Casualty",sent:"Nov 6",days:4,state:"scheduled",note:"Next follow-up Nov 13. Reminder already in your Outlook calendar.",btn:""}
 ],
 missing:[
  {client:"Kingsbridge HVAC LLC",doc:"2022-2024 Loss Runs",from:"Broker: Coastline Brokerage",status:"No reply after 2 automatic follow-ups. Sent to secretary.",level:"red"},
  {client:"Atlas Roofing & Siding",doc:"2023 Audit Worksheet",from:"AmTrust portal",status:"On secretary's manual list today (portal terms ban bots).",level:"amber"},
  {client:"Hudson Valley Bakery Inc",doc:"7-year coverage history",from:"WCB website",status:"On secretary's manual list today.",level:"amber"},
  {client:"Greenpoint Staffing Group",doc:"2021 Audit",from:"Broker: Main Street Insurance Agency",status:"Broker replied \u201csending this week\u201d (AI read it). Next check Nov 13.",level:"ok"},
  {client:"Queens Plaza Auto Body",doc:"NYCIRB rating worksheet",from:"NYCIRB",status:"Requested Nov 3. Automatic follow-up set for Nov 13.",level:"ok"}
 ],
 exceptions:[
  {id:"e1",kind:"manual",title:"Broker hasn't answered after 2 automatic follow-ups",client:"Kingsbridge HVAC LLC · 2022-2024 loss runs",why:"The system emailed Coastline Brokerage on Oct 30, Nov 4 and Nov 9. Time for a phone call. AI found a second contact in an old Gmail thread: service desk, Coastline Brokerage.",whyk:"ai",btns:[["Called them","Logged: broker called. Next automatic check in 2 days."],["Email the 2nd contact","Request sent to the second broker contact. Follow-ups restart automatically."]]},
  {id:"e2",kind:"manual",title:"AmTrust download",client:"Atlas Roofing & Siding · 2023 audit worksheet",why:"Stays manual: AmTrust's site terms don't allow bots. Log in, open policy WC-AT-30418, download the 2023 audit worksheet, drop it in the Intake folder. The system renames it, files it and updates SmartSuite.",whyk:"manual",btns:[["Downloaded, file it","Filed as \u201c2023 Audit Worksheet.pdf\u201d in Atlas Roofing & Siding / Policies. SmartSuite updated."]]},
  {id:"e3",kind:"manual",title:"WCB coverage lookup (7 years)",client:"Hudson Valley Bakery Inc",why:"Stays manual: the WCB site has no API and its terms allow informational use only. Run the search, save the results page as PDF to Intake. AI reads it and fills carriers, policy numbers and periods into SmartSuite, so nothing is re-typed.",whyk:"manual",btns:[["Saved the PDF","AI read it: 3 carriers, 7 policy periods added to SmartSuite. Broker requests drafted."]]},
  {id:"e4",kind:"human",title:"File couldn't be matched to a client",client:"Scan_0091.pdf · from fax-to-email",why:"AI thinks it's a 2022 loss run for Greenpoint Staffing Group but is only 41% sure, so it asks you instead of guessing.",whyk:"ai",btns:[["Yes, Greenpoint","Filed as \u201c2022 Loss Runs.pdf\u201d in Greenpoint Staffing Group / Policies."],["Not sure, skip","Left in Intake for later."]]},
  {id:"e5",kind:"human",title:"Check 2 numbers AI wasn't sure about",client:"Brightline Masonry Corp · 2023 audit",why:"Page 3 was a blurry scan. AI read class 5022 payroll as $612,400 (confidence 74%) and the rate as $14.10 (69%). Compare with the PDF and confirm.",whyk:"ai",phase:"Day 31-60",btns:[["Both correct","Verified. Numbers locked for the owner's case brief."]]}
 ],
 auto:[
  ["7:58","Signed agreement detected: Northshore Landscaping Inc. SmartSuite client and case created, OneDrive folders made, task list set.","auto",30,"Day 1-30"],
  ["8:01","Company name, FEIN and address read from the signed PDF, no typing.","ai",10,"Day 1-30"],
  ["8:03","NYCIRB request with Letter of Authority sent for Northshore Landscaping (you approved the template).","auto",15,"Day 1-30"],
  ["8:20","NYCIRB reply matched to Empire Kitchen Supply. Worksheet saved; mod 1.12 and losses recorded.","ai",20,"Day 31-60"],
  ["8:45","9 broker attachments classified, renamed (\u201c2023 Audit Worksheet.pdf\u201d etc.) and filed in OneDrive.","ai",35,"Day 1-30"],
  ["9:02","Duplicate of \u201c2022 Audit.pdf\u201d for Bay Ridge Electrical detected and skipped.","auto",5,"Day 1-30"],
  ["9:15","Missing year flagged: Greenpoint Staffing has no 2021 audit. Request created.","auto",10,"Day 1-30"],
  ["9:30","Follow-up #1 sent to broker for Queens Plaza Auto Body (day 5, no reply).","auto",10,"Day 1-30"],
  ["9:31","Follow-up #2 sent to Coastline Brokerage for Kingsbridge HVAC (day 10).","auto",10,"Day 1-30"],
  ["10:05","Broker reply read: Greenpoint's broker says \u201csending this week\u201d. Next check set for Nov 13.","ai",5,"Day 1-30"],
  ["10:40","Brightline Masonry: payroll, class codes, rates, mod and claims pulled from 7 PDFs, with page numbers.","ai",90,"Day 31-60"],
  ["10:42","Rules check (code, not AI): overtime, payroll caps, premium math, mod. 3 possible issues flagged.","auto",40,"Day 31-60"],
  ["10:50","Case brief prepared for the owner. SmartSuite note written and review task created, due Nov 12.","ai",30,"Day 31-60"],
  ["11:10","Outlook reminder created for Bay Ridge Electrical dispute follow-up on Nov 13.","auto",5,"Day 1-30"]
 ],
 activeCases:132,openDisputes:17,pipeline:412600,decided:{},doneExc:{},extraExc:[],extraAppr:[],followDone:{}
};
var S;
function clone(o){return JSON.parse(JSON.stringify(o))}
function reset(){S=clone(INITIAL);S.cases=clone(CASES0);S.activity=clone(ACT0);S.autoOff={};S.confirm={};S.mode={};VS={};renderAll()}

/* ---------------- toast ---------------- */
var tt;
function toast(msg){var t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(tt);tt=setTimeout(function(){t.classList.remove("show")},4200)}

/* ---------------- owner ---------------- */
function pendingApprovals(){return S.approvals.concat(S.extraAppr).filter(function(a){return !S.decided[a.id]})}
function overdueCount(){return S.follow.filter(function(f){return f.state==="overdue"&&!S.followDone[f.id]}).length}
function APPR(a){
  return '<li class="item tap" data-open="'+a.id+'" tabindex="0" role="button" aria-label="Open '+esc(a.client)+'"><div class="item-top"><div><div class="item-title">'+esc(a.client)+(caseByClient(a.client)?' <span class="item-sub">· '+caseByClient(a.client).id+'</span>':'')+'</div><div class="item-sub">'+esc(a.what)+' · '+esc(a.years)+'</div></div><div class="chev">›</div></div><div class="item-meta">'+
  (a.type==="batch"?'<span class="amount">'+a.items.length+' emails</span>':a.type==="invoice"?'<span class="amount">Fee '+money(a.amount)+'</span>':'<span class="amount">'+money(a.amount)+' possible</span>')+
  (a.type==="findings"?SUS:"")+(a.type==="invoice"||a.type==="batch"?tag("auto",a.type==="batch"?"Drafted automatically":"Prepared automatically"):tag("ai",a.type==="findings"?"Prepared by AI":"Drafted by AI"))+phase(a.phase)+'</div></li>'}
function followAppr(fu){return {id:"F:"+fu.id,type:"follow",fid:fu.id,client:fu.client,what:fu.state==="reply"?"Insurer asked for records: reply drafted":"Follow-up #"+(fu.days>10?2:1)+" to the insurer drafted",years:fu.carrier,amount:0,phase:"Day 1-30",carrier:fu.carrier,f:fu}}
function decisions(){
 var a=pendingApprovals().filter(function(x){return x.type!=="findings"});
 S.follow.forEach(function(fu){if(fu.btn&&!S.followDone[fu.id]&&!S.decided["F:"+fu.id])a.push(followAppr(fu))});
 return a;
}
function potCases(){return S.cases.filter(function(c){return ["Owner review","Dispute ready","Dispute open"].indexOf(c.stage)>-1&&c.amt>0})}
function confCases(){return S.cases.filter(function(c){return ["Recovered – invoice","Invoiced"].indexOf(c.stage)>-1})}
function paidCases(){return S.cases.filter(function(c){return c.stage==="Paid"})}
function sum(L,k){return L.reduce(function(t,c){return t+(c[k]||0)},0)}
function openDisp(){return S.cases.filter(function(c){return c.stage==="Dispute open"}).length}
function DECITEM(a){
 var meta=a.type==="follow"?(a.f.state==="overdue"?'<span class="tag t-red">Overdue · '+a.f.days+' days</span>':'<span class="tag t-human">Insurer replied</span>'):a.type==="invoice"?'<span class="amount">Fee '+money(a.amount)+'</span>':a.type==="batch"?'<span class="amount">'+a.items.length+' emails</span>':'<span class="amount">'+money(a.amount)+'</span>';
 var kind={follow:"Follow-up to insurer",invoice:"Invoice to client",batch:"Document requests",letter:"Dispute letter"}[a.type]||"";
 return '<li class="item dec"><div class="dec-top"><div><div class="dec-kind">'+kind+'</div><div class="item-title">'+esc(a.client)+'</div><div class="item-sub">'+esc(a.what)+'</div></div></div><div class="item-meta">'+meta+'</div><div class="btn-row"><button type="button" class="btn small" data-open="'+a.id+'">Review</button><button type="button" class="btn small good" data-open="'+a.id+'" data-pre="1">Approve</button><button type="button" class="btn small" data-act="info" data-id="'+a.id+'">Request changes</button></div></li>';
}
function renderOwner(){
 var D=decisions(),md=missingDocs(),od=S.follow.filter(function(x){return x.state==="overdue"&&!S.followDone[x.id]}).length;
 var k=[["Needs your decision",D.length,D.length?"warn":"good","Listed below","#decWidget"],["Overdue follow-ups",od,od?"bad":"good","Drafted, waiting for you","#decWidget"],["Missing documents",md.length,"","Being chased automatically","missing"],["Open disputes",openDisp(),"wide","With insurers now","disputes"]];
 $("#kpis").innerHTML=k.map(function(x){return '<button type="button" class="kpi '+x[2]+'" data-kpi="'+x[4]+'"><span class="k-label">'+x[0]+'</span><span class="k-num">'+x[1]+'</span><span class="k-sub">'+x[3]+' ›</span></button>'}).join("");
 $("#apprCount").textContent=D.length;
 var pf=pendingApprovals().filter(function(x){return x.type==="findings"});
 $("#auditCount").textContent=pf.length;$("#auditCount2").textContent="("+pf.length+" briefs waiting)";
 $("#auditList").innerHTML=pf.length?pf.map(APPR).join(""):'<li class="item"><div class="item-title">✅ No AI audit briefs waiting</div><div class="item-sub">Approved findings become dispute letters in “Needs your decision”.</div></li>';
 $("#decList").innerHTML=D.length?D.map(DECITEM).join(""):'<li class="item"><div class="item-title">✅ All caught up</div><div class="item-sub">Nothing is waiting for you. “Reset demo” in the side menu starts again.</div></li>';
 $("#baList").innerHTML=[["You set Outlook reminders and chase insurers yourself.","Follow-ups are drafted and scheduled. You just approve."],["You dig through emails and notes to see where a case stands.","Each case page shows documents, missing items and the next step."],["You write dispute letters and invoices from scratch.","They come to you ready. You check them and press approve."],["You find out late that a document never came.","Missing documents are chased by themselves and flagged when late."]].map(function(x){return '<li><div class="b"><span>Before</span>'+esc(x[0])+'</div><div class="a"><span>After</span>'+esc(x[1])+'</div></li>'}).join("");
 // details page
 var P1=potCases(),P2=confCases(),P3=paidCases();
 $("#pipe").innerHTML='<button type="button" class="kpi" data-money="pot"><span class="k-label">Potential recoveries</span><span class="k-num">'+money(sum(P1,"amt"))+'</span><span class="k-sub">'+P1.length+' cases · identified, not confirmed ›</span></button><button type="button" class="kpi good" data-money="conf"><span class="k-label">Confirmed credits</span><span class="k-num">'+money(sum(P2,"credit"))+'</span><span class="k-sub">'+P2.length+' case'+(P2.length===1?"":"s")+' · insurer agreed ›</span></button><button type="button" class="kpi wide" data-money="paid"><span class="k-label">Collected fees</span><span class="k-num">'+money(sum(P3,"fee"))+'</span><span class="k-sub">'+P3.length+' cases · invoiced and paid ›</span></button>';
 var mins=WEEK.hours.reduce(function(t,x){return t+x[1]*x[2]},0);
 $("#weekBanner").innerHTML='<div class="wb-title">This week the system did for you, automatically (tap a number):</div><div class="wb-stats"><button type="button" data-log="docs"><b>'+WEEK.docs.length+'</b> documents processed</button><button type="button" data-log="fups"><b>'+WEEK.fups.length+'</b> follow-ups sent</button><button type="button" data-log="packs"><b>'+WEEK.packs.length+'</b> case packs prepared</button><button type="button" data-log="hours">about <b>'+Math.round(mins/60)+' h</b> of work saved (est.)</button></div>';
 var by={};MISSING_ST.forEach(function(s){by[s]=0});md.forEach(function(d){by[docStatus(d)]++});
 $("#mdCount").textContent=md.length;
 $("#missCard").innerHTML='<div class="miss3">'+MISSING_ST.map(function(s){return '<button type="button" class="m3 '+(s==="Overdue"?"red":"")+'" data-missing="'+esc(s)+'"><b>'+by[s]+'</b><span>'+(s==="Overdue"?"Overdue":s)+'</span></button>'}).join("")+'</div><div class="btn-row"><button type="button" class="btn small" data-missing="">See all '+md.length+' missing documents ›</button></div>';
 var OD=S.cases.filter(isOverdueCase);
 $("#odCount").textContent=OD.length;
 $("#overdueList").innerHTML=OD.slice(0,4).map(function(c){return '<li class="item tap" data-rec="cases|'+c.id+'" role="button" tabindex="0"><div class="item-top"><div><div class="item-title">'+esc(c.client)+' <span class="item-sub">· '+c.id+'</span></div><div class="item-sub">'+esc(c.next)+'</div></div>'+pill(c.stage)+'</div><div class="item-meta">'+av(c.who)+'<span class="due late">Due '+fdate(c.due)+'</span></div></li>'}).join("")+(OD.length>4?'<li class="item"><span class="item-sub">Showing 4 of '+OD.length+'</span> <button type="button" class="linkbtn" data-overdue="1">Show all</button></li>':'');
 var RS=DISPUTES.filter(function(d){var s=disputeStatus(d);return s==="Insurer replied"||s==="Credit confirmed"});
 $("#respCount").textContent=RS.length;
 $("#respList").innerHTML=RS.map(function(d){var s=disputeStatus(d);return '<li class="item tap" data-rec="disputes|'+d.id+'" role="button" tabindex="0"><div class="item-top"><div><div class="item-title">'+esc(d.client)+'</div><div class="item-sub">'+esc(d.carrier)+' · '+fdate(d.last)+'</div></div>'+pill(s)+'</div><div class="item-sub" style="margin-top:4px">'+esc(d.resp||(s==="Credit confirmed"?"Credit of "+money(d.amt)+" confirmed. Invoice drafted.":"Asked for 2023 payroll records."))+'</div></li>'}).join("")||'<li class="item item-sub">No new responses.</li>';
 var fu=S.follow;
 $("#fuCount").textContent=fu.filter(function(x){return !S.followDone[x.id]&&x.state!=="scheduled"}).length;
 $("#followList").innerHTML=fu.map(function(x){
  var done=S.followDone[x.id];
  var st=done?'<span class="tag t-green">'+esc(done)+'</span>':(x.state==="overdue"?'<span class="tag t-red">Overdue · '+x.days+' days</span>':x.state==="reply"?'<span class="tag t-human">Insurer replied</span>':'<span class="tag t-auto">Scheduled</span>');
  return '<li class="item'+(done?" status-done":"")+'"><div class="item-title">'+esc(x.client)+'</div><div class="item-sub">'+esc(x.carrier)+' · dispute sent '+esc(x.sent)+'</div><div class="item-meta">'+st+'</div><div class="item-sub" style="margin-top:6px">'+esc(x.note)+'</div>'+(x.btn&&!done&&!S.decided["F:"+x.id]?'<div class="btn-row"><button type="button" class="btn small" data-open="F:'+x.id+'">Review</button><button type="button" class="btn small good" data-open="F:'+x.id+'" data-pre="1">Approve</button></div>':"")+'</li>'}).join("");
}
/* ---------------- sheet ---------------- */
var lastFocus=null;
function findAppr(id){if(String(id).indexOf("F:")===0){var fu=S.follow.filter(function(x){return "F:"+x.id===id})[0];return fu?followAppr(fu):null}return S.approvals.concat(S.extraAppr).filter(function(a){return a.id===id})[0]}

function supDocs(a){
 var c=caseByClient(a.client),L=[];
 if(a.type==="letter"){var fd=a.findings||[];L=[["Dispute letter (draft).docx","Disputes","just drafted"]];(a.ev||["2023 Audit.pdf, page 4","2023 Audit Worksheet.pdf, page 2","NYCIRB Experience Rating Worksheet 2023.pdf, page 1"]).forEach(function(e){var p=e.split(", ");L.push([p[0],"Policies",p.slice(1).join(", ")||"all pages"])});L.push(["Signed authorization.pdf","Agreements","page 1"])}
 else if(a.type==="invoice")L=[["INV-1043 (draft).pdf","Invoices","1 page"],["Revised 2023 Audit.pdf","Insurer responses","insurer letter, Nov 9"],["Signed agreement.pdf","Agreements","fee terms, page 2"]];
 else if(a.type==="follow")L=[["Dispute letter "+a.f.sent+".pdf","Disputes","as sent"],a.f.state==="reply"?["Insurer reply Nov 9.pdf","Insurer responses","AI summary on the case"]:["Outlook reminder","Calendar","due today"],a.f.state==="reply"?["2023 Payroll records.pdf","Policies","to attach"]:["Evidence pages.pdf","Disputes","attached again"]];
 else if(a.type==="batch")L=[["Signed authorization.pdf (×4 clients)","Agreements","attached to each email"],["Request template: broker documents","Templates","approved by you in month 1"]];
 return '<div class="brief-sec"><h4>Supporting documents</h4><ul class="mini">'+L.map(function(x){return '<li><span class="ic">📄</span><span><b>'+esc(x[0])+'</b><span class="item-sub"> · OneDrive › '+esc(a.client)+' › '+esc(x[1])+' · '+esc(x[2])+'</span></span></li>'}).join("")+'</ul>'+(c?'<div class="btn-row"><button type="button" class="btn small" data-rec="cases|'+c.id+'" data-force="1">Open the case record ('+c.id+') ›</button></div>':'')+'</div>';
}
function openSheet(id,keep){
 var a=findAppr(id);if(!a)return;if(!keep)lastFocus=document.activeElement;curRec={kind:"appr",id:id};
 var cs=caseByClient(a.client);$("#rpTable").textContent="Cases";$("#rpNav").textContent=cs?cs.id+" · Demo data":"Demo data";
 var h='';
 if(a.type==="findings"){
  h+='<div class="tag t-ai">Case brief prepared by AI · '+esc(a.phase)+'</div><h3 class="brief-h" id="sheetTitle">'+esc(a.client)+'</h3><div class="item-sub">'+esc(a.years)+' · Demo data</div>';
  h+=caseFields(a);
  h+='<div class="opt-note small"><b>AI Audit Assist · optional Phase 2 module.</b> Possible errors below are suspicions with evidence, not confirmed overcharges. You decide.</div>';
  h+='<div class="brief-sec"><h4>Client</h4><div class="facts"><div><b>FEIN</b>'+esc(a.fein)+'</div><div><b>Carrier</b>'+esc(a.carrier)+'</div><div><b>Policies</b>'+esc(a.policies)+'</div><div><b>Broker</b>'+esc(a.contact)+'</div><div><b>Case opened</b>'+esc(a.opened)+'</div><div><b>Possible total</b><span class="amount">'+money(a.amount)+'</span></div></div></div>';
  h+='<div class="brief-sec"><h4>Documents</h4>'+a.docs.map(function(d){return '<div class="doc"><span class="ic">'+(d[0]==="ok"?"✅":"⚠️")+'</span><span>'+esc(d[1])+'</span></div>'}).join("")+'</div>';
  h+='<div class="brief-sec"><h4>Possible errors (tick the ones to dispute)</h4>'+a.findings.map(function(f,i){
   return '<div class="finding"><label class="f-top"><input type="checkbox" class="fchk" data-i="'+i+'" '+(f.on?"checked":"")+'><span><span class="f-title">'+(i+1)+'. '+esc(f.t)+'</span><br><span class="item-sub">'+esc(f.yr)+'</span></span></label><div class="item-meta">'+SUS+'<span class="amount">≈ '+money(f.amt)+'</span></div>'+
   '<div class="evid"><b>Evidence:</b><br>'+f.ev.map(function(e){return "📄 "+esc(e)}).join("<br>")+'</div><div class="evid"><b>Rule:</b> '+esc(f.rule)+'</div><div class="calcbox">'+esc(f.calc)+'</div>'+
   '<div class="conf">Confidence '+f.conf+'%<span class="cbar"><span style="width:'+f.conf+'%"></span></span></div></div>'}).join("")+'</div>';
  h+='<div class="brief-sec"><h4>Recommended next step</h4><div class="why ai">'+esc(a.next)+'</div></div>';
 }else if(a.type==="letter"){
  h+='<div class="tag t-auto">Drafted for you from the findings you approved</div><h3 class="brief-h" id="sheetTitle">'+esc(a.client)+'</h3><div class="item-sub">Dispute to '+esc(a.carrier)+' · '+esc(a.years)+' · Demo data</div>';
  h+=caseFields(a);
  h+='<div class="brief-sec"><h4>Draft letter (you can edit before sending)</h4><div class="letter" contenteditable="true" spellcheck="false">'+esc(a.letter)+'</div></div>';
  h+=supDocs(a);
  h+='<div class="brief-sec"><h4>What happens when you approve</h4><div class="why">Sent from your mailbox with the evidence pages attached. Logged on the case in SmartSuite. A follow-up reminder is put in your Outlook calendar for 7 days out, and the follow-up email is drafted for you.</div></div>';
 }else if(a.type==="follow"){
  var fu=a.f;
  h+='<div class="tag t-auto">Drafted automatically · Day 1-30</div><h3 class="brief-h" id="sheetTitle">'+esc(a.client)+'</h3><div class="item-sub">'+esc(a.what)+' · '+esc(fu.carrier)+' · Demo data</div>';
  h+=caseFields(a);
  h+='<div class="brief-sec"><h4>Draft email (you can edit before sending)</h4><div class="letter" contenteditable="true" spellcheck="false">'+esc(fu.state==="reply"?"To: "+fu.carrier+"\nRe: "+a.client+" · audit dispute\n\nThank you for your reply of Nov 9. As requested, the 2023 payroll records are attached (payroll summary and quarterly NYS-45 filings).\n\nPlease let us know if anything else is needed to complete the review.\n\n[Owner's name]\nWorkers Comp Recovery LLC":"To: Premium Audit Department, "+fu.carrier+"\nRe: "+a.client+" · dispute sent "+fu.sent+"\n\nWe are following up on our dispute of "+fu.sent+", which has not yet been answered. The supporting pages are attached again for convenience.\n\nPlease confirm receipt and let us know when we can expect a revised audit.\n\n[Owner's name]\nWorkers Comp Recovery LLC")+'</div></div>';
  h+=supDocs(a);
  h+='<div class="brief-sec"><h4>What happens when you approve</h4><div class="why">Sent from your mailbox, logged on the case in SmartSuite, and the next Outlook reminder is set for 7 days out.</div></div>';
 }else if(a.type==="batch"){
  h+='<div class="tag t-auto">Drafted automatically · '+esc(a.phase)+'</div><h3 class="brief-h" id="sheetTitle">Outgoing request batch</h3><div class="item-sub">'+a.items.length+' emails · Demo data</div>';
  h+='<div class="brief-sec"><h4>What will be sent</h4><ul class="mini">'+a.items.map(function(x){return '<li><span class="tag t-auto">Email</span><span><b>'+esc(x[0])+'</b><span class="item-sub"> → '+esc(x[1])+'</span><br>'+esc(x[2])+'</span></li>'}).join("")+'</ul></div>';
  h+=supDocs(a);
  h+='<div class="brief-sec"><h4>What happens when you approve</h4><div class="why">All '+a.items.length+' go out from the office mailbox with the signed authorization attached. Each one is tracked as a Broker Request in SmartSuite, and follow-ups go out by themselves on day 5, 10 and 15 if nobody answers.</div></div>';
 }else{
  var fee=a.credit*a.rate/100;
  h+='<div class="tag t-auto">Prepared automatically · '+esc(a.phase)+'</div><h3 class="brief-h" id="sheetTitle">'+esc(a.client)+'</h3><div class="item-sub">Insurer confirmed a revised '+esc(a.years)+' · Demo data</div>';
  h+=caseFields(a);
  h+='<div class="brief-sec"><h4>Fee calculation</h4><div class="calcbox">Credit confirmed by '+esc(a.carrier)+': '+money(a.credit)+'\nFee rate from the signed agreement (demo): '+a.rate+'%\nFee = '+money(a.credit)+' × '+a.rate+'% = '+money(fee)+'</div></div>';
  h+=supDocs(a);
  h+='<div class="brief-sec"><h4>What happens when you approve</h4><div class="why">Invoice INV-1043 is sent to the client, payment is tracked, and a reminder goes out automatically if it is unpaid after 30 days.</div></div>';
 }
 var d=S.decided[a.id],AH=cs?'<div class="sec-title" style="margin-top:26px">The case record</div>'+casePage(cs)+activityHtml(cs.id):"";
 if(d){h+='<div class="decided '+(d.k==="ok"?"t-green":d.k==="info"?"t-human":"t-red")+'">'+esc(d.msg)+'</div>'+AH}
 else{h+=AH;
  var appr=a.type==="letter"?"Approve & send":a.type==="invoice"?"Approve & send invoice":a.type==="batch"?"Approve & send all "+a.items.length:a.type==="follow"?"Approve & send":"Approve findings";
  var what={letter:"the dispute letter to "+(a.carrier||"the insurer"),invoice:"invoice INV-1043 to "+a.client,batch:a.items?a.items.length+" request emails":"",follow:"this email to "+(a.carrier||"the insurer")}[a.type];
  if(a.type==="findings")h+='<div class="sticky-actions"><div class="btn-row" style="margin-top:0"><button type="button" class="btn good" data-act="approve" data-id="'+a.id+'">✓ Approve findings (drafts a letter, sends nothing)</button><button type="button" class="btn" data-act="info" data-id="'+a.id+'">Request changes</button><button type="button" class="btn bad" data-act="reject" data-id="'+a.id+'">Reject</button></div></div>';
  else if(S.confirm[a.id])h+='<div class="sticky-actions"><div class="confirm" id="confirmBox"><div class="cf-t">Final check</div><div class="cf-s">You are about to send '+esc(what)+'. You have the draft and the supporting documents above.</div><div class="btn-row"><button type="button" class="btn good" data-act="approve" data-id="'+a.id+'">✓ '+appr+'</button><button type="button" class="btn" data-unconfirm="'+a.id+'">Cancel</button></div></div></div>';
  else h+='<div class="sticky-actions"><div class="btn-row" style="margin-top:0"><button type="button" class="btn good" data-preconfirm="'+a.id+'">Approve…</button><button type="button" class="btn" data-act="info" data-id="'+a.id+'">Request changes</button><button type="button" class="btn bad" data-act="reject" data-id="'+a.id+'">Reject</button></div></div>';
 }
 $("#sheetBody").innerHTML=h;
 if(!keep)openPanel();
}
function decide(id,act){
 var a=findAppr(id);if(!a)return;delete S.confirm[id];
 if(a.type==="follow"){var fu=a.f,cf=S.cases.filter(function(c){return c.follow===fu.id})[0];
  if(act==="approve"){S.followDone[fu.id]=fu.state==="reply"?"Records sent · reminder set":"Follow-up sent · next reminder in 7 days";S.decided[id]={k:"ok",msg:fu.state==="reply"?"Sent. Payroll records went to "+fu.carrier+"; logged in SmartSuite.":"Sent to "+fu.carrier+". Next Outlook reminder set for 7 days."};if(cf){logAct(cf.id,"OW","approved and sent the "+(fu.state==="reply"?"payroll records":"follow-up email")+".");logAct(cf.id,"AU","Logged the send. Next Outlook reminder Nov 17.");cf.next="Automatic follow-up Nov 17";cf.due="2026-11-17"}toast(S.decided[id].msg)}
  else if(act==="info"){S.decided[id]={k:"info",msg:"Sent back with your note. A revised draft comes back to this list."};if(cf)logAct(cf.id,"OW","asked for changes to the drafted email.");toast("Sent back for changes. Nothing was sent to the insurer.")}
  else{S.decided[id]={k:"no",msg:"Not sent. Logged in SmartSuite."};if(cf)logAct(cf.id,"OW","decided not to send this follow-up.");toast("Not sent. Logged.")}
  renderAll();refreshPanel(".decided");return}
 if(act==="approve"){
  if(a.type==="findings"){
   var chk=$$(".fchk").filter(function(c){return c.checked}).map(function(c){return a.findings[+c.dataset.i]});
   if(!chk.length){toast("Tick at least one finding to approve, or choose Request changes.");return}
   var sum=chk.reduce(function(s,f){return s+f.amt},0);
   S.decided[id]={k:"ok",msg:"Approved "+chk.length+" finding"+(chk.length>1?"s":"")+". A dispute letter was drafted and added to your approval queue."};
   var cS=caseByClient(a.client);if(cS)cS.amt=sum;
   var cA=caseByClient(a.client);if(cA){cA.stage="Dispute ready";cA.next="Approve dispute letter";logAct(cA.id,"OW","approved finding"+(chk.length>1?"s ":" ")+chk.map(function(f){return a.findings.indexOf(f)+1}).join(" and ")+" for a dispute.");logAct(cA.id,"AI","Drafted the dispute letter to "+a.carrier+" and added it to the owner's approval queue.")}
   S.extraAppr.push({id:id+"L",type:"letter",client:a.client,what:"Dispute letter ready to send",years:a.years,amount:sum,phase:"Day 31-60",carrier:a.carrier,
    letter:"To: Premium Audit Department, "+a.carrier+"\nRe: "+a.client+" · "+a.years+"\n\nWe represent "+a.client+" under the attached authorization. Our review shows the following possible errors:\n\n"+chk.map(function(f,i){return (i+1)+". "+f.t+" ("+f.yr+"). "+f.ev[0]+". "+f.rule+"."}).join("\n\n")+"\n\nPlease review and issue a corrected audit. Supporting pages are attached.\n\n[Owner's name]\nWorkers Comp Recovery LLC"});
   toast("Approved. Dispute letter drafted from "+chk.length+" finding"+(chk.length>1?"s":"")+" and added to your queue.");
  }else if(a.type==="letter"){
   S.decided[id]={k:"ok",msg:"Sent from your mailbox. Logged in SmartSuite. Outlook reminder set for Nov 17, follow-up email will be drafted."};
   S.openDisputes++;
   var cL=caseByClient(a.client);if(cL){cL.stage="Dispute open";cL.next="Automatic follow-up Nov 17";cL.due="2026-11-17";logAct(cL.id,"OW","approved and sent the dispute letter to "+a.carrier+".");logAct(cL.id,"AU","Logged the send and created an Outlook reminder for Nov 17.")}
   toast("Dispute sent. Outlook reminder set for Nov 17. Open disputes: "+S.openDisputes+".");
  }else if(a.type==="batch"){
   S.decided[id]={k:"ok",msg:"All "+a.items.length+" emails sent and tracked as Broker Requests. Automatic follow-ups set for day 5, 10 and 15."};
   ["WCR-1049","WCR-1050","WCR-1044","WCR-1052"].forEach(function(cid){logAct(cid,"OW","approved the outgoing request batch.");logAct(cid,"AU","Requested documents by email and created the Broker Request. Follow-up #1 set for 5 days.")});
   toast("Approved. "+a.items.length+" requests sent; follow-ups will go out automatically.");
  }else{
   S.decided[id]={k:"ok",msg:"Invoice INV-1043 sent. Payment is being tracked."};
   var cI=caseByClient(a.client);if(cI){cI.stage="Invoiced";cI.next="Payment tracked automatically";logAct(cI.id,"OW","approved invoice INV-1043.");logAct(cI.id,"AU","Invoice INV-1043 sent. Payment tracking on; reminder if unpaid after 30 days.")}
   toast("Invoice sent to "+a.client+". Payment tracked automatically.");
  }
 }else if(act==="info"){
  var cQ=caseByClient(a.client);if(cQ){logAct(cQ.id,"OW","asked for more information before deciding.");logAct(cQ.id,"AU","Task created for the secretary, back to the owner when answered.")}
  S.decided[id]={k:"info",msg:"Sent back to the secretary with a task. It will come back to you when answered."};
  S.extraExc.push({id:"x"+id,kind:"human",title:"Owner asked for more info",client:a.client+" · "+a.what,why:"The owner wants more information before deciding. Check the case notes in SmartSuite, add what's missing, and it goes back to his queue.",whyk:"manual",btns:[["Info added, send back","Sent back to the owner's queue."]]});
  toast("Sent to the secretary's exceptions list. Check the Secretary tab.");
 }else{
  var cR=caseByClient(a.client);if(cR){cR.stage="Closed – no dispute";cR.next="—";logAct(cR.id,"OW","rejected. Reason logged; nothing was sent.")}
  S.decided[id]={k:"no",msg:"Rejected. Your reason is logged in SmartSuite Activity History. Nothing was sent."};
  toast("Rejected and logged. Nothing goes out.");
 }
 renderAll();refreshPanel(".decided");
}

/* ---------------- secretary ---------------- */
function allExc(){return S.exceptions.concat(S.extraExc)}
function renderSecretary(){
 var ex=allExc(),open=ex.filter(function(e){return !S.doneExc[e.id]});
 var total=S.auto.length+ex.length,done=S.auto.length+(ex.length-open.length);
 $("#secLead").innerHTML='Tuesday, Nov 10. <b>'+total+' tasks today: '+S.auto.length+' done automatically</b>, '+open.length+' need you.';
 $("#secBar").style.width=Math.round(done/total*100)+"%";
 $("#secBarLabel").textContent=done+" of "+total+" done · "+Math.round(done/total*100)+"%";
 var smins=S.auto.reduce(function(s,a){return s+a[3]},0);
 $("#secKpis").innerHTML='<div class="kpi"><div class="k-num">'+total+'</div><div class="k-label">Tasks today</div><div class="k-sub">Tuesday, Nov 10</div></div><div class="kpi good"><div class="k-num">'+S.auto.length+'</div><div class="k-label">Done automatically</div><div class="k-sub">No clicks needed</div></div><div class="kpi '+(open.length?"bad":"good")+'"><div class="k-num">'+open.length+'</div><div class="k-label">Need you</div><div class="k-sub">Exceptions below</div></div><div class="kpi wide"><div class="k-num">'+hm(smins)+'</div><div class="k-label">Time saved today</div><div class="k-sub">Typing, filing, chasing</div></div>';
 $("#excCount").textContent=open.length;
 $("#excList").innerHTML=ex.map(function(e){
  var d=S.doneExc[e.id];
  return '<li class="item'+(d?" status-done":"")+'"><div class="item-title">'+(d?"✅ ":"")+esc(e.title)+'</div><div class="item-sub">'+esc(e.client)+'</div><div class="item-meta">'+(e.kind==="manual"?tag("manual"):tag("human","Needs a human check"))+(e.phase?phase(e.phase):"")+'</div>'+
  (d?'<div class="why">'+esc(d)+'</div>':'<div class="why '+(e.whyk==="ai"?"ai":"")+'">'+esc(e.why)+'</div><div class="btn-row">'+e.btns.map(function(b,i){return '<button type="button" class="btn small '+(i===0?"primary":"")+'" data-exc="'+e.id+'" data-b="'+i+'">'+esc(b[0])+'</button>'}).join("")+'</div>')+'</li>'}).join("");
 $("#autoCount").textContent=S.auto.length;
 var mins=S.auto.reduce(function(s,a){return s+a[3]},0);
 $("#autoList").innerHTML='<li class="item sum"><b>≈ '+hm(mins)+'</b> of typing, filing and chasing done for you today.</li>'+S.auto.map(function(a){return '<li class="item"><div class="time">'+a[0]+'</div><div class="check">✓</div><div class="body"><div>'+esc(a[1])+'</div><div class="item-meta">'+tag(a[2])+phase(a[4])+'<span class="saved">saved ~'+a[3]+' min</span></div></div></li>'}).join("");
}

/* ---------------- who does what ---------------- */
var STEPS=[
 {n:1,t:"Sales & client onboarding",who:"Salesperson + admin",today:30,auto:5,ph:"Day 1-30",
  td:["Salesperson calls prospects and follows up","Agreement and authorization emailed, signed, processed in \u201cSentry\u201d","Client typed into SmartSuite by hand","OneDrive client folder made by hand"],
  ad:[["manual","Selling and prospect follow-up stay with the salesperson. It's relationships.","Phone, email"],["ai","Reads company name, FEIN and address from the signed PDF","Document AI"],["auto","Signed agreement detected → SmartSuite client and case, OneDrive folders and task list created","SmartSuite, OneDrive, workflow engine"],["human","Secretary confirms the new record with one click","SmartSuite"]]},
 {n:2,t:"Rating Board & insurance history",who:"Secretary",today:75,auto:43,ph:"Day 1-30 / 31-60",
  td:["Emails the authorization to NYCIRB, watches for the reply","Searches the WCB website for about 7 years of coverage","Types carriers, policy numbers and periods into SmartSuite"],
  ad:[["auto","NYCIRB request with Letter of Authority sent and tracked; reply matched to the case","Gmail, SmartSuite · Day 1-30"],["human","Secretary approves each NYCIRB send in the first month","Gmail"],["ai","NYCIRB worksheet read: mod and losses saved to the case","Document AI · Day 31-60"],["manual","WCB 7-year search stays manual: no API, and the site's terms allow informational use only","wcb.ny.gov"],["ai","The saved WCB results PDF is read and carriers, policies and periods fill SmartSuite. No re-typing.","Document AI"]]},
 {n:3,t:"Collecting insurance documents",who:"Secretary",today:150,auto:55,ph:"Day 1-30",
  td:["Finds the broker's contact, sometimes by research","Emails requests for each policy period","Makes her own follow-up tasks in SmartSuite and chases from memory","Logs into AmTrust and downloads records"],
  ad:[["ai","Finds the broker's contact from old Gmail threads and policy declarations","Gmail"],["auto","One request per policy year and document; follow-ups go out on day 5, 10 and 15 by themselves","Gmail, SmartSuite"],["ai","Reads broker replies: what arrived, what's still missing","Gmail"],["human","Secretary approves first-contact emails and calls brokers who don't answer","Exceptions list"],["manual","AmTrust portal stays manual: their site terms ban bots. The system builds her checklist and also emails AmTrust's loss-run desk.","AmTrust portal"]]},
 {n:4,t:"Document organization",who:"Secretary",today:45,auto:5,ph:"Day 1-30",
  td:["Downloads every attachment","Renames each file","Files into OneDrive by client, year and type"],
  ad:[["ai","Recognises each file: audit, worksheet, loss run, rating data","Document AI"],["auto","Renames to your convention (\u201c2023 Audit Worksheet.pdf\u201d), files in OneDrive, links to the case","OneDrive, SmartSuite"],["auto","Flags duplicates, missing years and missing pages","Workflow engine"],["human","Secretary clears the few files it can't match","Exceptions list"]]},
 {n:5,t:"Secretary's insurance review",who:"Secretary",today:180,auto:130,ph:"Day 31-60 · optional AI audit module",
  td:["Reads audits, worksheets, rating data and loss runs","Looks for class code, payroll, premium, mod and claims errors","Writes findings in SmartSuite notes","Creates a task for the owner"],
  ad:[["ai","Pulls payroll, class codes, rates, premiums, mod and claims from every PDF, with page numbers","Document AI"],["auto","Rules check in code, not AI: overtime exclusion, payroll caps, premium math, mod","Rules engine"],["auto","Writes the SmartSuite note and creates the owner's review task","SmartSuite"],["human","Secretary verifies every number and every flag","Document review screen"]]},
 {n:6,t:"Owner's review",who:"Owner",today:120,auto:85,ph:"Day 31-60 · case pack + optional AI audit",
  td:["Re-reads documents and scattered notes","Does his own analysis","Decides whether to dispute","Writes conclusions in SmartSuite"],
  ad:[["ai","One-page case brief: history, documents, gaps, possible errors with evidence and math","Owner dashboard"],["human","Owner checks the evidence and approves or rejects each finding. His judgment stays.","Owner dashboard"]]},
 {n:7,t:"Opening disputes",who:"Owner",today:90,auto:55,ph:"Day 31-60",
  td:["Prepares the dispute from scratch","Sometimes makes a separate Gmail account for the client","Emails the insurer explaining the errors"],
  ad:[["ai","Drafts the dispute letter from the findings he approved","Gmail"],["human","Owner edits and sends every dispute himself","Gmail"],["auto","Send is logged on the case and the follow-up date is set","SmartSuite"]]},
 {n:8,t:"Dispute follow-ups",who:"Owner",today:60,auto:30,ph:"Day 1-30 / 31-60",
  td:["Makes an Outlook reminder for a week later","Checks if the insurer answered","Sends a follow-up, makes another reminder, repeats"],
  ad:[["auto","Outlook reminder created automatically 7 days out","Outlook · Day 1-30"],["ai","Weekly follow-up drafted; insurer's reply detected and summarised","Gmail · Day 31-60"],["human","Owner approves follow-up wording and decides any settlement","Owner dashboard"]]},
 {n:9,t:"Recovery & invoicing",who:"Owner",today:15,auto:10,ph:"Day 61-90",
  td:["Confirms the adjustment","Calculates the fee","Sends the invoice"],
  ad:[["auto","Fee calculated from the agreement's terms on the client record","SmartSuite"],["auto","Invoice drafted, payment tracked, overdue reminders","Accounting system (to confirm)"],["human","Owner approves every invoice","Owner dashboard"]]}
];
var whoMode="today";
function renderWho(){
 $$(".switch-row .seg-btn").forEach(function(b){b.classList.toggle("active",b.dataset.mode===whoMode)});
 $("#legend").innerHTML=whoMode==="today"?'<span class="tag t-manual">Everything is done by hand today</span>':tag("ai")+tag("auto")+tag("human")+tag("manual");
 var sT=0,sA=0,oT=0,oA=0;STEPS.forEach(function(s){if(s.who==="Owner"){oT+=s.today;oA+=s.auto}else{sT+=s.today;sA+=s.auto}});
 if(whoMode==="today")$("#whoTotal").innerHTML='<div class="wt-box"><div class="wt-num">'+hm(sT)+'</div><div class="wt-label">Secretary & admin, per case</div></div><div class="wt-box"><div class="wt-num">'+hm(oT)+'</div><div class="wt-label">Owner, per case</div></div>';
 else $("#whoTotal").innerHTML='<div class="wt-box"><div class="wt-num">'+hm(sA)+'</div><div class="wt-label">Secretary & admin, per case</div><div class="wt-delta">was '+hm(sT)+' · −'+Math.round((1-sA/sT)*100)+'%</div></div><div class="wt-box"><div class="wt-num">'+hm(oA)+'</div><div class="wt-label">Owner, per case</div><div class="wt-delta">was '+hm(oT)+' · −'+Math.round((1-oA/oT)*100)+'%</div></div>';
 $("#steps").innerHTML=STEPS.map(function(s){
  var body;
  if(whoMode==="today")body='<div class="who-line">Done by: <b>'+esc(s.who)+'</b>, by hand</div><div class="mins"><span class="m">'+s.today+' min</span><span class="item-sub">per case</span></div><ul class="sub">'+s.td.map(function(x){return '<li>'+tag("manual","Manual")+'<span>'+esc(x)+'</span></li>'}).join("")+'</ul>';
  else body='<div class="who-line">'+phase(s.ph)+'</div><div class="mins"><span class="m">'+s.auto+' min</span><span class="was">'+s.today+' min</span><span class="item-sub">human time per case</span></div><ul class="sub">'+s.ad.map(function(x){return '<li>'+tag(x[0])+'<span>'+esc(x[1])+'<span class="tool">'+esc(x[2])+'</span></span></li>'}).join("")+'</ul>';
  return '<li class="step mode-'+whoMode+'"><div class="step-num">'+s.n+'</div><h3>'+esc(s.t)+'</h3>'+body+'</li>'}).join("");
}

/* ---------------- calculator ---------------- */
var CASES=[25,100,250,500],ci=1,ph="B";
var SHARE={A:{s:.25,o:.15},B:{s:.5,o:.35}};
function renderCalc(){
 var c=CASES[ci],nw=c/6,secT=nw*8,ownT=nw*4.75,sh=SHARE[ph];
 var ss=secT*sh.s,os=ownT*sh.o;
 $("#caseVal").textContent=c;$("#caseSlider").value=ci;
 $$("#caseTicks button").forEach(function(b){b.classList.toggle("on",+b.dataset.i===ci)});
 $$(".phase-seg .seg-btn").forEach(function(b){b.classList.toggle("active",b.dataset.ph===ph)});
 var fte=ss/167;
 $("#results").innerHTML='<div class="res sec"><div class="r-label">Estimated secretary & admin time saved</div><div class="r-num"><small>up to</small> '+Math.round(ss)+' <small>hours / month</small></div><div class="r-sub">≈ up to '+(fte<0.1?"a few hours a week":fte.toFixed(1)+" of a full-time person")+'</div></div>'+
 '<div class="res own"><div class="r-label">Estimated owner time saved</div><div class="r-num"><small>up to</small> '+Math.round(os)+' <small>hours / month</small></div><div class="r-sub">≈ up to '+(os/8).toFixed(1)+' work days back a month</div></div>';
 var mx=Math.max(secT,ownT);
 function bar(l,b,a){return '<div class="bar-row"><div class="bl"><span>'+l+'</span><span>'+Math.round(b)+' h → '+Math.round(a)+' h / month</span></div><div class="bar"><span class="before" style="width:'+(b/mx*100)+'%"></span><span class="after" style="width:'+(a/mx*100)+'%"></span></div></div>'}
 $("#bars").innerHTML=bar("Secretary & admin",secT,secT-ss)+bar("Owner",ownT,ownT-os)+'<div class="item-sub">Grey = today · Purple = with automation (estimate) · about '+Math.round(nw)+' new cases a month</div>';
}

/* ---------------- flow ---------------- */
var FLOW=[
 {d:"Day 0",t:"Client signs the agreement",x:"Signature detected. SmartSuite client and case created, OneDrive folders made, company details read from the PDF.",k:["auto","ai"],tm:30,am:5},
 {d:"Day 0",t:"NYCIRB request goes out",x:"Request with the Letter of Authority sent to NYCIRB and tracked. Secretary approved it in one tap.",k:["auto","human"],tm:15,am:3},
 {d:"Day 1",t:"WCB coverage lookup",x:"Secretary runs the 7-year search by hand (site terms) and saves the PDF. AI fills carriers and policy periods into SmartSuite.",k:["manual","ai"],tm:60,am:40},
 {d:"Day 1",t:"Broker requests sent",x:"AI finds the broker from old emails. One request per policy year goes out automatically.",k:["ai","auto"],tm:60,am:15},
 {d:"Day 6",t:"Automatic follow-up #1",x:"No reply after 5 days, so the follow-up goes out by itself. Nobody had to remember.",k:["auto"],tm:60,am:15},
 {d:"Day 8",t:"NYCIRB worksheet arrives",x:"Reply matched to the case, worksheet filed, mod and losses saved.",k:["ai","auto"],tm:15,am:2},
 {d:"Day 9",t:"AmTrust download",x:"Secretary downloads from the portal by hand (AmTrust's terms ban bots). The file is renamed and filed for her.",k:["manual","auto"],tm:30,am:25},
 {d:"Day 12",t:"Broker documents arrive",x:"Audits, worksheets and loss runs recognised, renamed and filed. One missing year flagged and requested.",k:["ai","auto"],tm:30,am:3},
 {d:"Day 14",t:"AI review + rules check",x:"Numbers pulled from every PDF with page references; code checks overtime, caps, premium math and mod. Secretary verifies.",k:["ai","auto","human"],tm:180,am:130},
 {d:"Day 15",t:"Owner gets the case brief",x:"One page with possible errors, evidence and math. Owner approves 2 findings, rejects 1.",k:["ai","human"],tm:120,am:85},
 {d:"Day 16",t:"Dispute letter sent",x:"AI drafts the letter from approved findings. Owner edits and sends. Outlook reminder set for day 23.",k:["ai","human","auto"],tm:90,am:55},
 {d:"Day 23-40",t:"Follow-ups until the insurer answers",x:"Weekly follow-ups drafted, owner approves in a tap. Insurer's reply is detected and summarised.",k:["auto","ai","human"],tm:60,am:30},
 {d:"Day 45",t:"Credit confirmed, invoice out",x:"Fee calculated from the agreement, invoice drafted. Owner approves it. Payment tracked.",k:["auto","human"],tm:15,am:10}
];
var fi=-1,timer=null;
function renderFlow(){
 $("#flow").innerHTML=FLOW.map(function(s,i){return '<li class="fstep'+(i<=fi?" on":"")+(i===fi?" cur":"")+'" data-fi="'+i+'"><div class="fday">'+esc(s.d)+'</div><div class="ftitle">'+esc(s.t)+'</div><div class="fdesc">'+esc(s.x)+'</div><div class="item-meta">'+s.k.map(function(k){return tag(k)}).join("")+'<span class="saved">'+s.tm+' → '+s.am+' min</span></div></li>'}).join("");
 var tm=0,am=0,au=0;for(var i=0;i<=fi;i++){tm+=FLOW[i].tm;am+=FLOW[i].am;if(FLOW[i].k.indexOf("auto")>-1||FLOW[i].k.indexOf("ai")>-1)au++}
 $("#flowMeter").innerHTML='<div class="fm"><div class="fm-n">'+(fi<0?"–":FLOW[fi].d)+'</div><div class="fm-l">Case day</div></div><div class="fm"><div class="fm-n">'+au+' / '+FLOW.length+'</div><div class="fm-l">Steps with AI or automation</div></div><div class="fm"><div class="fm-n">'+hm(am)+'</div><div class="fm-l">Human time (was '+hm(tm)+')</div></div>';
 $("#playBtn").textContent=timer?"❚❚ Pause":(fi>=FLOW.length-1?"↺ Replay":"▶ Play");
 $("#prevBtn").disabled=fi<0;$("#nextBtn").disabled=fi>=FLOW.length-1;
}
function scrollCur(){var c=$(".fstep.cur");if(c&&c.scrollIntoView){var r=c.getBoundingClientRect();if(r.top<90||r.bottom>window.innerHeight-20)c.scrollIntoView({behavior:"smooth",block:"center"})}}
function stopFlow(){if(timer){clearInterval(timer);timer=null}}
function stepFlow(dir){fi=Math.max(-1,Math.min(FLOW.length-1,fi+dir));renderFlow();scrollCur()}
function play(){
 if(timer){stopFlow();renderFlow();return}
 if(fi>=FLOW.length-1)fi=-1;
 timer=setInterval(function(){if(fi>=FLOW.length-1){stopFlow();renderFlow();toast("Case done: signed to invoiced. Human time "+hm(418)+" instead of "+hm(765)+".");return}stepFlow(1)},1600);
 stepFlow(1);
}


/* ---------------- wiring ---------------- */
function renderAll(){renderDay();renderAutos();renderOwner();renderOwnerCharts();renderSecretary();renderWho();renderCalc();renderFlow();if(curTable)renderTable(curTable)}
document.addEventListener("click",function(e){
 var el;
 if(!e.target.closest(".tool-wrap"))closePops();
 if((el=e.target.closest("[data-about]"))){setSidebar(false);return openInfo(aboutPanel)}
 if((el=e.target.closest(".nav")))return show(el.dataset.view);
 if(e.target.closest("#menuBtn"))return setSidebar(!document.body.classList.contains("sb-open"));
 if(e.target.closest("#sbClose")||e.target.id==="sbBackdrop")return setSidebar(false);
 if((el=e.target.closest(".vtab")))return setVT(el.dataset.vt);
 if((el=e.target.closest("[data-goto]"))){var g=el.dataset.goto.split("|");if(g[1])vs(g[0].slice(2)).vt=g[1];return show(g[0])}
 if((el=e.target.closest("[data-mode-i]"))){var mi=+el.dataset.modeI;if(LOCK[mi]&&el.dataset.modeV!==modeOf(mi))return toast("Locked. "+LOCK[mi]);S.mode[mi]=el.dataset.modeV;renderAutos();return toast("“"+AUTOS[mi][1]+"” now: "+MODEN.filter(function(m){return m[0]===el.dataset.modeV})[0][1]+".")}
 if(e.target.closest("#filterBtn"))return openPop("filter");
 if(e.target.closest("#sortBtn"))return openPop("sort");
 if(e.target.closest("#groupBtn"))return openPop("group");
 if((el=e.target.closest("[data-popclose]")))return closePops();
 if((el=e.target.closest("[data-sort]"))){vs(curTable).sort=el.dataset.sort||null;closePops();renderTable(curTable);return toast(el.dataset.sort?"Sorted by "+el.textContent:"Default order")}
 if((el=e.target.closest("[data-group]"))){vs(curTable).group=el.dataset.group||null;closePops();renderTable(curTable);return toast(el.dataset.group?"Grouped by "+el.textContent:"Grouping off")}
 if(e.target.closest("[data-showall]")){vs(curTable).all=true;renderTable(curTable);return}
 if((el=e.target.closest("[data-clear]"))){var s=vs(curTable);if(el.dataset.clear==="client")s.client=null;else if(el.dataset.clear==="overdue")s.overdue=false;else s.filter=[];closePops();renderTable(curTable);return}
 if(e.target.closest("#newBtn")){return toast(curTable==="clients"||curTable==="cases"?"No typing needed: new clients and cases are created automatically when an agreement is signed.":"Demo: records here are created automatically by the workflows.")}
 if(e.target.closest("#cmtBtn")){var inp=$("#cmtIn");var v=(inp.value||"").trim();if(!v){inp.focus();return}logAct(inp.dataset.key,"OW","commented: “"+v+"”");refreshPanel("#actList");return}
 if(e.target.closest("#aboutOk"))return closeSheet();
 if((el=e.target.closest("[data-about]"))){setSidebar(false);return openInfo(aboutPanel)}
 if((el=e.target.closest("[data-money]")))return openInfo(moneyPanel(el.dataset.money));
 if((el=e.target.closest("[data-log]")))return openInfo(logPanel(el.dataset.log));
 if((el=e.target.closest("[data-missing]"))){var sm=vs("documents");sm.filter=el.dataset.missing?[el.dataset.missing]:MISSING_ST.slice();sm.client=null;sm.vt="grid";sm.all=false;closeSheet();show("t-documents");return}
 if((el=e.target.closest("[data-overdue]"))){var so=vs("cases");so.overdue=true;so.filter=[];so.vt="grid";show("t-cases");return}
 if((el=e.target.closest("[data-stage]"))){var sg=vs("cases");sg.filter=[el.dataset.stage];sg.overdue=false;sg.vt="grid";show("t-cases");return}
 if((el=e.target.closest("[data-kpi]"))){var kk=el.dataset.kpi;if(kk==="missing"){var sk=vs("documents");sk.filter=MISSING_ST.slice();sk.client=null;sk.vt="grid";return show("t-documents")}if(kk==="disputes"){var sd=vs("cases");sd.filter=["Dispute open"];sd.overdue=false;sd.vt="grid";return show("t-cases")}var tg2=$(kk);if(tg2)tg2.scrollIntoView({behavior:"smooth",block:"start"});return}
 if((el=e.target.closest("[data-preconfirm]"))){S.confirm[el.dataset.preconfirm]=true;refreshPanel("#confirmBox");return}
 if((el=e.target.closest("[data-unconfirm]"))){delete S.confirm[el.dataset.unconfirm];refreshPanel();return}
 if((el=e.target.closest("[data-jump]"))){var tg=$(el.dataset.jump,$("#sheetBody"));$$(".rp-tabs button").forEach(function(x){x.classList.toggle("on",x===el)});if(tg){$("#sheetBody").scrollTop=Math.max(0,tg.offsetTop-70);if(el.dataset.jump==="#cmtIn")tg.focus()}return}
 if((el=e.target.closest("[data-rec]"))){var p=el.dataset.rec.split("|");return openRec(p[0],p[1],false,!!el.dataset.force)}
 if((el=e.target.closest("[data-open]"))){if(el.dataset.pre){S.confirm[el.dataset.open]=true;openSheet(el.dataset.open);setTimeout(function(){var cb=$("#confirmBox");if(cb)$("#sheetBody").scrollTop=Math.max(0,cb.offsetTop-120)},80);return}return openSheet(el.dataset.open)}
 if((el=e.target.closest("[data-act]")))return decide(el.dataset.id,el.dataset.act);
 if((el=e.target.closest("[data-follow]"))){var f=S.follow.filter(function(x){return x.id===el.dataset.follow})[0];
   S.followDone[f.id]=f.state==="reply"?"Records sent · reminder set":"Follow-up sent · next reminder in 7 days";
   var cf=S.cases.filter(function(c){return c.follow===f.id})[0];if(cf){logAct(cf.id,"OW",f.state==="reply"?"approved sending the 2023 payroll records.":"approved the follow-up email.");logAct(cf.id,"AU",(f.state==="reply"?"Payroll records sent to ":"Follow-up sent to ")+f.carrier+". Next Outlook reminder in 7 days.");cf.next="Automatic follow-up in 7 days";cf.due="2026-11-17"}
   renderAll();refreshPanel();
   toast(f.state==="reply"?"Payroll records sent to "+f.carrier+". Logged in SmartSuite.":"Follow-up sent to "+f.carrier+". Next Outlook reminder set for 7 days.");return}
 if((el=e.target.closest("[data-exc]"))){var ex=allExc().filter(function(x){return x.id===el.dataset.exc})[0];var b=ex.btns[+el.dataset.b];S.doneExc[ex.id]=b[1];renderAll();refreshPanel();toast(b[1]);return}
 if((el=e.target.closest(".switch-row .seg-btn"))){whoMode=el.dataset.mode;renderWho();return}
 if((el=e.target.closest(".phase-seg .seg-btn"))){ph=el.dataset.ph;renderCalc();return}
 if((el=e.target.closest("#caseTicks button"))){ci=+el.dataset.i;renderCalc();return}
 if(e.target.closest("#playBtn"))return play();
 if(e.target.closest("#nextBtn")){stopFlow();return stepFlow(1)}
 if(e.target.closest("#prevBtn")){stopFlow();return stepFlow(-1)}
 if(e.target.closest("#sheetClose")||e.target.id==="backdrop")return closeSheet();
 if(e.target.closest("#resetBtn")){stopFlow();fi=-1;whoMode="today";ci=1;ph="B";closeSheet();reset();show("owner");toast("Demo reset.");return}
});
document.addEventListener("keydown",function(e){
 if(e.key==="Escape"){if($("#sheet").classList.contains("open"))closeSheet();else if(document.body.classList.contains("sb-open"))setSidebar(false);closePops()}
 if(e.key==="Enter"&&e.target.id==="cmtIn"){e.preventDefault();$("#cmtBtn").click();return}
 if((e.key==="Enter"||e.key===" ")&&e.target.matches&&e.target.matches("[data-open],[data-rec]")){e.preventDefault();e.target.click()}
});
document.addEventListener("change",function(e){
 if(e.target.matches("[data-fv]")){var s=vs(curTable),v=e.target.dataset.fv,i=s.filter.indexOf(v);if(e.target.checked&&i<0)s.filter.push(v);if(!e.target.checked&&i>-1)s.filter.splice(i,1);renderTable(curTable)}
});
$("#caseSlider").addEventListener("input",function(e){ci=+e.target.value;renderCalc()});
reset();
show((location.hash||"#owner").slice(1));
})();
