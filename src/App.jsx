import { useEffect, useMemo, useRef, useState } from "react";

const sectionItems = [
  { id: "home", label: "Temario Bloque III" },
  { id: "geometry", label: "Perimetros y areas" },
  { id: "percentages", label: "Porcentajes" },
  { id: "rule-of-three", label: "Regla de tres" },
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
    createChallenge: () => ({ base: randomInt(1, 20), height: randomInt(1, 20) }),
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
      perimeter: "P = 2 x pi x radio",
      area: "A = pi x radio x radio"
    },
    createChallenge: () => ({ radius: randomInt(1, 20) }),
    calculate(values) {
      return {
        perimeter: 2 * Math.PI * values.radius,
        area: Math.PI * values.radius * values.radius
      };
    },
    substitution(values, results) {
      return {
        perimeter: `P = 2 x pi x ${values.radius} = ${formatNumber(results.perimeter)}`,
        area: `A = pi x ${values.radius} x ${values.radius} = ${formatNumber(results.area)}`
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
          <text x="210" y="146" className="measure-text">D mayor = {values.majorDiagonal}</text>
          <text x="226" y="168" className="measure-text vertical-text">D menor = {values.minorDiagonal}</text>
          <text x="122" y="112" className="measure-text">lado = {values.side}</text>
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
    createChallenge: () => ({
      baseMajor: randomInt(1, 20),
      baseMinor: randomInt(1, 20),
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
          <text x="210" y="228" className="measure-text vertical-text">apotema = {values.apothem}</text>
          <text x="210" y="296" className="measure-text">lado = {values.side}</text>
        </svg>
      );
    }
  }
];

