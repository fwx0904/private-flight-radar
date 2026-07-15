const FALLBACK_ROUTES = [
  {id:"sha-cts",from:"SHA",fromCity:"上海",to:"CTS",toCity:"札幌",price:2340,threshold:3000,dates:"09.12 — 09.26",stay:"14天",status:"hit",statusLabel:"低价命中",outbound:1402,inbound:938,link:"https://a.feizhu.com/0XOqCD",bars:[74,62,79,55,68,48,43,51,37,42,33,38],similarPercent:10,alternatives:[{departDate:"09.13",returnDate:"09.26",stayDays:13,total:2450,outbound:1450,inbound:1000,link:"https://a.feizhu.com/0XOqCD"}]},
  {id:"hgh-aat",from:"HGH",fromCity:"杭州",to:"AAT",toCity:"阿勒泰",price:1100,threshold:1600,dates:"等待合适往返组合",stay:"直飞单程",status:"watch",statusLabel:"持续扫描",outbound:1100,inbound:null,link:"https://a.feizhu.com/4OebbN",bars:[82,75,72,68,65,61,57,61,54,52,49,47],similarPercent:10,alternatives:[]},
  {id:"hgh-kmg",from:"HGH",fromCity:"杭州",to:"KMG",toCity:"昆明",price:1055,threshold:1600,dates:"09.04 — 09.07",stay:"3天",status:"hit",statusLabel:"究极低价",outbound:445,inbound:610,link:"https://a.feizhu.com/1SDlpz",bars:[70,61,66,52,48,54,39,45,34,29,31,23],similarPercent:10,alternatives:[{departDate:"09.04",returnDate:"09.09",stayDays:5,total:1055,outbound:445,inbound:610,link:"https://a.feizhu.com/1SDlpz"},{departDate:"09.05",returnDate:"09.09",stayDays:4,total:1055,outbound:445,inbound:610,link:"https://a.feizhu.com/1SDlpz"},{departDate:"09.05",returnDate:"09.10",stayDays:5,total:1095,outbound:465,inbound:630,link:"https://a.feizhu.com/1SDlpz"}]}
];

const calendar=[4,3,3,2,4,2,1,3,2,1,2,3,3,2,1,1,2,4,3,2,1,2,3,4,2,1,1,3,2,4,3,2,1,2,1,3,4,3,2,1,2,2];
const REPO = "fwx0904/private-flight-radar";
const byId=id=>document.getElementById(id);
const money=n=>Number.isFinite(Number(n))?new Intl.NumberFormat("zh-CN").format(Number(n)):"—";
let routes=[...FALLBACK_ROUTES];
let activeId="hgh-kmg";

function escapeHtml(value=""){
  return String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
}

function normalizeRoute(config,result={}){
  const lowest=result.lowest||{};
  const pending=!lowest.total;
  const threshold=Number(config.targetPrice||800)*2;
  const history=(result.history||[]).slice(-12).map(item=>Number(item.total)).filter(Boolean);
  let bars=[58,53,61,49,56,45,51,42,47,38,43,35];
  if(history.length){
    const max=Math.max(...history),min=Math.min(...history);
    bars=history.map(value=>30+Math.round((max===min?0.5:(max-value)/(max-min))*60));
  }
  return {
    id:config.id,from:config.originCode,fromCity:config.originCity,to:config.destinationCode,toCity:config.destinationCity,
    price:pending?null:Number(lowest.total),threshold,dates:pending?"等待首次扫描":`${shortDate(lowest.departDate)} — ${shortDate(lowest.returnDate)}`,
    stay:pending?`${config.stayMin}–${config.stayMax}天`: `${lowest.stayDays}天`,status:pending?"watch":(lowest.outbound<=config.targetPrice&&lowest.inbound<=config.targetPrice?"hit":"watch"),
    statusLabel:pending?"等待扫描":(lowest.outbound<=config.targetPrice&&lowest.inbound<=config.targetPrice?"价格命中":"持续扫描"),
    outbound:lowest.outbound??null,inbound:lowest.inbound??null,link:lowest.link||"https://www.fliggy.com/",bars,
    similarPercent:Number(config.similarPercent||10),alternatives:result.alternatives||[],lastChecked:result.lastChecked,error:result.error
  };
}

function shortDate(date){
  if(!date)return "—";
  const parts=String(date).split("-");
  return parts.length===3?`${parts[1]}.${parts[2]}`:date;
}

