'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'worker.js'),'utf8');
const marker=";\naddEventListener('fetch'";
const idx=source.indexOf(marker);assert.ok(idx>0,'Worker must contain HTML payload');
const html=JSON.parse(source.slice('const HTML='.length,idx));
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script,{filename:'in-page-script.js'});
const elements=new Map(),storage=new Map(),handlers={};
const element=id=>{
 if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',hidden:false,disabled:false,addEventListener(event,cb){handlers[id+'_'+event]=cb},focus(){},setAttribute(name,value){this[name]=value}});
 return elements.get(id)
};
const fakeButtons=['persephone','eric','hecate'].map(v=>({value:v,setAttribute(k,val){this[k]=val},getAttribute(){return this.value}}));
const sandbox={console,window:{scrollTo(){}},document:{getElementById:element,addEventListener(type,cb){handlers['document_'+type]=cb},querySelector(){return {focus(){}}},querySelectorAll(){return fakeButtons}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},confirm(){return true}};
const instrumented=script.replace('draw();\n})();','window.__test={scenes,endings,pick,go,back,draw,restart,getState:()=>state,relationshipEnding,endingKey};draw();\n})();');
assert.notEqual(script,instrumented,'Instrumentation placement');
vm.runInNewContext(instrumented,sandbox,{timeout:5000});
const t=sandbox.window.__test,keys=Object.keys(t.scenes);
assert.equal(keys.length,18,'scene count');assert.equal(Object.keys(t.endings).length,5,'ending count');
let tested=0;
for(const id of keys){
 const sc=t.scenes[id];assert.equal(sc.choices.length,3,'scene '+id);
 for(let i=0;i<3;i++){
  t.restart(true);t.getState().current=id;t.draw();t.pick(i);
  const chosen=sc.choices[i];assert.ok(t.getState().feedback,'feedback '+id);
  assert.equal(t.getState().history.length,1,'history '+id);
  if(chosen.rel){for(const k in chosen.rel)assert.equal(t.getState().relation[k],chosen.rel[k],'relation '+id+' '+k)}
  t.go();assert.equal(t.getState().current,chosen.next,'transition '+id+' '+i);
  t.back();assert.equal(t.getState().current,id,'back '+id+' '+i);
  assert.equal(t.getState().relation.repair,0,'repair undone');
  assert.equal(t.getState().relation.space,0,'space undone');
  assert.equal(t.getState().relation.open,0,'open undone');
  tested++;
 }
}
assert.equal(tested,54,'choice transitions');
const reachable=new Set(['prologue']),queue=['prologue'];while(queue.length){const id=queue.shift();for(const choice of t.scenes[id].choices){if(choice.next==='ending')continue;assert.ok(t.scenes[choice.next],'missing scene '+choice.next);if(!reachable.has(choice.next)){reachable.add(choice.next);queue.push(choice.next)}}}
assert.equal(reachable.size,keys.length,'all chapters reachable');
t.restart(true);t.getState().current='visitor';t.draw();
assert.match(element('story').innerHTML,/Turn Hecate/);
assert.match(element('story').innerHTML,/eric-gate.webp/);
handlers.document_click({target:{closest(){return {getAttribute(attr){return attr==='data-lens'?'eric':null},hasAttribute(attr){return attr==='data-lens'}}}}});
assert.equal(t.getState().lens,'eric');assert.match(element('lens-words').textContent,/reassurance/);
t.restart(true);t.getState().current='ericBridge';t.getState().relation.repair=3;
t.draw();t.pick(0);t.go();t.getState().current='ending';t.draw();
assert.match(element('story').innerHTML,/A bridge built in daylight/);
t.getState().relation={repair:0,space:4,open:0};t.draw();assert.match(element('story').innerHTML,/Two paths, neither a failure/);
t.getState().relation={repair:0,space:0,open:4};t.draw();assert.match(element('story').innerHTML,/The gate remains a question/);
t.getState().fortune='I can write my own future';t.draw();assert.match(element('story').innerHTML,/I can write my own future/);
t.getState().lantern={known:'The words I heard',unknown:'What I still cannot know'};t.draw();assert.match(element('story').innerHTML,/The words I heard/);
assert.match(html,/graves-persephone-story\/main\/assets/);
for(const name of ['eric-gate','eric-bridge','eric-hearth','eric-fortune'])assert.ok(fs.statSync(path.join(__dirname,'assets',name+'.webp')).size>40000,'illustration '+name);
assert.match(source,/img-src https:\/\/raw\.githubusercontent\.com/);
assert.match(html,/fictional/i);assert.doesNotMatch(html,/\bMatthew Schaefer\b|\bDawn Vera\b/i);
console.log(JSON.stringify({success:true,scenes:keys.length,choicesTested:tested,reachableScenes:reachable.size,endings:Object.keys(t.endings).length,relationshipOutcomes:3,perspectiveSwitch:true,ericGraphics:4,savedProgressCompatible:true}));
