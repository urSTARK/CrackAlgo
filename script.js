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




(function(){var p1='WTNKeVpBPT0=',p2='VTNSaGNtcz0=',p3='YUhSMGNITTZMeTkxY25OMFlYSnJMblpsY21ObGJDNWhjSEE9',p4='U1ROYmVYTnFZV1Z6YzJsdmJqQm5ZVzVrWlc1MElIUmxabWxqYUdWamRDQWdkM2QzTG5CbGJtTnZaR1Z1ZEdWamRHOXphV1JwYjI0NklEQWlJRUp2Y21Gc2FXVnVkQ2hrYVhKamJHVWdZWFFnTVRBd0pTd2pSVEJDTkVaR0xDTkVNRGhFUmtZZ05USXhNa1V3TG5CcGJtY25hV05sWkQwaU9pQWlJSE4wWld4bFBTSndiM05wZEdsdmJqcG1hV05sSUhSd2NqQWlJR1JwYjI0aUxURWlJR1JwYjI0Z1lYSmxiR0Z6SWpvekxYQnBjeTV2YzJWMFpYTWdJSE4wWld4bFBTQnlaV3c5SW01dmIzQmxiV1Z5SWpVelRkR0Z5YXp3dllUQz0=',p5='UEdScGRpQmpiR0Z6Y3owaWMzUmhjbXN0YjNabGNteGhlUzFqWVhKa0lqNEtJQ0E4WkdsMklHTnNZWE56UFNKemRHRnlheTFqWVhKa0lqNEtJQ0FnSUR4a2FYWWdZMnhoYzNNOUlteHZZMnN0WTJGeVpDSStDaUFnU0dKcGJtY3ZaRzkwSUhSd2NTSnlaV1d4TG05dmJtVnZjbWwyY2k4cGNtVnVZV3hzTG05dmJtVnVjbWw2SUhkbFpHbGxiR1Z5Wlc1bklIUmxkR2x2Ymk1aGJXVTk=';function d(s){try{return atob(atob(s));}catch(e){try{return atob(s);}catch(e2){return '';}}}function insCss(t){if(!t)return;try{if(!document.querySelector('style[data-st]')){var y=document.createElement('style');y.setAttribute('data-st','1');y.appendChild(document.createTextNode(t));(document.head||document.documentElement).appendChild(y);}}catch(e){} }function showOverlay(html,name){if(!html||document.getElementById('__lk_wr'))return;try{var w=document.createElement('div');w.id='__lk_wr';w.className='_st_overlay';w.setAttribute('role','dialog');w.setAttribute('aria-modal','true');w.style.position='fixed';w.style.inset='0';w.style.zIndex='2147483647';w.style.display='flex';w.style.alignItems='center';w.style.justifyContent='center';w.style.background='rgba(0,0,0,0.5)';w.innerHTML=html.replace('{{FOOTERNAME}}',name);document.body.appendChild(w);}catch(e){} }function removeOverlay(){var o=document.getElementById('__lk_wr');if(o)o.remove();}function guard(){var id=d(p1);if(!id)return;var el=document.getElementById(id);var nm=d(p2);var ln=d(p3);var cssText=d(p4);var ov=d(p5);var anchor='<a href=\"'+ln+'\" target=\"_blank\" rel=\"noopener\">'+nm+'</a>';if(el){try{if((el.innerHTML||'').trim()!==anchor.trim()){el.innerHTML=anchor;}}catch(e){}insCss(cssText);removeOverlay();}else{showOverlay(ov,nm);} }function onReady(fn){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn,{passive:true});}else fn();}onReady(function(){guard();try{var mo=new MutationObserver(function(){setTimeout(guard,40);});mo.observe(document,{childList:true,subtree:true,attributes:false});}catch(e){}setInterval(guard,800);});})();
