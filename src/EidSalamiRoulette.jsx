import { useState, useEffect, useRef, useCallback } from "react";

/* ── Load html2canvas from CDN ── */
function useHtml2Canvas() {
  const [loaded, setLoaded] = useState(!!window.html2canvas);
  useEffect(() => {
    if (window.html2canvas) { setLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = () => setLoaded(true);
    document.head.appendChild(s);
  }, []);
  return loaded;
}

/* ── Bangla digit converter ── */
const bn = (n) =>
  String(n).split("").map((c) => "০১২৩৪৫৬৭৮৯"[c] ?? c).join("");

/* ── Helpers ── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateNumbers(min, max) {
  const range = max - min + 1;
  if (range <= 20) {
    const n = []; for (let i = min; i <= max; i++) n.push(i); return shuffle(n);
  }
  const total = Math.min(16, range), s = new Set([min, max]);
  while (s.size < total) s.add(min + ((Math.random() * range) | 0));
  return shuffle([...s]);
}

const COLORS = [
  ["#1a5c2e","#f5c842"],["#c41e3a","#fde68a"],["#0a3d62","#f5c842"],
  ["#6b3a2a","#86efac"],["#2d5a27","#fbbf24"],["#7c2d12","#fde68a"],
  ["#1e3a5f","#f5c842"],["#4a1c6f","#86efac"],["#14532d","#fbbf24"],
  ["#7f1d1d","#fde68a"],["#064e3b","#f5c842"],["#312e81","#86efac"],
];
const CONFETTI_COLORS = ["#f5c842","#dc2626","#16a34a","#60a5fa","#f97316","#fde68a","#86efac","#e2136e"];

/* ── Wheel Canvas ── */
function WheelCanvas({ segments, rotation }) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c || !segments.length) return;
    const ctx = c.getContext("2d");
    const W = c.width, cx = W / 2, r = W / 2 - 5;
    const n = segments.length, arc = (2 * Math.PI) / n;
    ctx.clearRect(0, 0, W, W);
    for (let i = 0; i < n; i++) {
      const sa = rotation + i * arc - Math.PI / 2, ea = sa + arc;
      const col = COLORS[i % COLORS.length];
      ctx.beginPath(); ctx.moveTo(cx, cx); ctx.arc(cx, cx, r, sa, ea); ctx.closePath();
      ctx.fillStyle = col[0]; ctx.fill();
      ctx.strokeStyle = "rgba(245,200,66,0.45)"; ctx.lineWidth = 1.5; ctx.stroke();
      const g = ctx.createRadialGradient(cx, cx, r * 0.08, cx, cx, r);
      g.addColorStop(0, "rgba(255,255,255,0.09)"); g.addColorStop(1, "rgba(0,0,0,0.13)");
      ctx.beginPath(); ctx.moveTo(cx, cx); ctx.arc(cx, cx, r, sa, ea); ctx.closePath();
      ctx.fillStyle = g; ctx.fill();
      const fs = Math.max(9, ((n > 14 ? W / 38 : W / 30) | 0));
      ctx.save();
      ctx.translate(cx, cx); ctx.rotate(sa + arc / 2);
      ctx.textAlign = "right"; ctx.fillStyle = col[1];
      ctx.font = `bold ${fs}px 'Hind Siliguri', sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.65)"; ctx.shadowBlur = 4;
      ctx.fillText("৳" + bn(segments[i]), r - 10, fs * 0.38);
      ctx.restore();
    }
  }, [segments, rotation]);

  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current; if (!c) return;
      const sz = Math.min(Math.floor(Math.min(window.innerWidth, 560) - 44), 340);
      c.width = sz; c.height = sz; draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <canvas ref={canvasRef} style={{
      display: "block", borderRadius: "50%", touchAction: "none",
      boxShadow: "0 0 0 5px #e8a020, 0 0 0 9px #0a2e1a, 0 0 0 13px #e8a020, 0 0 36px rgba(245,200,66,0.32)",
    }} />
  );
}

/* ── Share Card (what gets screenshotted) ── */
function ShareCard({ winner, minVal, maxVal, cardRef }) {
  return (
    <div ref={cardRef} style={{
      background: "linear-gradient(160deg, #0a2e1a 0%, #14532d 50%, #0a2e1a 100%)",
      borderRadius: 24, padding: "32px 28px 28px",
      textAlign: "center", position: "relative", overflow: "hidden",
      fontFamily: "'Hind Siliguri', sans-serif",
      width: "100%",
    }}>
      {/* Decorative dots */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:`
        radial-gradient(1.5px 1.5px at 10% 15%, #fde68a88, transparent),
        radial-gradient(2px 2px at 85% 20%, #fde68aaa, transparent),
        radial-gradient(1px 1px at 50% 80%, #fde68a66, transparent),
        radial-gradient(1.5px 1.5px at 20% 75%, #fde68a88, transparent),
        radial-gradient(1px 1px at 75% 65%, #fde68a66, transparent),
        radial-gradient(2px 2px at 30% 40%, #fde68a44, transparent)
      `}} />

      {/* Top deco */}
      <div style={{ fontSize: 28, marginBottom: 4 }}>🌙✨🌸</div>
      <div style={{
        fontSize: "clamp(1rem,4vw,1.2rem)", fontWeight: 700,
        background: "linear-gradient(135deg,#f5c842,#fff9c4,#e8a020)",
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
        marginBottom: 16, letterSpacing: 1,
      }}>ঈদ সালামি রুলেট</div>

      {/* Range badge */}
      <div style={{
        display: "inline-block",
        background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.3)",
        borderRadius: 20, padding: "4px 14px", marginBottom: 18,
        color: "#fde68a", fontSize: "clamp(0.72rem,2.8vw,0.82rem)", fontWeight: 500,
      }}>
        🎯 রেঞ্জ: ৳{bn(minVal)} — ৳{bn(maxVal)}
      </div>

      {/* Main result */}
      <div style={{ color: "#bbf7d0", fontSize: "clamp(0.78rem,3vw,0.9rem)", marginBottom: 6 }}>
        সালামির রুলেট ঘুরিয়ে পেয়েছে
      </div>
      <div style={{
        fontSize: "clamp(3rem,14vw,4.5rem)", fontWeight: 700, lineHeight: 1,
        background: "linear-gradient(135deg,#f5c842,#fff9c4,#e8a020)",
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
        marginBottom: 4,
      }}>৳{bn(winner)}</div>
      <div style={{ color: "#86efac", fontSize: "clamp(0.9rem,3.5vw,1.1rem)", marginBottom: 20 }}>
        টাকা সালামি 💰
      </div>

      {/* Cheeky note */}
      <div style={{
        background: "rgba(226,19,110,0.15)", border: "1px solid rgba(226,19,110,0.4)",
        borderRadius: 12, padding: "10px 14px",
        color: "#fda4c8", fontSize: "clamp(0.72rem,2.8vw,0.84rem)", lineHeight: 1.5,
      }}>
        😅 রুলেট যা বলেছে, আমার দোষ নাই!<br/>
        ৳{bn(minVal)}–৳{bn(maxVal)} রেঞ্জে স্পিন করে এটাই উঠেছে 🎡
      </div>

      {/* Footer watermark */}
      <div style={{
        marginTop: 16, color: "rgba(134,239,172,0.5)",
        fontSize: "clamp(0.6rem,2.2vw,0.7rem)",
      }}>
        ঈদ সালামি রুলেট 🌙
      </div>
    </div>
  );
}

/* ── Main App ── */
export default function App() {
  const [minVal, setMinVal] = useState("10");
  const [maxVal, setMaxVal] = useState("500");
  const [segments, setSegments] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showWheel, setShowWheel] = useState(false);
  const [error, setError] = useState("");
  const [confetti, setConfetti] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [shareStatus, setShareStatus] = useState("idle"); // idle | capturing | done
  const [capturedImg, setCapturedImg] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const rotationRef = useRef(0);
  const resultRef = useRef(null);
  const shareCardRef = useRef(null);
  const h2cLoaded = useHtml2Canvas();

  /* Google Font */
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const buildWheel = () => {
    const min = parseInt(minVal), max = parseInt(maxVal);
    if (isNaN(min) || isNaN(max) || min >= max || min < 1) {
      setError("সর্বনিম্ন মান সর্বোচ্চ মানের চেয়ে ছোট হতে হবে ⚠️"); return;
    }
    setError("");
    setSegments(generateNumbers(min, max));
    setShowWheel(true);
    setWinner(null);
    setShowResult(false);
    setCapturedImg(null);
    setShowPreview(false);
    setRotation(0);
    rotationRef.current = 0;
  };

  const getWinner = (angle, segs) => {
    const n = segs.length, arc = (2 * Math.PI) / n;
    const a = ((-angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    return segs[Math.floor(a / arc) % n];
  };

  const fireConfetti = () => {
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
      duration: 1.8 + Math.random() * 2,
      delay: i * 0.022,
      size: 6 + Math.random() * 7,
      round: Math.random() > 0.5,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 5000);
  };

  const spinWheel = () => {
    if (spinning || !segments.length) return;
    setSpinning(true); setShowResult(false); setWinner(null);
    setCapturedImg(null); setShowPreview(false);
    const extra = (5 + Math.floor(Math.random() * 5)) * 2 * Math.PI;
    const target = rotationRef.current + extra + Math.random() * 2 * Math.PI;
    const dur = 4000 + Math.random() * 1500, t0 = performance.now(), a0 = rotationRef.current;
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const loop = (now) => {
      const t = Math.min((now - t0) / dur, 1);
      const angle = a0 + (target - a0) * ease(t);
      rotationRef.current = angle; setRotation(angle);
      if (t < 1) { requestAnimationFrame(loop); }
      else {
        rotationRef.current = target; setRotation(target); setSpinning(false);
        const w = getWinner(target, segments);
        setWinner(w); setShowResult(true); fireConfetti();
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
      }
    };
    requestAnimationFrame(loop);
  };

  /* ── Screenshot logic ── */
  const captureCard = async () => {
    if (!h2cLoaded || !shareCardRef.current) return;
    setShareStatus("capturing");
    try {
      const canvas = await window.html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImg(dataUrl);
      setShowPreview(true);
      setShareStatus("done");
    } catch {
      setShareStatus("idle");
    }
  };

  const downloadImage = () => {
    if (!capturedImg) return;
    const a = document.createElement("a");
    a.href = capturedImg;
    a.download = `eid-salami-${winner}tk.png`;
    a.click();
  };

  const shareImage = async () => {
    if (!capturedImg) return;
    const text = `🌙 ঈদ সালামি রুলেট!\n\nরেঞ্জ ছিল ৳${minVal}–৳${maxVal}\nরুলেট ঘুরিয়ে উঠেছে: ৳${winner} টাকা 💰\n\nরুলেট যা বলেছে আমার দোষ নাই! 😅🎡`;

    if (navigator.share) {
      try {
        // Try sharing with image if supported
        const blob = await (await fetch(capturedImg)).blob();
        const file = new File([blob], `eid-salami-${winner}tk.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text });
        } else {
          await navigator.share({ text });
        }
      } catch { /* user cancelled */ }
    } else {
      // Fallback: copy text to clipboard
      try {
        await navigator.clipboard.writeText(text);
        alert("টেক্সট কপি হয়েছে! এখন শেয়ার করুন 📋");
      } catch {
        downloadImage();
      }
    }
  };

  const copyText = async () => {
    const text = `🌙 ঈদ সালামি রুলেট!\n\nরেঞ্জ ছিল ৳${minVal}–৳${maxVal}\nরুলেট ঘুরিয়ে উঠেছে: ৳${winner} টাকা 💰\n\nরুলেট যা বলেছে আমার দোষ নাই! 😅🎡`;
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ কপি হয়েছে!");
    } catch { alert("কপি হয়নি, manually copy করুন।"); }
  };

  const lCount = window.innerWidth < 380 ? 7 : window.innerWidth < 520 ? 10 : 14;

  return (
    <div style={s.body}>
      <div style={s.stars} />
      <div style={s.rope} />

      {/* Lanterns */}
      <div style={s.lanternRow}>
        {Array.from({ length: lCount }, (_, i) => (
          <div key={i} style={{
            ...s.lantern,
            background: i % 3 === 0
              ? "radial-gradient(circle at 40% 40%,#f87171,#dc2626)"
              : i % 2 === 0
              ? "radial-gradient(circle at 40% 40%,#fbbf24,#e8a020)"
              : "radial-gradient(circle at 40% 40%,#6ee7b7,#16a34a)",
            animationDelay: `${(i * 0.3) % 3}s`,
          }} />
        ))}
      </div>

      {/* Confetti */}
      {confetti.map((p) => (
        <div key={p.id} style={{
          position:"fixed", top:-12, left:`${p.left}vw`,
          width:p.size, height:p.size, background:p.color,
          borderRadius: p.round ? "50%" : 2,
          pointerEvents:"none", zIndex:999,
          animation:`fall ${p.duration}s ${p.delay}s linear forwards`,
        }} />
      ))}

      {/* ── Image Preview Modal ── */}
      {showPreview && capturedImg && (
        <div style={s.modalOverlay} onClick={() => setShowPreview(false)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalTitle}>📸 শেয়ার কার্ড তৈরি!</div>
            <div style={s.modalSubtitle}>ছবিটা সেভ করে বন্ধুকে পাঠাও 😄</div>
            <img src={capturedImg} alt="share card" style={s.previewImg} />
            <div style={s.shareActions}>
              <button style={{...s.shareBtn, background:"linear-gradient(135deg,#e2136e,#c0105c)"}} onClick={shareImage}>
                📤 শেয়ার করো
              </button>
              <button style={{...s.shareBtn, background:"linear-gradient(135deg,#0a3d62,#1e3a5f)"}} onClick={downloadImage}>
                💾 সেভ করো
              </button>
              <button style={{...s.shareBtn, background:"linear-gradient(135deg,#14532d,#064e3b)"}} onClick={copyText}>
                📋 টেক্সট কপি
              </button>
            </div>
            <button style={s.closeBtn} onClick={() => setShowPreview(false)}>✕ বন্ধ করো</button>
          </div>
        </div>
      )}

      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.moon}>🌙</div>
          <div style={s.title}>ঈদ সালামি রুলেট</div>
          <div style={s.subtitle}>ঘুরিয়ে দেখো কত টাকা পাবে! ✨</div>
        </div>

        {/* Input Card */}
        <div style={s.card}>
          <div style={s.cardTitle}>🎯 সালামির পরিমাণ নির্ধারণ করুন</div>
          <div style={s.rangeRow}>
            <div style={s.rangeCol}>
              <span style={s.rangeLabel}>{"সর্বনিম্ন\n(টাকা)"}</span>
              <input type="number" inputMode="numeric" value={minVal}
                onChange={(e) => setMinVal(e.target.value)} style={s.numInput} />
            </div>
            <div style={s.sep}>—</div>
            <div style={s.rangeCol}>
              <span style={s.rangeLabel}>{"সর্বোচ্চ\n(টাকা)"}</span>
              <input type="number" inputMode="numeric" value={maxVal}
                onChange={(e) => setMaxVal(e.target.value)} style={s.numInput} />
            </div>
          </div>
          {error && <div style={s.err}>{error}</div>}
          <button style={s.btnGold} onClick={buildWheel}>🎡 চাকা তৈরি করুন</button>
        </div>

        {/* Wheel */}
        {showWheel && (
          <div style={s.wheelSection}>
            <div style={s.wheelOuter}>
              <div style={s.pointer} />
              <WheelCanvas segments={segments} rotation={rotation} />
              <button onClick={spinWheel} disabled={spinning} style={s.centerCap} aria-label="spin">🌙</button>
            </div>
            <button
              style={{ ...s.spinBtn, opacity: spinning ? 0.55 : 1, cursor: spinning ? "not-allowed" : "pointer" }}
              onClick={spinWheel} disabled={spinning}
            >
              {spinning ? "ঘুরছে..." : "ঘোরাও! 🎉"}
            </button>
          </div>
        )}

        {/* Result */}
        {showResult && winner !== null && (
          <div ref={resultRef} style={{ width: "100%" }}>
            {/* Visible result box */}
            <div style={s.resultBox}>
              <div style={s.resultDeco}>🌸 ঈদ মোবারক 🌸</div>
              <div style={s.resultLabel}>তোমার সালামি হলো</div>
              <div style={s.resultAmount}>৳{bn(winner)}</div>
              <div style={s.resultTaka}>টাকা 💰</div>
            </div>

            {/* Hidden share card (rendered off-screen for html2canvas) */}
            <div style={{ position: "absolute", left: -9999, top: 0, width: 360, pointerEvents: "none" }}>
              <ShareCard winner={winner} minVal={minVal} maxVal={maxVal} cardRef={shareCardRef} />
            </div>

            {/* Share section */}
            <div style={s.shareSection}>
              <div style={s.shareHint}>
                বন্ধুকে দেখাও কত সালামি পেলে! 😄
              </div>
              <button
                style={{
                  ...s.captureBtn,
                  opacity: shareStatus === "capturing" ? 0.7 : 1,
                  cursor: shareStatus === "capturing" ? "wait" : "pointer",
                }}
                onClick={captureCard}
                disabled={shareStatus === "capturing"}
              >
                {shareStatus === "capturing" ? "⏳ তৈরি হচ্ছে..." : "📸 শেয়ার কার্ড বানাও"}
              </button>
              {capturedImg && (
                <button style={s.viewCardBtn} onClick={() => setShowPreview(true)}>
                  👁 কার্ড দেখো / শেয়ার করো
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={s.footer}>
          <div style={s.footerTop}>🤲 আমাকেও একটু সালামি পাঠান ভাই/আপু! 😄🌙</div>
          <div style={s.bkashBadge}>
            <span style={s.bkashLogo}>bKash</span>
            <span style={s.bkashNum}>01925-257958</span>
          </div>
          <div style={s.footerNote}>ঈদ মোবারক 🌸 — ছোট্ট একটু সালামি মনটা ভালো করে দেয় 💛</div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        body{margin:0;overflow-x:hidden;}
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        @keyframes swing{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}
        @keyframes glow{from{filter:drop-shadow(0 0 8px #f5c842aa)}to{filter:drop-shadow(0 0 22px #f5c842ff)}}
        @keyframes fall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes popIn{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes fadeUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes modalIn{from{transform:scale(.85) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
      `}</style>
    </div>
  );
}

/* ── Styles ── */
const s = {
  body:{fontFamily:"'Hind Siliguri',sans-serif",background:"#0a2e1a",minHeight:"100vh",overflowX:"hidden",position:"relative"},
  stars:{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:`
    radial-gradient(1.5px 1.5px at  8% 18%,#fde68a99,transparent),
    radial-gradient(1px   1px   at 28% 62%,#fde68a66,transparent),
    radial-gradient(2px   2px   at 50%  9%,#fde68aaa,transparent),
    radial-gradient(1px   1px   at 72% 38%,#fde68a88,transparent),
    radial-gradient(1.5px 1.5px at 87% 78%,#fde68a66,transparent),
    radial-gradient(2px   2px   at 14% 88%,#fde68aaa,transparent),
    radial-gradient(1px   1px   at 91% 14%,#fde68a88,transparent),
    radial-gradient(1px   1px   at 38% 33%,#fde68aaa,transparent),
    radial-gradient(2px   2px   at 23% 53%,#fde68a88,transparent),
    radial-gradient(1px   1px   at 77% 24%,#fde68a66,transparent),
    radial-gradient(1.5px 1.5px at  4% 49%,#fde68aaa,transparent),
    radial-gradient(1px   1px   at 64% 91%,#fde68a88,transparent),
    radial-gradient(2px   2px   at 93% 58%,#fde68a66,transparent),
    radial-gradient(1px   1px   at 34%  4%,#fde68aaa,transparent)`},
  rope:{position:"fixed",top:0,left:0,width:"100%",height:4,zIndex:3,background:"repeating-linear-gradient(90deg,#e8a020 0,#e8a020 18px,#0a2e1a 18px,#0a2e1a 36px)"},
  lanternRow:{position:"fixed",top:0,left:0,width:"100%",height:48,display:"flex",alignItems:"flex-start",justifyContent:"space-around",pointerEvents:"none",zIndex:2},
  lantern:{width:15,height:22,borderRadius:"3px 3px 5px 5px",position:"relative",top:-2,flexShrink:0,animation:"swing 3s ease-in-out infinite alternate"},
  container:{position:"relative",zIndex:10,maxWidth:560,margin:"0 auto",padding:"6px 14px 52px",display:"flex",flexDirection:"column",alignItems:"center",gap:"clamp(14px,4vw,20px)"},
  header:{textAlign:"center",marginTop:"clamp(46px,11vw,60px)"},
  moon:{fontSize:"clamp(38px,11vw,54px)",lineHeight:1,display:"inline-block",animation:"glow 2s ease-in-out infinite alternate"},
  title:{fontSize:"clamp(1.3rem,6.5vw,2.1rem)",fontWeight:700,background:"linear-gradient(135deg,#f5c842,#fff9c4,#e8a020)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",margin:"4px 0",letterSpacing:1,lineHeight:1.25},
  subtitle:{color:"#86efac",fontSize:"clamp(0.74rem,3.2vw,0.9rem)"},
  card:{background:"linear-gradient(135deg,rgba(20,83,45,0.92),rgba(10,46,26,0.97))",border:"2px solid #e8a020",borderRadius:20,padding:"clamp(14px,5vw,24px) clamp(14px,5vw,28px)",width:"100%",boxShadow:"0 0 28px rgba(245,200,66,0.13),inset 0 1px 0 rgba(245,200,66,0.18)"},
  cardTitle:{color:"#f5c842",fontSize:"clamp(0.8rem,3.6vw,1rem)",fontWeight:600,textAlign:"center",marginBottom:"clamp(12px,3.5vw,16px)"},
  rangeRow:{display:"grid",gridTemplateColumns:"1fr 28px 1fr",alignItems:"center",gap:8},
  rangeCol:{display:"flex",flexDirection:"column",alignItems:"center",gap:6},
  rangeLabel:{color:"#bbf7d0",fontSize:"clamp(0.68rem,2.8vw,0.84rem)",textAlign:"center",lineHeight:1.35,whiteSpace:"pre-line"},
  numInput:{width:"100%",textAlign:"center",outline:"none",background:"rgba(10,46,26,0.85)",border:"1.5px solid #e8a020",color:"#f5c842",borderRadius:10,fontFamily:"'Hind Siliguri',sans-serif",fontSize:"clamp(0.95rem,4.2vw,1.1rem)",fontWeight:700,padding:"clamp(9px,2.8vw,12px) 4px"},
  sep:{color:"#f5c842",fontSize:"1.3rem",fontWeight:700,textAlign:"center"},
  err:{color:"#fca5a5",fontSize:"clamp(0.72rem,2.7vw,0.82rem)",textAlign:"center",marginTop:8},
  btnGold:{width:"100%",border:"none",borderRadius:12,cursor:"pointer",fontFamily:"'Hind Siliguri',sans-serif",fontWeight:700,background:"linear-gradient(135deg,#e8a020,#f5c842,#e8a020)",color:"#0a2e1a",fontSize:"clamp(0.88rem,3.8vw,1rem)",padding:"clamp(11px,3.5vw,14px) 0",marginTop:"clamp(12px,3.5vw,16px)",boxShadow:"0 4px 16px rgba(245,200,66,0.28)"},
  wheelSection:{display:"flex",flexDirection:"column",alignItems:"center",gap:"clamp(14px,4vw,18px)",width:"100%"},
  wheelOuter:{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"},
  pointer:{position:"absolute",top:-15,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"12px solid transparent",borderRight:"12px solid transparent",borderTop:"28px solid #f5c842",filter:"drop-shadow(0 2px 6px rgba(245,200,66,0.8))",zIndex:20},
  centerCap:{position:"absolute",borderRadius:"50%",width:"clamp(44px,12vw,58px)",height:"clamp(44px,12vw,58px)",background:"radial-gradient(circle at 40% 35%,#f5c842,#e8a020)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(1.1rem,4vw,1.5rem)",boxShadow:"0 0 16px rgba(245,200,66,0.6),inset 0 2px 4px rgba(255,255,255,0.3)",zIndex:15,cursor:"pointer",border:"none"},
  spinBtn:{background:"linear-gradient(135deg,#e8a020,#f5c842)",color:"#0a2e1a",fontFamily:"'Hind Siliguri',sans-serif",fontWeight:700,fontSize:"clamp(1rem,4.2vw,1.15rem)",border:"none",borderRadius:14,padding:"clamp(12px,3.5vw,15px) 0",width:"100%",maxWidth:280,boxShadow:"0 4px 20px rgba(245,200,66,0.38)"},
  resultBox:{background:"linear-gradient(135deg,rgba(20,83,45,0.92),rgba(10,46,26,0.97))",border:"2px solid #f5c842",borderRadius:20,padding:"clamp(16px,4.5vw,24px) clamp(14px,4.5vw,28px)",textAlign:"center",boxShadow:"0 0 28px rgba(245,200,66,0.18)",animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)"},
  resultDeco:{fontSize:"clamp(1.1rem,4vw,1.4rem)"},
  resultLabel:{color:"#bbf7d0",fontSize:"clamp(.78rem,3vw,.9rem)",margin:"8px 0 4px"},
  resultAmount:{fontSize:"clamp(2.2rem,12vw,3.4rem)",fontWeight:700,lineHeight:1.1,background:"linear-gradient(135deg,#f5c842,#fff9c4,#e8a020)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"},
  resultTaka:{color:"#86efac",fontSize:"clamp(.8rem,3vw,.95rem)",marginTop:4},

  /* Share section */
  shareSection:{marginTop:12,display:"flex",flexDirection:"column",alignItems:"center",gap:10,animation:"fadeUp 0.5s ease"},
  shareHint:{color:"#fde68a",fontSize:"clamp(0.78rem,3vw,0.88rem)",fontWeight:500,textAlign:"center"},
  captureBtn:{width:"100%",border:"2px solid #f5c842",borderRadius:14,cursor:"pointer",fontFamily:"'Hind Siliguri',sans-serif",fontWeight:700,background:"linear-gradient(135deg,rgba(245,200,66,0.15),rgba(245,200,66,0.05))",color:"#f5c842",fontSize:"clamp(0.9rem,3.8vw,1rem)",padding:"clamp(12px,3.5vw,14px) 0",boxShadow:"0 0 20px rgba(245,200,66,0.2)"},
  viewCardBtn:{width:"100%",border:"2px solid #86efac",borderRadius:14,cursor:"pointer",fontFamily:"'Hind Siliguri',sans-serif",fontWeight:700,background:"linear-gradient(135deg,rgba(134,239,172,0.15),rgba(134,239,172,0.05))",color:"#86efac",fontSize:"clamp(0.88rem,3.6vw,0.98rem)",padding:"clamp(11px,3vw,13px) 0"},

  /* Modal */
  modalOverlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16},
  modalBox:{background:"linear-gradient(160deg,#0f3d22,#0a2e1a)",border:"2px solid #e8a020",borderRadius:24,padding:"24px 20px",width:"100%",maxWidth:400,maxHeight:"90vh",overflowY:"auto",animation:"modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"},
  modalTitle:{color:"#f5c842",fontSize:"clamp(1rem,4vw,1.2rem)",fontWeight:700,textAlign:"center",marginBottom:4},
  modalSubtitle:{color:"#86efac",fontSize:"clamp(0.74rem,2.8vw,0.84rem)",textAlign:"center",marginBottom:16,opacity:0.8},
  previewImg:{width:"100%",borderRadius:16,display:"block",boxShadow:"0 0 24px rgba(245,200,66,0.2)"},
  shareActions:{display:"flex",flexDirection:"column",gap:10,marginTop:16},
  shareBtn:{width:"100%",border:"none",borderRadius:12,cursor:"pointer",fontFamily:"'Hind Siliguri',sans-serif",fontWeight:700,color:"#fff",fontSize:"clamp(0.88rem,3.6vw,1rem)",padding:"clamp(11px,3vw,13px) 0",boxShadow:"0 4px 12px rgba(0,0,0,0.3)"},
  closeBtn:{width:"100%",border:"1px solid rgba(245,200,66,0.3)",borderRadius:12,cursor:"pointer",fontFamily:"'Hind Siliguri',sans-serif",fontWeight:600,background:"transparent",color:"rgba(245,200,66,0.6)",fontSize:"clamp(0.82rem,3vw,0.9rem)",padding:"10px 0",marginTop:10},

  footer:{width:"100%",background:"linear-gradient(135deg,rgba(20,83,45,0.85),rgba(10,46,26,0.95))",border:"2px solid #e2136e",borderRadius:20,padding:"clamp(14px,4vw,20px) clamp(12px,4vw,24px)",textAlign:"center",boxShadow:"0 0 24px rgba(226,19,110,0.2)"},
  footerTop:{color:"#fde68a",fontSize:"clamp(0.8rem,3.5vw,1rem)",fontWeight:600,marginBottom:10,lineHeight:1.45},
  bkashBadge:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"clamp(6px,2vw,10px)",flexWrap:"wrap",background:"linear-gradient(135deg,#e2136e,#c0105c)",borderRadius:14,padding:"clamp(9px,2.5vw,11px) clamp(14px,5vw,24px)",boxShadow:"0 4px 16px rgba(226,19,110,0.4)"},
  bkashLogo:{fontSize:"clamp(1rem,4vw,1.25rem)",fontWeight:900,color:"#fff"},
  bkashNum:{fontSize:"clamp(1rem,4.2vw,1.15rem)",fontWeight:700,color:"#fff",letterSpacing:1},
  footerNote:{color:"#86efac",fontSize:"clamp(0.68rem,2.7vw,0.78rem)",marginTop:10,opacity:0.75,lineHeight:1.5},
};
