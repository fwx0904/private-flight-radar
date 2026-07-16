import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const routesPath=resolve(root,"data/routes.json");
const resultsPath=resolve(root,"data/results.json");
const configs=JSON.parse(readFileSync(routesPath,"utf8"));
let previous={routes:[]};
try{previous=JSON.parse(readFileSync(resultsPath,"utf8"))}catch{}
const previousMap=new Map((previous.routes||[]).map(item=>[item.id,item]));

const pad=n=>String(n).padStart(2,"0");
const dateString=date=>`${date.getUTCFullYear()}-${pad(date.getUTCMonth()+1)}-${pad(date.getUTCDate())}`;
const addDays=(date,days)=>{const copy=new Date(`${date}T00:00:00Z`);copy.setUTCDate(copy.getUTCDate()+days);return dateString(copy)};
const daysBetween=(a,b)=>Math.round((new Date(`${b}T00:00:00Z`)-new Date(`${a}T00:00:00Z`))/86400000);
const numeric=value=>Number(String(value??"").replace(/[^0-9.]/g,""));

function query(origin,destination,start,end){
  const output=execFileSync("flyai",["search-flight","--origin",origin,"--destination",destination,"--dep-date-start",start,"--dep-date-end",end,"--journey-type","1","--sort-type","3"],{encoding:"utf8",maxBuffer:20*1024*1024,timeout:180000});
  return JSON.parse(output.trim());
}

function extract(payload){
  const list=payload?.data?.itemList||payload?.itemList||[];
  return list.flatMap(item=>{
    const journey=(item.journeys||[])[0];
    const segments=journey?.segments||[];
    const segment=segments[0];
    const direct=/直/.test(journey?.journeyType||"")||segments.length===1;
    const fare=numeric(item.adultPrice??item.ticketPrice??item.price);
    const date=segment?.depDateTime?.slice(0,10);
    if(!direct||!fare||!date)return [];
    return [{date,price:fare,link:item.jumpUrl||"https://www.fliggy.com/",flightNo:segment?.marketingTransportNo||"",airline:segment?.marketingTransportName||""}];
  }).sort((a,b)=>a.price-b.price);
}

function uniqueByDate(items){
  const best=new Map();
  for(const item of items){if(!best.has(item.date)||item.price<best.get(item.date).price)best.set(item.date,item)}
  return [...best.values()];
}

function scan(config){
  const today=dateString(new Date());
  const depStart=config.dateMode==="fixed"?config.dateStart:addDays(today,1);
  const depEnd=config.dateMode==="fixed"?config.dateEnd:addDays(today,Number(config.horizonDays||90));
  const origin=config.originAirport?config.originCode:(config.originCity||config.originCode);
  const destination=config.destinationAirport?config.destinationCode:(config.destinationCity||config.destinationCode);
  const outbound=uniqueByDate(extract(query(origin,destination,depStart,depEnd))).slice(0,6);
  const pairs=[];
  let returnErrors=0;
  for(const out of outbound){
    const returnStart=addDays(out.date,Number(config.stayMin||1));
    const returnEnd=addDays(out.date,Number(config.stayMax||14));
    let inbound=[];
    try{inbound=uniqueByDate(extract(query(destination,origin,returnStart,returnEnd)))}catch(error){
      returnErrors++;
      console.error(`${config.id} return ${returnStart}..${returnEnd}: ${error.message||error}`);
      continue;
    }
    for(const back of inbound){
      const stayDays=daysBetween(out.date,back.date);
      if(stayDays<config.stayMin||stayDays>config.stayMax)continue;
      pairs.push({departDate:out.date,returnDate:back.date,stayDays,outbound:out.price,inbound:back.price,total:out.price+back.price,link:out.link||back.link,outboundFlight:out.flightNo,inboundFlight:back.flightNo});
    }
  }
  pairs.sort((a,b)=>a.total-b.total||a.departDate.localeCompare(b.departDate));
  const lowest=pairs[0]||null;
  if(!lowest&&returnErrors>0&&previousMap.get(config.id)?.lowest)throw new Error(`部分回程查询受限（${returnErrors} 次），已保留上次有效结果`);
  const ceiling=lowest?lowest.total*(1+Number(config.similarPercent||10)/100):0;
  const alternatives=pairs.filter((pair,index)=>index>0&&pair.total<=ceiling).slice(0,5);
  const old=previousMap.get(config.id)||{};
  const history=[...(old.history||[]),...(lowest?[{checkedAt:new Date().toISOString(),total:lowest.total}]:[])].slice(-24);
  const alertDropPercent=Number(config.alertDropPercent||20);
  const farBelow=Boolean(lowest&&lowest.outbound<=config.targetPrice&&lowest.inbound<=config.targetPrice&&lowest.total<=config.targetPrice*2*(1-alertDropPercent/100));
  const isNewRecord=farBelow&&(!old.lastAlertedTotal||lowest.total<old.lastAlertedTotal);
  const alert=isNewRecord&&config.notify!==false?{createdAt:new Date().toISOString(),total:lowest.total,departDate:lowest.departDate,returnDate:lowest.returnDate,link:lowest.link}:null;
  const needsEmail=farBelow&&config.notify!==false&&(!old.lastEmailedTotal||lowest.total<old.lastEmailedTotal);
  const emailAlert=needsEmail?{createdAt:new Date().toISOString(),total:lowest.total,departDate:lowest.departDate,returnDate:lowest.returnDate,link:lowest.link,discountPercent:Math.round((1-lowest.total/(config.targetPrice*2))*100)}:null;
  return {id:config.id,lastChecked:new Date().toISOString(),lowest,alternatives,history,lastAlertedTotal:isNewRecord?lowest.total:(old.lastAlertedTotal||null),lastEmailedTotal:old.lastEmailedTotal||null,alert,emailAlert,error:lowest?null:"尚未发现符合停留条件的直飞往返组合"};
}

const results=[];
for(const config of configs){
  if(config.enabled===false){
    const old=previousMap.get(config.id)||{id:config.id,lowest:null,alternatives:[],history:[]};
    results.push({...old,id:config.id,paused:true,alert:null,emailAlert:null,error:null});
    continue;
  }
  try{
    console.log(`Scanning ${config.originCode} -> ${config.destinationCode}`);
    results.push(scan(config));
  }catch(error){
    const old=previousMap.get(config.id)||{id:config.id,lowest:null,alternatives:[],history:[]};
    results.push({...old,lastChecked:new Date().toISOString(),alert:null,emailAlert:null,error:`本次扫描失败：${String(error.message||error).slice(0,240)}`});
    console.error(`${config.id}: ${error.message||error}`);
  }
}

writeFileSync(resultsPath,`${JSON.stringify({generatedAt:new Date().toISOString(),routes:results},null,2)}\n`);
console.log(`Updated ${results.length} routes`);
