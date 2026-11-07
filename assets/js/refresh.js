/* Rendering only. Update content.js for all routine content changes. */
(() => {
'use strict';
const data=window.SITE_CONTENT;if(!data)return;
const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value)n.textContent=value;return n;};
function link(label,url){const n=el(url?'a':'span','',label);if(url)n.href=url;return n;}
function image(src,alt,cls){const n=el('img',cls);n.src=src;n.alt=alt;n.loading='lazy';n.addEventListener('error',()=>{n.hidden=true;});return n;}
function newsCard(item){const card=el('article','news-card');if(item.image)card.append(image(item.image,'','news-image'));const body=el('div','news-copy');body.append(el('p','eyebrow',[item.category,item.date].filter(Boolean).join(' · ')));const h=el('h3');h.append(link(item.title,item.url));body.append(h);if(item.description)body.append(el('p','',item.description));if(item.url)body.append(link('Read more →',item.url));card.append(body);return card;}
const host=document.querySelector('[data-news]');
if(host&&data.news.length){
 const slides=el('div','news-slides'),controls=el('div','news-controls'),dots=el('div','news-dots');
 host.setAttribute('role','region');host.setAttribute('aria-roledescription','carousel');host.setAttribute('aria-label','Latest updates');
 let current=0,timer=null,paused=true;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const featured=data.news.slice(0,data.settings?.newsSlideLimit ?? 10);const cards=featured.map((item,i)=>{const c=newsCard(item);c.hidden=i!==0;c.setAttribute('role','group');c.setAttribute('aria-label',`${i+1} of ${featured.length}`);slides.append(c);return c;});
 const status=el('span','news-status');status.setAttribute('aria-live','polite');
 const buttons=featured.map((item,i)=>{const b=el('button','news-dot');b.type='button';b.setAttribute('aria-label',`Show update ${i+1}: ${item.title}`);b.addEventListener('click',()=>{stop();show(i);});dots.append(b);return b;});
 function show(i){current=(i+cards.length)%cards.length;cards.forEach((c,j)=>c.hidden=j!==current);buttons.forEach((b,j)=>b.setAttribute('aria-current',j===current?'true':'false'));status.textContent=`${current+1} / ${cards.length}`;}
 const prev=el('button','news-arrow','←'),next=el('button','news-arrow','→'),play=el('button','news-play','Play');
 [prev,next,play].forEach(b=>b.type='button');prev.setAttribute('aria-label','Previous update');next.setAttribute('aria-label','Next update');
 function stop(){clearInterval(timer);timer=null;paused=true;play.textContent='Play';play.setAttribute('aria-label','Play updates slideshow');}
 prev.onclick=()=>{stop();show(current-1);};next.onclick=()=>{stop();show(current+1);};
 play.onclick=()=>{if(!paused){stop();return;}paused=false;play.textContent='Pause';play.setAttribute('aria-label','Pause updates slideshow');timer=setInterval(()=>show(current+1),6500);};
 host.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();prev.click();}if(e.key==='ArrowRight'){e.preventDefault();next.click();}});
 host.addEventListener('mouseenter',stop);host.addEventListener('focusin',e=>{if(e.target!==play)stop();});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 controls.append(prev,dots,next,status,play);host.append(slides,controls);show(0);if(cards.length<2)controls.hidden=true; // Manual by default, including reduced-motion preference.
}
const archive=document.querySelector('[data-news-archive]');if(archive)data.news.forEach(item=>archive.append(newsCard(item)));
const collaborators=document.querySelector('[data-collaborators]');if(collaborators)data.collaborators.forEach(item=>{const c=el('article','collaborator');c.append(image(item.logo,item.name+' logo','collaborator-logo'));c.append(link(item.name,item.url));collaborators.append(c);});
function projectCard(item){
 const c=el('article','project-card');
 if(item.image||item.imagePlaceholder){const media=el(item.url?'a':'div','project-media');if(item.url){media.href=item.url;media.setAttribute('aria-label','View '+item.title);}if(item.image)media.append(image(item.image,item.imageAlt||item.title+(item.screenshot?' screenshot':''),item.screenshot?'project-image project-screenshot':'project-image'));else media.append(el('div','screenshot-placeholder','Screenshot to be added'));c.append(media);}
 const body=el('div','project-copy'),h=el('h3');if(item.status)body.append(el('p','eyebrow',item.status));h.append(link(item.title,item.url));body.append(h,el('p','',item.summary));if(item.url)body.append(link((item.linkLabel||'Explore project')+' →',item.url));c.append(body);return c;
}
const projects=document.querySelector('[data-projects]');if(projects)data.projects.forEach(item=>projects.append(projectCard(item)));
const innovations=document.querySelector('[data-innovations]');if(innovations)(data.innovations||[]).forEach(url=>{const item=data.projects.find(p=>p.url===url);if(item)innovations.append(projectCard(item));});
const story=document.querySelector('[data-research-story]');if(story)(data.researchStory||[]).forEach(p=>story.append(el('p','',p)));
for(const [selector,key,cls] of [['[data-experience]','experience','experience-entry'],['[data-services]','services','service-card']]){const host=document.querySelector(selector);if(host)(data[key]||[]).forEach(item=>{const c=el('article',cls),h=el('h3');h.append(link(item.title,item.url));c.append(h,el('p','',item.summary));host.append(c);});}
const pub=document.querySelector('[data-publications-fallback]');
if(pub){
 const groups=['Journal articles & published work','Other publications','Conferences & presentations'];
 const categories=['All',...(data.publicationCategories||['Remote Sensing','Modelling','AI and ML','Climate Change','Natural Hazards'])];
 const panel=el('div','publication-controls'),filters=el('div','publication-filters');filters.setAttribute('role','group');filters.setAttribute('aria-label','Filter publications by category');
 const result=el('p','publication-results');result.setAttribute('aria-live','polite');const content=el('div','publication-content');
 let active='All';const buttons=[];
 function render(){
  content.replaceChildren();const selected=data.publications.filter(item=>active==='All'||(item.categories||[]).includes(active));
  result.textContent=`${selected.length} of ${data.publications.length} publications and presentations`+(active==='All'?'':` · ${active}`);
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===active)));
  groups.forEach(group=>{const entries=selected.filter(p=>p.group===group);if(!entries.length)return;content.append(el('h3','publication-group',group));const list=el('div','publication-list');
   entries.forEach(item=>{const card=el('article','publication-entry'),h=el('h4'),strong=el('strong');strong.append(link(`${item.number}. ${item.title||item.citation}`,item.url));h.append(strong);const tags=el('div','publication-tags');(item.categories||[]).forEach(c=>tags.append(el('span','publication-tag',c)));card.append(h,tags,el('p','citation',item.citation),el('p','publication-summary',item.summary));list.append(card);});content.append(list);});
  if(!selected.length)content.append(el('p','','No publications in this category yet.'));
 }
 categories.forEach(category=>{const b=el('button','publication-filter',category);b.type='button';b.onclick=()=>{active=category;render();};buttons.push(b);filters.append(b);});
 panel.append(el('p','filter-label','Filter by research topic'),filters,result);pub.replaceChildren(panel,content);render();
}

