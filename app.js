const routes = [
  {id:"sha-cts",from:"SHA",fromCity:"上海",to:"CTS",toCity:"札幌",price:2340,threshold:3000,dates:"09.12 — 09.26",stay:"14天",status:"hit",statusLabel:"低价命中",outbound:1402,inbound:938,link:"https://a.feizhu.com/0XOqCD",bars:[74,62,79,55,68,48,43,51,37,42,33,38]},
  {id:"hgh-aat",from:"HGH",fromCity:"杭州",to:"AAT",toCity:"阿勒泰",price:1100,threshold:800,dates:"等待回落至目标价",stay:"直飞单程",status:"watch",statusLabel:"持续扫描",outbound:1100,inbound:null,link:"https://a.feizhu.com/4OebbN",bars:[82,75,72,68,65,61,57,61,54,52,49,47]},
  {id:"hgh-kmg",from:"HGH",fromCity:"杭州",to:"KMG",toCity:"昆明",price:1055,threshold:1600,dates:"09.04 — 09.07",stay:"3天",status:"hit",statusLabel:"究极低价",outbound:445,inbound:610,link:"https://a.feizhu.com/1SDlpz",bars:[70,61,66,52,48,54,39,45,34,29,31,23]}
];
const calendar=[4,3,3,2,4,2,1,3,2,1,2,3,3,2,1,1,2,4,3,2,1,2,3,4,2,1,1,3,2,4,3,2,1,2,1,3,4,3,2,1,2,2];
let activeId="hgh-kmg";
const price=n=>new Intl.NumberFormat("zh-CN").format(n);
const byId=id=>document.getElementById(id);

function renderCards(){
  byId("route-cards").innerHTML=routes.map(r=>{
    const saved=Math.max(0,Math.round((1-r.price/r.threshold)*100));
    return `<button class="route-card ${r.id===activeId?"active":""}" data-card="${r.id}" type="button"><div class="route-card-top"><span class="status-pill ${r.status}">${r.statusLabel}</span><span class="more">•••</span></div><div class="airport-line"><div><strong>${r.from}</strong><small>${r.fromCity}</small></div><div class="flight-line"><span>✈</span></div><div><strong>${r.to}</strong><small>${r.toCity}</small></div></div><div class="card-price"><span>${r.inbound?"往返最低":"当前直飞"}</span><strong><small>¥</small>${price(r.price)}</strong></div><div class="card-meta"><span>${r.dates}</span><span>${r.stay}</span></div><div class="mini-chart">${r.bars.map(h=>`<i style="height:${h}%"></i>`).join("")}</div><div class="target-row"><span>目标 ${r.inbound?"往返":"单程"} ¥${price(r.threshold)}</span>${saved>0?`<b>已低 ${saved}%</b>`:`<b class="waiting">差 ¥${price(r.price-r.threshold)}</b>`}</div></button>`;
  }).join("");
  document.querySelectorAll("[data-card]").forEach(el=>el.addEventListener("click",()=>selectRoute(el.dataset.card)));
}

function selectRoute(id){
  activeId=id; const r=routes.find(x=>x.id===id); const discount=Math.max(0,Math.round((r.threshold-r.price)/r.threshold*100));
  renderCards();
  byId("deal-from").textContent=r.from; byId("deal-from-city").textContent=r.fromCity; byId("deal-to").textContent=r.to; byId("deal-to-city").textContent=r.toCity;
  byId("deal-price-label").textContent=r.inbound?"两程合计":"单程当前"; byId("deal-price").textContent=price(r.price); byId("deal-discount").textContent=discount?`↓ ${discount}%`:"";
  byId("deal-out").textContent=`¥${price(r.outbound)}`; byId("deal-in").textContent=r.inbound?`¥${price(r.inbound)}`:"待命中"; byId("deal-dates").textContent=r.dates; byId("deal-stay").textContent=`${r.stay} · 直飞`;
  byId("deal-link").href=r.link; byId("deal-link-label").textContent=r.status==="hit"?"查看飞猪价格":"查看当前航班"; byId("deal-link").classList.toggle("muted",r.status!=="hit");
  byId("deal-signal").textContent=r.status==="hit"?"价格达标":"等待降价"; byId("deal-signal").classList.toggle("good",r.status==="hit");
  byId("trend-title").textContent=`${r.from} → ${r.to} 价格趋势`; byId("trend-target").textContent=`¥${price(r.threshold)}`;
  [...byId("trend-bars").querySelectorAll(".bar-column")].forEach(n=>n.remove());
  r.bars.forEach((h,i)=>{const col=document.createElement("div");col.className="bar-column";col.innerHTML=`<i class="${i===r.bars.length-1?"latest":""}" style="height:${h}%"></i>`;byId("trend-bars").appendChild(col)});
}

document.querySelectorAll("[data-route]").forEach(el=>el.addEventListener("click",()=>selectRoute(el.dataset.route)));
calendar.forEach(level=>{const dot=document.createElement("i");dot.className=`level-${level}`;byId("calendar").appendChild(dot)});
byId("refresh").addEventListener("click",()=>{byId("refresh-icon").classList.add("spin");byId("refresh-label").textContent="正在读取";setTimeout(()=>{byId("refresh-icon").classList.remove("spin");byId("refresh-label").textContent="刷新状态";byId("updated").textContent="刚刚"},900)});
byId("add-route").addEventListener("click",()=>{byId("toast").classList.add("show");setTimeout(()=>byId("toast").classList.remove("show"),2800)});
renderCards(); selectRoute(activeId);
