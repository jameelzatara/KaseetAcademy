import base64, pathlib

def find_and_b64(*keywords):
    for p in pathlib.Path(".").rglob("*"):
        if p.is_file() and any(k.lower() in p.name.lower() for k in keywords):
            try:
                return base64.b64encode(p.read_bytes()).decode()
            except:
                pass
    return ""

hero = find_and_b64("hero", "bg")
logo = find_and_b64("kaseet", "logo_")
wj   = find_and_b64("wajeez", "chip")

reel_urls = [
    "https://www.instagram.com/p/DYcvgQesju9/",
    "https://www.instagram.com/p/DbGBYbhsHNp/",
    "https://www.instagram.com/p/DW6yTEvDMgv/",
    "https://www.instagram.com/p/DWCVkWoDPLS/",
    "https://www.instagram.com/p/DbYqCDzMLPJ/",
]

reels_html = "\n        ".join(
    '<div class="reel-card">'
    '<div class="reel-embed-wrap">'
    '<blockquote class="instagram-media" data-instgrm-permalink="' + u + '" data-instgrm-version="14"></blockquote>'
    '</div>'
    '<div class="rc-strip">'
    '<div class="rc-info"><span class="rc-avatar">ك</span><span class="rc-name">من متدرّبي كاسيت</span></div>'
    '<span class="rc-stars">★★★★★</span>'
    '</div>'
    '</div>'
    for u in reel_urls
)

