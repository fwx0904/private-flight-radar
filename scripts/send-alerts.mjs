import nodemailer from "nodemailer";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const resultsPath=resolve(root,"data/results.json");
const routesPath=resolve(root,"data/routes.json");
const username=process.env.SMTP_USERNAME;
const password=process.env.SMTP_PASSWORD;
const recipient=process.env.ALERT_EMAIL;

if(!username||!password||!recipient){
  console.log("Email secrets are incomplete; skipping email delivery.");
  process.exit(0);
}

const payload=JSON.parse(readFileSync(resultsPath,"utf8"));
const configs=JSON.parse(readFileSync(routesPath,"utf8"));
const configMap=new Map(configs.map(item=>[item.id,item]));
const pending=(payload.routes||[]).filter(result=>result.emailAlert&&(!result.lastEmailedTotal||result.emailAlert.total<result.lastEmailedTotal));

if(!pending.length){
  console.log("No new extremely low fares to email.");
  process.exit(0);
}

const transport=nodemailer.createTransport({host:process.env.SMTP_HOST||"smtp-mail.outlook.com",port:587,secure:false,requireTLS:true,auth:{user:username,pass:password}});

for(const result of pending){
  const config=configMap.get(result.id),alert=result.emailAlert;
  if(!config)continue;
  const subject=`机票雷达｜${config.originCity} → ${config.destinationCity} 极低价 ¥${alert.total}`;
  const text=`发现极低价机票！\n\n航线：${config.originCity}（${config.originCode}）→ ${config.destinationCity}（${config.destinationCode}）\n日期：${alert.departDate} → ${alert.returnDate}\n直飞往返总价：¥${alert.total}\n比目标总价低：${alert.discountPercent}%\n\n查看实时票价：${alert.link}\n\n票价可能随时变化，请以下单页面为准。`;
  const html=`<div style="font-family:Arial,'PingFang SC',sans-serif;max-width:620px;margin:auto;background:#07100b;color:#f3f7f4;padding:30px"><p style="color:#8cffad;letter-spacing:2px">FLIGHT/RADAR</p><h1 style="font-size:28px">发现极低价机票</h1><p style="font-size:20px"><b>${config.originCity}</b>（${config.originCode}）→ <b>${config.destinationCity}</b>（${config.destinationCode}）</p><div style="border:1px solid #284434;padding:20px;margin:20px 0"><p>日期：<b>${alert.departDate} → ${alert.returnDate}</b></p><p>直飞往返：<b style="color:#8cffad;font-size:30px">¥${alert.total}</b></p><p>比目标总价低 <b>${alert.discountPercent}%</b></p></div><a href="${alert.link}" style="display:block;background:#8cffad;color:#071009;padding:15px;text-align:center;text-decoration:none;font-weight:bold">打开飞猪查看实时票价</a><p style="color:#738078;font-size:12px;line-height:1.6;margin-top:20px">票价可能随时变化，请以下单页面的含税价格、行李额度和退改规则为准。</p></div>`;
  await transport.sendMail({from:`私人机票雷达 <${username}>`,to:recipient,subject,text,html});
  result.lastEmailedTotal=alert.total;
  result.emailAlert=null;
  console.log(`Email sent for ${result.id}: ${alert.total}`);
}

writeFileSync(resultsPath,`${JSON.stringify(payload,null,2)}\n`);
