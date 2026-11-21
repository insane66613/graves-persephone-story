'use strict';
const fs=require('node:fs'),path=require('node:path');
const installWisdom=function installWisdom(html,lessons){
 const replace=(a,b)=>{
  if(!html.includes(a))throw Error("Missing wisdom patch anchor: "+a.slice(0,110));
  html=html.replace(a,b)
 };
 if(html.includes('id="wisdom-panel"'))throw Error("Wisdom Book already installed; avoid double patch");
 const css=String.raw`
/* Hecate's Book of Wisdom: optional, source-linked philosophy and reflective practice */
.wisdom-launch{margin:0 0 19px;max-width:840px}
.wisdom-toggle{width:100%;display:flex;align-items:center;gap:14px;text-align:left;background:linear-gradient(110deg,#4e354a85,#26313f88);border:1px solid #e6bf7b80;color:var(--ink);padding:16px 19px;border-radius:15px;box-shadow:0 12px 35px #00000030}
.wisdom-toggle .wisdom-sigil{font:400 1.7rem var(--serif);color:var(--gold);line-height:1}
.wisdom-toggle strong{display:block;font:400 1.13rem var(--serif);color:var(--gold)}
.wisdom-toggle small{display:block;color:var(--muted);font-size:.74rem;margin-top:3px;line-height:1.4}
.wisdom-toggle .wisdom-toggle-end{margin-left:auto;font-size:.78rem;color:var(--gold);white-space:nowrap}
.wisdom-toggle:hover{background:linear-gradient(110deg,#62465d99,#2c3a4b99)}
.wisdom-panel{border:1px solid #e6bf7b66;border-radius:21px;background:linear-gradient(145deg,#221e31,#1a1f2f);padding:22px;margin:0 0 27px;max-width:920px;box-shadow:0 24px 60px #0006}
.wisdom-panel[hidden]{display:none!important}
.wisdom-top{display:flex;align-items:start;justify-content:space-between;gap:16px}
.wisdom-top h2{font:400 clamp(1.7rem,3vw,2.3rem) var(--serif);margin:3px 0 7px;color:var(--gold)}
.wisdom-top p{font-size:.8rem;color:var(--muted);margin:0;line-height:1.55;max-width:630px}
.wisdom-close{background:none;border:1px solid #796775;color:var(--muted);border-radius:100px;padding:6px 13px;font-size:.82rem;flex:none}
.wisdom-tabs{display:flex;gap:7px;flex-wrap:wrap;margin:20px 0;border-top:1px solid #ffffff16;padding-top:19px}
.wisdom-tabs button{border-radius:100px;border:1px solid #796c7b;background:#171b2a;color:#dad0d5;padding:8px 12px;font-size:.8rem;text-align:left}
.wisdom-tabs button[aria-pressed="true"]{border-color:var(--gold);color:#261d24;background:var(--gold);font-weight:720}
.wisdom-tabs button .wisdom-done{color:#b5d0b6}
.wisdom-tabs button[aria-pressed="true"] .wisdom-done{color:#334936}
.wisdom-detail{border-top:1px solid #ffffff18;padding:22px 0 4px}
.wisdom-label{font-size:.71rem;letter-spacing:.12em;text-transform:uppercase;color:var(--sage);font-weight:650}
.wisdom-detail h3{font:400 clamp(1.7rem,3.5vw,2.5rem)/1.18 var(--serif);color:var(--ink);margin:8px 0 18px}
.wisdom-detail h4{font:400 1.22rem var(--serif);color:var(--gold);margin:22px 0 7px}
.wisdom-detail p{margin:0 0 14px;color:#d9cfd5;line-height:1.78}
.wisdom-detail .wisdom-caution{border-left:2px solid var(--sage);padding:9px 16px;margin:19px 0;background:#aecbb00c}
.wisdom-detail .wisdom-caution strong{color:var(--sage);display:block;font-size:.8rem;letter-spacing:.03em;margin-bottom:4px}
.wisdom-detail .wisdom-caution p{font-size:.87rem;margin:0}
.wisdom-quiz{background:#0e152375;border:1px solid #666376;border-radius:15px;padding:19px;margin:24px 0 18px}
.wisdom-quiz h4{margin:0 0 10px}
.wisdom-quiz .wisdom-question{font-weight:620;color:var(--ink)}
.wisdom-answers{display:grid;gap:9px;margin:15px 0}
.wisdom-answers button{background:#252335;color:#f1e4de;text-align:left;padding:11px 14px;border:1px solid #796979;border-radius:10px;font-size:.91rem}
.wisdom-answers button[aria-pressed="true"]{border-color:var(--gold);background:#55404a}
.wisdom-feedback{border-left:3px solid var(--sage);padding:9px 13px;background:#aecbb01a;color:#ebede1;font-size:.86rem}
.wisdom-reflection{margin:20px 0 8px}
.wisdom-reflection label{display:block;margin-bottom:8px;font-size:.89rem;color:var(--gold)}
.wisdom-reflection p{font-size:.8rem;color:var(--muted)}
.wisdom-reflection textarea{width:100%;min-height:92px;resize:vertical;color:var(--ink);background:#151724;border:1px solid #736775;border-radius:11px;padding:12px}
.wisdom-sources{display:flex;gap:8px 16px;flex-wrap:wrap;font-size:.79rem;margin-top:17px}
.wisdom-sources a{color:var(--gold);text-underline-offset:3px}
.wisdom-context{margin:22px 0 15px;max-width:770px}
.wisdom-context button{border:1px solid #ad8f7f;background:#4e364329;border-radius:50px;color:var(--gold);padding:9px 15px;font-size:.82rem}
.wisdom-context button:hover{background:#67465655}
.wisdom-rail{display:flex;flex-direction:column;align-items:start;gap:10px}
.wisdom-rail button{color:var(--gold);border:1px solid #a28b7b;background:transparent;padding:8px 12px;border-radius:30px;font-size:.8rem}
.wisdom-rail p{font-size:.8rem;color:var(--muted);margin:0}
@media(max-width:540px){.wisdom-panel{padding:14px}.wisdom-top h2{font-size:1.8rem}.wisdom-tabs{gap:6px}.wisdom-tabs button{font-size:.74rem;padding:7px 9px}.wisdom-toggle{padding:12px}.wisdom-toggle-end{font-size:.69rem!important}}
@media print{.wisdom-launch,.wisdom-panel,.wisdom-context{display:none!important}}
`;
 replace("</style>",css+"</style>");
 replace('<section class="rail-card"><h2>Footsteps</h2>',
 '<section class="rail-card wisdom-rail"><h2>Hecate’s Book</h2><p id="wisdom-rail-progress">0 of 9 practices explored</p><button id="wisdom-sidebar" type="button">Open the Book of Wisdom</button></section><section class="rail-card"><h2>Footsteps</h2>');
 const ui=String.raw`<div class="wisdom-launch"><button class="wisdom-toggle" id="wisdom-toggle" type="button" aria-expanded="false" aria-controls="wisdom-panel"><span class="wisdom-sigil" aria-hidden="true">✧</span><span><strong>Hecate’s Book of Wisdom</strong><small>Myth · Jung · philosophy · evidence-informed exercises</small></span><span class="wisdom-toggle-end" id="wisdom-count">0 / 9 studied</span></button></div>
<section class="wisdom-panel" id="wisdom-panel" role="region" aria-labelledby="wisdom-heading" hidden><div class="wisdom-top"><div><h2 id="wisdom-heading" tabindex="-1">Hecate’s Book of Wisdom</h2><p>An optional learning companion to the fictional story. Ideas are labeled by their sources and limits. It does not evaluate Dawn, Eric, or anyone else.</p></div><button id="wisdom-close" class="wisdom-close" type="button">Close</button></div><nav class="wisdom-tabs" id="wisdom-tabs" aria-label="Choose a philosophical lesson"></nav><article id="wisdom-detail" class="wisdom-detail" aria-live="polite"></article></section>`;
 replace('<details id="path-atlas" class="path-atlas">',ui+'<details id="path-atlas" class="path-atlas">');
 replace("letter:'',reading:false}}","letter:'',reading:false,wisdom:{selected:'myth',open:false,answers:{},completed:{},reflections:{}}}}");
 replace("if(typeof state.reading!=='boolean')state.reading=false;","if(typeof state.reading!=='boolean')state.reading=false;if(!state.wisdom||typeof state.wisdom!=='object')state.wisdom={selected:'myth',open:false,answers:{},completed:{},reflections:{}};if(!state.wisdom.answers||typeof state.wisdom.answers!=='object')state.wisdom.answers={};if(!state.wisdom.completed||typeof state.wisdom.completed!=='object')state.wisdom.completed={};if(!state.wisdom.reflections||typeof state.wisdom.reflections!=='object')state.wisdom.reflections={};if(typeof state.wisdom.open!=='boolean')state.wisdom.open=false;if(typeof state.wisdom.selected!=='string')state.wisdom.selected='myth';");
 const data="var wisdomLessons="+JSON.stringify(lessons)+";\n";
 const map=String.raw`var wisdomSceneMap={prologue:'myth',mirror:'mindreading',hall:'evidence',garden:'persona',visitor:'repair',crossroads:'myth',oracle:'mindreading',banquet:'persona',silence:'autonomy',fortune:'autonomy',hearth:'compassion',sunshower:'compassion',ericMirror:'mindreading',ericTable:'repair',bridge:'evidence',ericBridge:'repair',letter:'repair',descent:'shadow',morning:'compassion',return:'individuation',ending:'individuation'};
`;
 replace("var scenes={",data+map+"var scenes={");
 const helpers=String.raw`
function wisdomById(id){return wisdomLessons.find(function(x){return x.id===id})||wisdomLessons[0]}
function wisdomProgress(){return wisdomLessons.filter(function(l){return state.wisdom.completed[l.id]===true}).length}
function drawWisdom(){
var w=state.wisdom,total=wisdomLessons.length,count=wisdomProgress(),panel=document.getElementById('wisdom-panel');
document.getElementById('wisdom-count').textContent=count+' / '+total+' studied';
document.getElementById('wisdom-rail-progress').textContent=count+' of '+total+' optional practices explored';
document.getElementById('wisdom-toggle').setAttribute('aria-expanded',String(!!w.open));
panel.hidden=!w.open;
if(!w.open)return;
var lesson=wisdomById(w.selected);w.selected=lesson.id;
document.getElementById('wisdom-tabs').innerHTML=wisdomLessons.map(function(l,i){var done=w.completed[l.id]===true;return '<button type="button" data-wisdom-lesson="'+esc(l.id)+'" aria-pressed="'+(l.id===w.selected)+'">'+(i+1)+'. '+esc(l.title)+(done?' <span class="wisdom-done" aria-label="Practiced">✓</span>':'')+'</button>'}).join('');
var chosen=w.answers[lesson.id],valid=Number.isInteger(chosen)&&chosen>=0&&chosen<lesson.quiz.choices.length;
var answers=lesson.quiz.choices.map(function(answer,i){return '<button type="button" data-wisdom-answer="'+i+'" aria-pressed="'+(valid&&chosen===i)+'">'+esc(answer)+'</button>'}).join('');
var feedback=valid?'<p class="wisdom-feedback" role="status">'+esc(chosen===lesson.quiz.correct?lesson.quiz.correctFeedback:lesson.quiz.incorrectFeedback)+'</p>':'<p class="note">Choose an answer to explore the explanation. No grade or diagnosis.</p>';
var sources=lesson.sources.map(function(s){return '<a target="_blank" rel="noopener noreferrer" href="'+esc(s.url)+'">'+esc(s.label)+'</a>'}).join('');
document.getElementById('wisdom-detail').innerHTML='<div class="wisdom-label">'+esc(lesson.category)+'</div><h3>'+esc(lesson.title)+'</h3><h4>The idea</h4><p>'+esc(lesson.concept)+'</p><h4>In this story</h4><p>'+esc(lesson.story)+'</p><h4>In ordinary life</h4><p>'+esc(lesson.daily)+'</p><div class="wisdom-caution"><strong>Where the idea stops</strong><p>'+esc(lesson.nuance)+'</p></div><section class="wisdom-quiz" aria-label="Practice exercise"><h4>Try the distinction</h4><p class="wisdom-question">'+esc(lesson.quiz.prompt)+'</p><div class="wisdom-answers" role="group" aria-label="Answer choices">'+answers+'</div>'+feedback+'</section><div class="wisdom-reflection"><label for="wisdom-reflection">Your optional reflection: '+esc(lesson.reflection)+'</label><textarea id="wisdom-reflection" maxlength="1500" placeholder="A private note for yourself...">'+esc(w.reflections[lesson.id]||'')+'</textarea><p>Saved only on this device, like the story journal. Erase my path clears it.</p></div><h4>Read the sources</h4><div class="wisdom-sources">'+sources+'</div>';
}
function openWisdom(id){
var w=state.wisdom;
if(id&&wisdomLessons.some(function(l){return l.id===id}))w.selected=id;
w.open=true;save();drawWisdom();
var heading=document.getElementById('wisdom-heading');heading.focus({preventScroll:true});
var panel=document.getElementById('wisdom-panel');if(panel.scrollIntoView)panel.scrollIntoView({behavior:'smooth',block:'start'});
}
function closeWisdom(){state.wisdom.open=false;save();drawWisdom();document.getElementById('wisdom-toggle').focus()}
function answerWisdom(i){
var l=wisdomById(state.wisdom.selected);
if(!Number.isInteger(i)||i<0||i>=l.quiz.choices.length)return;
state.wisdom.answers[l.id]=i;if(i===l.quiz.correct)state.wisdom.completed[l.id]=true;
save();drawWisdom();
}
`;
 replace("function draw(){drawRail();",helpers+"function draw(){drawRail();");
 replace("function drawRail(){var part=currentPart();","function drawRail(){drawWisdom();var part=currentPart();");
 replace("if(lenses[state.current]){var ll=lenses[state.current];",
 "var bookId=wisdomSceneMap[state.current];if(bookId){var bookLesson=wisdomById(bookId);body+='<div class=\"wisdom-context\"><button type=\"button\" data-wisdom-scene=\"'+esc(bookId)+'\">✧ Explore the lesson: '+esc(bookLesson.title)+'</button></div>'}if(lenses[state.current]){var ll=lenses[state.current];");
 replace("if(state.notes)out.push('','My private journal',state.notes);",
 "if(state.notes)out.push('','My private journal',state.notes);if(state.wisdom){out.push('','Hecate’s Book of Wisdom','Practices explored: '+wisdomProgress()+' / '+wisdomLessons.length);wisdomLessons.forEach(function(l){if(state.wisdom.completed[l.id])out.push('Studied: '+l.title);if(state.wisdom.reflections[l.id])out.push('','Reflection: '+l.title,state.wisdom.reflections[l.id])})}");
 replace("oldLetter=state.letter,reading=state.reading;state=initial();",
 "oldLetter=state.letter,reading=state.reading,oldWisdom=state.wisdom;state=initial();");
 replace("state.letter=erase?'':oldLetter;state.reading=reading;draw();focusTitle()}",
 "state.letter=erase?'':oldLetter;state.reading=reading;if(!erase&&oldWisdom){state.wisdom=oldWisdom;state.wisdom.open=false}draw();focusTitle()}");
 replace("Erase your story path, fortune, letter, lantern reflections and private journal on this device?",
 "Erase your story path, learning reflections, fortune, letter, lantern reflections and private journal on this device?");
 replace("document.addEventListener('click',function(e){var el=e.target.closest('[data-choice],[data-action],[data-lens],[data-rewind],#reading-toggle,#reading-toggle-mobile,#save-keepsake,#back,#restart,#erase');if(!el)return;",
 "document.addEventListener('click',function(e){var el=e.target.closest('[data-choice],[data-action],[data-lens],[data-rewind],[data-wisdom-lesson],[data-wisdom-answer],[data-wisdom-scene],#wisdom-toggle,#wisdom-sidebar,#wisdom-close,#reading-toggle,#reading-toggle-mobile,#save-keepsake,#back,#restart,#erase');if(!el)return;if(el.id==='wisdom-toggle'||el.id==='wisdom-sidebar'){if(state.wisdom.open)closeWisdom();else openWisdom(wisdomSceneMap[state.current]||state.wisdom.selected);return}if(el.id==='wisdom-close'){closeWisdom();return}if(el.hasAttribute('data-wisdom-scene')){openWisdom(el.getAttribute('data-wisdom-scene'));return}if(el.hasAttribute('data-wisdom-lesson')){openWisdom(el.getAttribute('data-wisdom-lesson'));return}if(el.hasAttribute('data-wisdom-answer')){answerWisdom(Number(el.getAttribute('data-wisdom-answer')));return}");
 replace("document.getElementById('journal-text').addEventListener('input',function(e){state.notes=e.target.value;save()});",
 "document.getElementById('wisdom-panel').addEventListener('input',function(e){if(e.target.id==='wisdom-reflection'){var l=wisdomById(state.wisdom.selected);state.wisdom.reflections[l.id]=e.target.value;save()}});document.getElementById('journal-text').addEventListener('input',function(e){state.notes=e.target.value;save()});");
 return html
};
const root=__dirname,workerPath=path.join(root,'worker.js');
const lessons=JSON.parse(fs.readFileSync(path.join(root,'wisdom-lessons.json'),'utf8'));
if(lessons.length!==9||new Set(lessons.map(x=>x.id)).size!==9)throw Error('Expected nine distinct lessons');
lessons.forEach(l=>{if(l.quiz.choices.length!==3||l.quiz.correct<0||l.quiz.correct>2||!l.sources.every(s=>/^https:\/\//.test(s.url)))throw Error('Invalid lesson '+l.id)});
let s=fs.readFileSync(workerPath,'utf8'),sep=";\naddEventListener('fetch'",at=s.indexOf(sep);
if(at<0||!s.startsWith('const HTML='))throw Error('Worker source format changed');
let h=JSON.parse(s.slice(11,at));
h=installWisdom(h,lessons);
if(!h.includes('Hecate’s Book of Wisdom')||!h.includes('id="wisdom-panel"')||!h.includes('data-wisdom-answer'))throw Error('Book missing');
if((h.match(/kicker:'/g)||[]).length!==25||(h.match(/next:'/g)||[]).length!==60)throw Error('Story routes changed');
const updated='const HTML='+JSON.stringify(h)+s.slice(at);
fs.writeFileSync(workerPath,updated);
console.log(JSON.stringify({success:true,lessons:lessons.length,sourceLinks:lessons.reduce((n,x)=>n+x.sources.length,0),scenes:20,choices:60,bytes:updated.length}));
