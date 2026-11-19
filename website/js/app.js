(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const T={en:{skip:"Skip to main content",home:"Home",services:"Services",complaint:"Complaint",track:"Track",faq:"FAQ",arch:"Architecture",a11y:"Accessibility",
 hero_t:"Public services, simple and open to everyone",hero_p:"Find services, submit complaints, and track their progress from any device.",search:"Search services",search_ph:"e.g. ID card, tax, permit",find:"Search",
 pop:"Popular services",news:"Latest news",how:"How it works",all:"All",none:"No services match your search.",req:"Requirements",time:"Estimated time",
 f_cat:"Category",f_title:"Title",f_body:"Description",send:"Submit complaint",lookup:"Check status",code:"Ticket code",
 font_inc:"A+",font_dec:"A-",theme:"Theme",lang:"Bahasa Indonesia",ok:"Complaint received. Your ticket code is",not_found:"Ticket not found. Check the code and try again."}};
const dict=()=>T[document.documentElement.lang]||null;
function applyLang(l){document.documentElement.lang=l;store.set("lang",l);
 $$("[data-i]").forEach(e=>{if(!e.dataset.id)e.dataset.id=e.textContent;e.textContent=l==="en"&&T.en[e.dataset.i]?T.en[e.dataset.i]:e.dataset.id});
 $$("[data-ph]").forEach(e=>{if(!e.dataset.idph)e.dataset.idph=e.placeholder;e.placeholder=l==="en"&&T.en[e.dataset.ph]?T.en[e.dataset.ph]:e.dataset.idph});
 const b=$("#btn-lang");if(b)b.textContent=l==="en"?"Bahasa Indonesia":"English";
 document.dispatchEvent(new CustomEvent("langchange"));}
const t=(k,fb)=>(dict()&&dict()[k])||fb;
function toast(m){const e=$("#toast");if(!e)return;e.textContent=m;e.style.display="block";clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.display="none",3500)}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
// theme, font
function applyTheme(m){if(m==="light")document.documentElement.removeAttribute("data-theme");else document.documentElement.setAttribute("data-theme",m);store.set("theme",m);
 $$("[data-theme-btn]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.themeBtn===m))}
let fs=+(store.get("fs")||0);function applyFs(){document.documentElement.dataset.fs=fs;store.set("fs",fs)}
document.addEventListener("DOMContentLoaded",()=>{
 applyTheme(store.get("theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));applyFs();
 $$("[data-theme-btn]").forEach(b=>b.addEventListener("click",()=>applyTheme(b.dataset.themeBtn)));
 $("#fs-inc")?.addEventListener("click",()=>{fs=Math.min(3,fs+1);applyFs();toast("Font "+(100+fs*12.5)+"%")});
 $("#fs-dec")?.addEventListener("click",()=>{fs=Math.max(0,fs-1);applyFs();toast("Font "+(100+fs*12.5)+"%")});
 $("#btn-lang")?.addEventListener("click",()=>applyLang(document.documentElement.lang==="en"?"id":"en"));
 if(store.get("lang")==="en")applyLang("en");
 const here=location.pathname.split("/").pop()||"index.html";$$("nav a").forEach(a=>{if(a.getAttribute("href")===here)a.setAttribute("aria-current","page")});
 initServices();initHome();initForm();initTrack();
 if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
});
function cardHtml(l){const en=document.documentElement.lang==="en";
 return `<article class="card"><span class="tag">${esc(Svc.KAT[l.kat][en?1:0])}</span><h3>${esc(en?l.nama_en:l.nama)}</h3><p>${esc(en?l.ds_en:l.ds)}</p>
 <details><summary>${t("req","Persyaratan")} &amp; ${t("time","Estimasi")}</summary><ul>${l.sy.map(s=>`<li>${esc(s)}</li>`).join("")}</ul><p><strong>${t("time","Estimasi waktu")}:</strong> ${esc(l.wkt)}</p></details></article>`}
async function initServices(){const box=$("#list-layanan");if(!box)return;
 const q=$("#q"),f=$("#filters"),live=$("#live");let kat=new URLSearchParams(location.search).get("kat")||"";if(q)q.value=new URLSearchParams(location.search).get("q")||"";
 f.innerHTML=`<button type="button" class="btn alt" data-k="" aria-pressed="${!kat}">${t("all","Semua")}</button>`+Object.entries(Svc.KAT).map(([k,v])=>`<button type="button" class="btn alt" data-k="${k}" aria-pressed="${kat===k}">${v[document.documentElement.lang==="en"?1:0]}</button>`).join("");
 async function render(){const r=await Svc.getLayanan({q:q.value,kat});box.innerHTML=r.length?r.map(cardHtml).join(""):`<p>${t("none","Tidak ada layanan yang cocok.")}</p>`;
  live.textContent=r.length+" "+(document.documentElement.lang==="en"?"services found":"layanan ditemukan");
  $$("button",f).forEach(b=>b.setAttribute("aria-pressed",b.dataset.k===kat))}
 f.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;kat=b.dataset.k;render()});
 q.addEventListener("input",()=>{clearTimeout(initServices.h);initServices.h=setTimeout(render,200)});
 document.addEventListener("langchange",()=>{f.innerHTML=f.innerHTML;render()});render();}
async function initHome(){const pop=$("#popular");if(!pop)return;
 const r=await Svc.getLayanan();const draw=()=>{pop.innerHTML=r.slice(0,6).map(cardHtml).join("")};draw();document.addEventListener("langchange",draw);
 const n=$("#news");if(n){const b=await Svc.getBerita();n.innerHTML=b.map(x=>`<article class="card"><time datetime="${x.d}">${x.d}</time><h3>${esc(x.t)}</h3><p>${esc(x.r)}</p></article>`).join("")}}
function setErr(el,msg){const e=$("#"+el.id+"-err");el.setAttribute("aria-invalid",msg?"true":"false");if(e)e.textContent=msg||"";return!msg}
function initForm(){const form=$("#form-pengaduan");if(!form)return;
 const rules={kat:v=>v?"":"Pilih kategori pengaduan.",judul:v=>v.trim().length>=5?"":"Judul minimal 5 karakter, misalnya: Lampu jalan mati.",isi:v=>v.trim().length>=20?"":"Jelaskan masalah minimal 20 karakter: apa, di mana, dan kapan kejadiannya.",email:v=>!v||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?"":"Format email tidak valid, contoh: nama@email.com."};
 Object.keys(rules).forEach(id=>{const el=$("#"+id);el.addEventListener("blur",()=>setErr(el,rules[id](el.value)))});
 form.addEventListener("submit",async e=>{e.preventDefault();let first=null;
  Object.keys(rules).forEach(id=>{const el=$("#"+id);if(!setErr(el,rules[id](el.value))&&!first)first=el});
  if(first){first.focus();return}
  const btn=$("button[type=submit]",form);btn.disabled=true;btn.textContent="Mengirim...";
  try{const r=await Svc.kirimPengaduan({kategori:$("#kat").value,judul:$("#judul").value,isi:$("#isi").value});
   const out=$("#hasil");out.hidden=false;out.innerHTML=`<p><strong>${t("ok","Pengaduan diterima. Kode tiket Anda:")}</strong> <code>${r.kode}</code></p><p>Simpan kode ini untuk melacak status di halaman <a href="lacak.html?kode=${r.kode}">Lacak</a>.</p>`;
   out.setAttribute("tabindex","-1");out.focus();form.reset();}
  catch(err){toast("Gagal menyimpan. Periksa pengaturan penyimpanan browser.")}
  finally{btn.disabled=false;btn.textContent=t("send","Kirim pengaduan")}});}
function initTrack(){const form=$("#form-lacak");if(!form)return;const out=$("#hasil-lacak");
 async function go(kode){const r=await Svc.lacak(kode);out.hidden=false;
  if(!r){out.innerHTML=`<p class="err" role="alert">${t("not_found","Tiket tidak ditemukan. Periksa kode lalu coba lagi.")}</p>`;return}
  out.innerHTML=`<h2>${esc(r.kode)}</h2><p><strong>${esc(r.judul)}</strong> (${esc(r.kategori)}) - ${esc(r.tgl)}</p><ol class="timeline">${Svc.TAHAP.map((s,i)=>`<li class="${i<r.status?"done":i===r.status?"now":""}"${i===r.status?' aria-current="step"':""}>${s}${i<r.status?" (selesai)":i===r.status?" (tahap saat ini)":""}</li>`).join("")}</ol>`}
 form.addEventListener("submit",e=>{e.preventDefault();go($("#kode").value)});
 const k=new URLSearchParams(location.search).get("kode");if(k){$("#kode").value=k;go(k)}}
})();
