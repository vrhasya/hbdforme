const target=new Date("2026-09-25T00:00:00+07:00").getTime();
const welcome=document.getElementById("welcome"),countScreen=document.getElementById("countScreen"),birthday=document.getElementById("birthday");
const audio=document.getElementById("audio"),music=document.getElementById("music");
let celebrated=false;

document.getElementById("enter").onclick=async()=>{welcome.classList.add("hidden");countScreen.classList.remove("hidden");try{await audio.play();music.classList.remove("paused")}catch(e){}};
music.onclick=()=>{if(audio.paused){audio.play().then(()=>music.classList.remove("paused")).catch(()=>{})}else{audio.pause();music.classList.add("paused")}};

const overlay=document.getElementById("countOverlay"),countNumber=document.getElementById("countNumber");
const sh=document.getElementById("shatter"),shctx=sh.getContext("2d");
function sizeShatter(){sh.width=innerWidth*devicePixelRatio;sh.height=innerHeight*devicePixelRatio;sh.style.width=innerWidth+"px";sh.style.height=innerHeight+"px";shctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
sizeShatter();addEventListener("resize",sizeShatter);
function shatterBurst(){let a=[];for(let i=0;i<180;i++)a.push({x:innerWidth/2,y:innerHeight/2,vx:(Math.random()-.5)*18,vy:(Math.random()-.5)*18,r:Math.random()*5+1,l:100+Math.random()*100});function frame(){shctx.clearRect(0,0,innerWidth,innerHeight);let alive=false;for(const q of a){q.x+=q.vx;q.y+=q.vy;q.vy+=.08;q.l--;if(q.l>0){alive=true;shctx.globalAlpha=q.l/150;shctx.fillStyle="#d8d8e0";shctx.fillRect(q.x,q.y,q.r*2,q.r*2)}}if(alive)requestAnimationFrame(frame)}frame()}
function startOpening(){let n=3;const tick=setInterval(()=>{n--;if(n>0){countNumber.textContent=n;countNumber.style.animation="none";void countNumber.offsetWidth;countNumber.style.animation="countPulse .8s ease"}else{clearInterval(tick);countNumber.textContent="✦";setTimeout(()=>{shatterBurst();overlay.classList.add("hide");setTimeout(()=>overlay.remove(),1100)},550)}},900)}
setTimeout(startOpening,700);

function pad(n){return String(n).padStart(2,"0")}
function update(){const now=new Date(),diff=target-Date.now();document.getElementById("clock").textContent=now.toLocaleTimeString("id-ID",{hour12:false})+" WIB";if(diff<=0){if(!celebrated){celebrated=true;countScreen.classList.add("hidden");birthday.classList.remove("hidden");document.getElementById("autoLetter").classList.add("show");}return}document.getElementById("d").textContent=pad(Math.floor(diff/86400000));document.getElementById("h").textContent=pad(Math.floor(diff%86400000/3600000));document.getElementById("m").textContent=pad(Math.floor(diff%3600000/60000));document.getElementById("s").textContent=pad(Math.floor(diff%60000/1000))}
setInterval(update,1000);update();

const star=document.getElementById("stars"),ctx=star.getContext("2d"),fx=document.getElementById("fx"),fctx=fx.getContext("2d");let stars=[],parts=[];
function resize(){const d=devicePixelRatio||1;[star,fx].forEach(c=>{c.width=innerWidth*d;c.height=innerHeight*d;c.style.width=innerWidth+"px";c.style.height=innerHeight+"px"});ctx.setTransform(d,0,0,d,0,0);fctx.setTransform(d,0,0,d,0,0);stars=Array.from({length:120},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.2+Math.random()*1.2,a:Math.random()*6.28,v:.002+Math.random()*.008}))}
resize();addEventListener("resize",resize);
function loop(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of stars){p.a+=p.v;ctx.globalAlpha=.18+.25*Math.sin(p.a);ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(loop)}loop();

document.getElementById("openLetter").onclick=()=>document.getElementById("modal").classList.remove("hidden");
document.getElementById("close").onclick=()=>document.getElementById("modal").classList.add("hidden");
document.getElementById("share").onclick=async()=>{try{await navigator.share({title:"Luxury Birthday Experience",text:"A special birthday experience — 25.09",url:location.href})}catch(e){try{await navigator.clipboard.writeText(location.href);alert("Link berhasil disalin.")}catch(x){}}};

const wishModal=document.getElementById("wishModal"),status=document.getElementById("wishStatus");
document.getElementById("openWish").onclick=()=>{status.textContent="";wishModal.classList.remove("hidden")};
document.getElementById("closeWish").onclick=()=>wishModal.classList.add("hidden");
document.querySelectorAll(".quickWish").forEach(b=>b.onclick=()=>document.getElementById("wishMessage").value=b.dataset.text);

document.getElementById("sendWish").onclick=async()=>{
 const name=document.getElementById("wishName").value.trim();
 const message=document.getElementById("wishMessage").value.trim();
 if(!message){status.textContent="Tulis ucapan terlebih dahulu.";return}
 const btn=document.getElementById("sendWish");btn.disabled=true;status.textContent="Mengirim...";
 try{
   const res=await fetch("/api/wish",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,message,source:"Luxury Birthday Experience",page:location.href})});
   const data=await res.json();
   if(!res.ok) throw new Error(data.error||"Gagal mengirim");
   status.textContent="Ucapan berhasil dikirim. Terima kasih ✦";
   document.getElementById("wishMessage").value="";
 }catch(e){status.textContent=e.message||"Gagal mengirim ucapan."}
 finally{btn.disabled=false}
};
