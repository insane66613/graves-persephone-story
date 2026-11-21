'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(path.join(__dirname,'worker.js'),'utf8'),split=src.indexOf(";\naddEventListener('fetch'");
assert.ok(split>0);
const html=JSON.parse(src.slice('const HTML='.length,split));
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script,{filename:'orchard-live.js'});
const nodes=new Map(),events={},store=new Map(),downloads=[];
function node(id){if(!nodes.has(id))nodes.set(id,{id,hidden:false,innerHTML:'',textContent:'',value:'',style:{},addEventListener(type,callback){events[id+'_'+type]=callback},focus(){this.focused=true},scrollIntoView(){this.scrolled=true},setAttribute(name,value){this[name]=value}});return nodes.get(id)}
const body={classList:{toggle(){}},appendChild(){}};
const env={console,confirm(){return true},setTimeout(fn){fn()},Blob:class{constructor(a,opts){this.body=a.join('');downloads.push(this.body)}},URL:{createObjectURL(){return 'blob:unit-test'},revokeObjectURL(){}},window:{scrollTo(){}},document:{body,getElementById:node,addEventListener(type,fn){events['document_'+type]=fn},querySelector(){return{focus(){}}},querySelectorAll(){return []},createElement(){return {style:{},click(){},remove(){}}}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}};
const instrumented=script.replace('draw();\n})();','window.__test={scenes,lessons:wisdomLessons,wisdomById,wisdomSceneMap,getState:()=>state,draw,drawWisdom,openWisdom,closeWisdom,answerWisdom,wisdomProgress,restart,privateKeepsake,downloadKeepsake};draw();\n})();');
assert.notEqual(instrumented,script);
vm.runInNewContext(instrumented,env,{timeout:5000});
const t=env.window.__test;
assert.equal(Object.keys(t.scenes).length,20);
assert.equal(t.lessons.length,9);
assert.equal(new Set(t.lessons.map(l=>l.id)).size,9);
const allowed=['theoi.com','iaap.org','rnoh.nhs.uk','nhs.uk','plato.stanford.edu','greatergood.berkeley.edu','doi.org'];
for(const lesson of t.lessons){
 assert.equal(lesson.quiz.choices.length,3,'quiz '+lesson.id);
 assert.ok(lesson.sources.length>0,'sources '+lesson.id);
 for(const source of lesson.sources){const hostname=new URL(source.url).hostname;assert.ok(allowed.some(d=>hostname===d||hostname.endsWith('.'+d)),'unapproved '+hostname)}
}
for(const id of Object.keys(t.scenes))assert.ok(t.lessons.some(l=>l.id===t.wisdomSceneMap[id]),'missing lesson map '+id);
assert.equal(t.wisdomProgress(),0);
assert.equal(node('wisdom-panel').hidden,true);
assert.match(node('story').innerHTML,/data-wisdom-scene="myth"/);
function click(id,attrs={}){
 const target={id,hasAttribute(k){return Object.prototype.hasOwnProperty.call(attrs,k)},getAttribute(k){return attrs[k]||null},dataset:{action:attrs['data-action']||''}};
 events.document_click({target:{closest(){return target}}});
}
click('wisdom-toggle');
assert.equal(t.getState().wisdom.open,true);
assert.equal(node('wisdom-panel').hidden,false);
assert.equal(node('wisdom-toggle')['aria-expanded'],'true');
assert.match(node('wisdom-tabs').innerHTML,/data-wisdom-lesson="individuation"/);
assert.match(node('wisdom-detail').innerHTML,/Homeric Hymn/);
assert.match(node('wisdom-detail').innerHTML,/noopener noreferrer/);
assert.equal(node('wisdom-heading').focused,true);
for(const lesson of t.lessons){
 click('',{'data-wisdom-lesson':lesson.id});
 assert.equal(t.getState().wisdom.selected,lesson.id);
 assert.ok(node('wisdom-detail').innerHTML.includes('class="wisdom-label"'),'rendered '+lesson.id);
 const wrong=(lesson.quiz.correct+1)%3;
 click('',{'data-wisdom-answer':String(wrong)});
 assert.equal(t.getState().wisdom.completed[lesson.id],undefined);
 assert.match(node('wisdom-detail').innerHTML,/wisdom-feedback/);
 click('',{'data-wisdom-answer':String(lesson.quiz.correct)});
 assert.equal(t.getState().wisdom.completed[lesson.id],true);
}
assert.equal(t.wisdomProgress(),9);
assert.match(node('wisdom-count').textContent,/9 \/ 9/);
const reflection='A perspective I can examine without claiming to know someone else';
click('',{'data-wisdom-lesson':'mindreading'});
events['wisdom-panel_input']({target:{id:'wisdom-reflection',value:reflection}});
assert.equal(t.getState().wisdom.reflections.mindreading,reflection);
assert.match(t.privateKeepsake(),/Reflection: When Fear Writes the Dialogue/);
assert.match(t.privateKeepsake(),/A perspective I can examine/);
t.downloadKeepsake();assert.equal(downloads.length,1);assert.match(downloads[0],/Hecate’s Book of Wisdom/);
click('wisdom-close');assert.equal(node('wisdom-panel').hidden,true);
click('',{'data-wisdom-scene':'shadow'});assert.equal(t.getState().wisdom.selected,'shadow');assert.equal(t.getState().wisdom.open,true);
t.restart(false);assert.equal(t.getState().wisdom.reflections.mindreading,reflection);assert.equal(t.wisdomProgress(),9);assert.equal(t.getState().wisdom.open,false);
assert.equal(t.getState().current,'prologue');
t.restart(true);assert.equal(t.wisdomProgress(),0);assert.equal(t.getState().wisdom.reflections.mindreading,undefined);
assert.ok(store.get('graves_orchard_between_worlds_v1').length>0);
console.log(JSON.stringify({ok:true,lessons:t.lessons.length,exerciseAnswersTested:18,sourceLinks:t.lessons.reduce((n,l)=>n+l.sources.length,0),sceneMappings:Object.keys(t.scenes).length,persistence:true,reset:true,keepsakeExport:true,storyPreserved:true}));
