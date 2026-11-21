'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const p=path.join(__dirname,'..','worker.js'),src=fs.readFileSync(p,'utf8');
const sep=";\naddEventListener('fetch'",index=src.indexOf(sep);
assert.ok(src.startsWith('const HTML=')&&index>0,'Expected existing Worker source');
let html=JSON.parse(src.slice(11,index));
assert.ok(html.includes('</head>'),'Story head exists');
const init="window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','G-Z569M020PS');";
const tag='<script data-ga4-config-init="G-Z569M020PS">'+init+'</script>';
if(!html.includes('data-ga4-config-init')){
  html=html.replace('</head>',tag+'</head>');
}
assert.equal((html.match(/data-ga4-config-init/g)||[]).length,1,'Exactly one initializer');
assert.ok(html.includes('graves_orchard_between_worlds_v1'),'Local save key unchanged');
assert.ok(html.includes('Hecate’s Book of Wisdom'),'Keep lessons');
const next='const HTML='+JSON.stringify(html)+src.slice(index);
fs.writeFileSync(p,next);
console.log(JSON.stringify({success:true,workerBytes:next.length,initCalls:(html.match(/gtag\('config','G-Z569M020PS'\)/g)||[]).length,storyKeyPreserved:true}));
