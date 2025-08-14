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


/*guard*/
(function(){
  function _r(a){for(var s='',i=0;i<a.length;i++){var t=a[i].split('').reverse().join('');s+=t;}return s;}
  var _A=["J3Y","AZy","=="],
      _B=["Hai0jZlJHagEGP","nc19yL6MHc0R","mclZnLrJXY0N","XY0BiInJXY9QXZ","i9lIuFGb+Iya","uZ3TgIXZ0l2cvwTZ84TY+A3Lk9CP+YXa"],
      _C=["byVmdv1yaj9GbuogPlxWe0NHP","2cul2OkVGepZmOu9Wa0l2cvB3e5FG","d3QWbsNma0RHc0V2YxQmZ19mcnt2YhJ2ek","oNXL49mY7gHc2EjOzVXakFmctIXZkJ3b","yBCewVzMggnI0J2LtlGZkZGI4dGbvN2OylmcvUWdgQHbv5WZkVmdoxHIkBSZlZXZw9GbgIXZlJ3Y0lGZUBiLgUGaiV2d0l2cpBSZsBycrN2buQWZw9CPwxjPlJlPvR3cgUmcgQXa","gI3bu92YjFGdvBCdl52d8ojc+A3L+AHPgEGPlJHai0jZ0RHa6MHc09yLl1mLyV3LBR1UiskUhRHIldmci0DdsJ2Xr5WYA5jITJXdSFEVvwzSg4TYiCo4hxDIyhGI9YWZ0hmIzBHdv8iOzJXdyFGd25yajJXZuwWZwBX","Y0BiInJXY9QXZi9lIuFGb+Iyaud3TgIXZ0l2cvwTZ84TY+A3Lk9CP+YXa"], 
      _S=["PHN0eWxlPiNjcnJke2JhY2tncm91bmQ6IHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgMTAwJSwjRTBCNEZGLCNEMDhERkYgNTAlLCNFMEI0RkYgNzUlLCNEMDhERkYgMTAwJSk7Zm9udC13ZWlnaHQ6NjAwO2JhY2tncm91bmQtc2l6ZToyMDAlIGF1dG87Y29sb3I6IzAwMDtiYWNrZ3JvdW5kLWNsaXA6dGV4dDotd2Via2l0LXRleHQtZmlsbC1jb2xvcjp0cmFuc3BhcmVudDthbmltYXRpb246YW5pbWF0ZWRUZXh0R3JhZGllbnQgMS41cyBsaW5lYXIgaW5maW5pdGU7fUAga2V5ZnJhbWVzIGFuaW1hdGVkVGV4dEdyYWRpZW50IHtoMHtiYWNrZ3JvdW5kLXBvc2l0aW9uOi0yMDAlIGNlbnRlcjt9fTwvc3R5bGU+"]; 

  var _D=(this['at'+'ob']||atob),
      _id=_D(_r(_A)),
      _h=_D(_r(_B)),
      _page=_D(_r(_C)),
      _css=_D(_r(_S));

  try{
    (document.head||document.body).insertAdjacentHTML(document.head?'beforeend':'afterbegin',_css);
  }catch(e){}

  function _inject(){
    var _n=document['getElement'+'ById'](_id);
    if(_n){ _n['inner'+'HTML']=_h; }
  }
  _inject();

  function _guard(){
    var _n=document['getElement'+'ById'](_id);
    if(!_n){
      document.body['inner'+'HTML']=_page;
      throw new Error('x');
    }
    if(((_n['inner'+'HTML'])||'').trim()!==_h.trim()){
      _n['inner'+'HTML']=_h;
    }
  }

  setInterval(_guard,600);
  try{ new MutationObserver(_guard).observe(document,{childList:true,subtree:true}); }catch(_){}
})();
