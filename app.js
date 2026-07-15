const FALLBACK_ROUTES = [
  {id:"sha-cts",from:"PVG",fromCity:"上海",to:"CTS",toCity:"札幌",price:1940,threshold:3000,dates:"10.27 — 11.10",stay:"14天",status:"hit",statusLabel:"价格命中",outbound:902,inbound:1038,link:"https://a.feizhu.com/25zkd1",bars:[74,62,79,55,68,48,43,51,37,42,33,26],similarPercent:10,alternatives:[{departDate:"2026-10-27",returnDate:"2026-10-31",stayDays:4,total:2040,outbound:902,inbound:1138,link:"https://a.feizhu.com/25zkd1"}]},
  {id:"hgh-aat",from:"HGH",fromCity:"杭州",to:"AAT",toCity:"阿勒泰",price:2200,threshold:1600,dates:"09.09 — 09.11",stay:"2天",status:"watch",statusLabel:"持续扫描",outbound:1100,inbound:1100,link:"https://a.feizhu.com/14Mrmh",bars:[82,75,72,68,65,61,57,61,54,52,49,47],similarPercent:10,alternatives:[{departDate:"2026-09-09",returnDate:"2026-09-13",stayDays:4,total:2200,outbound:1100,inbound:1100,link:"https://a.feizhu.com/14Mrmh"}]},
  {id:"hgh-kmg",from:"HGH",fromCity:"杭州",to:"KMG",toCity:"昆明",price:1055,threshold:1600,dates:"09.07 — 09.14",stay:"7天",status:"hit",statusLabel:"价格命中",outbound:445,inbound:610,link:"https://a.feizhu.com/0N5UZS",bars:[70,61,66,52,48,54,39,45,34,29,31,23],similarPercent:10,alternatives:[{departDate:"2026-09-08",returnDate:"2026-09-14",stayDays:6,total:1055,outbound:445,inbound:610,link:"https://a.feizhu.com/1BewgM"},{departDate:"2026-09-10",returnDate:"2026-09-15",stayDays:5,total:1055,outbound:445,inbound:610,link:"https://a.feizhu.com/3NcW6W"}]}
];

