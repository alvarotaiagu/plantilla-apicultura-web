# Plantilla · Apicultura y mielería — «Tres quilómetros»

> **Sitio de demostración.** *Mel do Cordal* es una explotación apícola
> **ficticia**. El nombre, la dirección, los teléfonos, el correo, los cuatro
> colmenares, las cosechas, los precios y las notas del cuaderno están
> inventados. **No se publica ningún número de registro sanitario (RGSEAA) ni de
> REGA, y no se reclama la IGP «Mel de Galicia»**: el aviso legal explica cuál es
> el dato que iría en cada hueco. **No se atribuye a la miel ninguna propiedad
> medicinal**, y eso no es una omisión: es una sección entera de la página.

**Demo:** https://alvarotaiagu.github.io/plantilla-apicultura-web/

---

## El concepto

La imagen evidente del sector es **el hexágono del panal**, y no aparece en
ningún sitio de esta plantilla. La entrada es otra:

> **La miel no la hacemos nosotros. La hace lo que florece en tres kilómetros a
> la redonda.**

Tres kilómetros es el radio en el que una abeja pecorea bien; más lejos gasta
más de lo que trae. Así que una miel **es el mapa de lo que hay dentro de ese
círculo**, y cambiar de sitio el colmenar es cambiar de miel.

La sección protagonista es una **lámina comparativa**: cuatro colmenares, cuatro
mapas de radio dibujados —brañas encharcadas, curvas de nivel de una loma a 480
m, un souto de castaños en un valle y el río cruzando— y, debajo de cada uno,
**el tarro de la miel que sale de ahí, lleno de su color real**. Se leen los
cuatro de un vistazo y se entiende por qué no se mezclan.

No hay pestañas ni estados que esconder: **todo está a la vista a la vez**. Lo
que se mueve es el dibujo cuando llegas a él.

## Recursos de movimiento (todos salen del concepto)

1. **Los anillos se dibujan** (`stroke-dasharray` + `pathLength="1"`), de fuera
   adentro, en los cuatro mapas y en el del hero.
2. **La flora aparece escalonada** dentro de cada círculo: 36 marcadores en
   total —brezo, toxo, árbol y hierba— colocados uno a uno según lo que hay en
   cada sitio, recortados al anillo exterior con un `clipPath` porque lo que
   queda fuera de tres kilómetros no cuenta.
3. **Los cuatro tarros se llenan** de abajo arriba con el color real de su miel
   (`scaleY` sobre el rectángulo recortado a la silueta del tarro).
4. **Las siete barras del calendario crecen** desde enero hacia su mes.
5. **El radio del hero se cierra con el scroll** (`scrub`).
6. **La intro** dibuja los tres anillos y planta la colmena en el centro.
7. Titulares partidos en letras, cinta, cursor con etiqueta, botones magnéticos,
   máscaras de foto y contadores.

Y dos datos vivos, que no son adorno: **qué está floreciendo hoy** (calculado
con la fecha del navegador sobre la misma tabla de meses del gráfico) y
**dónde se vende ahora mismo**, que distingue el puesto del mercado del martes
de la venta en la casa el viernes y el sábado.

## Lo que se ha verificado (§7)

`node verificar-generico.js <repo> <salida> <puerto> conf-apicultura.json`

| Prueba | Resultado |
|---|---|
| Recorrido completo, escritorio 1440×900 | 21 capturas, sin errores de consola |
| Recorrido completo, móvil 390×844 | 25 capturas + menú |
| Los cuatro colmenares | `4 colmenares`, mieles `rgb(74,42,20) rgb(122,52,24) rgb(154,90,28) rgb(203,154,52)` — cuatro colores distintos de verdad |
| Mapas | `36 marcadores · 15 anillos` |
| Calendario | columnas de rejilla `2-4 2-5 5-8 6-8 6-9 5-10 8-11`, que es exactamente el calendario escrito en el texto alternativo |
| Dato vivo | «Ahora, en septiembre, están en flor el trébol y el brezo» |
| Aviso de cookies | aparece, se cierra y no vuelve |
| Mapa de Google | 0 iframes hasta pulsar, 1 después |
| **Sin GSAP** (CDN cortado) | `has-motion:false`, titular legible, **flora al 100 % de opacidad, tarros y barras sin transformar (es decir, pintados), foto sin recortar**, contador con su cifra y el dato vivo funcionando |
| **Movimiento reducido** | anillos con `stroke-dashoffset: 0`, flora `opacity: 1`, tarros `scaleY(1)` y barras `scaleX(1)`: el contenido está, lo que falta es la transición |
| **Tareas largas** (`PerformanceObserver`, 10 s) | **ninguna**, en tres cargas en frío con la caché deshabilitada |

