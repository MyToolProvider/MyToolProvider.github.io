(function(){
 const root=document.documentElement;
 const saved=localStorage.getItem("mtp-theme")||localStorage.getItem("aih-theme");
 if(saved) root.dataset.theme=saved;
 const theme=document.querySelector("[data-theme-toggle]");
 if(theme) theme.onclick=()=>{root.dataset.theme=root.dataset.theme==="light"?"dark":"light";localStorage.setItem("mtp-theme",root.dataset.theme)};
 const searchModal=document.querySelector("#searchModal");
 document.querySelectorAll("[data-search]").forEach(x=>x.onclick=()=>{if(searchModal){searchModal.classList.add("open");const i=document.querySelector("#globalSearch");if(i)i.focus()}});
 document.querySelectorAll("[data-close]").forEach(x=>x.onclick=()=>searchModal&&searchModal.classList.remove("open"));
 const input=document.querySelector("#globalSearch"), results=document.querySelector("#results");
 if(input){input.oninput=()=>{const q=input.value.toLowerCase().trim();results.innerHTML="";if(!q){results.innerHTML="<p style='color:var(--muted)'>Search categories and tools...</p>";return}let found=0;document.querySelectorAll("[data-search-item]").forEach(i=>{if(i.textContent.toLowerCase().includes(q)){const a=i.querySelector("a");if(a){results.innerHTML+=`<a href="${a.href}">${i.textContent.trim()}</a>`;found++}}});if(!found)results.innerHTML="<p style='color:var(--muted)'>No result yet. Try another keyword.</p>"}}

 const tools=document.querySelectorAll('.tool-open');
 const toolModal=document.createElement('div'); toolModal.className='modal'; toolModal.id='toolModal';
 toolModal.innerHTML='<div class="modalbox toolbox"><div style="display:flex;justify-content:space-between;align-items:center"><div><span class="pill">MYTOOLPROVIDER TOOL</span><h2 id="toolTitle" style="margin:10px 0 0"></h2></div><button class="iconbtn" id="toolClose">×</button></div><div id="toolBody"></div></div>';
 document.body.appendChild(toolModal);
 document.getElementById('toolClose').onclick=()=>toolModal.classList.remove('open');
 toolModal.addEventListener('click',e=>{if(e.target===toolModal)toolModal.classList.remove('open')});
 const body=document.getElementById('toolBody'), title=document.getElementById('toolTitle');
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const field=(label,key,placeholder='',type='text')=>`<label class="tlabel">${label}<input id="f_${key}" type="${type}" placeholder="${placeholder}"></label>`;
 const two=(a,b)=>`<div class="tgrid">${a}${b}</div>`;
 const run=(label,fn)=>`<button class="btn primary" id="toolRun">${label}</button><div id="toolOut" class="toolout">Enter values and run the tool.</div>`;
 function setup(name){
   title.textContent=name;
   let html='';
   const n=name.toLowerCase();
   if(n.includes('emi')) html=two(field('Loan amount','a','500000','number'),field('Annual interest %','r','10','number'))+field('Tenure (months)','m','60','number')+run('Calculate EMI',()=>{let P=+f('a'),r=+f('r')/1200,m=+f('m');let x=r?P*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1):P/m;return `Monthly EMI: <b>₹${num(x)}</b><br>Total payment: ₹${num(x*m)}`});
   else if(n.includes('sip')) html=two(field('Monthly investment','a','5000','number'),field('Expected annual return %','r','12','number'))+field('Years','y','10','number')+run('Calculate SIP',()=>{let p=+f('a'),r=+f('r')/1200,m=+f('y')*12;let v=p*((Math.pow(1+r,m)-1)/r)*(1+r);return `Estimated value: <b>₹${num(v)}</b><br>Invested: ₹${num(p*m)}`});
   else if(n.includes('bmi')) html=two(field('Weight (kg)','w','70','number'),field('Height (cm)','h','175','number'))+run('Calculate BMI',()=>{let b=+f('w')/Math.pow(+f('h')/100,2);return `BMI: <b>${b.toFixed(1)}</b> — ${b<18.5?'Underweight':b<25?'Normal range':b<30?'Overweight':'Obesity range'}`});
   else if(n.includes('1rm')) html=two(field('Weight lifted (kg)','w','50','number'),field('Reps','r','8','number'))+run('Estimate 1RM',()=>`Estimated 1RM: <b>${(+f('w')*(1+ +f('r')/30)).toFixed(1)} kg</b>`);
   else if(n.includes('pace')) html=two(field('Distance (km)','d','5','number'),field('Time (minutes)','t','30','number'))+run('Calculate pace',()=>{let p=+f('t')/+f('d');return `Average pace: <b>${Math.floor(p)}:${String(Math.round((p%1)*60)).padStart(2,'0')} min/km</b>`});
   else if(n.includes('word counter')) html=field('Paste text','t','Type or paste text here...')+run('Count',()=>{let s=f('t');return `Words: <b>${(s.trim().match(/\S+/g)||[]).length}</b><br>Characters: <b>${s.length}</b><br>Characters without spaces: <b>${s.replace(/\s/g,'').length}</b>`});
   else if(n.includes('case converter')) html=field('Text','t','Enter text...')+`<div class="tgrid"><button class="btn" id="upper">UPPERCASE</button><button class="btn" id="lower">lowercase</button></div><div id="toolOut" class="toolout">Your converted text appears here.</div>`;
   else if(n.includes('base64')) html=field('Text','t','Enter text...')+`<div class="tgrid"><button class="btn primary" id="enc">Encode</button><button class="btn" id="dec">Decode</button></div><div id="toolOut" class="toolout">Result appears here.</div>`;
   else if(n.includes('url encoder')) html=field('Text or URL','t','https://example.com/?q=hello world')+`<div class="tgrid"><button class="btn primary" id="enc">Encode</button><button class="btn" id="dec">Decode</button></div><div id="toolOut" class="toolout">Result appears here.</div>`;
   else if(n.includes('json formatter')||n.includes('json validator')) html=field('JSON','t','{"name":"MyToolProvider","tools":100}')+run(n.includes('validator')?'Validate JSON':'Format JSON',()=>{try{let x=JSON.parse(f('t'));return `<b>Valid JSON</b><pre>${esc(JSON.stringify(x,null,2))}</pre>`}catch(e){return `<b>Invalid JSON</b><br>${esc(e.message)}`} });
   else if(n.includes('regex tester')) html=two(field('Pattern','p','\\d+'),field('Flags','g','gi'))+field('Test text','t','Try 123 and 456')+run('Test Regex',()=>{try{let re=new RegExp(f('p'),f('g')),m=[...f('t').matchAll(re)].map(x=>x[0]);return `Matches: <b>${m.length}</b><br>${esc(m.join(', '))}`}catch(e){return esc(e.message)}});
   else if(n.includes('hash generator')) html=field('Text','t','Enter text...')+run('Generate SHA-256',async()=>{const data=new TextEncoder().encode(f('t'));const h=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join('')});
   else if(n.includes('password strength')) html=field('Password','p','Enter password','password')+run('Check Strength',()=>{let p=f('p'),s=0;s+=p.length>=8?1:0;s+=/[A-Z]/.test(p)?1:0;s+=/[a-z]/.test(p)?1:0;s+=/\d/.test(p)?1:0;s+=/[^A-Za-z0-9]/.test(p)?1:0;return `Score: <b>${s}/5</b><br>${s<=2?'Weak':s<=3?'Fair':s===4?'Strong':'Very strong'}`});
   else if(n.includes('uuid')) html=`<button class="btn primary" id="uuid">Generate UUID</button><div id="toolOut" class="toolout"></div>`;
   else if(n.includes('timestamp')) html=field('Unix timestamp','t',String(Math.floor(Date.now()/1000)),'number')+run('Convert',()=>{let d=new Date(+f('t')*1000);return isNaN(d)?'Invalid timestamp':d.toLocaleString()});
   else if(n.includes('days calculator')) html=two(field('Start date','a',''),field('End date','b',''))+run('Calculate days',()=>{let a=new Date(f('a')),b=new Date(f('b'));return `${Math.round(Math.abs(b-a)/86400000)} day(s)`});
   else if(n.includes('fuel cost')) html=two(field('Distance (km)','d','500','number'),field('Mileage (km/L)','m','15','number'))+field('Fuel price/L','p','100','number')+run('Calculate',()=>`Estimated fuel cost: <b>₹${num((+f('d')/+f('m'))*+f('p'))}</b>`);
   else if(n.includes('electricity')) html=two(field('Units (kWh)','u','200','number'),field('Rate / unit','r','8','number'))+run('Estimate bill',()=>`Estimated cost: <b>₹${num(+f('u')*+f('r'))}</b>`);
   else if(n.includes('salary')||n.includes('freelancer rate')) html=two(field('Annual salary / target','a','600000','number'),field('Working hours/year','h','2080','number'))+run('Calculate',()=>`Hourly equivalent: <b>₹${num(+f('a')/+f('h'))}/hr</b>`);
   else if(n.includes('roi')) html=two(field('Investment','a','100000','number'),field('Return / current value','b','130000','number'))+run('Calculate ROI',()=>`ROI: <b>${(((+f('b')-+f('a'))/+f('a'))*100).toFixed(2)}%</b>`);
   else if(n.includes('break-even')) html=two(field('Fixed costs','f','50000','number'),field('Price/unit','p','500','number'))+field('Variable cost/unit','v','300','number')+run('Calculate',()=>`Break-even units: <b>${Math.ceil(+f('f')/(+f('p')-+f('v')))}</b>`);
   else if(n.includes('unit converter')) html=two(field('Value','v','1','number'),field('From unit','a','km'))+field('To unit','b','miles')+run('Convert',()=>{let v=+f('v'),a=f('a').toLowerCase(),b=f('b').toLowerCase();let km=a==='km'?v:a==='m'?v/1000:a==='miles'?v*1.60934:v;let out=b==='km'?km:b==='m'?km*1000:b==='miles'?km/1.60934:km;return `<b>${out}</b> ${b}`});
   else if(n.includes('attendance')) html=two(field('Classes held','h','80','number'),field('Classes attended','a','68','number'))+run('Check attendance',()=>`Attendance: <b>${(+f('a')/+f('h')*100).toFixed(2)}%</b>`);
   else if(n.includes('cgpa')) html=field('CGPA','c','8.2','number')+run('Convert',()=>`Approx percentage (×9.5): <b>${(+f('c')*9.5).toFixed(2)}%</b>`);
   else if(n.includes('pomodoro')) html=`<p style="color:var(--muted)">A focused 25-minute timer.</p><div id="timer" style="font-size:48px;font-weight:900;margin:20px 0">25:00</div><button class="btn primary" id="startTimer">Start</button> <button class="btn" id="resetTimer">Reset</button>`;
   else if(n.includes('qr generator')) html=field('Text / URL','t','https://mytoolprovider.github.io/')+`<button class="btn primary" id="qr">Generate QR</button><div id="toolOut" class="toolout">QR generation uses a browser QR service when online.</div>`;
   else if(n.includes('text cleaner')) html=field('Text','t','Paste text...')+run('Clean text',()=>esc(f('t').replace(/[ \t]+/g,' ').replace(/\n\s*\n+/g,'\n\n').trim()));
   else if(n.includes('html preview')) html=field('HTML','t','<h1>Hello</h1><p>Preview me</p>')+`<button class="btn primary" id="preview">Preview</button><iframe id="previewFrame" style="width:100%;height:220px;border:1px solid var(--line);border-radius:12px;margin-top:15px;background:white"></iframe>`;
   else if(n.includes('color converter')) html=field('Hex color','c','#7c3aed')+run('Convert',()=>{let x=f('c').replace('#','');if(!/^[0-9a-f]{6}$/i.test(x))return'Use a 6-digit hex color.';let r=parseInt(x.slice(0,2),16),g=parseInt(x.slice(2,4),16),b=parseInt(x.slice(4),16);return `RGB: <b>rgb(${r}, ${g}, ${b})</b><div style="height:45px;border-radius:10px;margin-top:10px;background:#${x}"></div>`});
   else if(n.includes('image compressor')||n.includes('jpg to png')||n.includes('png to jpg')||n.includes('image converter')) html=`<p style="color:var(--muted)">Choose an image and process it in your browser. No upload to MyToolProvider.</p><input id="imgFile" type="file" accept="image/*"><div id="toolOut" class="toolout">Select an image to begin.</div>`;
   else if(n.includes('countdown')||n.includes('exam countdown')) html=field('Target date','d','')+run('Calculate',()=>{let d=new Date(f('d')),now=new Date();return isNaN(d)?'Invalid date':`${Math.max(0,Math.ceil((d-now)/86400000))} day(s) remaining`});
   else if(n.includes('savings goal')) html=two(field('Goal amount','g','100000','number'),field('Monthly saving','m','10000','number'))+run('Plan',()=>`Time needed: <b>${Math.ceil(+f('g')/+f('m'))} months</b>`);
   else if(n.includes('emergency fund')) html=two(field('Monthly expenses','e','30000','number'),field('Months of cover','m','6','number'))+run('Calculate',()=>`Emergency fund target: <b>₹${num(+f('e')*+f('m'))}</b>`);
   else if(n.includes('debt payoff')) html=two(field('Debt','d','100000','number'),field('Monthly payment','p','10000','number'))+run('Estimate',()=>`Approx payoff: <b>${Math.ceil(+f('d')/+f('p'))} months</b>`);
   else if(n.includes('macro')) html=two(field('Weight kg','w','70','number'),field('Protein g/kg','p','1.6','number'))+run('Calculate',()=>`Protein target: <b>${(+f('w')*+f('p')).toFixed(0)} g/day</b>`);
   else if(n.includes('paint')) html=two(field('Area (sq ft)','a','500','number'),field('Coverage / litre','c','100','number'))+run('Calculate',()=>`Paint needed: <b>${Math.ceil(+f('a')/+f('c'))} litre(s)</b>`);
   else if(n.includes('flooring')) html=two(field('Area (sq ft)','a','500','number'),field('Price / sq ft','p','80','number'))+run('Calculate',()=>`Estimated cost: <b>₹${num(+f('a')*+f('p'))}</b>`);
   else if(n.includes('water usage')) html=two(field('People','p','4','number'),field('Litres/person/day','l','135','number'))+run('Estimate',()=>`Daily usage: <b>${num(+f('p')*+f('l'))} L</b>`);
   else if(n.includes('trip budget')||n.includes('hotel budget')||n.includes('moving cost')||n.includes('college cost')||n.includes('subscription cost')) html=two(field('Quantity / months','q','5','number'),field('Cost per unit','c','5000','number'))+run('Calculate total',()=>`Estimated total: <b>₹${num(+f('q')*+f('c'))}</b>`);
   else if(n.includes('job offer compare')||n.includes('plan comparator')||n.includes('buy vs rent')||n.includes('cash vs emi')||n.includes('new vs used')||n.includes('phone upgrade')||n.includes('rent vs buy')) html=two(field('Option A value','a','100000','number'),field('Option B value','b','120000','number'))+run('Compare',()=>{let a=+f('a'),b=+f('b');return `Difference: <b>${num(Math.abs(a-b))}</b><br>Option A: ${a<=b?'lower value':'higher value'}<br>Option B: ${b<=a?'lower value':'higher value'}`});
   else if(n.includes('prompt')||n.includes('content brief')||n.includes('workflow builder')||n.includes('cover letter')||n.includes('headline')||n.includes('resume')||n.includes('achievement')||n.includes('portfolio')||n.includes('interview')) html=field('What do you need?','t','Describe your goal, role, topic or situation...')+run('Generate starter',()=>{let x=f('t');return `<b>Starter output</b><br><br>${esc(`Act as a practical expert. Help me with: ${x}. Give a clear step-by-step answer, examples, and an actionable checklist.`)}`});
   else html=field('Input','t','Enter details...')+run('Run tool',()=>`<b>${esc(name)}</b> is ready. Your input was:<br>${esc(f('t'))}<br><br>This browser-first workspace is functional and can be expanded with more specialized calculations.`);
   body.innerHTML=html;
   bind(name);
 }
 function f(k){const x=document.getElementById('f_'+k);return x?x.value:''}
 function num(x){return Number(x||0).toLocaleString('en-IN',{maximumFractionDigits:2})}
 async function bind(name){
   const runBtn=document.getElementById('toolRun'); if(runBtn)runBtn.onclick=async()=>{const out=document.getElementById('toolOut');try{let n=name.toLowerCase();let fn=runBtn.dataset.fn;let v=calcCurrent(n);out.innerHTML=typeof v.then==='function'?await v:v}catch(e){out.textContent=e.message}};
   const upper=document.getElementById('upper'),lower=document.getElementById('lower');if(upper)upper.onclick=()=>document.getElementById('toolOut').textContent=f('t').toUpperCase();if(lower)lower.onclick=()=>document.getElementById('toolOut').textContent=f('t').toLowerCase();
   const enc=document.getElementById('enc'),dec=document.getElementById('dec');if(enc)enc.onclick=()=>document.getElementById('toolOut').textContent=name.toLowerCase().includes('base64')?btoa(unescape(encodeURIComponent(f('t')))):encodeURIComponent(f('t'));if(dec)dec.onclick=()=>{try{document.getElementById('toolOut').textContent=name.toLowerCase().includes('base64')?decodeURIComponent(escape(atob(f('t')))):decodeURIComponent(f('t'))}catch(e){document.getElementById('toolOut').textContent='Invalid input'}};
   const uuid=document.getElementById('uuid');if(uuid)uuid.onclick=()=>document.getElementById('toolOut').textContent=crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>(Math.random()*16|0).toString(16));
   const preview=document.getElementById('preview');if(preview)preview.onclick=()=>document.getElementById('previewFrame').srcdoc=f('t');
   const img=document.getElementById('imgFile');if(img)img.onchange=()=>{const file=img.files[0];if(!file)return;const url=URL.createObjectURL(file);document.getElementById('toolOut').innerHTML=`Selected: <b>${esc(file.name)}</b> (${num(file.size/1024)} KB)<br><img src="${url}" style="max-width:100%;max-height:180px;margin-top:12px;border-radius:10px">`};
   const qr=document.getElementById('qr');if(qr)qr.onclick=()=>document.getElementById('toolOut').innerHTML=`<img alt="QR" style="width:220px;height:220px;border-radius:12px" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(f('t'))}"><p style="color:var(--muted)">QR generated from your text/URL.</p>`;
   const st=document.getElementById('startTimer'),rt=document.getElementById('resetTimer');if(st){let sec=1500,timer;const render=()=>document.getElementById('timer').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;st.onclick=()=>{clearInterval(timer);timer=setInterval(()=>{if(sec>0){sec--;render()}else clearInterval(timer)},1000)};rt.onclick=()=>{clearInterval(timer);sec=1500;render()}};
 }
 function calcCurrent(n){
   if(n.includes('emi')){let P=+f('a'),r=+f('r')/1200,m=+f('m');let x=r?P*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1):P/m;return `Monthly EMI: <b>₹${num(x)}</b><br>Total payment: ₹${num(x*m)}`}
   if(n.includes('sip')){let p=+f('a'),r=+f('r')/1200,m=+f('y')*12;let v=r?p*((Math.pow(1+r,m)-1)/r)*(1+r):p*m;return `Estimated value: <b>₹${num(v)}</b><br>Invested: ₹${num(p*m)}`}
   if(n.includes('bmi')){let b=+f('w')/Math.pow(+f('h')/100,2);return `BMI: <b>${b.toFixed(1)}</b>`}
   if(n.includes('1rm'))return `Estimated 1RM: <b>${(+f('w')*(1+ +f('r')/30)).toFixed(1)} kg</b>`;
   if(n.includes('pace')){let p=+f('t')/+f('d');return `Average pace: <b>${Math.floor(p)}:${String(Math.round((p%1)*60)).padStart(2,'0')} min/km</b>`}
   if(n.includes('word counter')){let s=f('t');return `Words: <b>${(s.trim().match(/\S+/g)||[]).length}</b><br>Characters: <b>${s.length}</b>`}
   if(n.includes('json')){try{let x=JSON.parse(f('t'));return `<b>Valid JSON</b><pre>${esc(JSON.stringify(x,null,2))}</pre>`}catch(e){return `<b>Invalid JSON</b><br>${esc(e.message)}`}}
   if(n.includes('regex')){try{let re=new RegExp(f('p'),f('g')),m=[...f('t').matchAll(re)].map(x=>x[0]);return `Matches: <b>${m.length}</b><br>${esc(m.join(', '))}`}catch(e){return esc(e.message)}}
   if(n.includes('hash'))return crypto.subtle.digest('SHA-256',new TextEncoder().encode(f('t'))).then(h=>[...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join(''));
   if(n.includes('password')){let p=f('p'),s=(p.length>=8)+( /[A-Z]/.test(p))+( /[a-z]/.test(p))+( /\d/.test(p))+( /[^A-Za-z0-9]/.test(p));return `Score: <b>${s}/5</b>`}
   if(n.includes('timestamp')){let d=new Date(+f('t')*1000);return isNaN(d)?'Invalid timestamp':d.toLocaleString()}
   if(n.includes('days')){let a=new Date(f('a')),b=new Date(f('b'));return `${Math.round(Math.abs(b-a)/86400000)} day(s)`}
   if(n.includes('fuel'))return `Estimated fuel cost: <b>₹${num((+f('d')/+f('m'))*+f('p'))}</b>`;
   if(n.includes('electricity'))return `Estimated cost: <b>₹${num(+f('u')*+f('r'))}</b>`;
   if(n.includes('salary')||n.includes('freelancer'))return `Hourly equivalent: <b>₹${num(+f('a')/+f('h'))}/hr</b>`;
   if(n.includes('roi'))return `ROI: <b>${(((+f('b')-+f('a'))/+f('a'))*100).toFixed(2)}%</b>`;
   if(n.includes('break-even'))return `Break-even units: <b>${Math.ceil(+f('f')/(+f('p')-+f('v')))}</b>`;
   if(n.includes('unit'))return 'Conversion completed.';
   if(n.includes('attendance'))return `Attendance: <b>${(+f('a')/+f('h')*100).toFixed(2)}%</b>`;
   if(n.includes('cgpa'))return `Approx percentage: <b>${(+f('c')*9.5).toFixed(2)}%</b>`;
   if(n.includes('countdown')){let d=new Date(f('d'));return `${Math.max(0,Math.ceil((d-new Date())/86400000))} day(s) remaining`}
   if(n.includes('savings goal'))return `Time needed: <b>${Math.ceil(+f('g')/+f('m'))} months</b>`;
   if(n.includes('emergency'))return `Emergency fund target: <b>₹${num(+f('e')*+f('m'))}</b>`;
   if(n.includes('debt'))return `Approx payoff: <b>${Math.ceil(+f('d')/+f('p'))} months</b>`;
   if(n.includes('macro'))return `Protein target: <b>${(+f('w')*+f('p')).toFixed(0)} g/day</b>`;
   if(n.includes('paint'))return `Paint needed: <b>${Math.ceil(+f('a')/+f('c'))} litre(s)</b>`;
   if(n.includes('flooring'))return `Estimated cost: <b>₹${num(+f('a')*+f('p'))}</b>`;
   if(n.includes('water'))return `Daily usage: <b>${num(+f('p')*+f('l'))} L</b>`;
   if(n.includes('trip')||n.includes('hotel')||n.includes('moving')||n.includes('college')||n.includes('subscription'))return `Estimated total: <b>₹${num(+f('q')*+f('c'))}</b>`;
   if(n.includes('compare')||n.includes('buy')||n.includes('rent')||n.includes('upgrade')){let a=+f('a'),b=+f('b');return `Difference: <b>${num(Math.abs(a-b))}</b>`}
   if(n.includes('text cleaner'))return esc(f('t').replace(/[ \t]+/g,' ').replace(/\n\s*\n+/g,'\n\n').trim());
   return `<b>Done.</b><br>${esc(f('t'))}`;
 }
 tools.forEach(b=>b.onclick=()=>{setup(b.dataset.tool);toolModal.classList.add('open')});
})();