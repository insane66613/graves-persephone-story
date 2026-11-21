// SanityCloud GA4 initialization bridge. Does not read visitor data.
// Introduces one missing gtag('config') event per HTML response; Cloudflare Google Tag Gateway supplies the tag loader.
const ID='G-Z569M020PS';
const INIT="window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','G-Z569M020PS');";
const INIT_TAG='<script data-ga4-config-init="G-Z569M020PS">'+INIT+'</script>';
const PREVIEW_PREFIX='/__ga4-preview/';
function rewriteHtml(html){
 if(html.includes('data-ga4-config-init')||/gtag\s*\(\s*['"]config['"]\s*,\s*['"]G-Z569M020PS['"]/.test(html))return {html,changed:false};
 if(!/<\/head\s*>/i.test(html))return {html,changed:false};
 return {html:html.replace(/<\/head\s*>/i,INIT_TAG+'</head>'),changed:true};
}
async function handle(request){
  if(request.method!=='GET')return fetch(request);
  const url=new URL(request.url);
  let upstream=request;
  if(url.pathname.startsWith(PREVIEW_PREFIX)){
    const target=new URL(request.url);
    target.pathname='/'+url.pathname.slice(PREVIEW_PREFIX.length);
    target.search='';
    upstream=new Request(target.toString(),request);
  }
  const response=await fetch(upstream);
  const type=(response.headers.get('content-type')||'').toLowerCase();
  if(response.status!==200||!type.startsWith('text/html'))return response;
  const html=await response.text();
  const {html:newHtml,changed}=rewriteHtml(html);
  if(!changed)return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
  const headers=new Headers(response.headers);
  headers.delete('content-length');headers.delete('etag');headers.delete('content-encoding');
  headers.set('x-ga4-init','v1');
  return new Response(newHtml,{status:response.status,statusText:response.statusText,headers});
}
addEventListener('fetch',event=>event.respondWith(handle(event.request)));
