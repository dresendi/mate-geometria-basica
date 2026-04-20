# Mate Geometria Basica

Aplicacion web interactiva para niñas y niños de 5o y 6o de primaria en Mexico. Permite explorar una figura geometrica a la vez, ingresar medidas del 1 al 20 y calcular en tiempo real el area y el perimetro.

## Figuras incluidas

- Cuadrado
- Rectangulo
- Circulo
- Rombo
- Trapecio
- Pentagono regular

## Caracteristicas

- Una sola pagina principal con una figura a la vez
- Figuras grandes, coloridas y con bordes gruesos
- Indicadores visuales claros para lado, base, altura, radio, diagonales y apotema
- Calculo simultaneo de area y perimetro
- Modo `Reto` con valores aleatorios del 1 al 20
- Celebracion con confeti y sonido cuando la respuesta es correcta
- Codigo y variables en ingles
- Contenido del proyecto y documentacion en español

## Tecnologias

- React
- Vite
- SVG para el dibujo de figuras
- Web Audio API para el sonido de celebracion
- Canvas API para el efecto de confeti

## Formulas utilizadas

- Cuadrado
  - Perimetro: `4 x lado`
  - Area: `lado x lado`
- Rectangulo
  - Perimetro: `2 x (base + altura)`
  - Area: `base x altura`
- Circulo
  - Perimetro: `2 x pi x radio`
  - Area: `pi x radio x radio`
- Rombo
  - Perimetro: `4 x lado`
  - Area: `(diagonal mayor x diagonal menor) / 2`
- Trapecio
  - Perimetro: `base mayor + base menor + lado izquierdo + lado derecho`
  - Area: `((base mayor + base menor) x altura) / 2`
- Pentagono regular
  - Perimetro: `5 x lado`
  - Area: `(perimetro x apotema) / 2`

## Como ejecutar el proyecto

```bash
npm install
npm run dev
```

Luego abre la direccion local que muestre Vite en la terminal.

## Build de produccion

```bash
npm run build
```

## Estructura general

- `src/App.jsx`: interfaz principal, formulas y modo reto
- `src/styles.css`: estilos visuales para la experiencia infantil
- `src/main.jsx`: punto de entrada de React

## Repositorio remoto

Repositorio objetivo:

[https://github.com/dresendi/mate-geometria-basica.git](https://github.com/dresendi/mate-geometria-basica.git)