const regularInitialValues = geometryFigures.reduce((accumulator, figure) => {
  accumulator[figure.id] = figure.fields.reduce((fieldAccumulator, field) => {
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
  total: randomInt(120, 1600),
  percent: [5, 10, 15, 20, 25, 30, 40, 50, 75][randomInt(0, 8)],
  answer: "",
  status: "idle"
});

const mayanChallengeFactory = () => ({
  value: randomInt(0, 399),
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
  answer: "",
  status: "idle"
});

const compareValues = (leftValue, rightValue, direction) =>
  direction === "ascending" ? leftValue - rightValue : rightValue - leftValue;

const normalizeDecimalSequence = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => formatFixed(Number(item.replace(",", "."))))
    .join(", ");

const toMayanDigits = (value) => {
  const digits = [];
  let pendingValue = value;

  do {
    digits.push(pendingValue % 20);
    pendingValue = Math.floor(pendingValue / 20);
  } while (pendingValue > 0);

  return digits.reverse();
};

function MayanDigit({ value }) {
  if (value === 0) {
    return <div className="mayan-shell">0</div>;
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
  const digits = toMayanDigits(value);

  return (
    <div className="mayan-display" aria-label={`Numero maya para ${value}`}>
      {digits.map((digit, index) => (
        <div key={`${value}-${index}`} className="mayan-level">
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

function HomeSection({ onNavigate }) {
  return (
    <section className="page-section">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Parcial 3</p>
          <h1>Temario Bloque III</h1>
          <p className="hero-copy">
            Esta portada resume el temario del PDF compartido y te da acceso directo a las
            experiencias interactivas que ya construimos para estudiar.
          </p>
        </div>
        <div className="hero-note">
          <strong>Fuente:</strong>
          <p>TEMARIO DEL EXAMEN PARCIAL DE MATEMATICAS BLOQUE III</p>
        </div>
      </header>

      <div className="two-column-grid">
        <article className="panel-card">
          <SectionHeader
            eyebrow="Temario del examen"
            title="Lo que viene en el parcial"
            description="El listado se muestra con el mismo sentido del PDF para que la portada sea una guia de estudio."
          />
          <ol className="syllabus-list">
            {syllabusItems.map((item) => (
              <li key={item}>{item}</li>
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

function GeometrySection({ onCelebrate }) {
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
      [activeFigureId]: {
        ...currentValues[activeFigureId],
        [fieldKey]: clampInteger(value, 1, 20)
      }
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
            </p>
            <div className="challenge-inputs">
              <label className="field-card">
                <span>Tu perimetro</span>
                <input
                  type="text"
                  value={activeChallenge.answerPerimeter}
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
                  onChange={(event) =>
                    updateRegularChallengeAnswer("answerArea", event.target.value)
                  }
                />
              </label>
            </div>
            <button type="button" className="primary-button" onClick={validateRegularChallenge}>
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
                onChange={(event) => updateIrregularChallengeAnswer(event.target.value)}
              />
            </label>
            <button type="button" className="primary-button" onClick={validateIrregularChallenge}>
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

function PercentagesSection({ onCelebrate }) {
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
                onChange={(event) =>
                  setChallenge((currentState) => ({
                    ...currentState,
                    answer: event.target.value,
                    status: "idle"
                  }))
                }
              />
            </label>
            <button type="button" className="primary-button" onClick={validateChallenge}>
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

function RuleOfThreeSection({ onCelebrate }) {
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
                onChange={(event) =>
                  setChallenge((currentState) => ({
                    ...currentState,
                    answer: event.target.value,
                    status: "idle"
                  }))
                }
              />
            </label>
            <button type="button" className="primary-button" onClick={validateChallenge}>
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

function MayanSection({ onCelebrate }) {
  const [decimalValue, setDecimalValue] = useState(37);
  const [challenge, setChallenge] = useState(mayanChallengeFactory);

  const digits = toMayanDigits(decimalValue);
  const expandedText = digits
    .map((digit, index) => {
      const power = digits.length - index - 1;
      const multiplier = 20 ** power;
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
        description="El sistema maya usa puntos, barras y niveles. El nivel de abajo son unidades y el de arriba vale grupos de 20."
      />

      <div className="lesson-grid">
        <article className="panel-card">
          <SectionHeader
            eyebrow="Explorador"
            title="Escribe un numero decimal"
            description="Prueba del 0 al 399 para ver como cambia su representacion maya."
          />
          <label className="field-card narrow-field">
            <span>Numero decimal</span>
            <input
              type="number"
              min="0"
              max="399"
              value={decimalValue}
              onChange={(event) => setDecimalValue(clampInteger(event.target.value, 0, 399))}
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
              <p>Un punto vale 1, una barra vale 5 y los niveles se leen de arriba hacia abajo.</p>
            </div>
          </div>
        </article>

        <article className="panel-card">
          <SectionHeader
            eyebrow="Reto"
            title="Que numero ves?"
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
                max="399"
                value={challenge.answer}
                onChange={(event) =>
                  setChallenge((currentState) => ({
                    ...currentState,
                    answer: event.target.value,
                    status: "idle"
                  }))
                }
              />
            </label>
            <button type="button" className="primary-button" onClick={validateChallenge}>
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

function MeasuresSection({ onCelebrate }) {
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
                onChange={(event) =>
                  setChallenge((currentState) => ({
                    ...currentState,
                    answer: event.target.value,
                    status: "idle"
                  }))
                }
              />
            </label>
            <button type="button" className="primary-button" onClick={validateChallenge}>
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

function DecimalsSection({ onCelebrate }) {
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
  const challengeExpected = [...challenge.list]
    .sort((left, right) => compareValues(left, right, challenge.direction))
    .map((value) => formatFixed(value))
    .join(", ");

  const validateChallenge = () => {
    const success = normalizeDecimalSequence(challenge.answer) === challengeExpected;

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
                onClick={() => setChallenge(decimalChallengeFactory())}
              >
                Nuevo reto
              </button>
            </div>
            <div className="number-strip">
              {challenge.list.map((value, index) => (
                <span key={`${value}-${index}`}>{formatFixed(value)}</span>
              ))}
            </div>
            <label className="field-card">
              <span>Escribe el orden correcto</span>
              <input
                type="text"
                value={challenge.answer}
                onChange={(event) =>
                  setChallenge((currentState) => ({
                    ...currentState,
                    answer: event.target.value,
                    status: "idle"
                  }))
                }
                placeholder="Ejemplo: 1.2300, 1.9000, 2.0001"
              />
            </label>
            <button type="button" className="primary-button" onClick={validateChallenge}>
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

  const celebrate = (color) => {
    setConfettiColor(color);
    setBurstToken(Date.now());

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(783.99, audioContext.currentTime + 0.15);
    oscillator.frequency.linearRampToValueAtTime(1046.5, audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.55);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.6);
    oscillator.onended = () => {
      audioContext.close().catch(() => undefined);
    };
  };

  return (
    <div className="app-shell">
      <ConfettiCanvas burstToken={burstToken} activeColor={confettiColor} />

      <header className="topbar-card">
        <div>
          <p className="eyebrow">Matematicas interactivas</p>
          <h1>Temario Bloque III</h1>
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

      {activeSection === "home" && <HomeSection onNavigate={setActiveSection} />}
      {activeSection === "geometry" && <GeometrySection onCelebrate={celebrate} />}
      {activeSection === "percentages" && <PercentagesSection onCelebrate={celebrate} />}
      {activeSection === "rule-of-three" && <RuleOfThreeSection onCelebrate={celebrate} />}
      {activeSection === "mayan" && <MayanSection onCelebrate={celebrate} />}
      {activeSection === "measures" && <MeasuresSection onCelebrate={celebrate} />}
      {activeSection === "decimals" && <DecimalsSection onCelebrate={celebrate} />}
    </div>
  );
}

export default App;