async function loadData(showMessage=false){
  try{
    const stamp=Date.now();
    const [routesResponse,resultsResponse]=await Promise.all([fetch(`./data/routes.json?t=${stamp}`),fetch(`./data/results.json?t=${stamp}`)]);
    if(!routesResponse.ok||!resultsResponse.ok)throw new Error("数据暂未生成");
    const configs=await routesResponse.json();
    const resultPayload=await resultsResponse.json();
    const resultMap=new Map((resultPayload.routes||[]).map(item=>[item.id,item]));
    routes=configs.map(config=>normalizeRoute(config,resultMap.get(config.id)));
    if(!routes.some(route=>route.id===activeId))activeId=routes[0]?.id;
    if(resultPayload.generatedAt)byId("updated").textContent=new Date(resultPayload.generatedAt).toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});
    renderAll();
    if(showMessage)toast("已读取最新价格快照");
  }catch(error){
    routes=[...FALLBACK_ROUTES];
    renderAll();
    if(showMessage)toast("自动数据尚未生成，当前显示上次价格快照");
  }
}

function renderCards(){
  byId("route-cards").innerHTML=routes.map(r=>{
    const pending=!r.price;
    const saved=pending?0:Math.max(0,Math.round((1-r.price/r.threshold)*100));
    return `<button class="route-card ${r.id===activeId?"active":""}" data-card="${escapeHtml(r.id)}" type="button"><div class="route-card-top"><span class="status-pill ${r.status}">${r.statusLabel}</span><span class="more">•••</span></div><div class="airport-line"><div><strong>${escapeHtml(r.from)}</strong><small>${escapeHtml(r.fromCity)}</small></div><div class="flight-line"><span>✈</span></div><div><strong>${escapeHtml(r.to)}</strong><small>${escapeHtml(r.toCity)}</small></div></div><div class="card-price"><span>${pending?"自动任务已创建":"往返最低"}</span><strong><small>${pending?"":"¥"}</small>${pending?"待扫描":money(r.price)}</strong></div><div class="card-meta"><span>${escapeHtml(r.dates)}</span><span>${escapeHtml(r.stay)}</span></div><div class="mini-chart">${r.bars.map(h=>`<i style="height:${h}%"></i>`).join("")}</div><div class="target-row"><span>目标每程 ¥${money(r.threshold/2)}</span>${pending?`<b class="waiting">每小时刷新</b>`:saved>0?`<b>已低 ${saved}%</b>`:`<b class="waiting">高 ¥${money(r.price-r.threshold)}</b>`}</div></button>`;
  }).join("");
  document.querySelectorAll("[data-card]").forEach(el=>el.addEventListener("click",()=>selectRoute(el.dataset.card)));
  byId("monitor-count").textContent=routes.length;
  byId("hit-count").textContent=routes.filter(route=>route.status==="hit").length;
  byId("footer-count").textContent=String(routes.length).padStart(2,"0");
}

function renderAlternatives(r){
  byId("similar-rule").textContent=`最低价 +${r.similarPercent||10}% 内`;
  const items=(r.alternatives||[]).slice(0,5);
  byId("similar-list").innerHTML=items.length?items.map(item=>{
    const delta=r.price?Math.round((item.total/r.price-1)*100):0;
    return `<a class="similar-fare" href="${escapeHtml(item.link||r.link)}" target="_blank" rel="noreferrer"><div><span>${shortDate(item.departDate)} — ${shortDate(item.returnDate)}</span><small>${item.stayDays}天 · 去¥${money(item.outbound)} / 回¥${money(item.inbound)}${delta?` · +${delta}%`:" · 同最低价"}</small></div><strong>¥${money(item.total)}</strong></a>`;
  }).join(""):`<div class="similar-empty">暂未发现同价格带的其他日期，雷达会继续扫描</div>`;
}

function selectRoute(id){
  activeId=id; const r=routes.find(x=>x.id===id); if(!r)return;
  const pending=!r.price;
  const discount=pending?0:Math.max(0,Math.round((r.threshold-r.price)/r.threshold*100));
  renderCards();
  byId("deal-from").textContent=r.from; byId("deal-from-city").textContent=r.fromCity; byId("deal-to").textContent=r.to; byId("deal-to-city").textContent=r.toCity;
  byId("deal-price-label").textContent=pending?"等待首次自动扫描":"两程合计"; byId("deal-price").textContent=pending?"待扫描":money(r.price); byId("deal-discount").textContent=discount?`↓ ${discount}%`:"";
  byId("deal-out").textContent=r.outbound?`¥${money(r.outbound)}`:"待扫描"; byId("deal-in").textContent=r.inbound?`¥${money(r.inbound)}`:"待扫描"; byId("deal-dates").textContent=r.dates; byId("deal-stay").textContent=`${r.stay} · 直飞`;
  byId("deal-link").href=r.link; byId("deal-link-label").textContent=pending?"打开飞猪":"查看飞猪价格"; byId("deal-link").classList.toggle("muted",r.status!=="hit");
  byId("deal-signal").textContent=pending?"等待扫描":r.status==="hit"?"价格达标":"等待降价"; byId("deal-signal").classList.toggle("good",r.status==="hit");
  byId("trend-title").textContent=`${r.from} → ${r.to} 价格趋势`; byId("trend-target").textContent=`¥${money(r.threshold)}`;
  [...byId("trend-bars").querySelectorAll(".bar-column")].forEach(n=>n.remove());
  r.bars.forEach((h,i)=>{const col=document.createElement("div");col.className="bar-column";col.innerHTML=`<i class="${i===r.bars.length-1?"latest":""}" style="height:${h}%"></i>`;byId("trend-bars").appendChild(col)});
  renderAlternatives(r);
}

