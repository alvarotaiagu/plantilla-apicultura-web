# Auditoría de accesibilidad — Mel do Cordal

Hecha con **axe-core 4.x** inyectado en la página y ejecutado con
`axe.run(document, { runOnly: wcag2a, wcag2aa, wcag21a, wcag21aa, best-practice })`
desde Playwright (Chromium).

## Cómo se pasó

Cada pasada: carga la página, espera a la intro, **cierra el aviso de cookies**,
**recorre la página entera con la rueda** (26 × 900 px) para que todo lo que
aparece con `IntersectionObserver` —los cuatro mapas, los cuatro tarros, las
siete barras del calendario— esté ya revelado, vuelve arriba e inyecta axe.

Pasadas: **portada en escritorio (1440×900) y en móvil (390×844)**, la **lámina
de colmenares** y el **calendario** ya revelados, el **menú móvil abierto**, el
**aviso legal** y el **404** (escritorio y móvil).

## Resultado

| Pasada | Violaciones |
|---|---|
| Portada · escritorio | **0** |
| Portada · móvil | **0** |
| Portada · lámina de colmenares revelada | **0** |
| Portada · calendario revelado | **0** |
| Portada · menú móvil abierto | **0** |
| Aviso legal | **0** |
| 404 · escritorio y móvil | **0** |

Cero a la primera pasada. La paleta se calculó con el script de razón WCAG
**antes de escribir el CSS**, midiendo cada token contra el peor de los fondos en
los que iba a aparecer.

## Los tokens, con su medida

| Token | Valor | Dónde | Razón |
|---|---|---|---|
| `--tinta` | `#22281f` | texto principal | 11,35 sobre `--panel` · 13,02 sobre el fondo |
| `--tinta-media` | `#5e564a` | párrafos secundarios | 5,44 sobre `--panel` |
| `--tinta-suave` | `#6a6255` | antetítulos, `dt`, pies de foto, notas | **4,53** sobre `--panel` (el peor), 5,19 y 5,71 en el resto |
| `--monte` | `#2f5140` | marca, botones, enlaces | 6,66 sobre `--panel`; con `--crema` encima, 8,41 |
| `--monte-claro` | `#8fb39a` | `code` del pie | 6,53 sobre `--tinta` |
| `--ambar` | `#b8761b` | **solo relleno y filetes** | 2,80 como texto: no se usa como texto |
| `--ambar-texto` | `#7d5210` | cifras, precios, números de sección, la cota «3 km» | 5,12 sobre `--panel` · 5,87 sobre el fondo |
| `--ambar-claro` | `#d59a3a` | títulos y enlaces del pie oscuro | 6,12 sobre `--tinta` |
| `--crema-suave` | `#c9c2b2` | texto apagado del pie | 8,51 sobre `--tinta` |

El ámbar es el color de la miel y por tanto el color de marca: **no se toca**.
Se queda en la colmena de los mapas, en las barras del calendario, en los
filetes y en el relleno de los tarros, y para texto hay dos variantes calculadas
aparte, una para fondo claro y otra para el pie oscuro.

## Lo que axe no mira, y aquí se ha mirado a mano

- **Texto dentro de un SVG.** axe no evalúa su contraste. El único texto en SVG
  de esta plantilla es la cota **«3 km»** del diagrama del hero: `--ambar-texto`
  sobre el fondo = **5,87**. Medido con el script.
- **Opacidad sobre texto:** no hay ninguna. Las únicas opacidades están en
  dibujos —el agua de las brañas (`.16`), el río (`.45`), la traza de la abeja
  del 404— y ninguna lleva texto encima.
- **La etiqueta del cursor** va sobre su propia mancha: `rgba(34,40,31,.8)` da un
  efectivo cercano a `#3f443c` y el texto crema encima queda muy por encima de
  AA.
- **Los cuatro colores de miel** de los tarros son datos, no información
  codificada solo por color: cada tarro lleva **su color escrito en texto**
  («Caoba muy oscuro», «Rojizo oscuro», «Ámbar tostado», «Dorado claro») en la
  ficha de al lado.
- **El calendario de floración** es un gráfico: lleva `role="img"`, un
  `aria-labelledby` con su título y un **`aria-describedby` que describe las
  siete floraciones y las tres cosechas en texto corrido**. Quien no vea las
  barras tiene el mismo dato escrito.

## Lo que la plantilla hace bien de serie

- `main`, `header`, `nav`, `footer`, saltar al contenido y foco visible.
- Cada mapa de radio lleva `role="img"` y un `aria-label` que dice qué hay
  dentro del círculo («brañas encharcadas, un regato y bosque bajo»), y cada
  tarro un `<title>` con su color.
- El botón del menú móvil tiene `aria-label` (por debajo de 620 px la palabra
  «Menú» se oculta) y `aria-expanded`, que cambia también el `aria-label`.
- Tablas con `<th scope>` y `<caption>`; titulares partidos en letras con su
  `aria-label` completo.
- **Con movimiento reducido el contenido sigue ahí**: anillos dibujados, flora
  visible, tarros llenos y barras a su longitud; lo que se apaga es la
  transición. Verificado midiendo los `transform` y el `stroke-dashoffset` en
  una pasada con `reducedMotion: 'reduce'`.