html_template = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>كاسيت أكاديمي</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<style>
  :root{
    --navy:#141a26;
    --navy-card:#1a2232;
    --gold:#FFC107;
    --off:#FCFBFB;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%;background:var(--navy)}
  body{
    font-family:'Tajawal',sans-serif;
    color:var(--off);
    overflow-x:hidden;
  }

  /* ---------- HERO SECTION ---------- */
  .hero{
    position:relative;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    isolation:isolate;
    background:var(--navy);
  }
  .hero-bg{
    position:absolute;inset:0;z-index:-2;
    background:url('data:image/jpeg;base64,__HERO__') center 28% / cover no-repeat;
    transform:scale(1.02);
  }
  .hero-overlay{
    position:absolute;inset:0;z-index:-1;
    background:
      radial-gradient(130% 80% at 50% 26%, rgba(20,26,38,.35) 0%, rgba(20,26,38,.65) 48%, rgba(20,26,38,.95) 100%),
      linear-gradient(180deg, rgba(20,26,38,.50) 0%, rgba(20,26,38,.40) 50%, rgba(20,26,38,1) 100%);
  }

  /* NAV */
  .nav{
    display:flex;align-items:center;justify-content:space-between;
    padding:22px clamp(18px,4vw,54px);
    gap:16px;
  }
  .nav-logo img{height:46px;width:auto;display:block;filter:drop-shadow(0 2px 8px rgba(0,0,0,.35));}
  .nav-actions{display:flex;align-items:center;gap:14px}
  .cta{
    font-family:'Tajawal',sans-serif;font-weight:700;font-size:15px;
    color:var(--navy);background:var(--gold);
    border:none;border-radius:999px;
    padding:12px 26px;cursor:pointer;
    box-shadow:0 6px 20px rgba(255,193,7,.30);
    transition:transform .18s ease, box-shadow .18s ease;
  }
  .cta:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(255,193,7,.42)}
  .lang-pill{
    font-family:'Tajawal',sans-serif;font-weight:500;font-size:14px;
    color:var(--off);background:rgba(255,255,255,.10);
    border:1px solid rgba(255,255,255,.20);border-radius:999px;
    padding:9px 16px;cursor:pointer;backdrop-filter:blur(6px);
  }
  .menu{
    background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.20);
    border-radius:12px;width:44px;height:44px;cursor:pointer;
    display:grid;place-items:center;backdrop-filter:blur(6px);
  }
  .menu span{display:block;width:20px;height:2px;background:var(--gold);
    border-radius:2px;box-shadow:0 6px 0 var(--gold),0 -6px 0 var(--gold)}

  /* HERO CONTENT */
  .hero-content{
    flex:1;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;
    padding:20px clamp(18px,5vw,40px) 10px;
    gap:clamp(16px,2.2vh,24px);
  }
  .headline{
    font-family:'Tajawal',sans-serif;
    font-weight:900;line-height:1.25;
    font-size:clamp(32px,5.6vw,64px);
    letter-spacing:-.5px;
  }
  .headline .lower{color:rgba(252,251,251,.95);display:block}
  .headline .lower .dots{color:var(--gold);letter-spacing:3px}
  .headline .raise{color:var(--gold);display:block;text-shadow:0 4px 34px rgba(255,193,7,.40)}

  .phrase-block{
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:4px;
  }
  .phrase-fixed{
    font-family:'Tajawal',sans-serif;font-weight:500;
    font-size:clamp(15px,1.7vw,19px);color:rgba(252,251,251,.85);
  }
  .rotator{
    position:relative;overflow:hidden;
    height:clamp(48px,6vw,72px);
    min-width:clamp(220px,32vw,360px);
    display:flex;align-items:center;justify-content:center;
  }
  .rotator .slot{
    position:absolute;inset:0;
    display:flex;align-items:center;justify-content:center;
    font-family:'Tajawal',sans-serif;font-weight:900;
    font-size:clamp(32px,4.8vw,56px);color:var(--gold);
    white-space:nowrap;text-shadow:0 4px 30px rgba(255,193,7,.38);
    transform:translateY(110%);opacity:0;
    transition:transform .55s cubic-bezier(.3,.8,.25,1),opacity .45s ease;
  }
  .rotator .slot.active{transform:translateY(0);opacity:1}
  .rotator .slot.exit{transform:translateY(-110%);opacity:0}

  .subtext{
    font-family:'Tajawal',sans-serif;font-weight:400;
    font-size:clamp(14px,1.7vw,18px);line-height:1.8;
    color:rgba(252,251,251,.85);max-width:640px;
  }

  /* STATS BAR */
  .footer-zone{position:relative;background:var(--navy);padding-bottom:40px}
  .stats-bar{
    position:relative;z-index:1;
    display:flex;align-items:center;justify-content:space-between;
    gap:clamp(14px,2.4vw,30px);flex-wrap:wrap;
    max-width:950px;margin:0 auto;
    padding:16px clamp(18px,2.4vw,28px);
    background:var(--navy-card);
    border:1px solid rgba(255,193,7,.3);
    border-radius:16px;
    box-shadow:0 12px 35px rgba(0,0,0,.5);
  }
  .bar-divider{width:1px;height:42px;background:rgba(255,255,255,.16);flex:none}
  .app-promo{display:flex;align-items:center;gap:12px}
  .app-badge{
    width:44px;height:44px;border-radius:11px;overflow:hidden;flex:none;
    background:#fff;display:grid;place-items:center;padding:4px;
  }
  .app-badge img{width:100%;height:100%;object-fit:contain;display:block}
  .app-promo .txt{text-align:start;max-width:210px}
  .app-promo .txt b{display:block;font-family:'Tajawal';font-weight:700;font-size:14px;color:var(--off)}
  .app-promo .txt .sub{display:block;font-family:'Tajawal';font-weight:400;font-size:12px;color:rgba(252,251,251,.62)}
  .stats{display:flex;align-items:center;gap:clamp(16px,2.6vw,40px)}
  .stat{text-align:center;position:relative;padding-bottom:11px}
  .stat::after{
    content:'';position:absolute;bottom:0;left:12%;right:12%;height:2px;
    background:var(--gold);border-radius:2px;
  }
  .stat .num{
    font-family:'Poppins',sans-serif;font-weight:700;
    font-size:clamp(18px,2.2vw,26px);color:var(--gold);line-height:1;
    direction:ltr;
  }
  .stat .lbl{font-family:'Tajawal';font-weight:400;font-size:12.5px;color:rgba(252,251,251,.72);margin-top:6px}
  .stat-sep{width:1px;height:38px;background:rgba(255,255,255,.14)}

  /* ================= REELS SECTION (STRICT 3 CARDS ONLY) ================= */
  .reels{
    position:relative;text-align:center;
    background-color:var(--navy);
    padding:60px 20px 100px;
    border-top:1px solid rgba(255,255,255,0.06);
  }
  .reels .r-badge{
    display:inline-flex;align-items:center;gap:8px;
    font-family:'Tajawal',sans-serif;font-weight:700;font-size:13px;color:var(--gold);
    background:rgba(255,193,7,.08);
    border:1px solid rgba(255,193,7,.25);
    border-radius:999px;padding:6px 18px;margin-bottom:18px;
  }
  .reels .r-badge .dot{width:7px;height:7px;border-radius:50%;background:var(--gold)}
  .reels h2{
    font-family:'Tajawal';font-weight:900;color:var(--off);
    font-size:clamp(28px,4.5vw,48px);line-height:1.25;margin:0 0 12px;
  }
  .reels h2 .g{color:var(--gold)}
  .reels .r-sub{
    font-family:'Tajawal';font-weight:400;color:rgba(252,251,251,.70);
    font-size:clamp(14px,1.8vw,17px);line-height:1.8;
    max-width:600px;margin:0 auto 40px;
  }

  /* CAROUSEL MASK: EXACTLY FIXED WIDTH FOR 3 CARDS ONLY */
  .carousel-outer{
    max-width:930px; /* Precise width to frame 3 cards cleanly */
    margin:0 auto;
    position:relative;
  }
  .carousel-viewport{
    overflow:hidden; /* Strictly hides any extra cards on left and right */
    padding:20px 0 30px;
    width:100%;
  }
  .track{
    display:flex;
    gap:30px;
    align-items:center;
    transition:transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
    will-change:transform;
  }
  .reel-card{
    flex:0 0 270px;
    width:270px;
    border-radius:20px;overflow:hidden;
    background:var(--navy-card);
    border:1px solid rgba(255,255,255,0.08);
    transform:scale(0.88);
    opacity:0.35;
    filter:grayscale(40%);
    transition:all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .reel-card.is-center{
    transform:scale(1.04);
    opacity:1;
    filter:none;
    z-index:5;
    border:2px solid var(--gold);
    box-shadow:0 0 35px rgba(255,193,7,0.25), 0 15px 35px rgba(0,0,0,0.6);
  }
  .reel-embed-wrap{
    width:100%;min-height:420px;
    background:#0d1117;
    display:flex;align-items:center;justify-content:center;
    overflow:hidden;
  }
  .reel-embed-wrap blockquote{
    margin:0 !important;width:100% !important;min-width:100% !important;border:none !important;
  }
  .rc-strip{
    display:flex;align-items:center;justify-content:space-between;
    padding:12px 16px;
    background:rgba(20, 26, 36, 0.95);
    border-top:1px solid rgba(255,255,255,0.08);
  }
  .rc-info{display:flex;align-items:center;gap:8px}
  .rc-avatar{
    width:24px;height:24px;border-radius:50%;
    background:var(--gold);color:var(--navy);
    font-weight:900;font-size:12px;display:grid;place-items:center;
  }
  .rc-name{font-family:'Tajawal';font-weight:700;font-size:12.5px;color:rgba(255,255,255,0.9)}
  .rc-stars{color:var(--gold);font-size:12px;letter-spacing:2px}

  .car-btn{
    position:absolute;top:50%;transform:translateY(-50%);
    width:46px;height:46px;border-radius:50%;cursor:pointer;z-index:10;
    background:rgba(255,255,255,0.08);
    border:1px solid rgba(255,255,255,0.2);
    color:var(--gold);
    display:grid;place-items:center;
    backdrop-filter:blur(8px);
    transition:all .22s ease;
  }
  .car-btn:hover{
    background:var(--gold);color:var(--navy);
    transform:translateY(-50%) scale(1.1);
  }
  .car-btn svg{width:20px;height:20px}
  .car-prev{right:-22px}
  .car-next{left:-22px}

  @media (max-width:768px){
    .carousel-outer{max-width:100%}
    .car-prev{right:2px} .car-next{left:2px}
    .reel-card{flex:0 0 240px;width:240px}
  }
</style>
</head>
<body>
  <div class="hero">
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>

    <header class="nav">
      <div class="nav-logo"><img src="data:image/png;base64,__LOGO__" alt="كاسيت"></div>
      <nav class="nav-actions">
        <button class="cta">ابدأ رحلتك الصوتية</button>
        <button class="lang-pill">JD · ع</button>
        <button class="menu" aria-label="القائمة"><span></span></button>
      </nav>
    </header>

    <main class="hero-content">
      <h1 class="headline">
        <span class="lower">اخفض صوت العالم<span class="dots">...</span></span>
        <span class="raise">وارفع صوت الكاسيت</span>
      </h1>

      <div class="phrase-block">
        <span class="phrase-fixed">لكل</span>
        <div class="rotator" id="box"></div>
      </div>

      <p class="subtext">الأكاديمية الأولى في تدريب التعليق الصوتي، صناعة البودكاست، والإنتاج المرئي.</p>
    </main>

    <div class="footer-zone">
      <div class="stats-bar">
        <div class="stats">
          <div class="stat"><div class="num"><span class="val" data-target="5000">0</span><span class="plus">+</span></div><div class="lbl">طالب مسجّل</div></div>
          <div class="stat-sep"></div>
          <div class="stat"><div class="num"><span class="val" data-target="700">0</span><span class="plus">+</span></div><div class="lbl">دورة تدريبية</div></div>
          <div class="stat-sep"></div>
          <div class="stat"><div class="num"><span class="val" data-target="8500">0</span><span class="plus">+</span></div><div class="lbl">ساعة تدريب مباشر</div></div>
        </div>
        <span class="bar-divider"></span>
        <div class="app-promo">
          <div class="app-badge"><img src="data:image/png;base64,__WJ__" alt="وجيز"></div>
          <div class="txt"><b>شهادة معتمدة من تطبيق وجيز</b><span class="sub">أكبر منصة صوتية بالشرق الأوسط</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- REELS SHOWCASE (EXACTLY 3 VISIBLE CARDS AT A TIME) -->
  <section class="reels">
    <span class="r-badge"><span class="dot"></span> من الاستوديو مباشرة</span>
    <h2>أصوات <span class="g">صنعناها معاً</span></h2>
    <p class="r-sub">مقاطع حيّة من ورشنا وأعمال متدربينا ومدربينا على إنستغرام.</p>

    <div class="carousel-outer">
      <button class="car-btn car-prev" id="reelPrev" aria-label="السابق">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <div class="carousel-viewport" id="reelsViewport">
        <div class="track" id="reelTrack">
          __REELS_HTML__
        </div>
      </div>

      <button class="car-btn car-next" id="reelNext" aria-label="التالي">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
    </div>
  </section>

<script>
  const phrases = ["صوتٍ حكاية", "نبرةٍ أثر", "حرفٍ رسالة", "موهبةٍ فرصة", "حلمٍ بداية"];
  const box = document.getElementById('box');
  let cur = 0;
  const slots = phrases.map((t,i)=>{
    const s = document.createElement('span');
    s.className = 'slot' + (i === 0 ? ' active' : '');
    s.textContent = t;
    box.appendChild(s);
    return s;
  });

  setInterval(()=>{
    const prev = slots[cur];
    cur = (cur + 1) % slots.length;
    const next = slots[cur];
    prev.classList.remove('active');
    prev.classList.add('exit');
    next.classList.remove('exit');
    next.classList.add('active');
    setTimeout(()=>prev.classList.remove('exit'), 600);
  }, 2600);

  // COUNTERS
  const fmt = n => Math.round(n).toLocaleString('en-US');
  document.querySelectorAll('.stat .val').forEach(el=>{
    const target = +el.dataset.target;
    const dur = 1700; const start = performance.now();
    const step = now => {
      const p = Math.min(1, (now-start)/dur);
      el.textContent = fmt(target * (1 - Math.pow(1-p,3)));
      if(p<1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    };
    requestAnimationFrame(step);
  });

  // CAROUSEL LOGIC FOR STRICT 3 CARDS FOCUS
  (function(){
    var track = document.getElementById('reelTrack');
    var viewport = document.getElementById('reelsViewport');
    var pBtn = document.getElementById('reelPrev');
    var nBtn = document.getElementById('reelNext');
    if(!track || !viewport) return;

    var cards = Array.from(track.children);
    var activeIdx = 1;

    function updateCarousel(){
      if(!cards.length) return;
      cards.forEach(function(c, i){
        if(i === activeIdx) c.classList.add('is-center');
        else c.classList.remove('is-center');
      });

      var cardW = cards[0].offsetWidth || 270;
      var gap = 30;
      var vpWidth = viewport.offsetWidth;
      var activeCenter = activeIdx * (cardW + gap) + (cardW / 2);
      var shift = (vpWidth / 2) - activeCenter;

      track.style.transform = 'translateX(' + shift + 'px)';
    }

    if(pBtn) pBtn.addEventListener('click', function(){
      if(activeIdx > 0){ activeIdx--; updateCarousel(); }
    });
    if(nBtn) nBtn.addEventListener('click', function(){
      if(activeIdx < cards.length - 1){ activeIdx++; updateCarousel(); }
    });

    window.addEventListener('resize', updateCarousel);
    setTimeout(updateCarousel, 300);

    var checkCount = 0;
    var timer = setInterval(function(){
      checkCount++;
      if(window.instgrm && window.instgrm.Embeds){
        window.instgrm.Embeds.process();
        setTimeout(updateCarousel, 500);
      }
      if(checkCount > 10) clearInterval(timer);
    }, 800);
  })();
</script>
<script async src="https://www.instagram.com/embed.js"></script>
</body>
</html>"""

html = html_template.replace("__HERO__", hero).replace("__LOGO__", logo).replace("__WJ__", wj).replace("__REELS_HTML__", reels_html)

out = "index.html"
pathlib.Path(out).write_text(html, encoding="utf-8")
print("written:", out, "size:", len(html), "bytes (Ready for Preview!)")