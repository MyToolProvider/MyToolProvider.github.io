
(function(){
 const root=document.documentElement;
 const saved=localStorage.getItem("aih-theme");
 if(saved) root.dataset.theme=saved;
 const theme=document.querySelector("[data-theme-toggle]");
 if(theme) theme.onclick=()=>{root.dataset.theme=root.dataset.theme==="light"?"dark":"light";localStorage.setItem("aih-theme",root.dataset.theme)};
 const modal=document.querySelector("#searchModal");
 document.querySelectorAll("[data-search]").forEach(x=>x.onclick=()=>{modal.classList.add("open");document.querySelector("#globalSearch").focus()});
 document.querySelectorAll("[data-close]").forEach(x=>x.onclick=()=>modal.classList.remove("open"));
 const input=document.querySelector("#globalSearch"), results=document.querySelector("#results");
 if(input){
  input.oninput=()=>{
   const q=input.value.toLowerCase().trim();
   results.innerHTML="";
   if(!q){results.innerHTML="<p style='color:var(--muted)'>Search categories and tools...</p>";return}
   const items=[...document.querySelectorAll("[data-search-item]")];
   let found=0;
   items.forEach(i=>{if(i.textContent.toLowerCase().includes(q)){const a=i.querySelector("a");results.innerHTML+=`<a href="${a.href}">${i.textContent.trim()}</a>`;found++}});
   if(!found) results.innerHTML="<p style='color:var(--muted)'>No result yet. Try another keyword.</p>";
  }
 }
})();
