'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(require('node:path').join(__dirname,'worker.js'),'utf8');
const stop=src.indexOf(";\naddEventListener('fetch'");
const html=JSON.parse(src.slice('const HTML='.length,stop));
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
assert.ok(script.includes("draw();\n})();"),'app entrypoint');
const elements=new Map(),storage=new Map();
function el(id){if(!elements.has(id))elements.set(id,{innerHTML:'',value:'',hidden:false,disabled:false,addEventListener(){},focus(){}});return elements.get(id)}
const sandbox={console,window:{scrollTo(){}},document:{getElementById:el,addEventListener(){},querySelector(){return{focus(){}}}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},confirm:()=>true};
const injectable=script.replace("draw();\n})();","window._test={scenes,endings,getState:()=>state,pick,go,draw,restart,endingKey};draw();\n})();");
vm.runInNewContext(injectable,sandbox,{timeout:5000});
const t=sandbox.window._test;
assert.equal(Object.keys(t.scenes).length,14);
assert.equal(Object.keys(t.endings).length,5);
let tested=0;const ids=Object.keys(t.scenes);
for(const id of ids){const scene=t.scenes[id];assert.equal(scene.choices.length,3,id+' choices');for(let i=0;i<scene.choices.length;i++){t.restart(true);t.getState().current=id;t.draw();t.pick(i);assert.ok(t.getState().feedback,id+' feedback');const expected=scene.choices[i].next;t.go();assert.equal(t.getState().current,expected,id+' path '+i);tested++}}
assert.equal(tested,42);
t.restart(true);t.getState().current='fortune';t.getState().fortune='I can write the next chapter';t.draw();assert.match(el('story').innerHTML,/fortune-line/);t.getState().current='ending';t.draw();assert.match(el('story').innerHTML,/I can write the next chapter/);
assert.match(html,/graves-persephone-story\/main\/assets/);assert.match(html,/A story for Dawn/);
assert.match(src,/img-src https:\/\/raw\.githubusercontent\.com/);
assert.doesNotMatch(html,/\bEric\b|\bMatt\b/i);
console.log(JSON.stringify({ok:true,sceneCount:ids.length,choicePathsTested:tested,endings:Object.keys(t.endings).length,fortuneMemory:true,illustrated:true,safePersonalization:true}));
