import React, { useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./wheel.css";

const RAW_DATA = {
  cuisines: [
    "茶餐廳",
    "日本菜",
    "打邊爐",
    "泰國菜",
    "飲茶/點心",
    "韓國菜",
    "西餐/扒房",
    "燒肉",
    "兩餸飯",
    "拉麵",
    "車仔麵",
    "米線",
    "越南粉(Pho)",
    "上海菜/小籠包",
    "台灣菜/牛肉麵",
    "漢堡包",
    "Pizza/意粉",
    "燒味飯",
    "煲仔飯",
    "自助餐",
    "印度咖喱",
    "潮州打冷",
    "京川滬菜",
    "All Day Breakfast",
  ],
  chains: [
    "譚仔/三哥",
    "壽司郎",
    "麥當勞",
    "大家樂/大快活",
    "薩莉亞",
    "吉野家",
    "KFC",
    "元氣壽司",
    "太興",
    "牛大人",
    "Sukiya(食其家)",
    "Pizza Hut",
    "Jollibee",
    "Five Guys",
    "沙嗲王",
    "敏華冰廳",
    "Pepper Lunch",
    "Mos Burger",
    "美心MX",
    "一蘭",
  ],
};

const SPIN_DURATION_MS = 4200;
const SPIN_END_BUFFER_MS = 80;
const WINNER_PULSE_MS = 800;
const roastLines = [
  "點呀…呢個完全唔啱食？咁你想食咩先講啦。",
  "你係咪又想講「是但」？是但都可以嫌，勁。",
  "隔籬嗰個唔鍾意？你叫佢自己諗啦，唔好靠個轉盤做人。",
  "認真？你轉咗好多次啦…其實你係想玩轉盤唔係想食嘢。",
  "又唔啱？你係咪想要「全香港第一啱你口味」嗰間？",
  "你呢個嘴刁到…轉盤都開始懷疑人生。",
  "得啦得啦，咁不如你講想食咩，我扮轉一次俾你睇。",
  "唔啱食唔緊要，但你轉到第六次…你自己都唔信自己啦。",
  "咩都唔啱？會唔會其實你唔餓，只係寂寞。",
  "最後一次喇喎，再唔啱就當你今日修行：食乜都隨緣。",
];

function buildWheelColors(count) {
  const stops = [];
  for (let i = 0; i < count; i += 1) {
    const hue = Math.round((360 / count) * i);
    const color = `hsl(${hue} 80% 70%)`;
    const start = (360 / count) * i;
    const end = (360 / count) * (i + 1);
    stops.push(`${color} ${start}deg ${end}deg`);
  }
  return `conic-gradient(${stops.join(", ")})`;
}

function App() {
  const [category, setCategory] = useState("cuisines");
  const [result, setResult] = useState("—");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [winnerPhase, setWinnerPhase] = useState("idle");
  const [spinCount, setSpinCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [roastText, setRoastText] = useState("");
  const [lastRoastIndex, setLastRoastIndex] = useState(-1);
  const audioContextRef = useRef(null);

  const options = RAW_DATA[category];
  const wheelBackground = useMemo(
    () => buildWheelColors(options.length),
    [options.length]
  );
  const highlightGradient = useMemo(() => {
    if (selectedIndex === null) {
      return "conic-gradient(transparent 0deg 360deg)";
    }
    const sliceDeg = 360 / options.length;
    const startDeg = selectedIndex * sliceDeg;
    const endDeg = (selectedIndex + 1) * sliceDeg;
    return `conic-gradient(transparent 0deg ${startDeg}deg, rgba(255, 255, 255, 0.65) ${startDeg}deg ${endDeg}deg, transparent ${endDeg}deg 360deg)`;
  }, [options.length, selectedIndex]);

  const pickRoast = () => {
    let next = Math.floor(Math.random() * roastLines.length);
    if (roastLines.length > 1) {
      while (next === lastRoastIndex) {
        next = Math.floor(Math.random() * roastLines.length);
      }
    }
    setLastRoastIndex(next);
    return roastLines[next];
  };

  const ensureAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const playDing = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinnerPhase("idle");
    setSelectedIndex(null);
    // Must be initialized after user gesture.
    ensureAudioContext();

    const index = Math.floor(Math.random() * options.length);
    const segmentAngle = 360 / options.length;
    const centerAngle = index * segmentAngle + segmentAngle / 2;
    const extraRounds = 5 + Math.floor(Math.random() * 3);
    const targetRotation = 360 * extraRounds + (360 - centerAngle);

    setRotation((prev) => prev + targetRotation);

    window.setTimeout(() => {
      setResult(options[index]);
      setSpinCount((prev) => {
        const next = prev + 1;
        if (next > 1) {
          setRoastText(pickRoast());
        } else {
          setRoastText("");
        }
        return next;
      });
      setShowModal(true);
      setSelectedIndex(index);
      setWinnerPhase("pulse");
      playDing();
      window.setTimeout(() => {
        setWinnerPhase("steady");
      }, WINNER_PULSE_MS);
      setIsSpinning(false);
    }, SPIN_DURATION_MS + SPIN_END_BUFFER_MS);
  };

  return (
    <div className="wheelPage">
      <header className="wheelHeader">
        <div className="wheelBrand">今日食咩好？</div>
        <a className="wheelBack" href="/">
          返回首頁
        </a>
      </header>

      <main className="wheelMain">
        <section className="wheelPanel">
          <div className="wheelTitle">美食轉盤</div>
          <div className="wheelTabs">
            <button
              className={category === "cuisines" ? "tab active" : "tab"}
              onClick={() => {
                setCategory("cuisines");
                setResult("—");
                setSelectedIndex(null);
                setWinnerPhase("idle");
              }}
            >
              菜式分類
            </button>
            <button
              className={category === "chains" ? "tab active" : "tab"}
              onClick={() => {
                setCategory("chains");
                setResult("—");
                setSelectedIndex(null);
                setWinnerPhase("idle");
              }}
            >
              連鎖餐廳
            </button>
          </div>

          <div className="wheelStage">
            <div className="pointer" />
            <div
              className="wheel"
              style={{
                background: wheelBackground,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <div
                className={`wheel-highlight ${winnerPhase}`}
                style={{ background: highlightGradient }}
              />
              <div className="wheelCore" />
            </div>
          </div>

          <div className="wheelResult">
            <div className="resultLabel">今日決定：</div>
            <div className="resultValue">{result}</div>
          </div>

          <button className="spinBtn" onClick={spin} disabled={isSpinning}>
            {isSpinning ? "轉緊..." : "開始轉"}
          </button>
          <div className="hint">唔使輸入，直接一鍵決定</div>
        </section>

        <aside className="wheelList">
          <div className="listTitle">候選清單</div>
          <ul>
            {options.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </main>

      {showModal && (
        <div className="modalOverlay" role="dialog" aria-modal="true">
          <div className="modalCard">
            <div className="modalTitle">轉盤結果</div>
            <div className="modalResult">{result}</div>
            <div className="modalCount">你已經轉咗 {spinCount} 次</div>
            <div className="modalRoast">{roastText}</div>
            <button className="modalBtn" onClick={() => setShowModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
