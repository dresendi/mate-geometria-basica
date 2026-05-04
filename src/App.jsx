import { useEffect, useMemo, useRef, useState } from "react";
import katex from "katex";

const isElenaMode = import.meta.env.ELENA === "true";
const appTitle = isElenaMode ? "Temario Bloque III para Elenukis" : "Temario Bloque III";

const sectionItems = [
  { id: "home", label: appTitle },
  { id: "algorithms", label: "Resolver algoritmos" },
  { id: "notation", label: "Notacion desarrollada" },
  { id: "geometry", label: "Perimetros y areas" },
  { id: "percentages", label: "Porcentajes" },
  { id: "rule-of-three", label: "Regla de tres" },
  { id: "sequences", label: "Sucesiones" },
  { id: "fractions", label: "Fracciones" },
  { id: "mayan", label: "Numeros mayas" },
  { id: "measures", label: "Medidas de capacidad" },
  { id: "decimals", label: "Decimales" }
];

const syllabusItems = [
  "Resolver algoritmos y casos de suma, resta, multiplicacion y division con numeros racionales enteros positivos y decimales hasta diezmilesimos.",
  "Realizar las comprobaciones de las operaciones basicas.",
  "Escribir en notacion desarrollada los numeros decimales e identificar el valor posicional.",
  "Ordenar numeros decimales hasta diezmilesimos de forma ascendente y descendente.",
  "Realizar sucesiones con numeros enteros y fracciones, identificando la constante.",
  "Resolver casos de porcentaje con regla de tres.",
  "Calcular el perimetro de figuras regulares e irregulares escribiendo la formula.",
  "Trabajar medidas de capacidad, peso y longitud con conversiones del sistema metrico decimal.",
  "Resolver suma y resta de fracciones propias, impropias y mixtas.",
  "Conocer y aplicar las reglas del sistema maya de numeracion."
];

const moduleCards = [
  {
    id: "algorithms",
    title: "Resolver algoritmos",
    description:
      "Practica suma, resta, multiplicacion y division con enteros y decimales, y aprende a comprobar cada operacion."
  },
  {
    id: "notation",
    title: "Notacion desarrollada",
    description:
      "Descompone numeros decimales y entiende el valor posicional de cada cifra."
  },
  {
    id: "geometry",
    title: "Perimetros y areas",
    description:
      "Figuras regulares, un ejemplo irregular como el del temario, formulas con sustitucion y retos."
  },
  {
    id: "percentages",
    title: "Porcentajes",
    description:
      "Porcentajes simples como 50% de 800, con procedimiento visible paso a paso y zona de reto."
  },
  {
    id: "rule-of-three",
    title: "Regla de tres",
    description:
      "Aprende a plantear proporciones y a usarlas para calcular porcentajes paso a paso."
  },
  {
    id: "sequences",
    title: "Sucesiones",
    description:
      "Crea sucesiones con enteros y fracciones, y descubre la constante que las hace crecer o disminuir."
  },
  {
    id: "fractions",
    title: "Fracciones",
    description:
      "Resuelve suma y resta de fracciones propias, impropias y mixtas con explicacion paso a paso."
  },
  {
    id: "mayan",
    title: "Numeros mayas",
    description:
      "Lectura y conversion del sistema maya con puntos, barras y retos para identificar cantidades."
  },
  {
    id: "measures",
    title: "Medidas de capacidad",
    description:
      "Conversiones interactivas de capacidad, peso y longitud usando la escalera decimal."
  },
  {
    id: "decimals",
    title: "Decimales",
    description:
      "Ordena numeros decimales hasta diezmilesimos en forma ascendente y descendente."
  }
];

const syllabusStorageKey = "block-iii-syllabus-checks";
const gamificationStorageKey = "block-iii-gamification";
const piValue = 3.1416;

const celebrationCharacters = [
  { name: "Astro", image: "/astro.webp" },
  { name: "Bobette", image: "/bobette.webp" },
  { name: "Brightney", image: "/brightney.webp" },
  { name: "Brusha", image: "/brusha.webp" },
  { name: "Connie", image: "/connie.webp" },
  { name: "Pebble", image: "/pebble.webp" },
  { name: "Shelly", image: "/shelly.webp" },
  { name: "Dandy", image: "/dandy.webp" },
  { name: "Gourdy", image: "/gourdy.webp" },
  { name: "Bassie", image: "/bassie.webp" }
];

const renderMathToHtml = (expression) =>
  katex.renderToString(expression, {
    throwOnError: false,
    output: "htmlAndMathml"
  });

const clampInteger = (value, minimum, maximum) => {
  if (value === "") {
    return "";
  }

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    return "";
  }

  return Math.max(minimum, Math.min(maximum, Math.round(parsedValue)));
};

const clampDecimal = (value, minimum, maximum) => {
  if (value === "") {
    return "";
  }

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    return "";
  }

  return Math.max(minimum, Math.min(maximum, parsedValue));
};

const randomInt = (minimum, maximum) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

const ensureRectangleValues = (values) => {
  const safeHeight = Math.max(1, values.height);
  const safeBase = Math.max(safeHeight + 1, values.base);

  return {
    ...values,
    base: Math.min(20, safeBase),
    height: Math.min(19, safeHeight)
  };
};

const ensureTrapezoidValues = (values) => {
  const safeMinor = Math.max(1, values.baseMinor);
  const safeMajor = Math.max(safeMinor + 1, values.baseMajor);

  return {
    ...values,
    baseMinor: Math.min(19, safeMinor),
    baseMajor: Math.min(20, safeMajor)
  };
};

