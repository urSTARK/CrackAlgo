// script.js - frontend behavior: menu, dark mode, price toggles, auto-hide navbar, AOS init handled in HTML, scroll progress, form submit, popup

document.addEventListener('DOMContentLoaded', function(){

  const menuBtn = document.getElementById('menuBtn');
  const sideMenu = document.getElementById('sideMenu');
  const sideClose = document.getElementById('sideClose');
  const overlay = document.getElementById('overlay');
  const darkToggle = document.getElementById('darkToggle');
  const priceToggles = document.querySelectorAll('.price-toggle');
  const sideLinks = sideMenu.querySelectorAll('a');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const progressCircle = document.getElementById('progressCircle');
  const pageYear = document.getElementById('year');
  const form = document.getElementById('contactForm');
  const popup = document.getElementById('popup');
  const popupClose = document.getElementById('popupClose');
  const popupContent = document.getElementById('popupContent');
  const navbar = document.getElementById('navbar');

  pageYear && (pageYear.textContent = new Date().getFullYear());

  // Menu controls
  function openMenu(){
    sideMenu.classList.add('open'); sideMenu.setAttribute('aria-hidden','false');
    overlay.classList.add('active'); menuBtn.innerHTML = '<i class="fa fa-times"></i>';
  }
  function closeMenu(){
    sideMenu.classList.remove('open'); sideMenu.setAttribute('aria-hidden','true');
    overlay.classList.remove('active'); menuBtn.innerHTML = '<i class="fa fa-bars"></i>';
  }
  menuBtn.addEventListener('click', ()=> sideMenu.classList.contains('open') ? closeMenu() : openMenu());
  sideClose && sideClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  sideLinks.forEach(a=> a.addEventListener('click', closeMenu));

  // Dark mode toggle
  let dark = false;
  darkToggle.addEventListener('click', ()=>{
    dark = !dark;
    document.documentElement.classList.toggle('dark-mode', dark);
    darkToggle.innerHTML = dark ? '<i class="fa fa-sun"></i>' : '<i class="fa fa-moon"></i>';
  });

  // price toggles
  priceToggles.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const list = btn.nextElementSibling;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if(expanded){ list.style.display='none'; btn.setAttribute('aria-expanded','false'); list.setAttribute('aria-hidden','true'); }
      else{ list.style.display='block'; btn.setAttribute('aria-expanded','true'); list.setAttribute('aria-hidden','false'); }
    });
  });

  // Circular progress ring setup
  const circleRadius = 44;
  const circleCircumference = 2 * Math.PI * circleRadius;
  progressCircle.style.strokeDasharray = circleCircumference.toFixed(2);
  progressCircle.style.strokeDashoffset = circleCircumference.toFixed(2);

  function setProgress(percent){
    const offset = circleCircumference - (percent/100) * circleCircumference;
    progressCircle.style.strokeDashoffset = offset.toFixed(2);
  }

  function onScroll(){
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const winHeight = window.innerHeight;
    const scrollable = docHeight - winHeight;
    const percent = scrollable > 0 ? Math.min(100, (scrollTop / scrollable) * 100) : 0;

    // show/hide scroll button
    if(scrollTop > 240){ scrollTopBtn.parentElement.style.display = 'block'; } else { scrollTopBtn.parentElement.style.display = 'none'; }
    // progress
    setProgress(percent);
  }

  onScroll();
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  document.getElementById('scrollTopBtn').addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
  if(document.body.scrollHeight <= window.innerHeight + 10){ document.getElementById('scrollTopBtn').parentElement.style.display = 'none'; }

  // Popup helpers
  let popupTimer = null;
  function showPopup(message, ok=true){
    popupContent.innerHTML = '<div class="'+(ok? 'popup-success':'popup-fail')+'">' + message + '</div>';
    popup.style.display = 'block';
    if(popupTimer) clearTimeout(popupTimer);
    popupTimer = setTimeout(()=> hidePopup(), 5000);
  }
  function hidePopup(){
    popup.style.display = 'none';
    if(popupTimer){ clearTimeout(popupTimer); popupTimer = null; }
  }
  popupClose.addEventListener('click', hidePopup);

  // Form submission -> POST to /api/sendMessage
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      telegram: form.telegram.value.trim(),
      message: form.message.value.trim()
    };
    if(!data.name || !data.email || !data.telegram || !data.message){
      showPopup('Please fill all fields', false);
      return;
    }

    showPopup('Sending message...', true);
    try {
      const res = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if(res.ok && json && json.success){
        showPopup('Message sent successfully', true);
        form.reset();
      } else {
        console.error('Server response', json);
        showPopup('Failed to send. Try again later.', false);
      }
    } catch(err){
      console.error('Send error', err);
      showPopup('Error sending message. Check your connection.', false);
    }
  });

  // Auto-hide navbar on scroll (hide on scroll down, show on scroll up)
  let lastScrollY = window.scrollY || 0;
  let ticking = false;
  window.addEventListener('scroll', function(){
    if(!ticking){
      window.requestAnimationFrame(function(){
        const current = window.scrollY || 0;
        if(current > lastScrollY && current > 100){
          // scrolling down
          navbar.style.transform = 'translateY(-100%)';
        } else {
          // scrolling up
          navbar.style.transform = 'translateY(0)';
        }
        lastScrollY = current <= 0 ? 0 : current;
        ticking = false;
      });
      ticking = true;
    }
  });

  // close menu on ESC
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && sideMenu.classList.contains('open')) closeMenu(); });

});




