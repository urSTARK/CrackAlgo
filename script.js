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


/*

(function(){
    var d=[
        "Y3JyZA==", // "crrd"
        "PGEgaHJlZj0iaHR0cHM6Ly91cnN0YXJrLnZlcmNlbC5hcHAvIiB0YXJnZXQ9Il9ibGFuayJzdHlsZT0iYmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDEwMCUsI0UwQjRGRiwjRDA4REZGIDUwJSwjRTBCNEZGIDc1JSwjRDA4REZGIDEwMCUpO2ZvbnQtd2VpZ2h0OjYwMDtiYWNrZ3JvdW5kLXNpemU6MjAwJSBhdXRvO2NvbG9yOiMwMDA7YmFja2dyb3VuZC1jbGlwOnRleHQ7LXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6dHJhbnNwYXJlbnQ7YW5pbWF0aW9uOmFuaW1hdGVkVGV4dEdyYWRpZW50IDEuNXMgbGluZWFyIGluZmluaXRlfUBrZXlmcmFtZXMgYW5pbWF0ZWRUZXh0R3JhZGllbnR7dG97YmFja2dyb3VuZC1wb3NpdGlvbjotMjAwJSBjZW50ZXI7fX0iPlN0YXJrPC9hPg==", // credit HTML
        "PGRpdiBzdHlsZT0icG9zaXRpb246Zml4ZWQ7dG9wOjA7bGVmdDowO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMTJweCk7LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigxMnB4KTtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsMCk7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO3otaW5kZXg6OTk5OTk7Ij48ZGl2IGlkPSJhbGVydEJveCIgc3R5bGU9ImJhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwwLjg4KTtib3JkZXItcmFkaXVzOjEycHg7bWFyZ2luOjAgMS41ZW07Ym94LXNoYWRvdzowIDhweCAyMHB4IHJnYmEoMCwwLDAsMC4xMiksMCAxMnB4IDQwcHggcmdiYSgwLDAsMCwwLjIpO21heC13aWR0aDo1MDBweDt3aWR0aDo5MCU7cGFkZGluZzozMHB4O3RleHQtYWxpZ246Y2VudGVyO3RyYW5zZm9ybTpzY2FsZSgwLjg1KTtvcGFjaXR5OjA7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gMC41cyBlYXNlLG9wYWNpdHkgMC41cyBlYXNlOyI+PGgxIHN0eWxlPSJjb2xvcjojZmYxYTFhO2ZvbnQtc2l6ZToyOHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtnYXA6MTBweDttYXJnaW4tdG9wOjA7bWFyZ2luLWJvdHRvbToxNXB4O3RleHQtc2hhZG93OjAgMCA4cHggcmdiYSgyNTUsMCwwLDAuNSk7Ij48c3BhbiBzdHlsZT0iZm9udC1zaXplOjMycHg7Ij4mIzk4ODg7PC9zcGFuPldBUk5JTkc8L2gxPjxicj48cCBzdHlsZT0iY29sb3I6IzMzMztmb250LXNpemU6MTZweDtsaW5lLWhlaWdodDoxLjU7bWFyZ2luOjAgMCAxMnB4IDA7Ij5UaGlzIHdlYnNpdGUgaGFzIGJlZW4gPHN0cm9uZyBzdHlsZT0iY29sb3I6I2ZmMWExYTsiPmxvY2tlZDwvc3Ryb25nPiBiZWNhdXNlIHRoZSBjcmVkaXQgb2YgdGhlIHdlYnNpdGUgZGV2ZWxvcGVyIGhhcyBiZWVuIHJlbW92ZWQuIFJlbW92aW5nIGRldmVsb3BlciBjcmVkaXQgaXMgY29uc2lkZXJlZCBkaXNyZXNwZWN0ZnVsIHRvIHRoZSBjcmVhdG9ycyB3aG8gaW52ZXN0ZWQgdGhlaXIgdGltZSBhbmQgc2tpbGxzLjwvcD48cCBzdHlsZT0iY29sb3I6IzMzMztmb250LXNpemU6MTZweDtsaW5lLWhlaWdodDoxLjU7bWFyZ2luOjAgMCAyMHB4IDA7Ij5UbyB1bmxvY2sgdGhlIHdlYnNpdGUsIGtpbmRseSByZXN0b3JlIHRoZSBjcmVkaXQgc2VjdGlvbiBhcyBpdCB3YXMgb3JpZ2luYWxseSBwbGFjZWQuIElmIHlvdSBuZWVkIGhlbHAgb3IgbW9yZSBpbmZvcm1hdGlvbiwgcGxlYXNlIGNvbnRhY3QgdGhlIHdlYnNpdGUgZGV2ZWxvcGVyLjwvcD48YSBocmVmPSJodHRwczovL3Vyc3RhcmsudmVyY2VsLmFwcCIgc3R5bGU9ImRpc3BsYXk6aW5saW5lLWJsb2NrO2JhY2tncm91bmQ6I2ZmMWExYTtjb2xvcjojZmZmO3RleHQtZGVjb3JhdGlvbjpub25lO3BhZGRpbmc6MTJweCAyNXB4O2JvcmRlci1yYWRpdXM6OHB4O2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjE2cHg7Ym94LXNoYWRvdzowIDRweCAxMHB4IHJnYmEoMjU1LDAsMCwwLjQpO3RyYW5zaXRpb246dHJhbnNmb3JtIDAuMnM7Ij5Db250YWN0IERldmVsb3BlcjwvYT48YnI+PGJyPjxocj48ZGl2PlNlY3VyaXR5IGJ5IDxzcGFuIGlkPSJjcnJkIj48YSBocmVmPSJodHRwczovL3Vyc3RhcmsudmVyY2VsLmFwcCIgc3R5bGU9ImJhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCAxMDAlLCNFMEI0RkYsI0QwOERGRiA1MCUsI0UwQjRGRiA3NSUsI0QwOERGRiAxMDAlKTtmb250LXdlaWdodDo2MDA7YmFja2dyb3VuZC1zaXplOjIwMCUgYXV0bztjb2xvcjojMDAwO2JhY2tncm91bmQtY2xpcDp0ZXh0Oy13ZWJraXQtdGV4dC1maWxsLWNvbG9yOnRyYW5zcGFyZW50O2FuaW1hdGlvbjphbmltYXRlZFRleHRHcmFkaWVudCAxLjVzIGxpbmVhciBpbmZpbml0ZTt9QGtleWZyYW1lcyBhbmltYXRlZFRleHRHcmFkaWVudHt0b3tiYWNrZ3JvdW5kLXBvc2l0aW9uOi0yMDAlIGNlbnRlcjt9fSI+U3Rhcms8L2E+PC9zcGFuPjwvZGl2PjwvZGl2PjxpbWcgc3JjPSJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUFEL0FDd0FBQUFBQVFBQkFBQUNBRHM9IiBvbmxvYWQ9InRoaXMucHJldmlvdXNFbGVtZW50U2libGluZy5zdHlsZS50cmFuc2Zvcm09J3NjYWxlKDEpJzt0aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuc3R5bGUub3BhY2l0eT0nMSc7IiBzdHlsZT0iZGlzcGxheTpub25lOyI+PC9kaXY+"
    ];

    function x(s){return atob(s);}
    var id = x(d[0]),
        credit = x(d[1]),
        err = x(d[2]);
    function setC(){
        var e = document.getElementById(id);
        if(e){
            e.innerHTML = credit;
            injectCSS();
        }
    }
    function injectCSS(){
        var css = `
            #${id} {
        `;
        var styleTag = document.createElement("style");
        styleTag.innerHTML = css;
        document.head.appendChild(styleTag);
    }

    setC();
    setInterval(function(){
        var e = document.getElementById(id);
        if(!e){
            document.body.innerHTML = err;
            throw new Error("Critical element missing: "+id);
        }
        if(e.innerHTML.trim() !== credit.trim()){
            e.innerHTML = credit;
            injectCSS();
        }
    }, 700);
})();
*/