const AIRPORTS = [
  ["中国","北京","首都国际机场","PEK"],["中国","北京","大兴国际机场","PKX"],["中国","上海","浦东国际机场","PVG"],["中国","上海","虹桥国际机场","SHA"],["中国","杭州","萧山国际机场","HGH"],["中国","广州","白云国际机场","CAN"],["中国","深圳","宝安国际机场","SZX"],["中国","成都","天府国际机场","TFU"],["中国","成都","双流国际机场","CTU"],["中国","重庆","江北国际机场","CKG"],["中国","昆明","长水国际机场","KMG"],["中国","西安","咸阳国际机场","XIY"],["中国","武汉","天河国际机场","WUH"],["中国","长沙","黄花国际机场","CSX"],["中国","南京","禄口国际机场","NKG"],["中国","厦门","高崎国际机场","XMN"],["中国","青岛","胶东国际机场","TAO"],["中国","天津","滨海国际机场","TSN"],["中国","郑州","新郑国际机场","CGO"],["中国","三亚","凤凰国际机场","SYX"],["中国","海口","美兰国际机场","HAK"],["中国","乌鲁木齐","天山国际机场","URC"],["中国","阿勒泰","雪都机场","AAT"],["中国","喀什","徕宁国际机场","KHG"],["中国","丽江","三义国际机场","LJG"],["中国","大理","凤仪机场","DLU"],["中国","哈尔滨","太平国际机场","HRB"],["中国","沈阳","桃仙国际机场","SHE"],["中国","大连","周水子国际机场","DLC"],["中国","福州","长乐国际机场","FOC"],["中国","宁波","栎社国际机场","NGB"],["中国","温州","龙湾国际机场","WNZ"],["中国","济南","遥墙国际机场","TNA"],["中国","合肥","新桥国际机场","HFE"],["中国","珠海","金湾机场","ZUH"],["中国","无锡","硕放国际机场","WUX"],["中国","烟台","蓬莱国际机场","YNT"],["中国","石家庄","正定国际机场","SJW"],["中国","拉萨","贡嘎国际机场","LXA"],["中国","银川","河东国际机场","INC"],
  ["日本","东京","羽田机场","HND"],["日本","东京","成田国际机场","NRT"],["日本","大阪","关西国际机场","KIX"],["日本","大阪","伊丹机场","ITM"],["日本","札幌","新千岁机场","CTS"],["日本","福冈","福冈机场","FUK"],["日本","冲绳","那霸机场","OKA"],["日本","名古屋","中部国际机场","NGO"],["日本","鹿儿岛","鹿儿岛机场","KOJ"],["日本","广岛","广岛机场","HIJ"],["日本","仙台","仙台机场","SDJ"],["日本","高松","高松机场","TAK"],
  ["韩国","首尔","仁川国际机场","ICN"],["韩国","首尔","金浦国际机场","GMP"],["韩国","釜山","金海国际机场","PUS"],["韩国","济州","济州国际机场","CJU"],
  ["泰国","曼谷","素万那普机场","BKK"],["泰国","曼谷","廊曼国际机场","DMK"],["泰国","普吉","普吉国际机场","HKT"],["泰国","清迈","清迈国际机场","CNX"],
  ["新加坡","新加坡","樟宜机场","SIN"],["马来西亚","吉隆坡","吉隆坡国际机场","KUL"],["马来西亚","槟城","槟城国际机场","PEN"],["马来西亚","亚庇","亚庇国际机场","BKI"],
  ["越南","河内","内排国际机场","HAN"],["越南","胡志明市","新山一国际机场","SGN"],["越南","岘港","岘港国际机场","DAD"],["菲律宾","马尼拉","尼诺伊·阿基诺国际机场","MNL"],["菲律宾","宿务","麦克坦国际机场","CEB"],
  ["印度尼西亚","雅加达","苏加诺-哈达国际机场","CGK"],["印度尼西亚","巴厘岛","伍拉·赖国际机场","DPS"],["印度尼西亚","泗水","朱安达国际机场","SUB"],
  ["美国","纽约","肯尼迪国际机场","JFK"],["美国","纽约","纽瓦克国际机场","EWR"],["美国","洛杉矶","洛杉矶国际机场","LAX"],["美国","旧金山","旧金山国际机场","SFO"],["美国","西雅图","西雅图-塔科马国际机场","SEA"],["美国","芝加哥","奥黑尔国际机场","ORD"],["美国","华盛顿","杜勒斯国际机场","IAD"],["美国","波士顿","洛根国际机场","BOS"],["美国","檀香山","火奴鲁鲁国际机场","HNL"],["美国","拉斯维加斯","哈里·里德国际机场","LAS"],
  ["加拿大","温哥华","温哥华国际机场","YVR"],["加拿大","多伦多","皮尔逊国际机场","YYZ"],["加拿大","蒙特利尔","特鲁多国际机场","YUL"],["加拿大","卡尔加里","卡尔加里国际机场","YYC"],
  ["英国","伦敦","希思罗机场","LHR"],["英国","伦敦","盖特威克机场","LGW"],["英国","曼彻斯特","曼彻斯特机场","MAN"],["英国","爱丁堡","爱丁堡机场","EDI"],
  ["法国","巴黎","戴高乐机场","CDG"],["法国","巴黎","奥利机场","ORY"],["德国","法兰克福","法兰克福机场","FRA"],["德国","慕尼黑","慕尼黑机场","MUC"],["德国","柏林","勃兰登堡机场","BER"],
  ["荷兰","阿姆斯特丹","史基浦机场","AMS"],["瑞士","苏黎世","苏黎世机场","ZRH"],["瑞士","日内瓦","日内瓦机场","GVA"],["意大利","罗马","菲乌米奇诺机场","FCO"],["意大利","米兰","马尔彭萨机场","MXP"],["意大利","威尼斯","马可波罗机场","VCE"],["西班牙","马德里","巴拉哈斯机场","MAD"],["西班牙","巴塞罗那","埃尔普拉特机场","BCN"],["葡萄牙","里斯本","温贝托·德尔加多机场","LIS"],
  ["澳大利亚","悉尼","金斯福德·史密斯机场","SYD"],["澳大利亚","墨尔本","墨尔本机场","MEL"],["澳大利亚","布里斯班","布里斯班机场","BNE"],["澳大利亚","珀斯","珀斯机场","PER"],["澳大利亚","黄金海岸","黄金海岸机场","OOL"],["新西兰","奥克兰","奥克兰机场","AKL"],["新西兰","基督城","基督城机场","CHC"],
  ["阿联酋","迪拜","迪拜国际机场","DXB"],["阿联酋","阿布扎比","扎耶德国际机场","AUH"],["土耳其","伊斯坦布尔","伊斯坦布尔机场","IST"],["土耳其","伊斯坦布尔","萨比哈·格克琴机场","SAW"],["卡塔尔","多哈","哈马德国际机场","DOH"],
  ["印度","德里","英迪拉·甘地国际机场","DEL"],["印度","孟买","贾特拉帕蒂·希瓦吉机场","BOM"],["印度","班加罗尔","坎佩高达国际机场","BLR"],["印度","加尔各答","内塔吉·苏巴斯机场","CCU"],["尼泊尔","加德满都","特里布万国际机场","KTM"],["斯里兰卡","科伦坡","班达拉奈克国际机场","CMB"]
].map(([country,city,name,code])=>({country,city,name,code}));
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
  renderAlternatives(r);
}

function renderAll(){renderCards();selectRoute(activeId)}
function toast(message){const node=byId("toast");node.textContent=message;node.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove("show"),3200)}
function setModal(open){byId("route-modal").classList.toggle("open",open);byId("route-modal").setAttribute("aria-hidden",String(!open));document.body.style.overflow=open?"hidden":"";if(open)setTimeout(()=>byId("origin-airport").focus(),180)}

