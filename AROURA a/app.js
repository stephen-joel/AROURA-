const tracks=[
 {title:"Aurora Dawn",artist:"AROURA Originals",album:"The Northern Collection",src:"assets/audio/aurora-dawn.wav",cover:"assets/images/dawn.svg",duration:"0:18"},
 {title:"Neon Moon",artist:"AROURA Originals",album:"Midnight Signals",src:"assets/audio/neon-moon.wav",cover:"assets/images/moon.svg",duration:"0:18"},
 {title:"Polar Dreams",artist:"AROURA Originals",album:"Northern Collection",src:"assets/audio/polar-dreams.wav",cover:"assets/images/polar.svg",duration:"0:18"}
];
let current=0;
let liked=JSON.parse(localStorage.getItem("arouraLiked")||"[]");
const audio=document.getElementById("audio"), playBtn=document.getElementById("playBtn");

document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>showPage(n.dataset.page));
function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));
 document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===id));
 if(id==="library")renderLibrary("all");
 if(id==="search")renderSearch();
 window.scrollTo({top:0,behavior:"smooth"});
}
function trackHTML(t,i){return `<div class="track"><img src="${t.cover}" alt=""><div class="meta"><b>${t.title}</b><span>${t.artist} • ${t.album}</span></div><span class="time">${t.duration}</span><button class="smallplay" onclick="playTrack(${i})">▶</button></div>`}
function renderFeatured(){document.getElementById("featured").innerHTML=tracks.map((t,i)=>`<button class="card" onclick="playTrack(${i})"><img src="${t.cover}" alt=""><b>${t.title}</b><span>${t.artist}</span></button>`).join("")}
function renderTrending(){document.getElementById("trending").innerHTML=tracks.map((t,i)=>trackHTML(t,i)).join("")}
function renderSearch(){
 const q=(document.getElementById("searchInput")?.value||"").toLowerCase().trim();
 const r=tracks.filter(t=>(t.title+" "+t.artist+" "+t.album).toLowerCase().includes(q));
 document.getElementById("searchResults").innerHTML=r.length?r.map(t=>trackHTML(t,tracks.indexOf(t))).join(""):`<div class="empty">No sounds found for "${q}".</div>`;
}
function setLibraryTab(btn,tab){
 document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderLibrary(tab);
}
function renderLibrary(tab="all"){
 const box=document.getElementById("libraryList");
 if(tab==="liked"){
  const r=tracks.filter((_,i)=>liked.includes(i));
  box.innerHTML=r.length?r.map(t=>trackHTML(t,tracks.indexOf(t))).join(""):`<div class="empty">No liked songs yet. Tap ♡ in the player.</div>`;
 }else if(tab==="playlist"){
  box.innerHTML=`<div class="track"><img src="assets/images/logo.svg" alt=""><div class="meta"><b>Night Drive</b><span>Your first AROURA playlist • ${tracks.length} songs</span></div><span class="time">${tracks.length} songs</span><button class="smallplay" onclick="playTrack(0)">▶</button></div>`;
 }else box.innerHTML=tracks.map((t,i)=>trackHTML(t,i)).join("");
}
function loadTrack(i,autoplay=false){
 current=(i+tracks.length)%tracks.length;const t=tracks[current];
 audio.src=t.src;audio.load();
 document.getElementById("nowTitle").textContent=t.title;
 document.getElementById("nowArtist").textContent=t.artist;
 document.getElementById("nowCover").src=t.cover;
 document.getElementById("likeBtn").textContent=liked.includes(current)?"♥":"♡";
 if(autoplay)audio.play().catch(()=>{});
 updatePlay();
}
function playTrack(i){loadTrack(i,true)}
function togglePlay(){if(!audio.src)loadTrack(current,true);else audio.paused?audio.play():audio.pause()}
function updatePlay(){playBtn.textContent=audio.paused?"▶":"Ⅱ"}
function nextTrack(){playTrack(current+1)}
function prevTrack(){playTrack(current-1)}
function toggleLike(){
 liked.includes(current)?liked=liked.filter(i=>i!==current):liked.push(current);
 localStorage.setItem("arouraLiked",JSON.stringify(liked));
 document.getElementById("likeBtn").textContent=liked.includes(current)?"♥":"♡";
 toast(liked.includes(current)?"Added to Liked Songs":"Removed from Liked Songs");
}
audio.addEventListener("play",updatePlay);audio.addEventListener("pause",updatePlay);audio.addEventListener("ended",nextTrack);
audio.addEventListener("loadedmetadata",()=>document.getElementById("duration").textContent=fmt(audio.duration));
audio.addEventListener("timeupdate",()=>{document.getElementById("current").textContent=fmt(audio.currentTime);document.getElementById("seek").value=audio.duration?(audio.currentTime/audio.duration)*100:0});
document.getElementById("seek").oninput=e=>{if(audio.duration)audio.currentTime=(e.target.value/100)*audio.duration};
function fmt(s){return isFinite(s)?Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0"):"0:00"}
function toggleTheme(){document.body.classList.toggle("light");localStorage.setItem("arouraTheme",document.body.classList.contains("light")?"light":"dark")}
if(localStorage.getItem("arouraTheme")==="light")document.body.classList.add("light");
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function openModal(type){
 const m=document.getElementById("modal");let html=`<button class="close" onclick="closeModal()">×</button>`;
 if(type==="payment")html+=`<h2>Upgrade to AROURA Premium</h2><p>Enter the M-PESA number you want to charge. Safaricom will open the secure STK prompt on that phone.</p><div class="pay-box"><span>Premium plan</span><b>KES 299 / month</b></div><input id="mpesaPhone" inputmode="numeric" placeholder="M-PESA number e.g. 0712345678"><div class="modal-actions"><button onclick="closeModal()">Cancel</button><button class="primary" onclick="startMpesa()">Send STK Prompt</button></div><p style="font-size:11px">Your M-PESA PIN is never entered into AROURA. Daraja credentials stay on the server.</p>`;
 else if(type==="profile")html+=`<h2>Welcome to AROURA</h2><p>Your local profile is ready. Sign-in and cloud sync can be connected when the backend is enabled.</p><div class="modal-actions"><button class="primary" onclick="closeModal()">Continue listening</button></div>`;
 else if(type==="about")html+=`<h2>AROURA</h2><p>Music becomes light. A premium music experience created by <b>Helupack Systems</b>.</p><p style="font-size:12px">© 2026 Helupack Systems. AROURA is an independent product concept.</p><div class="modal-actions"><button class="primary" onclick="closeModal()">Close</button></div>`;
 else if(type==="player")html+=`<div class="player-full"><div class="aurora-ribbon r1"></div><div class="aurora-ribbon r2"></div><div class="stars"></div><img src="${tracks[current].cover}" alt=""></div><h2 style="margin-top:18px">${tracks[current].title}</h2><p>${tracks[current].artist}</p><div class="modal-actions"><button onclick="prevTrack()">Previous</button><button class="primary" onclick="togglePlay()">Play / Pause</button><button onclick="nextTrack()">Next</button></div>`;
 m.innerHTML=html;document.getElementById("modalWrap").classList.add("open");
}
function closeModal(){document.getElementById("modalWrap").classList.remove("open")}
function normalizePhone(value){
 let p=value.replace(/\D/g,"");
 if(p.startsWith("0"))p="254"+p.slice(1);
 if(p.startsWith("7"))p="254"+p;
 return p;
}
async function startMpesa(){
 const phone=normalizePhone(document.getElementById("mpesaPhone").value);
 if(!/^2547\d{8}$/.test(phone)){toast("Enter a valid Kenyan M-PESA number");return}
 const btn=document.querySelector("#modal .primary");btn.disabled=true;btn.textContent="Sending…";
 try{
  const res=await fetch("/.netlify/functions/mpesa-stk",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone,amount:299})});
  const data=await res.json();
  if(!res.ok)throw new Error(data.error||"Could not start payment");
  closeModal();toast("Check your phone for the M-PESA prompt.");
 }catch(e){toast(e.message||"Payment service unavailable");btn.disabled=false;btn.textContent="Send STK Prompt"}
}
renderFeatured();renderTrending();renderLibrary();loadTrack(0,false);