const roundTo = (value, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

const formatNumber = (value, digits = 2) => {
  const roundedValue = roundTo(value, digits);
  return Number.isInteger(roundedValue) ? String(roundedValue) : roundedValue.toFixed(digits);
};

const formatFixed = (value, digits = 4) => Number(value).toFixed(digits);

const parseAnswer = (value) => Number(String(value).replace(",", "."));

const createConfettiPieces = (width, height, activeColor) =>
  Array.from({ length: 180 }, (_, index) => ({
    x: width / 2,
    y: height / 3,
    size: 6 + (index % 7),
    color:
      index % 5 === 0
        ? activeColor
        : index % 5 === 1
          ? "#ffffff"
          : index % 5 === 2
            ? "#ffe45e"
            : index % 5 === 3
              ? "#7bdff2"
              : "#b8f2e6",
    angle: Math.random() * Math.PI * 2,
    speed: 2 + Math.random() * 5,
    rotation: Math.random() * Math.PI,
    rotationSpeed: (Math.random() - 0.5) * 0.3,
    gravity: 0.08 + Math.random() * 0.08
  }));

function ConfettiCanvas({ burstToken, activeColor }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!burstToken) {
      return undefined;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrame = 0;
    let start = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const pieces = createConfettiPieces(canvas.width, canvas.height, activeColor);

    const draw = (timestamp) => {
      if (!start) {
        start = timestamp;
      }

      const elapsed = timestamp - start;
      context.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach((piece) => {
        const progress = elapsed / 16;
        const x = piece.x + Math.cos(piece.angle) * piece.speed * progress;
        const y =
          piece.y +
          Math.sin(piece.angle) * piece.speed * progress +
          piece.gravity * progress * progress;

        context.save();
        context.translate(x, y);
        context.rotate(piece.rotation + piece.rotationSpeed * progress);
        context.fillStyle = piece.color;
        context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
        context.restore();
      });

      if (elapsed < 1800) {
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [burstToken, activeColor]);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}

function CelebrationOverlay({ active, imageSrc }) {
  if (!imageSrc) {
    return null;
  }

  return (
    <div className={`celebration-overlay ${active ? "is-active" : ""}`} aria-hidden={!active}>
      <img src={imageSrc} alt="" className="celebration-character" />
    </div>
  );
}

function MathInline({ expression, className = "" }) {
  return (
    <span
      className={`math-inline ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: renderMathToHtml(expression) }}
    />
  );
}

const getReviewButtonState = (status, isCelebrating) => ({
  disabled: isCelebrating || status === "success",
  title:
    status === "success"
      ? "Debes iniciar un nuevo reto para seguir anotando puntos."
      : ""
});

const getChallengeLockState = (status, isCelebrating) => ({
  disabled: isCelebrating || status === "success",
  title:
    status === "success"
      ? "Debes hacer click en Nuevo reto para seguir anotando puntos."
      : ""
});

function UnlockToast({ item }) {
  if (!item) {
    return null;
  }

  return (
    <div className="unlock-toast" role="status" aria-live="polite">
      <img src={item.image} alt="" className="unlock-toast-image" />
      <div>
        <p className="eyebrow">Nuevo desbloqueo</p>
        <h3>Has desbloqueado a {item.name}</h3>
        <p>Sigue resolviendo retos para conocer al siguiente personaje.</p>
      </div>
    </div>
  );
}

const geometryFigures = [
  {
    id: "square",
    name: "Cuadrado",
    color: "#ff7a59",
    accent: "#ffd6ba",
    explanation: "Todos los lados miden lo mismo, por eso el perimetro es 4 veces el lado.",
    fields: [{ key: "side", label: "Lado", shortLabel: "lado" }],
    formulas: {
      perimeter: "P = 4 x lado",
      area: "A = lado x lado"
    },
    createChallenge: () => ({ side: randomInt(1, 20) }),
    calculate(values) {
      return {
        perimeter: 4 * values.side,
        area: values.side * values.side
      };
    },
    substitution(values, results) {
      return {
        perimeter: `P = 4 x ${values.side} = ${formatNumber(results.perimeter)}`,
        area: `A = ${values.side} x ${values.side} = ${formatNumber(results.area)}`
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Cuadrado">
          <rect x="110" y="55" width="180" height="180" rx="18" className="shape-fill" />
          <line x1="110" y1="250" x2="290" y2="250" className="measure-line" />
          <text x="200" y="272" className="measure-text">lado = {values.side}</text>
        </svg>
      );
    }
  },
  {
    id: "rectangle",
    name: "Rectangulo",
    color: "#00a6a6",
    accent: "#c5f3ef",
    explanation: "El area usa base por altura. El perimetro suma dos bases y dos alturas.",
    fields: [
      { key: "base", label: "Base", shortLabel: "base" },
      { key: "height", label: "Altura", shortLabel: "altura" }
    ],
    formulas: {
      perimeter: "P = 2 x (base + altura)",
      area: "A = base x altura"
    },
    createChallenge: () =>
      ensureRectangleValues({ base: randomInt(1, 20), height: randomInt(1, 19) }),
    calculate(values) {
      return {
        perimeter: 2 * (values.base + values.height),
        area: values.base * values.height
      };
    },
    substitution(values, results) {
      return {
        perimeter: `P = 2 x (${values.base} + ${values.height}) = ${formatNumber(results.perimeter)}`,
        area: `A = ${values.base} x ${values.height} = ${formatNumber(results.area)}`
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Rectangulo">
          <rect x="70" y="80" width="260" height="140" rx="24" className="shape-fill" />
          <line x1="70" y1="238" x2="330" y2="238" className="measure-line" />
          <line x1="350" y1="80" x2="350" y2="220" className="measure-line" />
          <text x="200" y="262" className="measure-text">base = {values.base}</text>
          <text x="360" y="155" className="measure-text vertical-text">altura = {values.height}</text>
        </svg>
      );
    }
  },
  {
    id: "circle",
    name: "Circulo",
    color: "#6a67ff",
    accent: "#d3d0ff",
    explanation: "El radio va del centro a la orilla. En el circulo redondeamos a 2 decimales.",
    fields: [{ key: "radius", label: "Radio", shortLabel: "radio" }],
    formulas: {
      perimeter: "P = 2 x 3.1416 x radio",
      area: "A = 3.1416 x radio x radio"
    },
    createChallenge: () => ({ radius: randomInt(1, 20) }),
    calculate(values) {
      return {
        perimeter: 2 * piValue * values.radius,
        area: piValue * values.radius * values.radius
      };
    },
    substitution(values, results) {
      return {
        perimeter: `P = 2 x 3.1416 x ${values.radius} = ${formatNumber(results.perimeter)}`,
        area: `A = 3.1416 x ${values.radius} x ${values.radius} = ${formatNumber(results.area)}`
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Circulo">
          <circle cx="210" cy="160" r="88" className="shape-fill" />
          <circle cx="210" cy="160" r="4" className="shape-center" />
          <line x1="210" y1="160" x2="298" y2="160" className="measure-line" />
          <text x="254" y="146" className="measure-text">radio = {values.radius}</text>
        </svg>
      );
    }
  },
  {
    id: "triangle",
    name: "Triangulo",
    color: "#2d9cdb",
    accent: "#c7edff",
    explanation:
      "El area del triangulo usa base por altura entre 2. Para el perimetro sumamos sus tres lados.",
    fields: [
      { key: "base", label: "Base", shortLabel: "base" },
      { key: "height", label: "Altura", shortLabel: "altura" },
      { key: "leftSide", label: "Lado izquierdo", shortLabel: "lado izq." },
      { key: "rightSide", label: "Lado derecho", shortLabel: "lado der." }
    ],
    formulas: {
      perimeter: "P = base + lado izq. + lado der.",
      area: "A = (base x altura) / 2"
    },
    createChallenge: () => ({
      base: randomInt(1, 20),
      height: randomInt(1, 20),
      leftSide: randomInt(1, 20),
      rightSide: randomInt(1, 20)
    }),
    calculate(values) {
      return {
        perimeter: values.base + values.leftSide + values.rightSide,
        area: (values.base * values.height) / 2
      };
    },
    substitution(values, results) {
      return {
        perimeter: `P = ${values.base} + ${values.leftSide} + ${values.rightSide} = ${formatNumber(results.perimeter)}`,
        area: `A = (${values.base} x ${values.height}) / 2 = ${formatNumber(results.area)}`
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Triangulo">
          <polygon points="210,48 105,248 315,248" className="shape-fill" />
          <line x1="210" y1="48" x2="210" y2="248" className="measure-line dashed-line" />
          <line x1="105" y1="266" x2="315" y2="266" className="measure-line" />
          <text x="210" y="290" className="measure-text">base = {values.base}</text>
          <text x="224" y="150" className="measure-text vertical-text">altura = {values.height}</text>
          <text x="124" y="142" className="measure-text">lado = {values.leftSide}</text>
          <text x="296" y="142" className="measure-text">lado = {values.rightSide}</text>
        </svg>
      );
    }
  },
  {
    id: "rhombus",
    name: "Rombo",
    color: "#ff4f81",
    accent: "#ffd0df",
    explanation: "El perimetro usa el lado. El area usa la diagonal mayor y la diagonal menor.",
    fields: [
      { key: "side", label: "Lado", shortLabel: "lado" },
      { key: "majorDiagonal", label: "Diagonal mayor", shortLabel: "diag. mayor" },
      { key: "minorDiagonal", label: "Diagonal menor", shortLabel: "diag. menor" }
    ],
    formulas: {
      perimeter: "P = 4 x lado",
      area: "A = (D mayor x D menor) / 2"
    },
    createChallenge: () => ({
      side: randomInt(1, 20),
      majorDiagonal: randomInt(1, 20),
      minorDiagonal: randomInt(1, 20)
    }),
    calculate(values) {
      return {
        perimeter: 4 * values.side,
        area: (values.majorDiagonal * values.minorDiagonal) / 2
      };
    },
    substitution(values, results) {
      return {
        perimeter: `P = 4 x ${values.side} = ${formatNumber(results.perimeter)}`,
        area: `A = (${values.majorDiagonal} x ${values.minorDiagonal}) / 2 = ${formatNumber(results.area)}`
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Rombo">
          <polygon points="210,40 330,160 210,280 90,160" className="shape-fill" />
          <line x1="90" y1="160" x2="330" y2="160" className="measure-line" />
          <line x1="210" y1="40" x2="210" y2="280" className="measure-line" />
          <text x="210" y="146" className="measure-text bright-diagonal-text">D mayor = {values.majorDiagonal}</text>
          <text x="226" y="168" className="measure-text vertical-text bright-diagonal-text">D menor = {values.minorDiagonal}</text>
          <text x="122" y="112" className="measure-text bright-side-text">lado = {values.side}</text>
        </svg>
      );
    }
  },
  {
    id: "trapezoid",
    name: "Trapecio",
    color: "#ffb703",
    accent: "#ffe4a0",
    explanation: "El area usa base mayor, base menor y altura. El perimetro suma todos los lados.",
    fields: [
      { key: "baseMajor", label: "Base mayor", shortLabel: "base mayor" },
      { key: "baseMinor", label: "Base menor", shortLabel: "base menor" },
      { key: "leftSide", label: "Lado izquierdo", shortLabel: "lado izq." },
      { key: "rightSide", label: "Lado derecho", shortLabel: "lado der." },
      { key: "height", label: "Altura", shortLabel: "altura" }
    ],
    formulas: {
      perimeter: "P = B mayor + B menor + lado izq. + lado der.",
      area: "A = ((B mayor + B menor) x altura) / 2"
    },
    createChallenge: () =>
      ensureTrapezoidValues({
        baseMajor: randomInt(1, 20),
        baseMinor: randomInt(1, 19),
        leftSide: randomInt(1, 20),
        rightSide: randomInt(1, 20),
        height: randomInt(1, 20)
      }),
    calculate(values) {
      return {
        perimeter: values.baseMajor + values.baseMinor + values.leftSide + values.rightSide,
        area: ((values.baseMajor + values.baseMinor) * values.height) / 2
      };
    },
    substitution(values, results) {
      return {
        perimeter: `P = ${values.baseMajor} + ${values.baseMinor} + ${values.leftSide} + ${values.rightSide} = ${formatNumber(results.perimeter)}`,
        area: `A = ((${values.baseMajor} + ${values.baseMinor}) x ${values.height}) / 2 = ${formatNumber(results.area)}`
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Trapecio">
          <polygon points="120,70 300,70 350,240 70,240" className="shape-fill" />
          <line x1="120" y1="52" x2="300" y2="52" className="measure-line" />
          <line x1="70" y1="258" x2="350" y2="258" className="measure-line" />
          <line x1="210" y1="70" x2="210" y2="240" className="measure-line dashed-line" />
          <text x="210" y="44" className="measure-text">base menor = {values.baseMinor}</text>
          <text x="210" y="280" className="measure-text">base mayor = {values.baseMajor}</text>
          <text x="226" y="160" className="measure-text vertical-text">altura = {values.height}</text>
          <text x="86" y="150" className="measure-text">lado = {values.leftSide}</text>
          <text x="310" y="150" className="measure-text">lado = {values.rightSide}</text>
        </svg>
      );
    }
  },
  {
    id: "pentagon",
    name: "Pentagono regular",
    color: "#4caf50",
    accent: "#d3f2ce",
    explanation: "En un pentagono regular todos los lados son iguales y usamos la apotema para el area.",
    fields: [
      { key: "side", label: "Lado", shortLabel: "lado" },
      { key: "apothem", label: "Apotema", shortLabel: "apotema" }
    ],
    formulas: {
      perimeter: "P = 5 x lado",
      area: "A = (perimetro x apotema) / 2"
    },
    createChallenge: () => ({ side: randomInt(1, 20), apothem: randomInt(1, 20) }),
    calculate(values) {
      const perimeter = 5 * values.side;
      return {
        perimeter,
        area: (perimeter * values.apothem) / 2
      };
    },
    substitution(values, results) {
      return {
        perimeter: `P = 5 x ${values.side} = ${formatNumber(results.perimeter)}`,
        area: `A = (${formatNumber(results.perimeter)} x ${values.apothem}) / 2 = ${formatNumber(results.area)}`
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Pentagono regular">
          <polygon points="210,35 336,125 288,272 132,272 84,125" className="shape-fill" />
          <circle cx="210" cy="165" r="4" className="shape-center" />
          <line x1="210" y1="165" x2="210" y2="272" className="measure-line" />
          <line x1="132" y1="272" x2="288" y2="272" className="measure-line" />
          <text x="210" y="228" className="measure-text vertical-text bright-apothem-text">apotema = {values.apothem}</text>
          <text x="210" y="296" className="measure-text">lado = {values.side}</text>
        </svg>
      );
    }
  }
];

const regularInitialValues = geometryFigures.reduce((accumulator, figure) => {
  const defaultValuesByFigure = {
    rectangle: { base: 10, height: 6 },
    triangle: { base: 8, height: 10, leftSide: 9, rightSide: 9 },
    trapezoid: { baseMajor: 12, baseMinor: 7, leftSide: 6, rightSide: 6, height: 5 }
  };

  accumulator[figure.id] =
    defaultValuesByFigure[figure.id] ??
    figure.fields.reduce((fieldAccumulator, field) => {
      fieldAccumulator[field.key] = 6;
      return fieldAccumulator;
    }, {});
  return accumulator;
}, {});

const regularChallengeValues = geometryFigures.reduce((accumulator, figure) => {
  accumulator[figure.id] = {
    values: figure.createChallenge(),
    answerPerimeter: "",
    answerArea: "",
    status: "idle"
  };
  return accumulator;
}, {});

const irregularDefault = {
  sideA: 8,
  sideB: 7,
  sideC: 10,
  sideD: 3,
  sideE: 9
};

const irregularChallengeFactory = () => ({
  values: {
    sideA: randomInt(1, 20),
    sideB: randomInt(1, 20),
    sideC: randomInt(1, 20),
    sideD: randomInt(1, 20),
    sideE: randomInt(1, 20)
  },
  answerPerimeter: "",
  status: "idle"
});

const applyFigureConstraints = (figureId, values) => {
  if (figureId === "rectangle") {
    return ensureRectangleValues(values);
  }

  if (figureId === "trapezoid") {
    return ensureTrapezoidValues(values);
  }

  return values;
};

const capacityUnits = [
  { key: "kl", label: "Kilolitro (kl)", factor: 1000 },
  { key: "hl", label: "Hectolitro (hl)", factor: 100 },
  { key: "dal", label: "Decalitro (dal)", factor: 10 },
  { key: "l", label: "Litro (l)", factor: 1 },
  { key: "dl", label: "Decilitro (dl)", factor: 0.1 },
  { key: "cl", label: "Centilitro (cl)", factor: 0.01 },
  { key: "ml", label: "Mililitro (ml)", factor: 0.001 }
];

const massUnits = [
  { key: "kg", label: "Kilogramo (kg)", factor: 1000 },
  { key: "hg", label: "Hectogramo (hg)", factor: 100 },
  { key: "g", label: "Gramo (g)", factor: 1 },
  { key: "dg", label: "Decigramo (dg)", factor: 0.1 },
  { key: "cg", label: "Centigramo (cg)", factor: 0.01 },
  { key: "mg", label: "Miligramo (mg)", factor: 0.001 }
];

const lengthUnits = [
  { key: "km", label: "Kilometro (km)", factor: 1000 },
  { key: "hm", label: "Hectometro (hm)", factor: 100 },
  { key: "dam", label: "Decametro (dam)", factor: 10 },
  { key: "m", label: "Metro (m)", factor: 1 },
  { key: "dm", label: "Decimetro (dm)", factor: 0.1 },
  { key: "cm", label: "Centimetro (cm)", factor: 0.01 }
];

const measurementFamilies = {
  capacity: {
    label: "Capacidad",
    baseLabel: "litros",
    units: capacityUnits
  },
  mass: {
    label: "Peso",
    baseLabel: "gramos",
    units: massUnits
  },
  length: {
    label: "Longitud",
    baseLabel: "metros",
    units: lengthUnits
  }
};

const percentageChallengeFactory = () => ({
  total: randomInt(200, 2000),
  percent: [10, 20, 25, 40, 50, 75][randomInt(0, 5)],
  answer: "",
  status: "idle"
});

const ruleOfThreeChallengeFactory = () => ({
  total: randomInt(100, 999),
  percent: [5, 10, 15, 20, 25, 30, 40, 50, 75][randomInt(0, 8)],
  answer: "",
  status: "idle"
});

const buildMayanValue = (topLevel, middleLevel, bottomLevel) =>
  topLevel * 400 + middleLevel * 20 + bottomLevel;

const createValidMayanValue = () =>
  buildMayanValue(randomInt(0, 5), randomInt(0, 10), randomInt(0, 19));

const normalizeMayanValue = (value) => {
  const safeValue = Math.max(0, Number(value) || 0);
  const topLevel = Math.min(5, Math.floor(safeValue / 400));
  const remainderAfterTop = safeValue - topLevel * 400;
  const middleLevel = Math.min(10, Math.floor(remainderAfterTop / 20));
  const bottomLevel = Math.min(19, remainderAfterTop - middleLevel * 20);

  return buildMayanValue(topLevel, middleLevel, bottomLevel);
};

const operationLabels = {
  addition: "Suma",
  subtraction: "Resta",
  multiplication: "Multiplicacion",
  division: "Division"
};

const operationSymbols = {
  addition: "+",
  subtraction: "-",
  multiplication: "x",
  division: "÷"
};

const operationLatexSymbols = {
  addition: "+",
  subtraction: "-",
  multiplication: "\\times",
  division: "\\div"
};

const randomDecimal = (minimum, maximum) => roundTo(minimum + Math.random() * (maximum - minimum), 4);

const randomFraction = (allowedDenominators = [2, 3, 4, 5, 6, 8]) => {
  const denominator =
    allowedDenominators[randomInt(0, allowedDenominators.length - 1)];
  const numerator = randomInt(1, denominator * 3);

  return simplifyFraction({ numerator, denominator });
};

const toMixedFractionString = ({ numerator, denominator }) => {
  const simplified = simplifyFraction({ numerator, denominator });
  const whole = Math.trunc(simplified.numerator / simplified.denominator);
  const remainder = Math.abs(simplified.numerator % simplified.denominator);

  if (remainder === 0) {
    return String(whole);
  }

  if (whole === 0) {
    return `${remainder}/${simplified.denominator}`;
  }

  return `${whole} ${remainder}/${simplified.denominator}`;
};

const fractionToLatex = ({ numerator, denominator }) => {
  const simplified = simplifyFraction({ numerator, denominator });
  return `\\frac{${simplified.numerator}}{${simplified.denominator}}`;
};

const mixedFractionToLatex = ({ whole, numerator, denominator }) => {
  const simplifiedImproper = simplifyFraction(mixedToFraction(whole, numerator, denominator));
  const normalizedWhole = Math.trunc(simplifiedImproper.numerator / simplifiedImproper.denominator);
  const remainder = Math.abs(simplifiedImproper.numerator % simplifiedImproper.denominator);

  if (remainder === 0) {
    return `${normalizedWhole}`;
  }

  if (normalizedWhole === 0) {
    return `\\frac{${remainder}}{${simplifiedImproper.denominator}}`;
  }

  return `${normalizedWhole}\\frac{${remainder}}{${simplifiedImproper.denominator}}`;
};

const formatMathValue = (value, displayMode) =>
  displayMode === "fraction" ? toMixedFractionString(value) : formatNumber(value, 4);

const toComparableNumber = (value, displayMode) =>
  displayMode === "fraction" ? value.numerator / value.denominator : value;

const calculateOperation = (operation, firstValue, secondValue) => {
  if (operation === "addition") {
    return firstValue + secondValue;
  }
  if (operation === "subtraction") {
    return firstValue - secondValue;
  }
  if (operation === "multiplication") {
    return firstValue * secondValue;
  }

  return firstValue / secondValue;
};

const buildOperationCheck = (operation, firstValue, secondValue, result) => {
  if (operation === "addition") {
    return `${formatNumber(result, 4)} - ${formatNumber(secondValue, 4)} = ${formatNumber(firstValue, 4)}`;
  }
  if (operation === "subtraction") {
    return `${formatNumber(result, 4)} + ${formatNumber(secondValue, 4)} = ${formatNumber(firstValue, 4)}`;
  }
  if (operation === "multiplication") {
    return `${formatNumber(result, 4)} ÷ ${formatNumber(secondValue, 4)} = ${formatNumber(firstValue, 4)}`;
  }

  return `${formatNumber(result, 4)} x ${formatNumber(secondValue, 4)} = ${formatNumber(firstValue, 4)}`;
};

const buildAlgorithmExercise = (operation) => {
  const useFractions = Math.random() > 0.5;

  if (!useFractions) {
    if (operation === "addition") {
      const firstValue = randomInt(20, 150);
      const secondValue = randomInt(10, 90);
      return {
        operation,
        displayMode: "integer",
        firstValue,
        secondValue,
        story: `Lucia leyo ${firstValue} paginas el lunes y ${secondValue} paginas el martes. ¿Cuantas paginas leyo en total?`
      };
    }

    if (operation === "subtraction") {
      const firstValue = randomInt(80, 220);
      const secondValue = randomInt(10, firstValue - 5);
      return {
        operation,
        displayMode: "integer",
        firstValue,
        secondValue,
        story: `En la biblioteca habia ${firstValue} cuentos y prestaron ${secondValue}. ¿Cuantos cuentos quedaron?`
      };
    }

    if (operation === "multiplication") {
      const firstValue = randomInt(3, 15);
      const secondValue = randomInt(4, 18);
      return {
        operation,
        displayMode: "integer",
        firstValue,
        secondValue,
        story: `Hay ${firstValue} cajas y en cada caja caben ${secondValue} dulces. ¿Cuantos dulces caben en total?`
      };
    }

    const secondValue = randomInt(2, 12);
    const result = randomInt(2, 18);
    const firstValue = secondValue * result;
    return {
      operation,
      displayMode: "integer",
      firstValue,
      secondValue,
      story: `Pedro tenia ${firstValue} dulces y ${secondValue} cajas para guardar. ¿Cuantos dulces puede almacenar en cada caja si reparte todo por igual?`
    };
  }

  if (operation === "addition") {
    const firstValue = randomFraction();
    const secondValue = randomFraction();
    return {
      operation,
      displayMode: "fraction",
      firstValue,
      secondValue,
      story: `Mariana camino ${toMixedFractionString(firstValue)} kilometros en la mañana y ${toMixedFractionString(secondValue)} kilometros en la tarde. ¿Cuantos kilometros camino en total?`
    };
  }

  if (operation === "subtraction") {
    let firstValue = randomFraction();
    let secondValue = randomFraction();

    while (firstValue.numerator / firstValue.denominator <= secondValue.numerator / secondValue.denominator) {
      firstValue = randomFraction();
      secondValue = randomFraction();
    }

    return {
      operation,
      displayMode: "fraction",
      firstValue,
      secondValue,
      story: `Sofia tenia ${toMixedFractionString(firstValue)} litros de jugo y uso ${toMixedFractionString(secondValue)} litros. ¿Cuanto jugo le quedo?`
    };
  }

  if (operation === "multiplication") {
    const firstValue = randomFraction([2, 4, 5, 8]);
    const secondValue = randomInt(2, 9);
    return {
      operation,
      displayMode: "fraction",
      firstValue,
      secondValue,
      story: `Cada cinta mide ${toMixedFractionString(firstValue)} metro y necesitas ${secondValue} cintas iguales. ¿Cuantos metros de cinta necesitas en total?`
    };
  }

  const secondValue = randomFraction([2, 3, 4, 5, 6]);
  const result = randomInt(2, 8);
  const firstValue = simplifyFraction({
    numerator: secondValue.numerator * result,
    denominator: secondValue.denominator
  });

  return {
    operation,
    displayMode: "fraction",
    firstValue,
    secondValue,
    story: `Hay ${toMixedFractionString(firstValue)} litros de agua para llenar recipientes de ${toMixedFractionString(secondValue)} litro cada uno. ¿Cuantos recipientes se llenan por completo?`
  };
};

const createAlgorithmChallenge = (operation) => ({
  ...buildAlgorithmExercise(operation),
  answer: "",
  status: "idle"
});

const decimalPlaceLabels = [
  { key: "units", label: "Unidades", factor: 1 },
  { key: "tenths", label: "Decimos", factor: 0.1 },
  { key: "hundredths", label: "Centesimos", factor: 0.01 },
  { key: "thousandths", label: "Milesimos", factor: 0.001 },
  { key: "tenThousandths", label: "Diezmilesimos", factor: 0.0001 }
];

const getFixedDecimalDigits = (value) => {
  const fixedValue = Number(value).toFixed(4);
  const [units, decimals] = fixedValue.split(".");
  return {
    text: fixedValue,
    digits: [Number(units), ...decimals.split("").map(Number)]
  };
};

const buildExpandedNotation = (value) => {
  const { digits } = getFixedDecimalDigits(value);

  return decimalPlaceLabels
    .map((place, index) => {
      const digit = digits[index];

      if (digit === 0) {
        return null;
      }

      return `${digit} x ${place.factor}`;
    })
    .filter(Boolean)
    .join(" + ");
};

const createNotationChallenge = () => {
  const value = randomDecimal(1, 99);
  const placeIndex = randomInt(0, decimalPlaceLabels.length - 1);
  const { digits } = getFixedDecimalDigits(value);

  return {
    value,
    placeIndex,
    answer: "",
    status: "idle",
    expected: roundTo(digits[placeIndex] * decimalPlaceLabels[placeIndex].factor, 4)
  };
};

const gcd = (firstValue, secondValue) => {
  let a = Math.abs(firstValue);
  let b = Math.abs(secondValue);

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return a || 1;
};

const lcm = (firstValue, secondValue) => Math.abs(firstValue * secondValue) / gcd(firstValue, secondValue);

const simplifyFraction = ({ numerator, denominator }) => {
  if (numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }

  const divisor = gcd(numerator, denominator);
  const normalizedDenominator = denominator / divisor;
  const normalizedNumerator = numerator / divisor;

  return {
    numerator: normalizedDenominator < 0 ? -normalizedNumerator : normalizedNumerator,
    denominator: Math.abs(normalizedDenominator)
  };
};

const fractionToString = ({ numerator, denominator }) => {
  const simplified = simplifyFraction({ numerator, denominator });
  return `${simplified.numerator}/${simplified.denominator}`;
};

const mixedToFraction = (whole, numerator, denominator) => ({
  numerator: whole * denominator + numerator,
  denominator
});

const formatFractionMath = (fraction) => {
  const simplified = simplifyFraction(fraction);
  return `${simplified.numerator}/${simplified.denominator}`;
};

const createSequenceTerms = (type, start, step) => {
  if (type === "integer") {
    return Array.from({ length: 5 }, (_, index) => start + step * index);
  }

  if (type === "decimal") {
    return Array.from({ length: 5 }, (_, index) => roundTo(start + step * index, 4));
  }

  return Array.from({ length: 5 }, (_, index) => ({
    numerator: start.numerator + step.numerator * index,
    denominator: start.denominator
  }));
};

const createSequenceChallenge = () => {
  const id = `sequence-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const start = roundTo(randomInt(1, 300) + Math.random(), 4);
  const step = roundTo(0.1 + Math.random() * 25, 4);
  return {
    id,
    type: "decimal",
    start,
    step,
    answer: "",
    constantAnswer: "",
    status: "idle"
  };
};

const parseFractionString = (value) => {
  const cleanValue = String(value).trim();

  if (!cleanValue) {
    return null;
  }

  if (cleanValue.includes("/")) {
    const [numerator, denominator] = cleanValue.split("/").map((item) => Number(item.trim()));

    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return null;
    }

    return simplifyFraction({ numerator, denominator });
  }

  const numericValue = Number(cleanValue.replace(",", "."));

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return simplifyFraction({ numerator: numericValue, denominator: 1 });
};

const areFractionsEqual = (firstFraction, secondFraction) =>
  firstFraction && secondFraction &&
  simplifyFraction(firstFraction).numerator === simplifyFraction(secondFraction).numerator &&
  simplifyFraction(firstFraction).denominator === simplifyFraction(secondFraction).denominator;

const createFractionChallenge = () => {
  const operation = Math.random() > 0.5 ? "addition" : "subtraction";
  const denominatorA = [2, 3, 4, 5, 6, 8][randomInt(0, 5)];
  const denominatorB = [2, 3, 4, 5, 6, 8][randomInt(0, 5)];
  const first = {
    whole: randomInt(0, 2),
    numerator: randomInt(1, denominatorA),
    denominator: denominatorA
  };
  const second = {
    whole: randomInt(0, 2),
    numerator: randomInt(1, denominatorB),
    denominator: denominatorB
  };

  const firstImproper = mixedToFraction(first.whole, first.numerator, first.denominator);
  let secondImproper = mixedToFraction(second.whole, second.numerator, second.denominator);

  if (
    operation === "subtraction" &&
    firstImproper.numerator / firstImproper.denominator <
      secondImproper.numerator / secondImproper.denominator
  ) {
    secondImproper = {
      numerator: Math.max(1, firstImproper.numerator - 1),
      denominator: firstImproper.denominator
    };
  }

  return {
    operation,
    first,
    second: secondImproper.denominator === second.denominator
      ? second
      : { whole: 0, numerator: secondImproper.numerator, denominator: secondImproper.denominator },
    answer: "",
    status: "idle"
  };
};

const mayanChallengeFactory = () => ({
  value: createValidMayanValue(),
  answer: "",
  status: "idle"
});

const measurementChallengeFactory = () => {
  const familyKeys = ["capacity", "mass", "length"];
  const familyKey = familyKeys[randomInt(0, familyKeys.length - 1)];
  const units = measurementFamilies[familyKey].units;
  const fromIndex = randomInt(0, units.length - 1);
  let toIndex = randomInt(0, units.length - 1);

  while (toIndex === fromIndex) {
    toIndex = randomInt(0, units.length - 1);
  }

  return {
    familyKey,
    fromKey: units[fromIndex].key,
    toKey: units[toIndex].key,
    value: randomInt(1, 250),
    answer: "",
    status: "idle"
  };
};

const createRandomDecimal = () => roundTo(Math.random() * 9 + Math.random() * 90, 4);

const decimalChallengeFactory = () => ({
  list: Array.from({ length: 5 }, () => createRandomDecimal()),
  direction: Math.random() > 0.5 ? "ascending" : "descending",
  userOrder: [],
  draggingIndex: null,
  status: "idle"
});

const compareValues = (leftValue, rightValue, direction) =>
  direction === "ascending" ? leftValue - rightValue : rightValue - leftValue;

const toThreeLevelMayanDigits = (value) => {
  const topLevel = Math.floor(value / 400);
  const remainderAfterTop = value % 400;
  const middleLevel = Math.floor(remainderAfterTop / 20);
  const bottomLevel = remainderAfterTop % 20;

  return [topLevel, middleLevel, bottomLevel];
};

function MayanDigit({ value }) {
  if (value === 0) {
    return (
      <div className="mayan-shell">
        <img src="/concha.png" alt="Concha maya para cero" className="mayan-shell-image" />
      </div>
    );
  }

  const bars = Math.floor(value / 5);
  const dots = value % 5;

  return (
    <div className="mayan-digit">
      <div className="mayan-dots">
        {Array.from({ length: dots }).map((_, index) => (
          <span key={`dot-${index}`} className="mayan-dot" />
        ))}
      </div>
      <div className="mayan-bars">
        {Array.from({ length: bars }).map((_, index) => (
          <span key={`bar-${index}`} className="mayan-bar" />
        ))}
      </div>
    </div>
  );
}

function MayanDisplay({ value }) {
  const digits = toThreeLevelMayanDigits(value);
  const levelLabels = ["Nivel 3 · x400", "Nivel 2 · x20", "Nivel 1 · x1"];

  return (
    <div className="mayan-display" aria-label={`Numero maya para ${value}`}>
      {digits.map((digit, index) => (
        <div key={`${value}-${index}`} className="mayan-level">
          <span className="mayan-level-label">{levelLabels[index]}</span>
          <MayanDigit value={digit} />
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="section-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <p className="section-copy">{description}</p>
    </div>
  );
}

function HomeSection({ onNavigate, checkedItems, onToggleItem }) {
  return (
    <section className="page-section">


      <div className="two-column-grid">
        <article className="panel-card">
          <SectionHeader
            eyebrow="Temario del examen"
            description="El listado se muestra con el mismo sentido del PDF para que la portada sea una guia de estudio. Puedes marcar la casilla para llevar tu avance"
          />
          <ol className="syllabus-list">
            {syllabusItems.map((item, index) => (
              <li key={item} className="syllabus-item">
                <label className="syllabus-checkbox">
                  <input
                    type="checkbox"
                    checked={checkedItems[index]}
                    onChange={() => onToggleItem(index)}
                  />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ol>
        </article>

        <article className="panel-card">
          <SectionHeader
            eyebrow="Estudiar por modulo"
            title="Accesos rapidos"
            description="Cada tarjeta abre una seccion con explicacion, ejemplos resueltos y retos."
          />
          <div className="module-grid">
            {moduleCards.map((card) => (
              <button
                key={card.id}
                type="button"
                className="module-card"
                onClick={() => onNavigate(card.id)}
              >
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </button>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function GeometrySection({ onCelebrate, isCelebrating }) {
  const [activeFigureId, setActiveFigureId] = useState(geometryFigures[0].id);
  const [figureValues, setFigureValues] = useState(regularInitialValues);
  const [challengeState, setChallengeState] = useState(regularChallengeValues);
  const [irregularValues, setIrregularValues] = useState(irregularDefault);
  const [irregularChallenge, setIrregularChallenge] = useState(irregularChallengeFactory);

  const activeFigure = useMemo(
    () => geometryFigures.find((figure) => figure.id === activeFigureId),
    [activeFigureId]
  );

  const activeValues = figureValues[activeFigureId];
  const activeResults = activeFigure.calculate(activeValues);
  const activeSubstitution = activeFigure.substitution(activeValues, activeResults);
  const activeChallenge = challengeState[activeFigureId];
  const challengeResults = activeFigure.calculate(activeChallenge.values);
  const expectsRoundedAnswers = activeFigure.id === "circle" || activeFigure.id === "trapezoid";
  const irregularPerimeter =
    irregularValues.sideA +
    irregularValues.sideB +
    irregularValues.sideC +
    irregularValues.sideD +
    irregularValues.sideE;
  const irregularChallengePerimeter = Object.values(irregularChallenge.values).reduce(
    (sum, value) => sum + value,
    0
  );

  const updateFigureValue = (fieldKey, value) => {
    setFigureValues((currentValues) => ({
      ...currentValues,
      [activeFigureId]: applyFigureConstraints(activeFigureId, {
        ...currentValues[activeFigureId],
        [fieldKey]: clampInteger(
          value,
          1,
          activeFigureId === "rectangle" && fieldKey === "height"
            ? 19
            : activeFigureId === "trapezoid" && fieldKey === "baseMinor"
              ? 19
              : 20
        )
      })
    }));
  };

  const updateRegularChallengeAnswer = (fieldKey, value) => {
    if (value === "" || /^(\d+([.]\d{0,2})?)$/.test(value)) {
      setChallengeState((currentState) => ({
        ...currentState,
        [activeFigureId]: {
          ...currentState[activeFigureId],
          [fieldKey]: value,
          status: "idle"
        }
      }));
    }
  };

  const refreshRegularChallenge = () => {
    setChallengeState((currentState) => ({
      ...currentState,
      [activeFigureId]: {
        values: activeFigure.createChallenge(),
        answerPerimeter: "",
        answerArea: "",
        status: "idle"
      }
    }));
  };

  const validateRegularChallenge = () => {
    const expectedArea = roundTo(challengeResults.area, 2);
    const expectedPerimeter = roundTo(challengeResults.perimeter, 2);
    const typedArea = parseAnswer(activeChallenge.answerArea);
    const typedPerimeter = parseAnswer(activeChallenge.answerPerimeter);
    const tolerance = expectsRoundedAnswers ? 0.05 : 0.01;
    const success =
      Math.abs(typedArea - expectedArea) <= tolerance &&
      Math.abs(typedPerimeter - expectedPerimeter) <= tolerance;

    setChallengeState((currentState) => ({
      ...currentState,
      [activeFigureId]: {
        ...currentState[activeFigureId],
        status: success ? "success" : "error"
      }
    }));

    if (success) {
      onCelebrate(activeFigure.color);
    }
  };

  const updateIrregularValue = (fieldKey, value) => {
    setIrregularValues((currentValues) => ({
      ...currentValues,
      [fieldKey]: clampInteger(value, 1, 20)
    }));
  };

  const updateIrregularChallengeAnswer = (value) => {
    if (value === "" || /^(\d+([.]\d{0,2})?)$/.test(value)) {
      setIrregularChallenge((currentState) => ({
        ...currentState,
        answerPerimeter: value,
        status: "idle"
      }));
    }
  };

  const refreshIrregularChallenge = () => {
    setIrregularChallenge(irregularChallengeFactory());
  };

  const validateIrregularChallenge = () => {
    const success =
      Math.abs(parseAnswer(irregularChallenge.answerPerimeter) - irregularChallengePerimeter) <=
      0.01;

    setIrregularChallenge((currentState) => ({
      ...currentState,
      status: success ? "success" : "error"
    }));

    if (success) {
      onCelebrate("#9c27b0");
    }
  };

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Geometria"
        title="Perimetros y areas"
        description="Trabaja una figura a la vez. Primero exploras figuras regulares y despues una figura irregular como la del temario."
      />

      <div className="selector-row">
        {geometryFigures.map((figure) => (
          <button
            key={figure.id}
            type="button"
            className={`topic-pill ${figure.id === activeFigureId ? "is-active" : ""}`}
            style={{ "--pill-color": figure.color, "--pill-accent": figure.accent }}
            onClick={() => setActiveFigureId(figure.id)}
          >
            {figure.name}
          </button>
        ))}
      </div>

      <div className="lesson-grid">
        <article
          className="panel-card shape-card"
          style={{ "--shape-color": activeFigure.color, "--shape-accent": activeFigure.accent }}
        >
          <SectionHeader
            eyebrow="Figura actual"
            title={activeFigure.name}
            description={activeFigure.explanation}
          />
          <div className="shape-stage">{activeFigure.renderFigure(activeValues)}</div>
          <div className="formula-grid">
            <div className="info-box">
              <h3>Formula del perimetro</h3>
              <p>{activeFigure.formulas.perimeter}</p>
            </div>
            <div className="info-box">
              <h3>Formula del area</h3>
              <p>{activeFigure.formulas.area}</p>
            </div>
          </div>
          {activeFigure.id === "circle" && (
            <div className="pi-helper">
              Ayuda: para este tema usamos pi = 3.1416.
            </div>
          )}
        </article>

        <article className="panel-card">
          <SectionHeader
            eyebrow="Ingresa las medidas"
            title="Calculadora interactiva"
            description="Los valores van del 1 al 20 y la sustitucion se actualiza en tiempo real."
          />

          <div className="input-grid">
            {activeFigure.fields.map((field) => (
              <label key={field.key} className="field-card">
                <span>{field.label}</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={activeValues[field.key]}
                  onChange={(event) => updateFigureValue(field.key, event.target.value)}
                />
              </label>
            ))}
          </div>

          <div className="result-grid">
            <div className="result-card">
              <h3>Perimetro</h3>
              <strong>{formatNumber(activeResults.perimeter)}</strong>
            </div>
            <div className="result-card">
              <h3>Area</h3>
              <strong>{formatNumber(activeResults.area)}</strong>
            </div>
          </div>

          <div className="substitution-card">
            <h3>Sustitucion paso a paso</h3>
            <p>
              <span>Perimetro:</span> {activeSubstitution.perimeter}
            </p>
            <p>
              <span>Area:</span> {activeSubstitution.area}
            </p>
          </div>

          <div className="challenge-card">
            <div className="challenge-head">
              <div>
                <p className="eyebrow">Reto</p>
                <h3>Resuelve sin ver la respuesta</h3>
              </div>
              <button type="button" className="secondary-button" onClick={refreshRegularChallenge}>
                Nuevo reto
              </button>
            </div>
            <p className="challenge-copy">
              Usa estas medidas:
              {" "}
              {activeFigure.fields
                .map((field) => `${field.shortLabel}: ${activeChallenge.values[field.key]}`)
                .join(", ")}
              .
              {activeFigure.id === "circle" ? " Recuerda usar pi = 3.1416." : ""}
            </p>
            <div className="challenge-inputs">
              <label className="field-card">
                <span>Tu perimetro</span>
                <input
                  type="text"
                  value={activeChallenge.answerPerimeter}
                  {...getChallengeLockState(activeChallenge.status, isCelebrating)}
                  onChange={(event) =>
                    updateRegularChallengeAnswer("answerPerimeter", event.target.value)
                  }
                />
              </label>
              <label className="field-card">
                <span>Tu area</span>
                <input
                  type="text"
                  value={activeChallenge.answerArea}
                  {...getChallengeLockState(activeChallenge.status, isCelebrating)}
                  onChange={(event) =>
                    updateRegularChallengeAnswer("answerArea", event.target.value)
                  }
                />
              </label>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={validateRegularChallenge}
              {...getReviewButtonState(activeChallenge.status, isCelebrating)}
            >
              Revisar respuesta
            </button>
            {activeChallenge.status === "success" && (
              <p className="feedback success-message">
                Excelente. El perimetro es {formatNumber(challengeResults.perimeter)} y el area es{" "}
                {formatNumber(challengeResults.area)}.
              </p>
            )}
            {activeChallenge.status === "error" && (
              <p className="feedback error-message">
                Aun no coincide. Revisa la sustitucion y vuelve a intentarlo con calma.
              </p>
            )}
          </div>
        </article>
      </div>

      <div className="two-column-grid irregular-grid">
        <article className="panel-card shape-card irregular-accent">
          <SectionHeader
            eyebrow="Figura irregular"
            title="Perimetro de una figura irregular"
            description="Como en la imagen del temario, aqui sumamos cada lado por separado porque no todos miden lo mismo."
          />
          <div className="shape-stage">
            <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Figura irregular">
              <polygon
                points="90,200 165,90 300,70 350,200 160,245"
                className="shape-fill irregular-shape"
              />
              <text x="122" y="254" className="measure-text">a = {irregularValues.sideA}</text>
              <text x="74" y="170" className="measure-text">b = {irregularValues.sideB}</text>
              <text x="165" y="62" className="measure-text">c = {irregularValues.sideC}</text>
              <text x="314" y="58" className="measure-text">d = {irregularValues.sideD}</text>
              <text x="372" y="166" className="measure-text">e = {irregularValues.sideE}</text>
            </svg>
          </div>
          <div className="formula-grid single-column">
            <div className="info-box">
              <h3>Formula</h3>
              <p>P = a + b + c + d + e</p>
            </div>
            <div className="info-box">
              <h3>Nota sobre el area</h3>
              <p>En primaria, el area de una figura irregular suele encontrarse dividiendola en figuras mas simples.</p>
            </div>
          </div>
        </article>

        <article className="panel-card">
          <SectionHeader
            eyebrow="Suma cada lado"
            title="Practica guiada"
            description="Cambia los lados del 1 al 20 y observa como se forma el perimetro."
          />
          <div className="input-grid">
            {[
              { key: "sideA", label: "Lado a" },
              { key: "sideB", label: "Lado b" },
              { key: "sideC", label: "Lado c" },
              { key: "sideD", label: "Lado d" },
              { key: "sideE", label: "Lado e" }
            ].map((field) => (
              <label key={field.key} className="field-card">
                <span>{field.label}</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={irregularValues[field.key]}
                  onChange={(event) => updateIrregularValue(field.key, event.target.value)}
                />
              </label>
            ))}
          </div>
          <div className="result-card">
            <h3>Perimetro</h3>
            <strong>{formatNumber(irregularPerimeter)}</strong>
          </div>
          <div className="substitution-card">
            <h3>Sustitucion</h3>
            <p>
              <span>Perimetro:</span> P = {irregularValues.sideA} + {irregularValues.sideB} +{" "}
              {irregularValues.sideC} + {irregularValues.sideD} + {irregularValues.sideE} ={" "}
              {formatNumber(irregularPerimeter)}
            </p>
          </div>
          <div className="challenge-card">
            <div className="challenge-head">
              <div>
                <p className="eyebrow">Reto irregular</p>
                <h3>Encuentra el perimetro</h3>
              </div>
              <button type="button" className="secondary-button" onClick={refreshIrregularChallenge}>
                Nuevo reto
              </button>
            </div>
            <p className="challenge-copy">
              Suma estos lados: a = {irregularChallenge.values.sideA}, b ={" "}
              {irregularChallenge.values.sideB}, c = {irregularChallenge.values.sideC}, d ={" "}
              {irregularChallenge.values.sideD}, e = {irregularChallenge.values.sideE}.
            </p>
            <label className="field-card">
              <span>Tu perimetro</span>
              <input
                type="text"
                value={irregularChallenge.answerPerimeter}
                {...getChallengeLockState(irregularChallenge.status, isCelebrating)}
                onChange={(event) => updateIrregularChallengeAnswer(event.target.value)}
              />
            </label>
            <button
              type="button"
              className="primary-button"
              onClick={validateIrregularChallenge}
              {...getReviewButtonState(irregularChallenge.status, isCelebrating)}
            >
              Revisar respuesta
            </button>
            {irregularChallenge.status === "success" && (
              <p className="feedback success-message">
                Muy bien. El perimetro correcto es {formatNumber(irregularChallengePerimeter)}.
              </p>
            )}
            {irregularChallenge.status === "error" && (
              <p className="feedback error-message">
                Todavia no. Suma un lado a la vez para no perderte.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function PercentagesSection({ onCelebrate, isCelebrating }) {
  const [totalValue, setTotalValue] = useState(800);
  const [percentValue, setPercentValue] = useState(50);
  const [challenge, setChallenge] = useState(percentageChallengeFactory);

  const percentageResult = (totalValue * percentValue) / 100;
  const challengeResult = (challenge.total * challenge.percent) / 100;

  const validateChallenge = () => {
    const success = Math.abs(parseAnswer(challenge.answer) - challengeResult) <= 0.01;

    setChallenge((currentState) => ({
      ...currentState,
      status: success ? "success" : "error"
    }));

    if (success) {
      onCelebrate("#ff7a59");
    }
  };

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Porcentajes"
        title="Porcentajes simples"
        description="Calcula porcentajes como en el ejemplo 50% de 800 = 400 y observa cada sustitucion."
      />

      <div className="lesson-grid">
        <article className="panel-card">
          <SectionHeader
            eyebrow="Ejemplo interactivo"
            title="Calcula el porcentaje que te piden"
            description="Puedes cambiar el total y el porcentaje para ver como se mueve el resultado."
          />
          <div className="input-grid">
            <label className="field-card">
              <span>Cantidad total</span>
              <input
                type="number"
                min="1"
                max="5000"
                value={totalValue}
                onChange={(event) => setTotalValue(clampInteger(event.target.value, 1, 5000))}
              />
            </label>
            <label className="field-card">
              <span>Porcentaje</span>
              <input
                type="number"
                min="1"
                max="100"
                value={percentValue}
                onChange={(event) => setPercentValue(clampInteger(event.target.value, 1, 100))}
              />
            </label>
          </div>
          <div className="formula-grid single-column">
            <div className="info-box">
              <h3>Formula general</h3>
              <p>Porcentaje = (porcentaje / 100) x cantidad total</p>
            </div>
            <div className="substitution-card">
              <h3>Sustitucion</h3>
              <p>
                <span>Resultado:</span> {percentValue}% de {totalValue} = ({percentValue} / 100) x{" "}
                {totalValue} = {formatNumber(percentageResult)}
              </p>
            </div>
          </div>
          <div className="result-card">
            <h3>Respuesta</h3>
            <strong>{formatNumber(percentageResult)}</strong>
          </div>
        </article>

        <article className="panel-card">
          <SectionHeader
            eyebrow="Reto"
            title="Hazlo tu"
            description="Resuelve el porcentaje sin ver la respuesta y despues comparala."
          />
          <div className="challenge-card">
            <div className="challenge-head">
              <div>
                <p className="eyebrow">Problema</p>
                <h3>{challenge.percent}% de {challenge.total}</h3>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setChallenge(percentageChallengeFactory())}
              >
                Nuevo reto
              </button>
            </div>
            <label className="field-card">
              <span>Tu respuesta</span>
              <input
                type="text"
                value={challenge.answer}
                {...getChallengeLockState(challenge.status, isCelebrating)}
                onChange={(event) =>
                  setChallenge((currentState) => ({
                    ...currentState,
                    answer: event.target.value,
                    status: "idle"
                  }))
                }
              />
            </label>
            <button
              type="button"
              className="primary-button"
              onClick={validateChallenge}
              {...getReviewButtonState(challenge.status, isCelebrating)}
            >
              Revisar respuesta
            </button>
            {challenge.status === "success" && (
              <p className="feedback success-message">
                Correcto. {challenge.percent}% de {challenge.total} es {formatNumber(challengeResult)}.
              </p>
            )}
            {challenge.status === "error" && (
              <p className="feedback error-message">
                Revisa la fraccion del porcentaje: porcentaje entre 100, y luego multiplica.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function RuleOfThreeSection({ onCelebrate, isCelebrating }) {
  const [baseTotal, setBaseTotal] = useState(800);
  const [basePercent, setBasePercent] = useState(50);
  const [challenge, setChallenge] = useState(ruleOfThreeChallengeFactory);

  const xResult = (baseTotal * basePercent) / 100;
  const challengeResult = (challenge.total * challenge.percent) / 100;

  const validateChallenge = () => {
    const success = Math.abs(parseAnswer(challenge.answer) - challengeResult) <= 0.01;

    setChallenge((currentState) => ({
      ...currentState,
      status: success ? "success" : "error"
    }));

    if (success) {
      onCelebrate("#f2545b");
    }
  };

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Proporciones"
        title="Regla de tres"
        description="La regla de tres nos ayuda a encontrar un valor faltante usando una proporcion. Aqui la usamos sobre todo para calcular porcentajes."
      />

      <div className="lesson-grid">
        <article className="panel-card">
          <SectionHeader
            eyebrow="Explicacion interactiva"
            title="Como sacar un porcentaje con regla de tres"
            description="Si el 100% corresponde al total, entonces el porcentaje pedido corresponde a una cantidad llamada x."
          />

          <div className="input-grid">
            <label className="field-card">
              <span>Total</span>
              <input
                type="number"
                min="1"
                max="5000"
                value={baseTotal}
                onChange={(event) => setBaseTotal(clampInteger(event.target.value, 1, 5000))}
              />
            </label>
            <label className="field-card">
              <span>Porcentaje que buscas</span>
              <input
                type="number"
                min="1"
                max="100"
                value={basePercent}
                onChange={(event) => setBasePercent(clampInteger(event.target.value, 1, 100))}
              />
            </label>
          </div>

          <div className="formula-grid single-column">
            <div className="info-box">
              <h3>Planteamiento</h3>
              <p>100% -------- {baseTotal}</p>
              <p>{basePercent}% -------- x</p>
            </div>
            <div className="info-box">
              <h3>Multiplicacion cruzada</h3>
              <p>100 x = {basePercent} x {baseTotal}</p>
            </div>
            <div className="substitution-card">
              <h3>Despeje</h3>
              <p>
                <span>Paso 1:</span> x = ({basePercent} x {baseTotal}) / 100
              </p>
              <p>
                <span>Paso 2:</span> x = {basePercent * baseTotal} / 100 = {formatNumber(xResult)}
              </p>
            </div>
          </div>

          <div className="result-card">
            <h3>Respuesta</h3>
            <strong>{formatNumber(xResult)}</strong>
          </div>
        </article>

        <article className="panel-card">
          <SectionHeader
            eyebrow="Reto"
            title="Resuelve la proporcion"
            description="Encuentra x usando la misma estructura de la regla de tres."
          />
          <div className="challenge-card">
            <div className="challenge-head">
              <div>
                <p className="eyebrow">Problema</p>
                <h3>{challenge.percent}% de {challenge.total}</h3>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setChallenge(ruleOfThreeChallengeFactory())}
              >
                Nuevo reto
              </button>
            </div>
            <div className="info-box">
              <h3>Plantea asi</h3>
              <p>100% -------- {challenge.total}</p>
              <p>{challenge.percent}% -------- x</p>
            </div>
            <label className="field-card">
              <span>Tu valor de x</span>
              <input
                type="text"
                value={challenge.answer}
                {...getChallengeLockState(challenge.status, isCelebrating)}
                onChange={(event) =>
                  setChallenge((currentState) => ({
                    ...currentState,
                    answer: event.target.value,
                    status: "idle"
                  }))
                }
              />
            </label>
            <button
              type="button"
              className="primary-button"
              onClick={validateChallenge}
              {...getReviewButtonState(challenge.status, isCelebrating)}
            >
              Revisar respuesta
            </button>
            {challenge.status === "success" && (
              <p className="feedback success-message">
                Correcto. x = {formatNumber(challengeResult)}.
              </p>
            )}
            {challenge.status === "error" && (
              <p className="feedback error-message">
                Revisa la multiplicacion cruzada: porcentaje por total, y al final divides entre 100.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function AlgorithmsSection({ onCelebrate, isCelebrating }) {
  const [operation, setOperation] = useState("addition");
  const [exampleExercise, setExampleExercise] = useState(() => buildAlgorithmExercise("addition"));
  const [challenge, setChallenge] = useState(() => createAlgorithmChallenge("addition"));

  useEffect(() => {
    setExampleExercise(buildAlgorithmExercise(operation));
    setChallenge(createAlgorithmChallenge(operation));
  }, [operation]);

  const exampleFirst = toComparableNumber(exampleExercise.firstValue, exampleExercise.displayMode);
  const exampleSecond = toComparableNumber(exampleExercise.secondValue, exampleExercise.displayMode);
  const result = calculateOperation(operation, exampleFirst, exampleSecond);
  const challengeFirst = toComparableNumber(challenge.firstValue, challenge.displayMode);
  const challengeSecond = toComparableNumber(challenge.secondValue, challenge.displayMode);
  const challengeResult = calculateOperation(challenge.operation, challengeFirst, challengeSecond);

  const validateChallenge = () => {
    const fractionAnswer = parseFractionString(challenge.answer);
    const numericAnswer = parseAnswer(challenge.answer);
    const success =
      challenge.displayMode === "fraction"
        ? fractionAnswer !== null &&
          Math.abs(
            fractionAnswer.numerator / fractionAnswer.denominator - challengeResult
          ) <= 0.0001
        : Math.abs(numericAnswer - challengeResult) <= 0.0001;

    setChallenge((currentState) => ({
      ...currentState,
      status: success ? "success" : "error"
    }));

    if (success) {
      onCelebrate("#ff7a59");
    }
  };

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Operaciones"
        title="Resolver algoritmos"
        description="Practica suma, resta, multiplicacion y division con enteros positivos y decimales hasta diezmilesimos, y comprueba por que tu resultado es correcto."
      />
      <div className="lesson-grid">
        <article className="panel-card">
          <SectionHeader
            eyebrow="Calculadora guiada"
            title="Elige una operacion"
            description="Puedes cambiar la operacion y ver su comprobacion para entender la importancia de revisar tu trabajo."
          />
          <div className="selector-row">
            {Object.entries(operationLabels).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`topic-pill neutral-pill ${operation === key ? "is-active" : ""}`}
                onClick={() => setOperation(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="challenge-head">
            <div className="info-box">
              <h3>Problema matematico</h3>
              <p>{exampleExercise.story}</p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setExampleExercise(buildAlgorithmExercise(operation))}
            >
              Nuevo ejemplo
            </button>
          </div>
          <div className="result-card">
            <h3>Resultado</h3>
            <strong>{formatNumber(result, 4)}</strong>
          </div>
          <div className="substitution-card">
            <h3>Algoritmo</h3>
            <p>
              <span>Operacion:</span>{" "}
              {exampleExercise.displayMode === "fraction" ? (
                <MathInline
                  expression={`${fractionToLatex(exampleExercise.firstValue)} ${
                    operationLatexSymbols[operation]
                  } ${
                    typeof exampleExercise.secondValue === "number"
                      ? exampleExercise.secondValue
                      : fractionToLatex(exampleExercise.secondValue)
                  } = ${formatNumber(result, 4)}`}
                />
              ) : (
                <>
                  {formatMathValue(exampleExercise.firstValue, exampleExercise.displayMode)}{" "}
                  {operationSymbols[operation]}{" "}
                  {formatMathValue(exampleExercise.secondValue, exampleExercise.displayMode)} = {formatNumber(result, 4)}
                </>
              )}
            </p>
            <p>
              <span>Comprobacion:</span> {buildOperationCheck(operation, exampleFirst, exampleSecond, result)}
            </p>
          </div>
          <div className="info-box">
            <h3>¿Por qué es importante comprobar?</h3>
            <p>Comprobar ayuda a detectar errores de signo, acomodo de decimales y cuentas mal hechas antes de entregar el ejercicio.</p>
          </div>
        </article>

        <article className="panel-card">
          <SectionHeader
            eyebrow="Reto"
            title="Resuelve el algoritmo"
            description="Haz la operacion y luego piensa como la comprobarias."
          />
          <div className="challenge-card">
            <div className="challenge-head">
              <div>
                <p className="eyebrow">{operationLabels[challenge.operation]}</p>
                <h3>Resuelve el problema</h3>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setChallenge(createAlgorithmChallenge(operation))}
              >
                Nuevo reto
              </button>
            </div>
            <div className="info-box">
              <h3>Problema</h3>
              <p>{challenge.story}</p>
            </div>
            <label className="field-card">
              <span>Tu respuesta</span>
              <input
                type="text"
                value={challenge.answer}
                {...getChallengeLockState(challenge.status, isCelebrating)}
                onChange={(event) =>
                  setChallenge((currentState) => ({
                    ...currentState,
                    answer: event.target.value,
                    status: "idle"
                  }))
                }
              />
            </label>
            <button
              type="button"
              className="primary-button"
              onClick={validateChallenge}
              {...getReviewButtonState(challenge.status, isCelebrating)}
            >
              Revisar respuesta
            </button>
            {challenge.status === "success" && (
              <p className="feedback success-message">
                Correcto. La comprobacion seria: {buildOperationCheck(challenge.operation, challengeFirst, challengeSecond, challengeResult)}
              </p>
            )}
            {challenge.status === "error" && (
              <p className="feedback error-message">
                Revisa el acomodo de los decimales y usa la comprobacion para verificar tu resultado.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function NotationSection({ onCelebrate, isCelebrating }) {
  const [numberValue, setNumberValue] = useState(12.3045);
  const [challenge, setChallenge] = useState(createNotationChallenge);
  const notationParts = getFixedDecimalDigits(numberValue);
  const challengeParts = getFixedDecimalDigits(challenge.value);

  const validateChallenge = () => {
    const success = Math.abs(parseAnswer(challenge.answer) - challenge.expected) <= 0.0001;

    setChallenge((currentState) => ({
      ...currentState,
      status: success ? "success" : "error"
    }));

    if (success) {
      onCelebrate("#6a67ff");
    }
  };

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Valor posicional"
        title="Notacion desarrollada"
        description="Descompone numeros decimales y observa que cada cifra tiene un valor segun su posicion."
      />
      <div className="lesson-grid">
        <article className="panel-card">
          <SectionHeader
            eyebrow="Explorador"
            title="Desarrolla un numero decimal"
            description="Escribe un numero con hasta cuatro decimales y mira su expansion."
          />
          <label className="field-card narrow-field">
            <span>Numero decimal</span>
            <input
              type="number"
              step="0.0001"
              value={numberValue}
              onChange={(event) => setNumberValue(clampDecimal(event.target.value, 0, 9999))}
            />
          </label>
          <div className="number-strip">
            {notationParts.digits.map((digit, index) => (
              <span key={`${digit}-${index}`}>{decimalPlaceLabels[index].label}: {digit}</span>
            ))}
          </div>
          <div className="substitution-card">
            <h3>Notacion desarrollada</h3>
            <p>
              <span>Expansion:</span> {buildExpandedNotation(numberValue)}
            </p>
          </div>
        </article>

        <article className="panel-card">
          <SectionHeader
            eyebrow="Reto"
            title="Identifica el valor posicional"
            description="Encuentra cuanto vale la cifra marcada segun su lugar en el numero."
          />
          <div className="challenge-card">
            <div className="challenge-head">
              <div>
                <p className="eyebrow">Numero</p>
                <h3>{challengeParts.text}</h3>
              </div>
              <button type="button" className="secondary-button" onClick={() => setChallenge(createNotationChallenge())}>
                Nuevo reto
              </button>
            </div>
            <div className="info-box">
              <h3>Pregunta</h3>
              <p>
                Cual es el valor de la cifra {challengeParts.digits[challenge.placeIndex]} en la posicion
                {" "}
                {decimalPlaceLabels[challenge.placeIndex].label.toLowerCase()}?
              </p>
            </div>
            <label className="field-card">
              <span>Tu respuesta</span>
              <input
                type="text"
                value={challenge.answer}
                {...getChallengeLockState(challenge.status, isCelebrating)}
                onChange={(event) =>
                  setChallenge((currentState) => ({
                    ...currentState,
                    answer: event.target.value,
                    status: "idle"
                  }))
                }
              />
            </label>
            <button
              type="button"
              className="primary-button"
              onClick={validateChallenge}
              {...getReviewButtonState(challenge.status, isCelebrating)}
            >
              Revisar respuesta
            </button>
            {challenge.status === "success" && (
              <p className="feedback success-message">
                Correcto. Su valor es {formatNumber(challenge.expected, 4)}.
              </p>
            )}
            {challenge.status === "error" && (
              <p className="feedback error-message">
                Revisa en que columna esta la cifra: unidades, decimos, centesimos, milesimos o diezmilesimos.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function SequencesSection({ onCelebrate, isCelebrating }) {
  const [sequenceType, setSequenceType] = useState("integer");
  const [startValue, setStartValue] = useState(4);
  const [stepValue, setStepValue] = useState(3);
  const [fractionStart, setFractionStart] = useState({ numerator: 1, denominator: 4 });
  const [fractionStep, setFractionStep] = useState({ numerator: 1, denominator: 4 });
  const [challenge, setChallenge] = useState(createSequenceChallenge);

  const practiceTerms =
    sequenceType === "integer"
      ? createSequenceTerms("integer", startValue, stepValue)
      : createSequenceTerms("fraction", fractionStart, fractionStep);
  const challengeTerms = createSequenceTerms(challenge.type, challenge.start, challenge.step);
  const challengeExpectedNext = challengeTerms[challengeTerms.length - 1];
  const challengeExpectedConstant = challenge.step;

  const validateChallenge = () => {
    const answerOk =
      challenge.type === "fraction"
        ? areFractionsEqual(parseFractionString(challenge.answer), challengeExpectedNext)
        : Math.abs(parseAnswer(challenge.answer) - challengeExpectedNext) <= 0.0001;
    const constantOk =
      challenge.type === "fraction"
        ? areFractionsEqual(parseFractionString(challenge.constantAnswer), challengeExpectedConstant)
        : Math.abs(parseAnswer(challenge.constantAnswer) - challengeExpectedConstant) <= 0.0001;
    const success = answerOk && constantOk;

    setChallenge((currentState) => ({
      ...currentState,
      status: success ? "success" : "error"
    }));

    if (success) {
      onCelebrate("#00a6a6");
    }
  };

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Patrones"
        title="Sucesiones"
        description="Observa como una regla constante hace crecer o disminuir una sucesion con enteros o fracciones."
      />
      <div className="lesson-grid">
        <article className="panel-card">
          <SectionHeader
            eyebrow="Practica"
            title="Construye una sucesion"
            description="Elige enteros o fracciones y observa la constante."
          />
          <div className="selector-row">
            <button type="button" className={`topic-pill neutral-pill ${sequenceType === "integer" ? "is-active" : ""}`} onClick={() => setSequenceType("integer")}>
              Enteros
            </button>
            <button type="button" className={`topic-pill neutral-pill ${sequenceType === "fraction" ? "is-active" : ""}`} onClick={() => setSequenceType("fraction")}>
              Fracciones
            </button>
          </div>
          {sequenceType === "integer" ? (
            <div className="input-grid">
              <label className="field-card">
                <span>Inicio</span>
                <input type="number" value={startValue} onChange={(event) => setStartValue(clampInteger(event.target.value, 0, 99))} />
              </label>
              <label className="field-card">
                <span>Constante</span>
                <input type="number" value={stepValue} onChange={(event) => setStepValue(clampInteger(event.target.value, -20, 20))} />
              </label>
            </div>
          ) : (
            <div className="input-grid">
              <label className="field-card">
                <span>Inicio numerador</span>
                <input type="number" value={fractionStart.numerator} onChange={(event) => setFractionStart((current) => ({ ...current, numerator: clampInteger(event.target.value, 0, 20) }))} />
              </label>
              <label className="field-card">
                <span>Inicio denominador</span>
                <input type="number" value={fractionStart.denominator} onChange={(event) => setFractionStart((current) => ({ ...current, denominator: clampInteger(event.target.value, 1, 12) }))} />
              </label>
              <label className="field-card">
                <span>Constante numerador</span>
                <input type="number" value={fractionStep.numerator} onChange={(event) => setFractionStep((current) => ({ ...current, numerator: clampInteger(event.target.value, -10, 10) }))} />
              </label>
              <label className="field-card">
                <span>Constante denominador</span>
                <input type="number" value={fractionStep.denominator} onChange={(event) => setFractionStep((current) => ({ ...current, denominator: clampInteger(event.target.value, 1, 12) }))} />
              </label>
            </div>
          )}
          <div className="number-strip">
            {practiceTerms.map((term, index) => (
              <span key={index}>
                {sequenceType === "integer" ? term : <MathInline expression={fractionToLatex(term)} />}
              </span>
            ))}
          </div>
          <div className="substitution-card">
            <h3>Constante</h3>
            <p>
              <span>Regla:</span>{" "}
              {sequenceType === "integer"
                ? `sumar ${stepValue} cada vez`
                : `sumar ${formatFractionMath(fractionStep)} cada vez`}
            </p>
          </div>
        </article>

        <article className="panel-card">
          <SectionHeader eyebrow="Reto" title="Encuentra el siguiente termino" description="Descubre el siguiente termino y la constante de una sucesion con numeros decimales." />
          <div className="challenge-card">
            <div className="challenge-head">
              <div>
                <p className="eyebrow">Decimales</p>
                <h3>Que sigue?</h3>
              </div>
              <button type="button" className="secondary-button" onClick={() => setChallenge(createSequenceChallenge())}>
                Nuevo reto
              </button>
            </div>
            <div className="number-strip" key={challenge.id}>
              {challengeTerms.slice(0, 4).map((term, index) => (
                <span key={`${challenge.id}-${index}`}>
                  {formatFixed(term)}
                </span>
              ))}
              <span key={`${challenge.id}-question`}>?</span>
            </div>
            <div className="challenge-inputs">
              <label className="field-card">
                <span>Siguiente termino</span>
                <input type="text" value={challenge.answer} {...getChallengeLockState(challenge.status, isCelebrating)} onChange={(event) => setChallenge((currentState) => ({ ...currentState, answer: event.target.value, status: "idle" }))} />
              </label>
              <label className="field-card">
                <span>Constante</span>
                <input type="text" value={challenge.constantAnswer} {...getChallengeLockState(challenge.status, isCelebrating)} onChange={(event) => setChallenge((currentState) => ({ ...currentState, constantAnswer: event.target.value, status: "idle" }))} />
              </label>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={validateChallenge}
              {...getReviewButtonState(challenge.status, isCelebrating)}
            >
              Revisar respuesta
            </button>
            {challenge.status === "success" && (
              <p className="feedback success-message">Excelente. Ya identificaste el siguiente termino y la constante.</p>
            )}
            {challenge.status === "error" && (
              <p className="feedback error-message">Revisa cuanto cambia cada termino respecto al anterior.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function FractionsSection({ onCelebrate, isCelebrating }) {
  const [operation, setOperation] = useState("addition");
  const [firstFraction, setFirstFraction] = useState({ whole: 1, numerator: 1, denominator: 2 });
  const [secondFraction, setSecondFraction] = useState({ whole: 0, numerator: 3, denominator: 4 });
  const [challenge, setChallenge] = useState(createFractionChallenge);

  const firstImproper = mixedToFraction(firstFraction.whole, firstFraction.numerator, firstFraction.denominator);
  const secondImproper = mixedToFraction(secondFraction.whole, secondFraction.numerator, secondFraction.denominator);
  const commonDenominator = lcm(firstImproper.denominator, secondImproper.denominator);
  const scaledFirst = {
    numerator: firstImproper.numerator * (commonDenominator / firstImproper.denominator),
    denominator: commonDenominator
  };
  const scaledSecond = {
    numerator: secondImproper.numerator * (commonDenominator / secondImproper.denominator),
    denominator: commonDenominator
  };
  const resultFraction = simplifyFraction({
    numerator:
      operation === "addition"
        ? scaledFirst.numerator + scaledSecond.numerator
        : scaledFirst.numerator - scaledSecond.numerator,
    denominator: commonDenominator
  });

  const challengeFirst = mixedToFraction(
    challenge.first.whole,
    challenge.first.numerator,
    challenge.first.denominator
  );
  const challengeSecond = mixedToFraction(
    challenge.second.whole,
    challenge.second.numerator,
    challenge.second.denominator
  );
  const challengeDenominator = lcm(challengeFirst.denominator, challengeSecond.denominator);
  const challengeResult = simplifyFraction({
    numerator:
      challenge.operation === "addition"
        ? challengeFirst.numerator * (challengeDenominator / challengeFirst.denominator) +
          challengeSecond.numerator * (challengeDenominator / challengeSecond.denominator)
        : challengeFirst.numerator * (challengeDenominator / challengeFirst.denominator) -
          challengeSecond.numerator * (challengeDenominator / challengeSecond.denominator),
    denominator: challengeDenominator
  });

  const validateChallenge = () => {
    const success = areFractionsEqual(parseFractionString(challenge.answer), challengeResult);

    setChallenge((currentState) => ({
      ...currentState,
      status: success ? "success" : "error"
    }));

    if (success) {
      onCelebrate("#4caf50");
    }
  };

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Fracciones"
        title="Suma y resta de fracciones"
        description="Trabaja con fracciones propias, impropias y mixtas. Primero conviertes, luego igualas denominadores y al final simplificas."
      />
      <div className="lesson-grid">
        <article className="panel-card">
          <SectionHeader eyebrow="Practica guiada" title="Arma dos fracciones" description="Si el numero entero es mayor que cero, la fraccion se vuelve mixta." />
          <div className="selector-row">
            <button type="button" className={`topic-pill neutral-pill ${operation === "addition" ? "is-active" : ""}`} onClick={() => setOperation("addition")}>
              Suma
            </button>
            <button type="button" className={`topic-pill neutral-pill ${operation === "subtraction" ? "is-active" : ""}`} onClick={() => setOperation("subtraction")}>
              Resta
            </button>
          </div>
          <div className="input-grid">
            <label className="field-card">
              <span>Primera entera</span>
              <input type="number" value={firstFraction.whole} onChange={(event) => setFirstFraction((current) => ({ ...current, whole: clampInteger(event.target.value, 0, 5) }))} />
            </label>
            <label className="field-card">
              <span>Primer numerador</span>
              <input type="number" value={firstFraction.numerator} onChange={(event) => setFirstFraction((current) => ({ ...current, numerator: clampInteger(event.target.value, 0, 12) }))} />
            </label>
            <label className="field-card">
              <span>Primer denominador</span>
              <input type="number" value={firstFraction.denominator} onChange={(event) => setFirstFraction((current) => ({ ...current, denominator: clampInteger(event.target.value, 1, 12) }))} />
            </label>
            <label className="field-card">
              <span>Segunda entera</span>
              <input type="number" value={secondFraction.whole} onChange={(event) => setSecondFraction((current) => ({ ...current, whole: clampInteger(event.target.value, 0, 5) }))} />
            </label>
            <label className="field-card">
              <span>Segundo numerador</span>
              <input type="number" value={secondFraction.numerator} onChange={(event) => setSecondFraction((current) => ({ ...current, numerator: clampInteger(event.target.value, 0, 12) }))} />
            </label>
            <label className="field-card">
              <span>Segundo denominador</span>
              <input type="number" value={secondFraction.denominator} onChange={(event) => setSecondFraction((current) => ({ ...current, denominator: clampInteger(event.target.value, 1, 12) }))} />
            </label>
          </div>
          <div className="substitution-card">
            <h3>Paso a paso</h3>
            <p>
              <span>Improprias:</span>{" "}
              <MathInline
                expression={`${fractionToLatex(firstImproper)} ${
                  operation === "addition" ? "+" : "-"
                } ${fractionToLatex(secondImproper)}`}
              />
            </p>
            <p>
              <span>Mismo denominador:</span>{" "}
              <MathInline
                expression={`${fractionToLatex(scaledFirst)} ${
                  operation === "addition" ? "+" : "-"
                } ${fractionToLatex(scaledSecond)}`}
              />
            </p>
            <p>
              <span>Resultado simplificado:</span>{" "}
              <MathInline expression={fractionToLatex(resultFraction)} />
            </p>
          </div>
        </article>

        <article className="panel-card">
          <SectionHeader eyebrow="Reto" title="Resuelve la operacion" description="Escribe tu resultado como fraccion simplificada, por ejemplo 7/4." />
          <div className="challenge-card">
            <div className="challenge-head">
              <div>
                <p className="eyebrow">{challenge.operation === "addition" ? "Suma" : "Resta"}</p>
                <h3>
                  <MathInline
                    expression={`${mixedFractionToLatex(challenge.first)} ${
                      challenge.operation === "addition" ? "+" : "-"
                    } ${mixedFractionToLatex(challenge.second)}`}
                  />
                </h3>
              </div>
              <button type="button" className="secondary-button" onClick={() => setChallenge(createFractionChallenge())}>
                Nuevo reto
              </button>
            </div>
            <label className="field-card">
              <span>Tu respuesta</span>
              <input type="text" value={challenge.answer} {...getChallengeLockState(challenge.status, isCelebrating)} onChange={(event) => setChallenge((currentState) => ({ ...currentState, answer: event.target.value, status: "idle" }))} placeholder="Ejemplo: 7/4" />
            </label>
            <button
              type="button"
              className="primary-button"
              onClick={validateChallenge}
              {...getReviewButtonState(challenge.status, isCelebrating)}
            >
              Revisar respuesta
            </button>
            {challenge.status === "success" && (
              <p className="feedback success-message">
                Correcto. El resultado simplificado es{" "}
                <MathInline expression={fractionToLatex(challengeResult)} className="math-inline-light" />.
              </p>
            )}
            {challenge.status === "error" && (
              <p className="feedback error-message">Revisa la conversion a impropias y busca un denominador comun antes de operar.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function MayanSection({ onCelebrate, isCelebrating }) {
  const [decimalValue, setDecimalValue] = useState(37);
  const [challenge, setChallenge] = useState(mayanChallengeFactory);

  const digits = toThreeLevelMayanDigits(decimalValue);
  const expandedText = digits
    .map((digit, index) => {
      const multiplier = index === 0 ? 400 : index === 1 ? 20 : 1;
      return `${digit} x ${multiplier}`;
    })
    .join(" + ");

  const validateChallenge = () => {
    const success = Number(challenge.answer) === challenge.value;

    setChallenge((currentState) => ({
      ...currentState,
      status: success ? "success" : "error"
    }));

    if (success) {
      onCelebrate("#4caf50");
    }
  };

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Sistema maya"
        title="Numeros mayas"
        description="El sistema maya usa puntos, barras, concha para el cero y tres niveles. Abajo van unidades, en medio grupos de 20 y arriba grupos de 400."
      />

      <div className="lesson-grid">
        <article className="panel-card">
          <SectionHeader
            eyebrow="Explorador"
            title="Escribe un numero decimal"
            description="Prueba del 0 al 2219. En esta version usamos tres niveles: abajo hasta 19, en medio hasta 10 y arriba hasta 5."
          />
          <label className="field-card narrow-field">
            <span>Numero decimal</span>
            <input
              type="number"
              min="0"
              max="2219"
              value={decimalValue}
              onChange={(event) =>
                setDecimalValue(normalizeMayanValue(clampInteger(event.target.value, 0, 2219)))
              }
            />
          </label>
          <div className="mayan-panel">
            <MayanDisplay value={decimalValue} />
          </div>
          <div className="substitution-card">
            <h3>Descomposicion</h3>
            <p>
              <span>Numero:</span> {decimalValue} = {expandedText}
            </p>
          </div>
          <div className="formula-grid single-column">
            <div className="info-box">
              <h3>Reglas rapidas</h3>
              <p>Un punto vale 1, una barra vale 5, la concha vale 0 y los niveles se leen de arriba hacia abajo.</p>
              <p>Nivel 1: de 0 a 19. Nivel 2: de 0 a 10. Nivel 3: de 0 a 5.</p>
              <p>Si escribes un numero grande, la app lo ajusta a esos limites para mantener el ejemplo dentro de este temario.</p>
            </div>
          </div>
        </article>

        <article className="panel-card">
          <SectionHeader
            eyebrow="Reto"
            title="¿Qué numero ves?"
            description="Observa el numero maya y escribe su valor decimal."
          />
          <div className="challenge-card">
            <div className="challenge-head">
              <div>
                <p className="eyebrow">Numero maya</p>
                <h3>Descifralo</h3>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setChallenge(mayanChallengeFactory())}
              >
                Nuevo reto
              </button>
            </div>
            <div className="mayan-panel compact-panel">
              <MayanDisplay value={challenge.value} />
            </div>
            <label className="field-card">
              <span>Tu respuesta en decimal</span>
              <input
                type="number"
                min="0"
                max="2219"
                value={challenge.answer}
                {...getChallengeLockState(challenge.status, isCelebrating)}
                onChange={(event) =>
                  setChallenge((currentState) => ({
                    ...currentState,
                    answer: event.target.value,
                    status: "idle"
                }))
                }
                placeholder="0 a 2219"
              />
            </label>
            <button
              type="button"
              className="primary-button"
              onClick={validateChallenge}
              {...getReviewButtonState(challenge.status, isCelebrating)}
            >
              Revisar respuesta
            </button>
            {challenge.status === "success" && (
              <p className="feedback success-message">
                Excelente. Ese numero maya representa {challenge.value}.
              </p>
            )}
            {challenge.status === "error" && (
              <p className="feedback error-message">
                Todavia no. Recuerda que el nivel superior vale grupos de 20.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function MeasuresSection({ onCelebrate, isCelebrating }) {
  const [familyKey, setFamilyKey] = useState("capacity");
  const [inputValue, setInputValue] = useState(8);
  const [fromKey, setFromKey] = useState("l");
  const [toKey, setToKey] = useState("ml");
  const [challenge, setChallenge] = useState(measurementChallengeFactory);

  const activeFamily = measurementFamilies[familyKey];
  const fromUnit = activeFamily.units.find((unit) => unit.key === fromKey) ?? activeFamily.units[0];
  const toUnit = activeFamily.units.find((unit) => unit.key === toKey) ?? activeFamily.units[1];
  const convertedValue = (inputValue * fromUnit.factor) / toUnit.factor;
  const baseValue = inputValue * fromUnit.factor;
  const challengeFamily = measurementFamilies[challenge.familyKey];
  const challengeFromUnit = challengeFamily.units.find((unit) => unit.key === challenge.fromKey);
  const challengeToUnit = challengeFamily.units.find((unit) => unit.key === challenge.toKey);
  const challengeResult = (challenge.value * challengeFromUnit.factor) / challengeToUnit.factor;

  useEffect(() => {
    const units = measurementFamilies[familyKey].units;
    setFromKey(units[0].key);
    setToKey(units[1].key);
  }, [familyKey]);

  const validateChallenge = () => {
    const success = Math.abs(parseAnswer(challenge.answer) - challengeResult) <= 0.0001;

    setChallenge((currentState) => ({
      ...currentState,
      status: success ? "success" : "error"
    }));

    if (success) {
      onCelebrate("#00a6a6");
    }
  };

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Sistema metrico"
        title="Medidas de capacidad"
        description="Aqui tambien estudiamos peso y longitud porque en el temario vienen juntas como conversiones decimales."
      />

      <div className="selector-row">
        {Object.entries(measurementFamilies).map(([key, family]) => (
          <button
            key={key}
            type="button"
            className={`topic-pill neutral-pill ${familyKey === key ? "is-active" : ""}`}
            onClick={() => setFamilyKey(key)}
          >
            {family.label}
          </button>
        ))}
      </div>

      <div className="lesson-grid">
        <article className="panel-card">
          <SectionHeader
            eyebrow="Conversor"
            title={`Conversiones de ${activeFamily.label.toLowerCase()}`}
            description="El sistema decimal sube o baja de 10 en 10 entre unidades consecutivas."
          />
          <div className="input-grid three-columns">
            <label className="field-card">
              <span>Valor</span>
              <input
                type="number"
                value={inputValue}
                onChange={(event) => setInputValue(clampDecimal(event.target.value, 0.01, 5000))}
              />
            </label>
            <label className="field-card">
              <span>De</span>
              <select value={fromKey} onChange={(event) => setFromKey(event.target.value)}>
                {activeFamily.units.map((unit) => (
                  <option key={unit.key} value={unit.key}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-card">
              <span>A</span>
              <select value={toKey} onChange={(event) => setToKey(event.target.value)}>
                {activeFamily.units.map((unit) => (
                  <option key={unit.key} value={unit.key}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="result-card">
            <h3>Resultado</h3>
            <strong>{formatNumber(convertedValue, 4)}</strong>
          </div>
          <div className="substitution-card">
            <h3>Sustitucion</h3>
            <p>
              <span>Paso 1:</span> {inputValue} {fromUnit.key} = {formatNumber(baseValue, 4)}{" "}
              {activeFamily.baseLabel}
            </p>
            <p>
              <span>Paso 2:</span> {formatNumber(baseValue, 4)} {activeFamily.baseLabel} /{" "}
              {toUnit.factor} = {formatNumber(convertedValue, 4)} {toUnit.key}
            </p>
          </div>
        </article>

        <article className="panel-card">
          <SectionHeader
            eyebrow="Reto"
            title="Convierte la medida"
            description="Escribe el resultado con hasta 4 decimales si hace falta."
          />
          <div className="challenge-card">
            <div className="challenge-head">
              <div>
                <p className="eyebrow">{measurementFamilies[challenge.familyKey].label}</p>
                <h3>
                  Convierte {challenge.value} {challenge.fromKey} a {challenge.toKey}
                </h3>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setChallenge(measurementChallengeFactory())}
              >
                Nuevo reto
              </button>
            </div>
            <label className="field-card">
              <span>Tu respuesta</span>
              <input
                type="text"
                value={challenge.answer}
                {...getChallengeLockState(challenge.status, isCelebrating)}
                onChange={(event) =>
                  setChallenge((currentState) => ({
                    ...currentState,
                    answer: event.target.value,
                    status: "idle"
                  }))
                }
              />
            </label>
            <button
              type="button"
              className="primary-button"
              onClick={validateChallenge}
              {...getReviewButtonState(challenge.status, isCelebrating)}
            >
              Revisar respuesta
            </button>
            {challenge.status === "success" && (
              <p className="feedback success-message">
                Bien hecho. El resultado es {formatNumber(challengeResult, 4)} {challenge.toKey}.
              </p>
            )}
            {challenge.status === "error" && (
              <p className="feedback error-message">
                Revisa si subiste o bajaste en la escalera decimal la cantidad correcta de pasos.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function DecimalsSection({ onCelebrate, isCelebrating }) {
  const [practiceList, setPracticeList] = useState([
    4.03,
    4.3,
    4.0031,
    4.0009,
    4.12
  ]);
  const [practiceDirection, setPracticeDirection] = useState("ascending");
  const [challenge, setChallenge] = useState(decimalChallengeFactory);

  const orderedPractice = [...practiceList].sort((left, right) =>
    compareValues(left, right, practiceDirection)
  );
  const paddedPractice = practiceList.map((value) => formatFixed(value));
  const challengeUserOrder =
    challenge.userOrder.length > 0 ? challenge.userOrder : challenge.list;
  const challengeExpected = [...challenge.list]
    .sort((left, right) => compareValues(left, right, challenge.direction))
    .map((value) => formatFixed(value));

  useEffect(() => {
    if (challenge.userOrder.length === 0 && challenge.list.length > 0) {
      setChallenge((currentState) => ({
        ...currentState,
        userOrder: [...currentState.list]
      }));
    }
  }, [challenge]);

  const moveChallengeItem = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex === null || toIndex === null) {
      return;
    }

    setChallenge((currentState) => {
      const nextOrder = [...currentState.userOrder];
      const [movedItem] = nextOrder.splice(fromIndex, 1);
      nextOrder.splice(toIndex, 0, movedItem);

      return {
        ...currentState,
        userOrder: nextOrder,
        draggingIndex: toIndex,
        status: "idle"
      };
    });
  };

  const validateChallenge = () => {
    const normalizedUserOrder = challengeUserOrder.map((value) => formatFixed(value));
    const success = normalizedUserOrder.join(", ") === challengeExpected.join(", ");

    setChallenge((currentState) => ({
      ...currentState,
      draggingIndex: null,
      status: success ? "success" : "error"
    }));

    if (success) {
      onCelebrate("#6a67ff");
    }
  };

  return (
    <section className="page-section">
      <SectionHeader
        eyebrow="Decimales"
        title="Ordenar numeros hasta diezmilesimos"
        description="Observa sus cuatro posiciones decimales y compara de izquierda a derecha para decidir cual va primero."
      />

      <div className="lesson-grid">
        <article className="panel-card">
          <SectionHeader
            eyebrow="Practica guiada"
            title="Ascendente o descendente"
            description="Genera una lista nueva y cambia el sentido del orden para comparar."
          />
          <div className="selector-row">
            <button
              type="button"
              className={`topic-pill neutral-pill ${practiceDirection === "ascending" ? "is-active" : ""}`}
              onClick={() => setPracticeDirection("ascending")}
            >
              Ascendente
            </button>
            <button
              type="button"
              className={`topic-pill neutral-pill ${practiceDirection === "descending" ? "is-active" : ""}`}
              onClick={() => setPracticeDirection("descending")}
            >
              Descendente
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                setPracticeList(Array.from({ length: 5 }, () => createRandomDecimal()))
              }
            >
              Nueva lista
            </button>
          </div>
          <div className="number-strip">
            {practiceList.map((value, index) => (
              <span key={`${value}-${index}`}>{formatFixed(value)}</span>
            ))}
          </div>
          <div className="substitution-card">
            <h3>Como se comparan</h3>
            <p>
              <span>Original:</span> {paddedPractice.join(", ")}
            </p>
            <p>
              <span>Ordenado:</span> {orderedPractice.map((value) => formatFixed(value)).join(", ")}
            </p>
          </div>
        </article>

        <article className="panel-card">
          <SectionHeader
            eyebrow="Reto"
            title="Escribe el orden correcto"
            description="Separa tus respuestas con comas y conserva cuatro decimales si lo necesitas."
          />
          <div className="challenge-card">
            <div className="challenge-head">
              <div>
                <p className="eyebrow">
                  Orden {challenge.direction === "ascending" ? "ascendente" : "descendente"}
                </p>
                <h3>Lista a ordenar</h3>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setChallenge({
                    ...decimalChallengeFactory(),
                    userOrder: []
                  })
                }
              >
                Nuevo reto
              </button>
            </div>
            <div className="drag-help">
              Arrastra las tarjetas para formar el orden
              {" "}
              {challenge.direction === "ascending" ? "ascendente" : "descendente"}.
            </div>
            <div className="number-strip drag-strip">
              {challengeUserOrder.map((value, index) => (
                <button
                  key={`${value}-${index}`}
                  type="button"
                  className={`draggable-number ${challenge.draggingIndex === index ? "is-dragging" : ""}`}
                  draggable
                  onDragStart={() =>
                    setChallenge((currentState) => ({
                      ...currentState,
                      draggingIndex: index,
                      status: "idle"
                    }))
                  }
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    moveChallengeItem(challenge.draggingIndex, index);
                  }}
                  onDragEnd={() =>
                    setChallenge((currentState) => ({
                      ...currentState,
                      draggingIndex: null
                    }))
                  }
                >
                  {formatFixed(value)}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={validateChallenge}
              {...getReviewButtonState(challenge.status, isCelebrating)}
            >
              Revisar respuesta
            </button>
            {challenge.status === "success" && (
              <p className="feedback success-message">Muy bien. Ese era el orden correcto.</p>
            )}
            {challenge.status === "error" && (
              <p className="feedback error-message">
                No coincide aun. Compara primero unidades, luego decimos, centesimos, milesimos y diezmilesimos.
              </p>
            )}
            <div className="substitution-card">
              <h3>Tu orden actual</h3>
              <p>
                <span>Secuencia:</span>{" "}
                {challengeUserOrder.map((value) => formatFixed(value)).join(", ")}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [burstToken, setBurstToken] = useState(0);
  const [confettiColor, setConfettiColor] = useState("#ff7a59");
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebrationImage, setCelebrationImage] = useState(null);
  const [unlockToast, setUnlockToast] = useState(null);
  const [checkedSyllabusItems, setCheckedSyllabusItems] = useState(() => {
    if (typeof window === "undefined") {
      return syllabusItems.map(() => false);
    }

    try {
      const savedValue = window.sessionStorage.getItem(syllabusStorageKey);

      if (!savedValue) {
        return syllabusItems.map(() => false);
      }

      const parsedValue = JSON.parse(savedValue);

      if (
        Array.isArray(parsedValue) &&
        parsedValue.length === syllabusItems.length &&
        parsedValue.every((item) => typeof item === "boolean")
      ) {
        return parsedValue;
      }
    } catch {
      return syllabusItems.map(() => false);
    }

    return syllabusItems.map(() => false);
  });
  const [gamificationProgress, setGamificationProgress] = useState(() => {
    if (typeof window === "undefined") {
      return { correctCount: 0, unlockedCount: 0 };
    }

    try {
      const savedValue = window.sessionStorage.getItem(gamificationStorageKey);

      if (!savedValue) {
        return { correctCount: 0, unlockedCount: 0 };
      }

      const parsedValue = JSON.parse(savedValue);

      if (
        typeof parsedValue?.correctCount === "number" &&
        typeof parsedValue?.unlockedCount === "number"
      ) {
        return {
          correctCount: Math.max(0, parsedValue.correctCount),
          unlockedCount: Math.max(0, Math.min(parsedValue.unlockedCount, celebrationCharacters.length))
        };
      }
    } catch {
      return { correctCount: 0, unlockedCount: 0 };
    }

    return { correctCount: 0, unlockedCount: 0 };
  });
  const audioRef = useRef(null);
  const celebrationTimeoutRef = useRef(null);
  const unlockToastTimeoutRef = useRef(null);
  const gamificationRef = useRef(gamificationProgress);

  useEffect(() => {
    window.sessionStorage.setItem(
      syllabusStorageKey,
      JSON.stringify(checkedSyllabusItems)
    );
  }, [checkedSyllabusItems]);

  useEffect(() => {
    gamificationRef.current = gamificationProgress;
    window.sessionStorage.setItem(
      gamificationStorageKey,
      JSON.stringify(gamificationProgress)
    );
  }, [gamificationProgress]);

  const toggleSyllabusItem = (index) => {
    setCheckedSyllabusItems((currentItems) =>
      currentItems.map((item, currentIndex) =>
        currentIndex === index ? !item : item
      )
    );
  };

  const celebrate = (color) => {
    if (celebrationTimeoutRef.current) {
      window.clearTimeout(celebrationTimeoutRef.current);
    }
    if (unlockToastTimeoutRef.current) {
      window.clearTimeout(unlockToastTimeoutRef.current);
    }

    const currentProgress = gamificationRef.current;
    const nextCorrectCount = currentProgress.correctCount + 1;
    const previousUnlockedCount = currentProgress.unlockedCount;
    const visibleCharacterIndex = isElenaMode
      ? Math.min(
          celebrationCharacters.length - 1,
          Math.floor((nextCorrectCount - 1) / 2) - 1
        )
      : -1;
    const shouldUnlockNextCharacter =
      isElenaMode &&
      nextCorrectCount % 2 === 0 &&
      previousUnlockedCount < celebrationCharacters.length;
    const nextUnlockedCount = shouldUnlockNextCharacter
      ? previousUnlockedCount + 1
      : previousUnlockedCount;

    setConfettiColor(color);
    setBurstToken(Date.now());
    setIsCelebrating(true);
    setCelebrationImage(
      visibleCharacterIndex >= 0 ? celebrationCharacters[visibleCharacterIndex].image : null
    );
    setGamificationProgress({
      correctCount: nextCorrectCount,
      unlockedCount: nextUnlockedCount
    });

    if (shouldUnlockNextCharacter) {
      const unlockedCharacter = celebrationCharacters[previousUnlockedCount];
      setUnlockToast(unlockedCharacter);
      unlockToastTimeoutRef.current = window.setTimeout(() => {
        setUnlockToast(null);
        unlockToastTimeoutRef.current = null;
      }, 4000);
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => undefined);
    }

    celebrationTimeoutRef.current = window.setTimeout(() => {
      setIsCelebrating(false);
      setCelebrationImage(null);
      celebrationTimeoutRef.current = null;
    }, 2600);
  };

  useEffect(
    () => () => {
      if (celebrationTimeoutRef.current) {
        window.clearTimeout(celebrationTimeoutRef.current);
      }
      if (unlockToastTimeoutRef.current) {
        window.clearTimeout(unlockToastTimeoutRef.current);
      }
    },
    []
  );

  return (
    <div className="app-shell">
      <ConfettiCanvas burstToken={burstToken} activeColor={confettiColor} />
      <CelebrationOverlay active={isCelebrating} imageSrc={celebrationImage} />
      <UnlockToast item={unlockToast} />
      <audio ref={audioRef} src="/bien-hecho.mp3" preload="auto" />

      <header className="topbar-card">
        <div>
          <p className="eyebrow">Matematicas Rogers Hall 5°</p>
          <h1>{appTitle}</h1>
        </div>
        <nav className="top-nav" aria-label="Secciones del temario">
          {sectionItems.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`nav-link ${activeSection === section.id ? "is-active" : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </header>

      {activeSection === "home" && (
        <HomeSection
          onNavigate={setActiveSection}
          checkedItems={checkedSyllabusItems}
          onToggleItem={toggleSyllabusItem}
        />
      )}
      {activeSection === "algorithms" && (
        <AlgorithmsSection onCelebrate={celebrate} isCelebrating={isCelebrating} />
      )}
      {activeSection === "notation" && (
        <NotationSection onCelebrate={celebrate} isCelebrating={isCelebrating} />
      )}
      {activeSection === "geometry" && (
        <GeometrySection onCelebrate={celebrate} isCelebrating={isCelebrating} />
      )}
      {activeSection === "percentages" && (
        <PercentagesSection onCelebrate={celebrate} isCelebrating={isCelebrating} />
      )}
      {activeSection === "rule-of-three" && (
        <RuleOfThreeSection onCelebrate={celebrate} isCelebrating={isCelebrating} />
      )}
      {activeSection === "sequences" && (
        <SequencesSection onCelebrate={celebrate} isCelebrating={isCelebrating} />
      )}
      {activeSection === "fractions" && (
        <FractionsSection onCelebrate={celebrate} isCelebrating={isCelebrating} />
      )}
      {activeSection === "mayan" && (
        <MayanSection onCelebrate={celebrate} isCelebrating={isCelebrating} />
      )}
      {activeSection === "measures" && (
        <MeasuresSection onCelebrate={celebrate} isCelebrating={isCelebrating} />
      )}
      {activeSection === "decimals" && (
        <DecimalsSection onCelebrate={celebrate} isCelebrating={isCelebrating} />
      )}
    </div>
  );
}

export default App;