function populateCountries(){
  const countries=[...new Set(AIRPORTS.map(item=>item.country))];
  [byId("origin-country"),byId("destination-country")].forEach(select=>{select.innerHTML=countries.map(country=>`<option value="${country}">${country}</option>`).join("")});
  byId("origin-country").value="中国"; byId("destination-country").value="中国";
}
function populateAirports(countryId,airportId,preferredCode){
  const country=byId(countryId).value;
  const list=AIRPORTS.filter(item=>item.country===country);
  byId(airportId).innerHTML=list.map(item=>`<option value="${item.code}">${item.city} · ${item.name}（${item.code}）</option>`).join("");
  if(preferredCode&&list.some(item=>item.code===preferredCode))byId(airportId).value=preferredCode;
}
function selectedAirport(id){return AIRPORTS.find(item=>item.code===byId(id).value)}

function issueBody(config){
  const dateText=config.dateMode==="relative"?`未来 ${config.horizonDays} 天`:`${config.dateStart} 至 ${config.dateEnd}`;
  return `<!-- FLIGHT_MONITOR_CONFIG\n${JSON.stringify(config)}\n-->\n## 新增航线监控\n\n- 航线：${config.originCountry} · ${config.originCity} ${config.originAirport}（${config.originCode}）→ ${config.destinationCountry} · ${config.destinationCity} ${config.destinationAirport}（${config.destinationCode}）\n- 出发范围：${dateText}\n- 停留：${config.stayMin}–${config.stayMax} 天\n- 目标：直飞往返，每程不高于 ¥${config.targetPrice}\n- 相近低价：最低价 +${config.similarPercent}% 以内\n\n> 请直接提交本 Issue。自动化会保存配置、关闭 Issue，并从下一次扫描开始显示结果。`;
}

document.querySelectorAll("[data-route]").forEach(el=>el.addEventListener("click",()=>selectRoute(el.dataset.route)));
byId("refresh").addEventListener("click",async()=>{byId("refresh-icon").classList.add("spin");byId("refresh-label").textContent="正在读取";await loadData(true);byId("refresh-icon").classList.remove("spin");byId("refresh-label").textContent="刷新状态"});
byId("add-route").addEventListener("click",()=>setModal(true));
byId("close-route").addEventListener("click",()=>setModal(false));
byId("modal-backdrop").addEventListener("click",()=>setModal(false));
document.addEventListener("keydown",event=>{if(event.key==="Escape")setModal(false)});
byId("origin-country").addEventListener("change",()=>populateAirports("origin-country","origin-airport"));
byId("destination-country").addEventListener("change",()=>populateAirports("destination-country","destination-airport"));
byId("swap-city").addEventListener("click",()=>{
  const originCountry=byId("origin-country").value,originCode=byId("origin-airport").value;
  const destinationCountry=byId("destination-country").value,destinationCode=byId("destination-airport").value;
  byId("origin-country").value=destinationCountry; populateAirports("origin-country","origin-airport",destinationCode);
  byId("destination-country").value=originCountry; populateAirports("destination-country","destination-airport",originCode);
});
document.querySelectorAll('input[name="dateMode"]').forEach(input=>input.addEventListener("change",()=>{const fixed=input.form.dateMode.value==="fixed";byId("relative-fields").classList.toggle("hidden",fixed);byId("fixed-fields").classList.toggle("hidden",!fixed)}));
byId("route-form").addEventListener("submit",event=>{
  event.preventDefault();
  const origin=selectedAirport("origin-airport"),destination=selectedAirport("destination-airport");
  const dateMode=event.currentTarget.dateMode.value,stayMin=Number(byId("stay-min").value),stayMax=Number(byId("stay-max").value);
  if(!origin||!destination)return toast("请选择出发和到达机场");
  if(origin.code===destination.code)return toast("出发和到达机场不能相同");
  if(stayMin>stayMax)return toast("最短停留不能大于最长停留");
  if(dateMode==="fixed"&&(!byId("date-start").value||!byId("date-end").value||byId("date-start").value>byId("date-end").value))return toast("请填写正确的出发日期范围");
  const config={id:`${origin.code}-${destination.code}-${Date.now().toString(36)}`.toLowerCase(),originCountry:origin.country,originCity:origin.city,originAirport:origin.name,originCode:origin.code,destinationCountry:destination.country,destinationCity:destination.city,destinationAirport:destination.name,destinationCode:destination.code,dateMode,horizonDays:dateMode==="relative"?Number(byId("horizon").value):null,dateStart:dateMode==="fixed"?byId("date-start").value:null,dateEnd:dateMode==="fixed"?byId("date-end").value:null,stayMin,stayMax,targetPrice:Number(byId("target-price").value),similarPercent:Number(byId("similar-percent").value),directOnly:byId("direct-only").checked,notify:byId("notify").checked,enabled:true,createdAt:new Date().toISOString()};
  const title=`[Flight Monitor] ${origin.code} → ${destination.code}`;
  const url=`https://github.com/${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(issueBody(config))}`;
  setModal(false);toast("配置已生成，请在 GitHub 页面确认提交");window.open(url,"_blank","noopener");
});

populateCountries();
populateAirports("origin-country","origin-airport","HGH");
populateAirports("destination-country","destination-airport","KMG");
renderAll();
loadData();
