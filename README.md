# Mate Geometría Básica

Aplicación web interactiva para niñas y niños de 5o y 6o de primaria en México. Permite explorar una figura geométrica a la vez, ingresar medidas del 1 al 20 y calcular en tiempo real el área y el perímetro.

## Figuras incluidas

- Cuadrado
- Rectángulo
- Círculo
- Rombo
- Trapecio
- Pentágono regular

## Características

- Una sola página principal con una figura a la vez
- Figuras grandes, coloridas y con bordes gruesos
- Indicadores visuales claros para lado, base, altura, radio, diagonales y apotema
- Cálculo simultáneo de área y perímetro
- Modo `Reto` con valores aleatorios del 1 al 20
- Celebración con confeti y sonido cuando la respuesta es correcta
- Código y variables en inglés
- Contenido del proyecto y documentación en español

## Tecnologías

- React
- Vite
- SVG para el dibujo de figuras
- Web Audio API para el sonido de celebración
- Canvas API para el efecto de confeti

## Fórmulas utilizadas

- Cuadrado
  - Perímetro: `4 x lado`
  - Área: `lado x lado`
- Rectángulo
  - Perímetro: `2 x (base + altura)`
  - Área: `base x altura`
- Círculo
  - Perímetro: `2 x pi x radio`
  - Área: `pi x radio x radio`
- Rombo
  - Perímetro: `4 x lado`
  - Área: `(diagonal mayor x diagonal menor) / 2`
- Trapecio
  - Perímetro: `base mayor + base menor + lado izquierdo + lado derecho`
  - Área: `((base mayor + base menor) x altura) / 2`
- Pentágono regular
  - Perímetro: `5 x lado`
  - Área: `(perímetro x apotema) / 2`

## Cómo ejecutar el proyecto

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```

Repositorio objetivo:

[https://github.com/dresendi/mate-geometria-basica.git](https://github.com/dresendi/mate-geometria-basica.git)