function renderAll(){renderCards();selectRoute(activeId)}
function toast(message){const node=byId("toast");node.textContent=message;node.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove("show"),3200)}
function setModal(open){byId("route-modal").classList.toggle("open",open);byId("route-modal").setAttribute("aria-hidden",String(!open));document.body.style.overflow=open?"hidden":"";if(open)setTimeout(()=>byId("origin").focus(),180)}
function parseCity(value){const raw=value.trim();const match=raw.match(/^(.*?)(?:\s+|\/)([A-Za-z]{3})$/);return match?{city:match[1].trim(),code:match[2].toUpperCase()}:{city:raw,code:raw.slice(0,3).toUpperCase()}}

function issueBody(config){
  const dateText=config.dateMode==="relative"?`未来 ${config.horizonDays} 天`:`${config.dateStart} 至 ${config.dateEnd}`;
  return `<!-- FLIGHT_MONITOR_CONFIG\n${JSON.stringify(config)}\n-->\n## 新增航线监控\n\n- 航线：${config.originCity}（${config.originCode}）→ ${config.destinationCity}（${config.destinationCode}）\n- 出发范围：${dateText}\n- 停留：${config.stayMin}–${config.stayMax} 天\n- 目标：直飞往返，每程不高于 ¥${config.targetPrice}\n- 相近低价：最低价 +${config.similarPercent}% 以内\n\n> 请直接提交本 Issue。自动化会保存配置、关闭 Issue，并从下一次扫描开始显示结果。`;
}

document.querySelectorAll("[data-route]").forEach(el=>el.addEventListener("click",()=>selectRoute(el.dataset.route)));
calendar.forEach(level=>{const dot=document.createElement("i");dot.className=`level-${level}`;byId("calendar").appendChild(dot)});
byId("refresh").addEventListener("click",async()=>{byId("refresh-icon").classList.add("spin");byId("refresh-label").textContent="正在读取";await loadData(true);byId("refresh-icon").classList.remove("spin");byId("refresh-label").textContent="刷新状态"});
byId("add-route").addEventListener("click",()=>setModal(true));
byId("close-route").addEventListener("click",()=>setModal(false));
byId("modal-backdrop").addEventListener("click",()=>setModal(false));
document.addEventListener("keydown",event=>{if(event.key==="Escape")setModal(false)});
byId("swap-city").addEventListener("click",()=>{const origin=byId("origin").value;byId("origin").value=byId("destination").value;byId("destination").value=origin});
document.querySelectorAll('input[name="dateMode"]').forEach(input=>input.addEventListener("change",()=>{const fixed=input.form.dateMode.value==="fixed";byId("relative-fields").classList.toggle("hidden",fixed);byId("fixed-fields").classList.toggle("hidden",!fixed)}));
byId("route-form").addEventListener("submit",event=>{
  event.preventDefault();
  const origin=parseCity(byId("origin").value),destination=parseCity(byId("destination").value);
  const dateMode=event.currentTarget.dateMode.value,stayMin=Number(byId("stay-min").value),stayMax=Number(byId("stay-max").value);
  if(origin.code===destination.code)return toast("出发地和目的地不能相同");
  if(stayMin>stayMax)return toast("最短停留不能大于最长停留");
  if(dateMode==="fixed"&&(!byId("date-start").value||!byId("date-end").value||byId("date-start").value>byId("date-end").value))return toast("请填写正确的出发日期范围");
  const config={id:`${origin.code}-${destination.code}-${Date.now().toString(36)}`.toLowerCase(),originCity:origin.city,originCode:origin.code,destinationCity:destination.city,destinationCode:destination.code,dateMode,horizonDays:dateMode==="relative"?Number(byId("horizon").value):null,dateStart:dateMode==="fixed"?byId("date-start").value:null,dateEnd:dateMode==="fixed"?byId("date-end").value:null,stayMin,stayMax,targetPrice:Number(byId("target-price").value),similarPercent:Number(byId("similar-percent").value),directOnly:byId("direct-only").checked,notify:byId("notify").checked,enabled:true,createdAt:new Date().toISOString()};
  const title=`[Flight Monitor] ${origin.code} → ${destination.code}`;
  const url=`https://github.com/${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(issueBody(config))}`;
  setModal(false);toast("配置已生成，请在 GitHub 页面确认提交");window.open(url,"_blank","noopener");
});

renderAll();
loadData();
