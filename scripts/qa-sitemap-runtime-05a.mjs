import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {writeFile,mkdir} from "node:fs/promises";
const origin="http://127.0.0.1:3155";
const command=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-H","127.0.0.1","-p","3155"],{env:process.env,stdio:["ignore","pipe","pipe"]});
let serverLog="";
command.stdout.on("data",v=>serverLog+=v);command.stderr.on("data",v=>serverLog+=v);
const checks=[];
function check(name, condition, detail){checks.push({name,status:condition?"PASS":"FAIL",detail});assert.ok(condition,name+" "+detail);}
try {
 let ready=false;
 for(let i=0;i<50;i++) {await new Promise(resolve=>setTimeout(resolve,350));try{if((await fetch(origin+"/")).ok){ready=true;break}}catch{}}
 check("Next.js API-mode isolated loopback server ready",ready,"");
 const sitemap=await fetch(origin+"/sitemap.xml",{cache:"no-store"});
 const xml=await sitemap.text();
 check("Sitemap HTTP 200",sitemap.status===200,String(sitemap.status));
 check("Indexing disabled yields no URL entries",!xml.includes("<url>")&&!xml.includes("https://screenwhy.com/movies/triangle"),xml.slice(0,400));
 const robots=await fetch(origin+"/robots.txt",{cache:"no-store"});
 const txt=await robots.text();
 check("Robots HTTP 200",robots.status===200,String(robots.status));
 check("Robots disallows site",/Disallow:\s*\//i.test(txt),txt.slice(0,400));
 check("Robots does not publish sitemap while indexing disabled",!txt.includes("Sitemap:"),txt.slice(0,400));
 const homepage=await fetch(origin+"/");
 const html=await homepage.text();
 check("API-mode homepage HTTP 200",homepage.status===200,String(homepage.status));
 check("Homepage noindex",/noindex/i.test(html),html.match(/<meta[^>]+robots[^>]+>/i)?.[0]??"");
 check("No former-brand sitemap links",!xml.includes("plotexplainer"),xml.slice(0,200));
}finally {
 command.kill("SIGTERM");
 await mkdir("/vercel/sandbox/step05/evidence",{recursive:true});
 await writeFile("/vercel/sandbox/step05/evidence/sitemap-runtime-qa.json",JSON.stringify({checks,summary:{passed:checks.filter(v=>v.status==="PASS").length,failed:checks.filter(v=>v.status==="FAIL").length},classification:"REAL API-mode build, empty public CMS and indexing disabled",serverLog:serverLog.slice(-2000)},null,2));
}
console.log("RUNTIME_SITEMAP_CHECKS="+checks.length);