const funding=document.querySelector('[data-funding]');
if(funding){if(!(data.funding||[]).length){funding.append(el('div','funding-placeholder','Funding details will be added here.'));}else data.funding.forEach(item=>{const c=el('article','funding-entry'),h=el('h3');h.append(link(item.title,item.url));c.append(h);const meta=[item.sponsor,item.period,item.role].filter(Boolean).join(' · ');if(meta)c.append(el('p','funding-meta',meta));if(item.summary)c.append(el('p','',item.summary));funding.append(c);});}
const gallery=document.querySelector('[data-gallery]');
if(gallery&&(data.gallery||[]).length){
 const slides=el('div','gallery-slides'),controls=el('div','news-controls gallery-controls'),dots=el('div','news-dots gallery-dots'),status=el('span','news-status gallery-status');
 gallery.setAttribute('role','region');gallery.setAttribute('aria-roledescription','carousel');gallery.setAttribute('aria-label','Photo gallery');gallery.tabIndex=0;status.setAttribute('aria-live','polite');
 let current=0,timer=null;const cards=data.gallery.map((item,i)=>{const c=el('figure','gallery-slide');c.hidden=i!==0;c.setAttribute('role','group');c.setAttribute('aria-label',`Photo ${i+1} of ${data.gallery.length}`);const frame=el('div','gallery-frame');if(item.image){const img=image(item.image,item.caption||`Gallery photo ${i+1}`,'gallery-image');img.addEventListener('error',()=>frame.append(el('div','gallery-placeholder',`Photo ${i+1}`)));frame.append(img);}else frame.append(el('div','gallery-placeholder',`Photo ${i+1}`));c.append(frame,el('figcaption',item.caption?'':'caption-placeholder',item.caption||'Caption will appear here.'));slides.append(c);return c;});
 const prev=el('button','news-arrow','←'),next=el('button','news-arrow','→'),play=el('button','news-play','Play');[prev,next,play].forEach(b=>b.type='button');prev.setAttribute('aria-label','Previous photo');next.setAttribute('aria-label','Next photo');play.setAttribute('aria-label','Play photo gallery');
 const buttons=cards.map((c,i)=>{const b=el('button','news-dot');b.type='button';b.setAttribute('aria-label',`Show photo ${i+1}`);b.onclick=()=>{stop();show(i);};dots.append(b);return b;});
 function show(i){current=(i+cards.length)%cards.length;cards.forEach((c,j)=>c.hidden=j!==current);buttons.forEach((b,j)=>b.setAttribute('aria-current',String(j===current)));status.textContent=`${current+1} / ${cards.length}`;}
 function stop(){clearInterval(timer);timer=null;play.textContent='Play';play.setAttribute('aria-label','Play photo gallery');}
 prev.onclick=()=>{stop();show(current-1);};next.onclick=()=>{stop();show(current+1);};play.onclick=()=>{if(timer){stop();return;}timer=setInterval(()=>show(current+1),6500);play.textContent='Pause';play.setAttribute('aria-label','Pause photo gallery');};
 gallery.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();prev.click();}if(e.key==='ArrowRight'){e.preventDefault();next.click();}});gallery.addEventListener('mouseenter',stop);gallery.addEventListener('focusin',e=>{if(e.target!==play)stop();});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 controls.append(prev,dots,next,status,play);gallery.append(slides,controls);show(0);if(cards.length===1)controls.hidden=true;
}

if(location.hash){const target=document.getElementById(location.hash.slice(1))||document.querySelector('a[name="'+CSS.escape(location.hash.slice(1))+'"]');if(target)requestAnimationFrame(()=>target.scrollIntoView());}
})();
