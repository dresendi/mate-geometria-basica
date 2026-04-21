import { useEffect, useMemo, useRef, useState } from "react";

const clampValue = (value) => {
  if (value === "") {
    return "";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "";
  }

  return Math.max(1, Math.min(20, Math.round(numericValue)));
};

const roundToTwo = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const formatNumber = (value) => {
  const roundedValue = roundToTwo(value);
  return Number.isInteger(roundedValue) ? String(roundedValue) : roundedValue.toFixed(2);
};

const makeChallengeValues = (fields) =>
  fields.reduce((accumulator, field) => {
    accumulator[field.key] = Math.floor(Math.random() * 20) + 1;
    return accumulator;
  }, {});

const figures = [
  {
    id: "square",
    name: "Cuadrado",
    color: "#ff7a59",
    accent: "#ffcf99",
    explanation:
      "Todos sus lados miden lo mismo. En primaria se trabaja con lado para sacar perimetro y area.",
    fields: [{ key: "side", label: "Lado", shortLabel: "lado" }],
    formulas: {
      perimeter: "P = 4 × lado",
      area: "A = lado × lado"
    },
    substitution(values, results) {
      return {
        perimeter: `P = 4 × ${values.side} = ${formatNumber(results.perimeter)}`,
        area: `A = ${values.side} × ${values.side} = ${formatNumber(results.area)}`
      };
    },
    calculate(values) {
      const side = values.side;
      return {
        perimeter: 4 * side,
        area: side * side
      };
    },
    renderFigure(values) {
      const sideText = values.side || "?";
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Cuadrado">
          <rect x="110" y="55" width="180" height="180" rx="18" className="shape-fill" />
          <line x1="110" y1="250" x2="290" y2="250" className="measure-line" />
          <text x="200" y="272" className="measure-text">lado = {sideText}</text>
        </svg>
      );
    }
  },
  {
    id: "rectangle",
    name: "Rectangulo",
    color: "#00a6a6",
    accent: "#9ce6de",
    explanation:
      "Tiene dos medidas principales: base y altura. El perimetro usa los cuatro lados y el area usa base por altura.",
    fields: [
      { key: "base", label: "Base", shortLabel: "base" },
      { key: "height", label: "Altura", shortLabel: "altura" }
    ],
    formulas: {
      perimeter: "P = 2 × (base + altura)",
      area: "A = base × altura"
    },
    substitution(values, results) {
      return {
        perimeter: `P = 2 × (${values.base} + ${values.height}) = ${formatNumber(results.perimeter)}`,
        area: `A = ${values.base} × ${values.height} = ${formatNumber(results.area)}`
      };
    },
    calculate(values) {
      const base = values.base;
      const height = values.height;
      return {
        perimeter: 2 * (base + height),
        area: base * height
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Rectangulo">
          <rect x="70" y="80" width="260" height="140" rx="22" className="shape-fill" />
          <line x1="70" y1="238" x2="330" y2="238" className="measure-line" />
          <line x1="350" y1="80" x2="350" y2="220" className="measure-line" />
          <text x="200" y="262" className="measure-text">base = {values.base || "?"}</text>
          <text x="360" y="155" className="measure-text vertical-text">altura = {values.height || "?"}</text>
        </svg>
      );
    }
  },
  {
    id: "circle",
    name: "Circulo",
    color: "#6a67ff",
    accent: "#bdb8ff",
    explanation:
      "El radio va del centro a la orilla. Para el circulo mostramos resultados redondeados a 2 decimales.",
    fields: [{ key: "radius", label: "Radio", shortLabel: "radio" }],
    formulas: {
      perimeter: "P = 2 × pi × radio",
      area: "A = pi × radio × radio"
    },
    substitution(values, results) {
      return {
        perimeter: `P = 2 × pi × ${values.radius} = ${formatNumber(results.perimeter)}`,
        area: `A = pi × ${values.radius} × ${values.radius} = ${formatNumber(results.area)}`
      };
    },
    calculate(values) {
      const radius = values.radius;
      return {
        perimeter: 2 * Math.PI * radius,
        area: Math.PI * radius * radius
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Circulo">
          <circle cx="210" cy="160" r="88" className="shape-fill" />
          <circle cx="210" cy="160" r="4" className="shape-center" />
          <line x1="210" y1="160" x2="298" y2="160" className="measure-line" />
          <text x="254" y="148" className="measure-text">radio = {values.radius || "?"}</text>
        </svg>
      );
    }
  },
  {
    id: "rhombus",
    name: "Rombo",
    color: "#ff4f81",
    accent: "#ffc0d6",
    explanation:
      "El rombo usa lado para perimetro y diagonales mayor y menor para el area.",
    fields: [
      { key: "side", label: "Lado", shortLabel: "lado" },
      { key: "majorDiagonal", label: "Diagonal mayor", shortLabel: "D mayor" },
      { key: "minorDiagonal", label: "Diagonal menor", shortLabel: "D menor" }
    ],
    formulas: {
      perimeter: "P = 4 × lado",
      area: "A = (D mayor × D menor) / 2"
    },
    substitution(values, results) {
      return {
        perimeter: `P = 4 × ${values.side} = ${formatNumber(results.perimeter)}`,
        area: `A = (${values.majorDiagonal} × ${values.minorDiagonal}) / 2 = ${formatNumber(results.area)}`
      };
    },
    calculate(values) {
      return {
        perimeter: 4 * values.side,
        area: (values.majorDiagonal * values.minorDiagonal) / 2
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Rombo">
          <polygon points="210,40 330,160 210,280 90,160" className="shape-fill" />
          <line x1="90" y1="160" x2="330" y2="160" className="measure-line" />
          <line x1="210" y1="40" x2="210" y2="280" className="measure-line" />
          <text x="210" y="148" className="measure-text">D mayor = {values.majorDiagonal || "?"}</text>
          <text x="224" y="168" className="measure-text vertical-text">D menor = {values.minorDiagonal || "?"}</text>
          <text x="118" y="110" className="measure-text">lado = {values.side || "?"}</text>
        </svg>
      );
    }
  },
  {
    id: "trapezoid",
    name: "Trapecio",
    color: "#ffb703",
    accent: "#ffe08a",
    explanation:
      "Usamos base mayor, base menor y altura para el area. Para el perimetro se suman todos los lados.",
    fields: [
      { key: "baseMajor", label: "Base mayor", shortLabel: "base mayor" },
      { key: "baseMinor", label: "Base menor", shortLabel: "base menor" },
      { key: "leftSide", label: "Lado izquierdo", shortLabel: "lado izq." },
      { key: "rightSide", label: "Lado derecho", shortLabel: "lado der." },
      { key: "height", label: "Altura", shortLabel: "altura" }
    ],
    formulas: {
      perimeter: "P = B mayor + B menor + lado izq. + lado der.",
      area: "A = ((B mayor + B menor) × altura) / 2"
    },
    substitution(values, results) {
      return {
        perimeter: `P = ${values.baseMajor} + ${values.baseMinor} + ${values.leftSide} + ${values.rightSide} = ${formatNumber(results.perimeter)}`,
        area: `A = ((${values.baseMajor} + ${values.baseMinor}) × ${values.height}) / 2 = ${formatNumber(results.area)}`
      };
    },
    calculate(values) {
      return {
        perimeter:
          values.baseMajor + values.baseMinor + values.leftSide + values.rightSide,
        area: ((values.baseMajor + values.baseMinor) * values.height) / 2
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Trapecio">
          <polygon points="120,70 300,70 350,240 70,240" className="shape-fill" />
          <line x1="120" y1="52" x2="300" y2="52" className="measure-line" />
          <line x1="70" y1="258" x2="350" y2="258" className="measure-line" />
          <line x1="210" y1="70" x2="210" y2="240" className="measure-line dashed-line" />
          <text x="210" y="42" className="measure-text">base menor = {values.baseMinor || "?"}</text>
          <text x="210" y="280" className="measure-text">base mayor = {values.baseMajor || "?"}</text>
          <text x="225" y="160" className="measure-text vertical-text">altura = {values.height || "?"}</text>
          <text x="82" y="150" className="measure-text">lado = {values.leftSide || "?"}</text>
          <text x="302" y="150" className="measure-text">lado = {values.rightSide || "?"}</text>
        </svg>
      );
    }
  },
  {
    id: "pentagon",
    name: "Pentagono",
    color: "#4caf50",
    accent: "#b9e9b2",
    explanation:
      "Trabajamos con pentagono regular: todos sus lados son iguales. El area usa perimetro por apotema entre 2.",
    fields: [
      { key: "side", label: "Lado", shortLabel: "lado" },
      { key: "apothem", label: "Apotema", shortLabel: "apotema" }
    ],
    formulas: {
      perimeter: "P = 5 × lado",
      area: "A = (perimetro × apotema) / 2"
    },
    substitution(values, results) {
      return {
        perimeter: `P = 5 × ${values.side} = ${formatNumber(results.perimeter)}`,
        area: `A = (${formatNumber(results.perimeter)} × ${values.apothem}) / 2 = ${formatNumber(results.area)}`
      };
    },
    calculate(values) {
      const perimeter = 5 * values.side;
      return {
        perimeter,
        area: (perimeter * values.apothem) / 2
      };
    },
    renderFigure(values) {
      return (
        <svg viewBox="0 0 420 320" className="shape-svg" role="img" aria-label="Pentagono">
          <polygon points="210,35 336,125 288,272 132,272 84,125" className="shape-fill" />
          <circle cx="210" cy="165" r="4" className="shape-center" />
          <line x1="210" y1="165" x2="210" y2="272" className="measure-line" />
          <line x1="132" y1="272" x2="288" y2="272" className="measure-line" />
          <text x="210" y="228" className="measure-text vertical-text">apotema = {values.apothem || "?"}</text>
          <text x="210" y="296" className="measure-text">lado = {values.side || "?"}</text>
        </svg>
      );
    }
  }
];

