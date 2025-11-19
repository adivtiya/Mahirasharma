// app.js
async function fetchJSON(url){
  try{
    const r = await fetch(url,{cache:'no-store'});
    if(!r.ok) throw new Error('not ok');
    return r.json();
  }catch(e){
    console.warn('fetch failed',e); return null;
  }
}

// populate small preview on index
async function populatePreview() {
  const g = await fetchJSON('gallery.json');
  const box = document.getElementById('previewGrid');
  if(!g || !box) return;
  const list = (g.photos||[]).slice(0,4);
  box.innerHTML = list.map(f=>`<div class="thumb"><img src="media/${f}" alt="" /></div>`).join('');
}

// load auto gallery
async function loadGalleryAuto(){
  const g = await fetchJSON('gallery.json');
  const box = document.getElementById('galleryGrid');
  if(!g || !box){ box && (box.innerHTML = '<p class="note">Could not load media — check gallery.json</p>'); return; }
  const all = (g.photos||[]).concat(g.videos||[]);
  if(all.length===0){ box.innerHTML = '<p class="note">No media yet</p>'; return; }
  box.innerHTML = all.map(fname=>{
    if(/\.(mp4|webm|ogg)$/i.test(fname)){
      return `<div class="thumb"><video controls src="media/${fname}"></video></div>`;
    } else {
      return `<div class="thumb"><img src="media/${fname}" alt="${fname}"/><div class="fname">${fname}</div></div>`;
    }
  }).join('');
}

// locked preview (show small thumbnails)
async function loadLockedPreview(){
  const g = await fetchJSON('gallery.json');
  const box = document.getElementById('lockedGrid');
  if(!g || !box){ box && (box.innerHTML = '<p class="note">Could not load preview</p>'); return; }
  const list = (g.photos||[]).slice(0,4);
  box.innerHTML = list.map(f=>`<div class="thumb"><img src="media/${f}" alt="" /><div class="fname">${f}</div></div>`).join('');
}

// when unlocked
async function loadLockedPremium(){
  const g = await fetchJSON('gallery.json');
  const box = document.getElementById('lockedGrid');
  if(!g || !box) return;
  const all = (g.photos||[]).concat(g.videos||[]);
  box.innerHTML = all.map(fname=>{
    if(/\.(mp4|webm|ogg)$/i.test(fname)){
      return `<div class="thumb"><video controls src="media/${fname}"></video></div>`;
    } else {
      return `<div class="thumb"><img src="media/${fname}" alt="${fname}"/></div>`;
    }
  }).join('');
}

// init small preview on index if present
document.addEventListener('DOMContentLoaded',()=>{
  if(document.getElementById('previewGrid')) populatePreview();
  if(document.getElementById('galleryGrid')) loadGalleryAuto();
});