Las capturas están en `screenshots/`, en JPEG de calidad 72.

## Accesibilidad

**axe-core: 0 violaciones** en las ocho pasadas. Detalle en
[`AUDITORIA.md`](AUDITORIA.md), incluido lo que axe no mira (el texto dentro del
SVG) y por qué el calendario lleva su descripción escrita.

Ningún texto se apaga con `opacity`. El ámbar de marca (2,80 como texto) se
queda en rellenos y filetes, con `--ambar-texto` (5,12) y `--ambar-claro` (6,12)
calculados aparte.

## La línea roja del sector

Un sitio de apicultura es el lugar más fácil del mundo para escribir una
barbaridad. Aquí hay una sección entera, **«La miel es un alimento, no un
remedio»**, que dice explícitamente que no se le atribuye ninguna propiedad
curativa, y el aviso legal explica por qué: el Reglamento (CE) 1924/2006 solo
permite las declaraciones de propiedades saludables autorizadas, y para la miel
no hay ninguna.

Lo que sí aparece es información de manejo —por qué cristaliza, cómo se
conserva— y **la advertencia oficial de no dar miel a menores de doce meses**,
que es seguridad alimentaria, no una promesa.

Al reskinear, **esa parte no debería tocarse** por mucho que la pida el cliente.

## Cómo está hecho

HTML + CSS + un `main.js`. Sin framework, sin compilación, sin npm y sin
servidor. GSAP + ScrollTrigger + Lenis por CDN, y si no llegan, la página sigue
entera.

```
index.html · aviso-legal.html · privacidad.html · 404.html
css/estilo.css · js/main.js
assets/fotos/ (3 fotos de archivo) · assets/og.png · favicon.svg
screenshots/ · CREDITOS.md · AUDITORIA.md
```

- **Tipografía:** Vollkorn (titulares) + Karla (texto).
- **Paleta:** lino `#f2eee3`, panel `#e5dfd0`, crema `#fbf9f3`, tinta `#22281f`,
  monte `#2f5140`, ámbar `#b8761b`.
- **Imágenes:** tres fotografías de archivo de Pexels, guardadas en el repo y
  acreditadas en `CREDITOS.md`. Todo lo demás —los cuatro mapas, los
  marcadores de flora, los tarros, el calendario, el logotipo y la abeja fuera
  del radio del 404— está dibujado aquí.

## Para reskinear a un apicultor real

1. Sustituir nombre, dirección, teléfonos y correo (el dominio `.example` está
   puesto a propósito).
2. Poner el RGSEAA y el REGA en el aviso legal, y la IGP solo si de verdad está
   inscrito.
3. Cambiar los colmenares: cada uno es un `<li class="colmenar">` con su mapa,
   su flora y su `--miel` (el color de la miel, en el `style` del `<li>`). El
   terreno de cada mapa son cuatro o cinco `<path>`; los marcadores, `<use>` de
   los cuatro símbolos del `<defs>`.
4. Cambiar el calendario: los meses están en `--desde`/`--hasta` de cada
   `.barra` **y** en la lista `FLORA` de `js/main.js`, que es la que calcula qué
   florece hoy. Si se cambian en un sitio, hay que cambiarlos en el otro, y hay
   que reescribir el texto alternativo del gráfico.
5. **No tocar la sección «La miel es un alimento, no un remedio».**
6. Quitar el sello de demostración del pie, del `<head>` (`robots: noindex`) y
   de los comentarios de cada HTML.
