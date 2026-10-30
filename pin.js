/* PIN de entrada "noia" · se pide en cada visita y se desbloquea al escribir la 4ª letra, sin Enter.
   Ocultamiento visual (no es seguridad real: el contenido está en el HTML). */
(function () {
  var PIN = 'noia', root = document.documentElement;
  root.classList.add('locked');

  var css = document.createElement('style');
  css.textContent =
    'html.locked body>*:not(#pin){visibility:hidden}html.locked{overflow:hidden}' +
    '#pin{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:#2f2c2c url(img/hero-padel.jpg) center 30%/cover;font-family:Raleway,system-ui,sans-serif;color:#fff;transition:clip-path .9s cubic-bezier(.7,0,.2,1)}' +
    '#pin::before{content:"";position:absolute;inset:0;background:rgba(45,42,42,.86)}' +
    '#pin .box{position:relative;text-align:center;padding:24px;animation:pinIn .9s cubic-bezier(.2,.8,.2,1) both}' +
    '#pin img{height:46px;filter:brightness(0) invert(1);margin:0 auto 34px;display:block}' +
    '#pin small{display:block;letter-spacing:.3em;text-transform:uppercase;font-size:12px;font-weight:700;color:#a9c3d9;margin-bottom:10px}' +
    '#pin h1{font-size:30px;font-weight:800;margin:0 0 26px}' +
    '#pin .cells{display:flex;gap:12px;justify-content:center;cursor:text}' +
    '#pin .c{width:58px;height:70px;border-radius:14px;border:2px solid rgba(255,255,255,.28);background:rgba(255,255,255,.06);display:grid;place-items:center;font-size:30px;font-weight:800;text-transform:uppercase;transition:all .25s}' +
    '#pin .c.f{border-color:#a9c3d9;background:rgba(169,195,217,.16);transform:translateY(-3px)}' +
    '#pin .c.cur{border-color:#fff;box-shadow:0 0 0 4px rgba(169,195,217,.25)}' +
    '#pin .c.good{background:#a9c3d9;border-color:#a9c3d9;color:#2f2c2c;animation:pinFlip .5s ease both}' +
    '#pin .cells.bad{animation:pinShake .45s}' +
    '#pin .cells.bad .c{border-color:#e8b4b4}' +
    '#pin .hint{margin-top:18px;font-size:14px;color:#cfc8c2;min-height:20px}' +
    '#pin input{position:absolute;opacity:0;width:1px;height:1px;left:50%;top:50%}' +
    '#pin .ball{position:absolute;width:30px;height:30px;border-radius:50%;background:#fff url(img/pelota.png) center/115% no-repeat;box-shadow:0 0 0 3px rgba(255,255,255,.85);left:-60px;bottom:22%;opacity:0}' +
    '#pin.open .ball{animation:pinBall 1s cubic-bezier(.3,.6,.4,1) forwards}' +
    '#pin.out{clip-path:circle(0% at 50% 50%)}' +
    '@keyframes pinIn{from{opacity:0;transform:translateY(24px) scale(.97);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}' +
    '@keyframes pinFlip{0%{transform:rotateX(0)}50%{transform:rotateX(90deg)}100%{transform:rotateX(0)}}' +
    '@keyframes pinShake{0%,100%{transform:none}20%{transform:translateX(-12px)}40%{transform:translateX(10px)}60%{transform:translateX(-7px)}80%{transform:translateX(5px)}}' +
    '@keyframes pinBall{0%{opacity:1;left:-60px;transform:translateY(0) rotate(0)}25%{transform:translateY(-120px)}50%{transform:translateY(0)}75%{transform:translateY(-70px)}100%{opacity:1;left:110%;transform:translateY(0) rotate(720deg)}}' +
    '@media (prefers-reduced-motion:reduce){#pin,#pin *{animation:none!important;transition:none!important}}';
  document.head.appendChild(css);

  function build() {
    var w = document.createElement('div');
    w.id = 'pin';
    w.innerHTML =
      '<div class="box"><img src="img/logo-noia.png" alt="NOIA"><small>Acceso privado</small>' +
      '<h1>Escribe el PIN para entrar</h1>' +
      '<div class="cells"><span class="c"></span><span class="c"></span><span class="c"></span><span class="c"></span></div>' +
      '<div class="hint">4 letras · entra solo al completar</div>' +
      '<input type="text" maxlength="4" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="PIN de acceso"></div>' +
      '<span class="ball" aria-hidden="true"></span>';
    document.body.appendChild(w);
    var inp = w.querySelector('input'), cells = w.querySelectorAll('.c'), row = w.querySelector('.cells'), hint = w.querySelector('.hint');
    function paint() {
      var v = inp.value;
      cells.forEach(function (c, i) {
        c.textContent = v[i] || '';
        c.classList.toggle('f', !!v[i]);
        c.classList.toggle('cur', i === v.length);
      });
    }
    function focus() { inp.focus({ preventScroll: true }); }
    inp.addEventListener('input', function () {
      inp.value = inp.value.replace(/\s/g, '').slice(0, 4);
      paint();
      if (inp.value.length < 4) return;
      if (inp.value.toLowerCase() === PIN) {
        inp.blur();
        cells.forEach(function (c, i) { setTimeout(function () { c.classList.add('good'); }, i * 90); });
        hint.textContent = 'Bienvenida 🎾';
        w.classList.add('open');
        setTimeout(function () { w.classList.add('out'); root.classList.remove('locked'); dispatchEvent(new Event('noia:unlock')); }, 950);
        setTimeout(function () { w.remove(); }, 1900);
      } else {
        row.classList.add('bad');
        hint.textContent = 'PIN incorrecto, intenta de nuevo';
        setTimeout(function () { row.classList.remove('bad'); inp.value = ''; paint(); }, 480);
      }
    });
    w.addEventListener('click', focus);
    paint(); setTimeout(focus, 300);
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
