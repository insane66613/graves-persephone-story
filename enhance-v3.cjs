const fs=require('node:fs');const path=require('node:path');
const enhance=(function enhance(source){
  const head='const HTML=', split=";\naddEventListener('fetch'";
  const at=source.indexOf(split);
  if(!source.startsWith(head)||at<0)throw Error('Unexpected worker structure');
  let html=JSON.parse(source.slice(head.length,at));
  if(html.includes('The Bridge of Two Truths'))return source;
  const change=(from,to)=>{
    if(!html.includes(from))throw Error('Patch anchor absent: '+from.slice(0,90));
    html=html.replace(from,to);
  };
  change('</style>',String.raw`
/* v3: private-on-device lantern worksheet and returning story memory */
.lantern-sheet{margin:26px 0 12px;border:1px solid #dbc08a80;border-radius:18px;padding:22px;background:linear-gradient(120deg,#382d3e95,#222634bb);max-width:780px}
.lantern-sheet h3{font:400 1.38rem var(--serif);color:var(--gold);margin:0 0 8px}
.lantern-sheet p{font-size:.87rem;color:#c4b9bd;margin:0 0 14px}
.lantern-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.lantern-grid label{font-size:.81rem;color:#eee0d7;display:block;margin-bottom:8px}
.lantern-grid textarea{width:100%;height:91px;resize:vertical;background:#11131e;border:1px solid #6b606f;color:#fff4e4;border-radius:10px;padding:12px;font-size:.9rem}
.lantern-note{font-size:.77rem!important;margin:13px 0 0!important;color:#b5a7b2!important}
.memory-ribbon{margin:23px 0 8px;max-width:720px;font-size:.83rem;color:#d9bd9d;border-left:2px solid #c9a77e94;padding:9px 14px;background:#d9b48b0b}
.keepsake{margin:20px 0 26px;background:#cfbc9f11;border:1px solid #d5b58773;border-radius:15px;padding:21px;max-width:720px}
.keepsake h2{font:400 1.4rem var(--serif);color:#ead4ab;margin:0 0 12px}
.keepsake dt{font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:#cbbbaa;margin-top:15px}
.keepsake dd{margin:5px 0 0;color:#f1e8e4;white-space:pre-wrap;overflow-wrap:anywhere;font:italic 1.02rem/1.55 var(--serif)}
.keepsake small{display:block;margin-top:16px;color:#b6aeb4}
@media(max-width:650px){.lantern-grid{grid-template-columns:1fr}.lantern-sheet{padding:16px}}
@media(print){.topbar,.rail,.journal,.bottom-actions,.foot,.choices,.primary{display:none!important}.layout{display:block}.main{max-width:750px}.scene-art img{max-height:260px}body{background:white;color:#24222b}.prose,.lede,.keepsake dd{color:#24222b}}
</style>`);
  for (const [name,following] of [['fortune','hearth'],['hearth','sunshower'],['sunshower','descent']]){
    const a=html.indexOf(name+':{part:4,');
    const b=html.indexOf('\n'+following+':{part:',a);
    if(a<0||b<0)throw Error('Cannot find '+name+' scene boundary');
    const block=html.slice(a,b);
    if((block.match(/next:'descent'/g)||[]).length!==3)throw Error('Expected 3 branches from '+name);
    html=html.slice(0,a)+block.replaceAll("next:'descent'","next:'bridge'")+html.slice(b);
  }
  const bridge=String.raw`
bridge:{part:5,kicker:'V · THE BRIDGE',title:'The Bridge of Two Truths',lead:'A feeling could be true without its explanation being certain. Two truths might fit on the same bridge.',paragraphs:['The bridge crossed a deep valley filled with voices. On one side, a stranger said something painful. On the other, the queen could already hear the explanation she had imagined: what they must think, what they would do next, what this would prove about her.','Hecate set down her torches. “You may say that a word hurt you,” she said. “You may notice a pattern, set a boundary, and choose your next step. But you need not pretend to live inside the other person’s mind.”','A second lantern lit up. The queen saw that she could own her choices without owning another person’s judgments. She could also be loving without becoming responsible for solving every struggle placed before her.'],question:'How will the queen cross?',choices:[
{title:'Hold what is known, and leave room for what is not',sub:'Acknowledge the experience without inventing the motive.',next:'descent',delta:{sight:2,mercy:1},response:'The bridge holds. She knows what happened. She need not know everything it meant before choosing her response.'},
{title:'Protect my boundaries without winning their approval',sub:'Let another person disagree and still retain your freedom.',next:'descent',delta:{freedom:2,mercy:1},response:'A voice calls after her. She does not need to defeat it or obey it. The stones remain solid underfoot.'},
{title:'Decide the verdict before hearing the answer',sub:'Make the familiar fear sound like a certainty.',next:'descent',delta:{echo:2},response:'The echo travels farther than the voice that started it. Hecate does not argue with the sound. She simply keeps the light on.'}
]},
`;
  change('descent:{part:5,',bridge+'descent:{part:6,');
  change('return:{part:6,','return:{part:7,');
  change("var labels=['The threshold','First reflection','The crossroads','The invitation','The unwritten page','The shadow','The return','Your ending'];",
    "var labels=['The threshold','First reflection','The crossroads','The invitation','The unwritten page','The bridge of two truths','The shadow','The return','Your ending'];");
  change("function currentPart(){return state.current==='ending'?7:scenes[state.current].part}",
    "function currentPart(){return state.current==='ending'?8:scenes[state.current].part}");
  change("Math.min(part+1,8)).padStart(2,'0')+' / 08",
    "Math.min(part+1,9)).padStart(2,'0')+' / 09");
  change("return {v:VERSION,current:'prologue',scores:{sight:0,freedom:0,mercy:0,echo:0},history:[],feedback:null,notes:'',fortune:''}",
    "return {v:VERSION,current:'prologue',scores:{sight:0,freedom:0,mercy:0,echo:0},history:[],feedback:null,notes:'',fortune:'',lantern:{known:'',unknown:''}}");
  change("if(!state||!state.scores||!Array.isArray(state.history)){state=initial()}",
    "if(!state||!state.scores||!Array.isArray(state.history)){state=initial()}if(!state.lantern||typeof state.lantern!=='object')state.lantern={known:'',unknown:''};");
  change("sunshower:'return',descent:'shadow'",
    "sunshower:'return',bridge:'crossroads',descent:'shadow'");
  change("var body='<figure class=\"scene-art\">",
    "var body='<figure class=\"scene-art\">"); // validated non-mutating anchor
  // Returning memory, described as a decision and not a diagnosis.
  change("sc.paragraphs.map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'</div>';",
    "sc.paragraphs.map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'</div>';if(state.history.length>0&&!done){var prev=state.history[state.history.length-1];body+='<div class=\"memory-ribbon\">✧ The path remembers: earlier you chose “'+esc(prev.title)+'”. A choice is a moment, not a verdict about who you are.</div>'}");
  change("if(done){if(state.fortune)body+='<div class=\"fortune-echo\"><strong>Your self-written fortune</strong>'+esc(state.fortune)+'</div>';body+='<blockquote class=\"ending-quote\">'",
    "if(done){if(state.fortune)body+='<div class=\"fortune-echo\"><strong>Your self-written fortune</strong>'+esc(state.fortune)+'</div>';if(state.lantern.known||state.lantern.unknown){body+='<section class=\"keepsake\"><h2>The torch you carried</h2><dl>'+(state.lantern.known?'<dt>What I could observe</dt><dd>'+esc(state.lantern.known)+'</dd>':'')+(state.lantern.unknown?'<dt>What remained uncertain</dt><dd>'+esc(state.lantern.unknown)+'</dd>':'')+'</dl><small>Your own words remain on this device. This story is not an assessment of you.</small></section>'}body+='<blockquote class=\"ending-quote\">'");
  change("else{if(state.current==='fortune')body+='<div class=\"fortune-box\">",
    "else{if(state.current==='bridge'){body+='<section class=\"lantern-sheet\"><h3>Hecate’s two lanterns</h3><p>These reflections are optional. You can leave either blank.</p><div class=\"lantern-grid\"><div><label for=\"lantern-known\">What did I actually see or hear?</label><textarea id=\"lantern-known\" maxlength=\"300\" placeholder=\"Only what I could observe...\">'+esc(state.lantern.known||'')+'</textarea></div><div><label for=\"lantern-unknown\">What am I imagining or unsure about?</label><textarea id=\"lantern-unknown\" maxlength=\"300\" placeholder=\"A possibility, not a fact...\">'+esc(state.lantern.unknown||'')+'</textarea></div></div><p class=\"lantern-note\">You can hold feelings, boundaries and uncertainty at the same time. Nothing is sent to a server.</p></section>'}if(state.current==='fortune')body+='<div class=\"fortune-box\">");
  change("if(e.target.id==='fortune-line'){state.fortune=e.target.value;save()}});",
    "if(e.target.id==='fortune-line'){state.fortune=e.target.value;save()}else if(e.target.id==='lantern-known'){state.lantern.known=e.target.value;save()}else if(e.target.id==='lantern-unknown'){state.lantern.unknown=e.target.value;save()}});");
  change("var notes=erase?'':state.notes,fortune=erase?'':state.fortune;state=initial();state.notes=notes;state.fortune=fortune;draw();focusTitle()}",
    "var notes=erase?'':state.notes,fortune=erase?'':state.fortune,lantern=erase?{known:'',unknown:''}:state.lantern;state=initial();state.notes=notes;state.fortune=fortune;state.lantern=lantern;draw();focusTitle()}");
  change("Erase your story path, fortune and private journal on this device?",
    "Erase your story path, fortune, lantern reflections and private journal on this device?");
  change("Progress, fortunes and reflections stay in this browser. No account, tracking, or server-side journal.",
    "Progress, fortunes and journal entries stay on this device. No login is required. This link is accessible to anyone who has it.");
  // Existing approved artist assets stay unchanged.
  const next=head+JSON.stringify(html)+source.slice(at);
  if((html.match(/kicker:'/g)||[]).length!==19)throw Error('Expected 14 scenes and 5 endings');
  if((html.match(/next:'/g)||[]).length!==42)throw Error('Expected 42 choice transitions');
  if(!html.includes('The Bridge of Two Truths')||!html.includes('lantern-known'))throw Error('Missing lantern features');
  return next;
});
const p=path.join(__dirname,'worker.js');const old=fs.readFileSync(p,'utf8');const fresh=enhance(old);if(fresh===old)throw Error('Already enhanced');fs.writeFileSync(p,fresh);console.log(JSON.stringify({oldBytes:old.length,newBytes:fresh.length,sceneCount:(fresh.match(/kicker:'/g)||[]).length,choiceCount:(fresh.match(/next:'/g)||[]).length}));