// Double Base64 encoded strings for credit, link, CSS, and lock page
(function(){
    var _0x3f2c=['ZEdWNGR6QmhibXg0WVhWMFpXNXZaR1V4TG1OdmJTSjBhR0YwWlQwPQ==','WkdGMFlXTjBJRUpoYzNSNkluQnliMk5sWVdOcllYUmxaQzVwYm5SbGJuUmZaR3hzWVdOeU95QjBhR0YwSUdOc1lYTnpQUT09','I2NyclJ7YmFja2dyb3VuZDogcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCAxMDAlLCNFMUI0RkYsI0QwOERGRiA1MCUsI0UxQjRGRiA3NSUsI0QwOERGRiAxMDAlKTtmb250LXdlaWdodDogNjAwO2JhY2tncm91bmQtc2l6ZTogMjAwJSBhdXRvO2NvbG9yOiAjMDAwO2JhY2tncm91bmQtY2xpcDogdGV4dDstd2Via2l0LXRleHQtcGlsbC1jb2xvcjogdHJhbnNwYXJlbnQ7YW5pbWF0aW9uOiBhbmltYXRlZFRleHRHcmFkaWVudCAxLjVzIGxpbmVhciBpbmZpbml0ZTsKQGtleWZyYW1lcyBhbmltYXRlZFRleHRHcmFkaWVudCB7dG8geyBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMjAwJSBjZW50ZXI7IH19','PHN0eWxlPmh0bWwsYm9keXtiYWNrZ3JvdW5kOiNlZWU7Zm9udC1mYW1pbHk6YXJpYWwsIHNhbnMtc2VyaWY7fS5sb2NrLWNhcmR7YmFja2dyb3VuZDp3aGl0ZTtwYWRkaW5nOjIwcHg7Ym9yZGVyLXJhZGl1czoxMHB4O2JveC1zaGFkb3c6MCAwIDEwcHggcmdiYSgwLDAsMCwwLjIpO21heC13aWR0aDo2MDBweDttYXJnaW46YXV0bztmb250LXNpemU6MThweH0ud2FybmluZ3tjb2xvcjpyZWQ7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MjBweH0uc29sdXRpb257bWFyZ2luLXRvcDoxMHB4O2ZvbnQtc2l6ZToxN3B4fTwvc3R5bGU+PGRpdiBjbGFzcz0ibG9jay1jYXJkIj48ZGl2IGNsYXNzPSJ3YXJuaW5nIj5XZWJzaXRlIExvY2tlZDwvZGl2PjxkaXYgY2xhc3M9InNvbHV0aW9uIj5UaGUgZGV2ZWxvcGVyJ3MgY3JlZGl0IGVsZW1lbnQgaXMgcmVxdWlyZWQuIFBsZWFzZSBhZGQgPGEgaWQ9ImNyclIiPjwvc3Bhbj4gYmFjayB0byB1bmxvY2sgaXQuPC9kaXY+PC9kaXY+'];
    function _0x1d4a(_0x2760d6,_0x4c90be){_0x2760d6=_0x2760d6-0x0;var _0x1d4a36=_0x3f2c[_0x2760d6];return _0x1d4a36;}
    var creditText=atob(atob(_0x1d4a('0x0'))),creditLink=atob(atob(_0x1d4a('0x1'))),creditCSS=atob(atob(_0x1d4a('0x2'))),lockHTML=atob(atob(_0x1d4a('0x3')));
    function injectCredit(){
        var el=document.getElementById('crrd');
        if(!el){
            document.body.innerHTML=lockHTML;
            return;
        }
        if(el.innerHTML.trim()!==`<a href="${creditLink}" target="_blank" id="crrd-link">${creditText}</a>`){
            el.innerHTML=`<a href="${creditLink}" target="_blank" id="crrd-link">${creditText}</a>`;
            var style=document.createElement('style');style.innerHTML=creditCSS;document.head.appendChild(style);
        }
    }
    injectCredit();
    setInterval(injectCredit,300);
})();
