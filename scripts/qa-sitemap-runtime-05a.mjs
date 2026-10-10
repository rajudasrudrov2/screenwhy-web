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
¶»§q«^