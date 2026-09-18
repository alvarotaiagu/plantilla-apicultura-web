/* ==========================================================================
   Mel do Cordal — sitio de demostración (explotación ficticia)
   Concepto: «Tres quilómetros». Cuatro mapas de radio, cuatro mieles.

   Reglas de la casa:
   - El movimiento solo se promete si GSAP + ScrollTrigger cargaron de verdad
     (html.has-motion). Sin ellos, todo está pintado y usable.
   - prefers-reduced-motion apaga el MOVIMIENTO, no el CONTENIDO: los anillos,
     la flora, los tarros llenos y las barras del calendario siguen ahí.
   - Las apariciones van con IntersectionObserver, no con ScrollTrigger
     once:true, que puede no dispararse si el elemento ya está en pantalla.
   ========================================================================== */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var hayGsap = !!(window.gsap && window.ScrollTrigger);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var movimiento = hayGsap && !reduce;

  if (hayGsap) {
    raiz.classList.add('has-motion');
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- 0 · tareas largas (anotadas en el README) ---------- */
  window.__tareasLargas = [];
  if (window.PerformanceObserver) {
    try {
      var po = new PerformanceObserver(function (l) {
        l.getEntries().forEach(function (e) { window.__tareasLargas.push(Math.round(e.duration)); });
      });
      po.observe({ entryTypes: ['longtask'] });
      setTimeout(function () {
        var t = window.__tareasLargas;
        console.log('[Cordal] tareas largas (>50 ms) en los primeros 10 s: ' +
          (t.length ? t.join(', ') + ' ms · la peor ' + Math.max.apply(null, t) + ' ms' : 'ninguna'));
      }, 10000);
    } catch (e) { /* navegador sin longtask */ }
  }

  /* ---------- 1 · scroll suave ---------- */
  var lenis = null;
  if (movimiento && window.Lenis) {
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function irA(destino) {
    if (lenis) lenis.scrollTo(destino, { duration: 1.1 });
    else if (destino && destino.scrollIntoView) destino.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- 2 · cortina de entrada ----------
     Gesto propio del concepto: los tres anillos se dibujan de dentro afuera,
     la colmena se planta en el centro, el anillo exterior se abre hasta
     salirse de la pantalla y la cortina sube detrás con el borde de abajo
     curvado en un arco hondo, que es el mismo arco del radio.
     Retirada garantizada: sin GSAP y con movimiento reducido se quita de
     inmediato, y aun con GSAP hay una red de seguridad a los 4,2 s. */
  var preloader = document.getElementById('preloader');
  var animHero = [];                                  // el hero arranca cuando sube la cortina
  function arrancarHero() { animHero.splice(0).forEach(function (f) { f(); }); }

  function quitarPreloader() {
    if (!preloader) return;
    preloader.style.display = 'none';
    arrancarHero();
  }
  if (!movimiento) {
    quitarPreloader();
  } else {
    var tl = gsap.timeline();
    // Ojo: nada de tuitear `scale` con GSAP sobre elementos SVG de esta
    // cortina. GSAP mide el transformOrigin sobre el bbox y se lleva la pieza
    // fuera del lienzo; los dos gestos van en CSS y aquí solo se pone la clase.
    tl.to('.preloader__aro', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: .18 }, 0)
      .call(function () { preloader.classList.add('plantada'); }, null, .95)
      .call(function () { preloader.classList.add('abriendo'); }, null, 1.5)
      .to('.preloader__palabra', { opacity: 0, y: -14, duration: .5, ease: 'power2.in' }, 1.6)
      .to(preloader, { '--curva-cortina': 1, duration: .55, ease: 'power2.inOut' }, 1.85)
      .to(preloader, {
        yPercent: -102, duration: 1.3, ease: 'expo.inOut',
        onComplete: quitarPreloader
      }, 2.1)
      .add(arrancarHero, 2.4);
    setTimeout(quitarPreloader, 4600);   // red de seguridad
  }

  /* ---------- 3 · aviso de cookies ---------- */
  var banner = document.getElementById('cookieBanner');
  var aceptar = document.getElementById('cookieAceptar');
  var CLAVE = 'cordal-cookies';
  var visto = false;
  try { visto = localStorage.getItem(CLAVE) === 'si'; } catch (e) { visto = false; }
  if (banner && !visto) setTimeout(function () { banner.hidden = false; }, movimiento ? 4600 : 600);
  if (aceptar) {
    aceptar.addEventListener('click', function () {
      banner.hidden = true;
      try { localStorage.setItem(CLAVE, 'si'); } catch (e) { /* modo privado */ }
    });
  }

  /* ---------- 4 · menú y cabecera ---------- */
  var hamburguesa = document.getElementById('hamburguesa');
  var nav = document.getElementById('nav');
  if (hamburguesa && nav) {
    hamburguesa.addEventListener('click', function () {
      var abierta = nav.classList.toggle('abierta');
      hamburguesa.setAttribute('aria-expanded', abierta ? 'true' : 'false');
      hamburguesa.setAttribute('aria-label', abierta ? 'Cerrar el menú' : 'Abrir el menú');
    });
    nav.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) {
        nav.classList.remove('abierta');
        hamburguesa.setAttribute('aria-expanded', 'false');
        hamburguesa.setAttribute('aria-label', 'Abrir el menú');
      }
    });
  }

  var cabecera = document.getElementById('cabecera');
  function pintarCabecera() { if (cabecera) cabecera.classList.toggle('encogida', window.scrollY > 40); }
  window.addEventListener('scroll', pintarCabecera, { passive: true });
  pintarCabecera();

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var destino = document.querySelector(id);
      if (!destino) return;
      ev.preventDefault();
      irA(destino);
    });
  });

  /* ---------- 5 · titulares partidos en letras ---------- */
  function partir(el) {
    var texto = el.textContent;
    el.setAttribute('aria-label', texto);
    el.textContent = '';
    texto.split(' ').forEach(function (palabra, i, todas) {
      var p = document.createElement('span');
      p.className = 'palabra';
      p.setAttribute('aria-hidden', 'true');
      palabra.split('').forEach(function (c) {
        var l = document.createElement('span');
        l.className = 'letra';
        l.textContent = c;
        p.appendChild(l);
      });
      el.appendChild(p);
      if (i < todas.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return el.querySelectorAll('.letra');
  }

  if (movimiento) {
    document.querySelectorAll('[data-reveal]').forEach(function (el, idx) {
      var letras = partir(el);
      // El titular del hero no lleva retardo fijo: lo arranca la cortina.
      var lanzar = function () {
        var conf = { y: 0, duration: .9, ease: 'power3.out', stagger: .016 };
        if (idx !== 0) conf.scrollTrigger = { trigger: el, start: 'top 88%', once: true };
        gsap.to(letras, conf);
      };
      if (idx === 0) animHero.push(lanzar); else lanzar();
    });
  }

  /* ---------- 6 · contadores ---------- */
  document.querySelectorAll('.contador').forEach(function (el) {
    var hasta = parseInt(el.getAttribute('data-hasta'), 10);
    if (!movimiento || isNaN(hasta)) return;
    var obj = { v: 0 };
    el.textContent = '0';
    animHero.push(function () {
      gsap.to(obj, {
        v: hasta, duration: 1.6, ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(obj.v); }
      });
    });
  });

  /* ---------- 7 · cinta ---------- */
  var pista = document.getElementById('cintaPista');
  if (pista && movimiento) {
    pista.innerHTML = pista.innerHTML + pista.innerHTML;
    gsap.to(pista, { xPercent: -50, duration: 34, ease: 'none', repeat: -1 });
  }

  /* ---------- 8 · apariciones: anillos, flora, tarros, barras, fotos ------ */
  // Todo lo que se dibuja lo dispara la clase .visible en el contenedor, y el
  // movimiento está en CSS: así funciona igual sin GSAP y se apaga solo con
  // prefers-reduced-motion, sin quitar el contenido.
  var aRevelar = document.querySelectorAll('.colmenar, .grafico, .hero__radio, figure[data-mascara]');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.18 });
    aRevelar.forEach(function (el) { obs.observe(el); });
  } else {
    aRevelar.forEach(function (el) { el.classList.add('visible'); });
  }

  // los ocho marcadores de flora de cada mapa entran escalonados
  document.querySelectorAll('.radio__flora').forEach(function (grupo) {
    Array.prototype.slice.call(grupo.querySelectorAll('use')).forEach(function (u, i) {
      u.style.transitionDelay = (reduce ? 0 : .55 + i * 0.085) + 's';
    });
  });

  /* ---------- 9 · el radio del hero respira con el scroll ---------- */
  var radioHero = document.querySelector('.radio--hero');
  if (movimiento && radioHero) {
    gsap.fromTo(radioHero,
      { scale: 1, transformOrigin: '50% 50%' },
      {
        scale: .82, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
      });
  }

  /* ---------- 10 · cursor y botones magnéticos ---------- */
  var cursor = document.getElementById('cursor');
  var cursorTexto = document.getElementById('cursorTexto');
  var finoPuntero = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursor && finoPuntero && movimiento) {
    var cx = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var destino = { x: cx.x, y: cx.y };
    window.addEventListener('mousemove', function (ev) {
      destino.x = ev.clientX; destino.y = ev.clientY;
      cursor.classList.add('activo');
    }, { passive: true });
    gsap.ticker.add(function () {
      cx.x += (destino.x - cx.x) * .18;
      cx.y += (destino.y - cx.y) * .18;
      cursor.style.transform = 'translate(' + cx.x + 'px,' + cx.y + 'px) translate(-50%,-50%)';
    });
    document.querySelectorAll('[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorTexto.textContent = el.getAttribute('data-cursor');
        cursor.classList.add('etiqueta');
      });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('etiqueta'); });
    });
  }

  if (movimiento && finoPuntero) {
    document.querySelectorAll('.magnetico').forEach(function (el) {
      el.addEventListener('mousemove', function (ev) {
        var r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (ev.clientX - (r.left + r.width / 2)) * .28,
          y: (ev.clientY - (r.top + r.height / 2)) * .34,
          duration: .5, ease: 'power3.out'
        });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1, .45)' });
      });
    });
  }

  /* ---------- 11 · qué florece ahora mismo ---------- */
  // Los mismos meses que el gráfico, en una sola lista: si se cambian ahí,
  // hay que cambiarlos aquí. Meses inclusivos, 1 = enero.
  var FLORA = [
    { n: 'el salgueiro', desde: 2, hasta: 3 },
    { n: 'el toxo', desde: 2, hasta: 4 },
    { n: 'el eucalipto', desde: 5, hasta: 7 },
    { n: 'el castaño', desde: 6, hasta: 7 },
    { n: 'la silva', desde: 6, hasta: 8 },
    { n: 'el trébol', desde: 5, hasta: 9 },
    { n: 'el brezo', desde: 8, hasta: 10 }
  ];
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  function pintarAhora() {
    var el = document.getElementById('ahoraTexto');
    if (!el) return;
    var mes = new Date().getMonth() + 1;
    var enFlor = FLORA.filter(function (f) { return mes >= f.desde && mes <= f.hasta; })
      .map(function (f) { return f.n; });
    if (!enFlor.length) {
      el.textContent = 'En ' + MESES[mes - 1] + ' no hay floración que dé miel: las colmenas viven de lo que guardaron.';
    } else if (enFlor.length === 1) {
      el.textContent = 'Ahora, en ' + MESES[mes - 1] + ', está en flor ' + enFlor[0] + '.';
    } else {
      var ultimo = enFlor.pop();
      el.textContent = 'Ahora, en ' + MESES[mes - 1] + ', están en flor ' + enFlor.join(', ') + ' y ' + ultimo + '.';
    }
  }
  pintarAhora();

  /* ---------- 12 · abierto / cerrado, con el día de hoy marcado ---------- */
  // Martes en el mercado de Santa Comba 9:00–13:30; viernes en la casa
  // 16:30–20:00; sábado en la casa 10:00–14:00.
  var TRAMOS = {
    0: [], 1: [],
    2: [[540, 810, 'en el mercado de Santa Comba']],
    3: [], 4: [],
    5: [[990, 1200, 'en la casa']],
    6: [[600, 840, 'en la casa']]
  };
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  function hhmm(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h + ':' + (m < 10 ? '0' + m : m);
  }
  function pintarEstado() {
    var estado = document.getElementById('estado');
    var texto = document.getElementById('estadoTexto');
    if (!estado || !texto) return;
    var ahora = new Date();
    var dia = ahora.getDay();
    var min = ahora.getHours() * 60 + ahora.getMinutes();
    var tramos = TRAMOS[dia] || [];
    var abierto = tramos.filter(function (t) { return min >= t[0] && min < t[1]; })[0];

    estado.classList.toggle('abierto', !!abierto);
    estado.classList.toggle('cerrado', !abierto);

    if (abierto) {
      texto.textContent = 'Ahora mismo, ' + abierto[2] + ' hasta las ' + hhmm(abierto[1]);
    } else {
      var siguiente = tramos.filter(function (t) { return min < t[0]; })[0];
      if (siguiente) {
        texto.textContent = 'Hoy ' + siguiente[2] + ', de ' + hhmm(siguiente[0]) + ' a ' + hhmm(siguiente[1]);
      } else {
        var d = dia, vueltas = 0;
        do { d = (d + 1) % 7; vueltas++; } while (!(TRAMOS[d] || []).length && vueltas < 8);
        var prim = TRAMOS[d][0];
        texto.textContent = 'Cerrado ahora · el ' + DIAS[d] + ', ' + prim[2] + ' desde las ' + hhmm(prim[0]);
      }
    }

    var filas = document.querySelectorAll('#horarioCuerpo tr');
    var indiceHoy = (dia + 6) % 7;   // la tabla empieza en lunes
    filas.forEach(function (f, i) { f.classList.toggle('hoy', i === indiceHoy); });
  }
  pintarEstado();
  setInterval(pintarEstado, 60000);

  /* ---------- 13 · el mapa solo si lo pides ---------- */
  var mapaBoton = document.getElementById('mapaBoton');
  if (mapaBoton) {
    mapaBoton.addEventListener('click', function () {
      var hueco = document.getElementById('mapaConsent');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Mazaricos, A Coruña') + '&output=embed';
      iframe.title = 'Mapa de Mazaricos (A Coruña), donde estaría la explotación';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      hueco.replaceWith(iframe);
    });
  }

  /* ---------- 14 · refresco final ---------- */
  if (hayGsap) {
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  }
})();