const createInitialValues = () =>
  figures.reduce((allValues, figure) => {
    allValues[figure.id] = figure.fields.reduce((accumulator, field) => {
      accumulator[field.key] = 6;
      return accumulator;
    }, {});
    return allValues;
  }, {});

const createInitialChallengeState = () =>
  figures.reduce((accumulator, figure) => {
    accumulator[figure.id] = {
      values: makeChallengeValues(figure.fields),
      answerArea: "",
      answerPerimeter: "",
      status: "idle"
    };
    return accumulator;
  }, {});

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

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const pieces = Array.from({ length: 160 }, (_, index) => ({
      x: canvas.width / 2,
      y: canvas.height / 3,
      size: 6 + (index % 8),
      color:
        index % 4 === 0
          ? activeColor
          : index % 4 === 1
            ? "#ffffff"
            : index % 4 === 2
              ? "#ffe45e"
              : "#7bdff2",
      angle: Math.random() * Math.PI * 2,
      speed: 2 + Math.random() * 5,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      gravity: 0.08 + Math.random() * 0.08
    }));

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
      window.removeEventListener("resize", resize);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [burstToken, activeColor]);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}

function App() {
  const [activeFigureId, setActiveFigureId] = useState(figures[0].id);
  const [figureValues, setFigureValues] = useState(createInitialValues);
  const [challengeState, setChallengeState] = useState(createInitialChallengeState);
  const [burstToken, setBurstToken] = useState(0);

  const activeFigure = useMemo(
    () => figures.find((figure) => figure.id === activeFigureId),
    [activeFigureId]
  );

  const activeValues = figureValues[activeFigureId];
  const activeResults = activeFigure.calculate(activeValues);
  const activeSubstitution = activeFigure.substitution(activeValues, activeResults);
  const activeChallenge = challengeState[activeFigureId];
  const challengeResults = activeFigure.calculate(activeChallenge.values);
  const expectsRoundedAnswers = activeFigure.id === "circle" || activeFigure.id === "trapezoid";

  const playCelebrationSound = () => {
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

  const updateFigureValue = (figureId, key, value) => {
    setFigureValues((currentValues) => ({
      ...currentValues,
      [figureId]: {
        ...currentValues[figureId],
        [key]: clampValue(value)
      }
    }));
  };

  const updateChallengeAnswer = (key, value) => {
    if (value === "" || /^(\d+([.]\d{0,2})?)$/.test(value)) {
      setChallengeState((currentState) => ({
        ...currentState,
        [activeFigureId]: {
          ...currentState[activeFigureId],
          [key]: value,
          status: "idle"
        }
      }));
    }
  };

  const generateNewChallenge = () => {
    setChallengeState((currentState) => ({
      ...currentState,
      [activeFigureId]: {
        values: makeChallengeValues(activeFigure.fields),
        answerArea: "",
        answerPerimeter: "",
        status: "idle"
      }
    }));
  };

  const validateChallenge = () => {
    const expectedArea = roundToTwo(challengeResults.area);
    const expectedPerimeter = roundToTwo(challengeResults.perimeter);
    const typedArea = Number(activeChallenge.answerArea);
    const typedPerimeter = Number(activeChallenge.answerPerimeter);
    const tolerance = expectsRoundedAnswers ? 0.05 : 0.01;
    const areaMatches = Math.abs(typedArea - expectedArea) <= tolerance;
    const perimeterMatches = Math.abs(typedPerimeter - expectedPerimeter) <= tolerance;

    setChallengeState((currentState) => ({
      ...currentState,
      [activeFigureId]: {
        ...currentState[activeFigureId],
        status: areaMatches && perimeterMatches ? "success" : "error"
      }
    }));

    if (areaMatches && perimeterMatches) {
      setBurstToken(Date.now());
      playCelebrationSound();
    }
  };

  return (
    <div className="app-shell">
      <ConfettiCanvas burstToken={burstToken} activeColor={activeFigure.color} />

      <header className="hero-card">
        <div>
          <p className="eyebrow">Matematicas para 5o y 6o de primaria</p>
          <h1>Calculadora interactiva de area y perimetro para Elenukis</h1>
          <p className="hero-copy">
            Explora una figura a la vez, cambia sus medidas y descubre sus formulas con una
            experiencia colorida pensada para niñas y niños.
          </p>
        </div>

        <div className="hero-badges">
          <span>Valores del 1 al 20</span>
          <span>Resultados en tiempo real</span>
          <span>Modo reto con celebracion</span>
        </div>
      </header>

      <nav className="figure-selector" aria-label="Seleccionar figura">
        {figures.map((figure) => (
          <button
            key={figure.id}
            type="button"
            className={`figure-pill ${figure.id === activeFigureId ? "is-active" : ""}`}
            style={{
              "--pill-color": figure.color,
              "--pill-accent": figure.accent
            }}
            onClick={() => setActiveFigureId(figure.id)}
          >
            {figure.name}
          </button>
        ))}
      </nav>

      <main className="content-grid">
        <section className="shape-panel" style={{ "--shape-color": activeFigure.color, "--shape-accent": activeFigure.accent }}>
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Figura actual</p>
              <h2>{activeFigure.name}</h2>
            </div>
            <p className="panel-copy">{activeFigure.explanation}</p>
          </div>

          <div className="shape-stage">{activeFigure.renderFigure(activeValues)}</div>

          <div className="formula-grid">
            <article>
              <h3>Formula del perimetro</h3>
              <p>{activeFigure.formulas.perimeter}</p>
            </article>
            <article>
              <h3>Formula del area</h3>
              <p>{activeFigure.formulas.area}</p>
            </article>
          </div>
        </section>

        <section className="controls-panel">
          <div className="calculator-card">
            <div className="panel-heading">
              <div>
                <p className="section-kicker">Calculadora</p>
                <h2>Ingresa las medidas</h2>
              </div>
              <p className="panel-copy">Las operaciones se actualizan automaticamente.</p>
            </div>

            <div className="input-grid">
              {activeFigure.fields.map((field) => (
                <label className="field-card" key={field.key}>
                  <span>{field.label}</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={activeValues[field.key]}
                    onChange={(event) =>
                      updateFigureValue(activeFigureId, field.key, event.target.value)
                    }
                  />
                </label>
              ))}
            </div>

            <div className="result-grid">
              <article className="result-card">
                <h3>Perimetro</h3>
                <strong>{formatNumber(activeResults.perimeter)}</strong>
              </article>
              <article className="result-card">
                <h3>Area</h3>
                <strong>{formatNumber(activeResults.area)}</strong>
              </article>
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
          </div>

          <div className="challenge-card">
            <div className="panel-heading">
              <div>
                <p className="section-kicker">Reto</p>
                <h2>Resuelve sin ver la respuesta</h2>
              </div>
              <button type="button" className="secondary-button" onClick={generateNewChallenge}>
                Nuevo reto
              </button>
            </div>

            <p className="challenge-copy">
              Calcula el area y el perimetro de este {activeFigure.name.toLowerCase()}.
              {expectsRoundedAnswers ? " Usa hasta 2 decimales." : " Si sale decimal, escribe hasta 2 decimales."}
            </p>

            <div className="challenge-values">
              {activeFigure.fields.map((field) => (
                <span key={field.key}>
                  {field.shortLabel}: <strong>{activeChallenge.values[field.key]}</strong>
                </span>
              ))}
            </div>

            <div className="challenge-inputs">
              <label className="field-card">
                <span>Tu perimetro</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={activeChallenge.answerPerimeter}
                  onChange={(event) => updateChallengeAnswer("answerPerimeter", event.target.value)}
                />
              </label>
              <label className="field-card">
                <span>Tu area</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={activeChallenge.answerArea}
                  onChange={(event) => updateChallengeAnswer("answerArea", event.target.value)}
                />
              </label>
            </div>

            <div className="challenge-actions">
              <button type="button" className="primary-button" onClick={validateChallenge}>
                Revisar respuesta
              </button>
            </div>

            {activeChallenge.status === "success" && (
              <p className="challenge-message success-message">
                Excelente. Tu area es {formatNumber(challengeResults.area)} y tu perimetro es{" "}
                {formatNumber(challengeResults.perimeter)}.
              </p>
            )}

            {activeChallenge.status === "error" && (
              <p className="challenge-message error-message">
                Intentalo otra vez. Pista: repasa la formula y revisa cada medida con calma.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
