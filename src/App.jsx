// ============================================================
//  TradeIQ — Firebase Edition
//  STEP 1: Replace the values below with your Firebase config
//  Go to: Firebase Console → Project Settings → Your Apps → Config
// ============================================================

import { useState, useEffect, useRef } from "react";

// ─── FIREBASE CONFIG ─────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        "nifty50-a5b7c.firebaseapp.com",
  projectId:         "nifty50-a5b7c",
  storageBucket:     "nifty50-a5b7c.firebasestorage.app",
  messagingSenderId: "741386978523",
  appId:             "1:741386978523:web:afd14c255f45539ae938fe",
};

// ─── GEMINI API KEY ──────────────────────────────────────────
const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;
// ─────────────────────────────────────────────────────────────

let firebaseApp, firebaseAuth, firebaseDb;
let fbReady = false;

async function loadFirebase() {
  if (fbReady) return;
  const [
    { initializeApp },
    { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile },
    { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove },
  ] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),
  ]);
  firebaseApp  = initializeApp(FIREBASE_CONFIG);
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb   = getFirestore(firebaseApp);
  window._fb   = { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove };
  fbReady = true;
}

const NIFTY50_STOCKS = [
  { symbol: "RELIANCE",   name: "Reliance Industries",       price: 2847.35,  change:  1.24, sector: "Energy" },
  { symbol: "TCS",        name: "Tata Consultancy Services", price: 3912.10,  change: -0.43, sector: "IT" },
  { symbol: "HDFCBANK",   name: "HDFC Bank",                 price: 1678.55,  change:  0.87, sector: "Banking" },
  { symbol: "INFY",       name: "Infosys",                   price: 1823.20,  change: -1.12, sector: "IT" },
  { symbol: "ICICIBANK",  name: "ICICI Bank",                price: 1245.80,  change:  2.15, sector: "Banking" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever",        price: 2345.60,  change:  0.34, sector: "FMCG" },
  { symbol: "ITC",        name: "ITC Limited",               price: 478.25,   change:  1.67, sector: "FMCG" },
  { symbol: "SBIN",       name: "State Bank of India",       price: 812.40,   change: -0.22, sector: "Banking" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel",             price: 1567.90,  change:  3.41, sector: "Telecom" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance",             price: 7234.15,  change: -2.34, sector: "Finance" },
  { symbol: "KOTAKBANK",  name: "Kotak Mahindra Bank",       price: 1892.30,  change:  0.56, sector: "Banking" },
  { symbol: "LT",         name: "Larsen & Toubro",           price: 3456.75,  change:  1.89, sector: "Infrastructure" },
  { symbol: "WIPRO",      name: "Wipro",                     price: 567.45,   change: -0.78, sector: "IT" },
  { symbol: "ASIANPAINT", name: "Asian Paints",              price: 2987.60,  change:  0.12, sector: "Consumer" },
  { symbol: "MARUTI",     name: "Maruti Suzuki",             price: 12456.30, change:  2.67, sector: "Auto" },
  { symbol: "TITAN",      name: "Titan Company",             price: 3678.90,  change: -1.45, sector: "Consumer" },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement",          price: 9876.20,  change:  0.98, sector: "Cement" },
  { symbol: "SUNPHARMA",  name: "Sun Pharmaceutical",        price: 1567.40,  change:  1.23, sector: "Pharma" },
  { symbol: "POWERGRID",  name: "Power Grid Corp",           price: 345.60,   change:  0.45, sector: "Utilities" },
  { symbol: "NTPC",       name: "NTPC Limited",              price: 389.75,   change: -0.34, sector: "Utilities" },
  { symbol: "ONGC",       name: "Oil & Natural Gas Corp",    price: 287.30,   change:  1.56, sector: "Energy" },
  { symbol: "COALINDIA",  name: "Coal India",                price: 456.80,   change:  2.34, sector: "Mining" },
  { symbol: "ADANIENT",   name: "Adani Enterprises",         price: 2876.45,  change: -3.21, sector: "Conglomerate" },
  { symbol: "HCLTECH",    name: "HCL Technologies",          price: 1678.90,  change:  0.67, sector: "IT" },
  { symbol: "TECHM",      name: "Tech Mahindra",             price: 1234.55,  change: -1.89, sector: "IT" },
  { symbol: "NESTLEIND",  name: "Nestle India",              price: 24567.80, change:  0.23, sector: "FMCG" },
  { symbol: "DRREDDY",    name: "Dr. Reddy's Labs",          price: 6789.40,  change:  1.12, sector: "Pharma" },
  { symbol: "CIPLA",      name: "Cipla",                     price: 1456.70,  change: -0.56, sector: "Pharma" },
  { symbol: "DIVISLAB",   name: "Divi's Laboratories",       price: 4567.30,  change:  2.89, sector: "Pharma" },
  { symbol: "EICHERMOT",  name: "Eicher Motors",             price: 4789.60,  change:  1.45, sector: "Auto" },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto",                price: 9234.50,  change:  0.78, sector: "Auto" },
  { symbol: "M&M",        name: "Mahindra & Mahindra",       price: 2345.80,  change: -2.12, sector: "Auto" },
  { symbol: "TATAMOTORS", name: "Tata Motors",               price: 989.45,   change:  3.67, sector: "Auto" },
  { symbol: "TATASTEEL",  name: "Tata Steel",                price: 167.35,   change: -1.23, sector: "Metals" },
  { symbol: "JSWSTEEL",   name: "JSW Steel",                 price: 987.60,   change:  2.45, sector: "Metals" },
  { symbol: "HINDALCO",   name: "Hindalco Industries",       price: 678.90,   change:  0.89, sector: "Metals" },
  { symbol: "VEDL",       name: "Vedanta",                   price: 456.70,   change: -0.67, sector: "Metals" },
  { symbol: "GRASIM",     name: "Grasim Industries",         price: 2345.60,  change:  1.34, sector: "Diversified" },
  { symbol: "INDUSINDBK", name: "IndusInd Bank",             price: 1456.30,  change: -2.78, sector: "Banking" },
  { symbol: "AXISBANK",   name: "Axis Bank",                 price: 1234.80,  change:  0.45, sector: "Banking" },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv",             price: 1876.40,  change: -1.56, sector: "Finance" },
  { symbol: "HDFCLIFE",   name: "HDFC Life Insurance",       price: 689.30,   change:  0.34, sector: "Insurance" },
  { symbol: "SBILIFE",    name: "SBI Life Insurance",        price: 1567.80,  change:  1.23, sector: "Insurance" },
  { symbol: "BRITANNIA",  name: "Britannia Industries",      price: 5678.90,  change: -0.89, sector: "FMCG" },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp",             price: 4567.20,  change:  2.12, sector: "Auto" },
  { symbol: "BPCL",       name: "Bharat Petroleum",          price: 345.60,   change:  0.78, sector: "Energy" },
  { symbol: "IOC",        name: "Indian Oil Corp",           price: 178.90,   change: -0.34, sector: "Energy" },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals",          price: 6789.30,  change:  3.45, sector: "Healthcare" },
  { symbol: "TATACONSUM", name: "Tata Consumer Products",    price: 1234.50,  change:  0.56, sector: "FMCG" },
  { symbol: "UPL",        name: "UPL Limited",               price: 567.80,   change: -1.78, sector: "Agrochemicals" },
];

const SECTOR_COLORS = {
  "IT":"#6366f1","Banking":"#0ea5e9","Energy":"#f59e0b","FMCG":"#10b981",
  "Finance":"#8b5cf6","Telecom":"#ec4899","Infrastructure":"#f97316",
  "Consumer":"#14b8a6","Auto":"#ef4444","Pharma":"#06b6d4",
  "Utilities":"#84cc16","Mining":"#a78bfa","Conglomerate":"#fb923c",
  "Cement":"#94a3b8","Metals":"#fbbf24","Diversified":"#34d399",
  "Insurance":"#60a5fa","Healthcare":"#f472b6","Agrochemicals":"#4ade80",
};

function MiniChart({ positive }) {
  const pts = Array.from({ length: 20 }, (_, i) => {
    const trend = positive ? i * 1.5 : -i * 1.5;
    return Math.max(5, Math.min(95, 50 + trend + (Math.random() - 0.5) * 18));
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / 19) * 100} ${p}`).join(" ");
  const c = positive ? "#10b981" : "#ef4444";
  return (
    <svg viewBox="0 0 100 100" style={{ width: 64, height: 32 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L 100 100 L 0 100 Z`} fill={`url(#g${positive})`} />
      <path d={path} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function AIModal({ stock, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [riskLevel, setRiskLevel] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => { analyzeStock(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);


  async function callGroq(prompt) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000
      })
    });
    const data = await res.json();
    console.log("Groq response:", JSON.stringify(data).slice(0, 200));
    if (data.error) return "Error: " + data.error.message;
    return data.choices?.[0]?.message?.content || "Unable to analyze.";
  }

  async function analyzeStock() {
    setLoading(true);
    try {
      const prompt = `You are TradeIQ, an expert Indian stock market analyst. Always start with RISK LEVEL: LOW, MEDIUM, or HIGH. Give 3 key reasons, sector context, and educational tips. Always remind users this is educational, not financial advice. Be friendly, use emojis.\n\nAnalyze ${stock.symbol} (${stock.name}): Price Rs.${stock.price}, Change: ${stock.change > 0 ? "+" : ""}${stock.change}%, Sector: ${stock.sector}. Give risk assessment for a retail investor.`;
      const text = await callGroq(prompt);
      if (text.toLowerCase().includes("risk level: low")) setRiskLevel("LOW");
      else if (text.toLowerCase().includes("risk level: high")) setRiskLevel("HIGH");
      else setRiskLevel("MEDIUM");
      setMessages([{ role: "assistant", content: text }]);
    } catch(e) {
      console.log("analyzeStock error:", e.message);
      setMessages([{ role: "assistant", content: "Analysis unavailable. Please try again." }]);
      setRiskLevel("MEDIUM");
    }
    setLoading(false);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userInput = input.trim(); setInput("");
    const next = [...messages, { role: "user", content: userInput }];
    setMessages(next); setLoading(true);
    try {
      const history = next.map(m => (m.role === "user" ? "User: " : "Assistant: ") + m.content).join("\n");
      const prompt = `You are TradeIQ, an expert Indian stock educator. The user asks about ${stock.symbol} at Rs.${stock.price}, ${stock.change > 0 ? "up" : "down"} ${Math.abs(stock.change)}% in ${stock.sector}. Be educational, concise. Not financial advice.\n\n${history}`;
      const text = await callGroq(prompt);
      setMessages(p => [...p, { role: "assistant", content: text }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "Connection error." }]);
    }
    setLoading(false);
  }

  const riskColors = {
    LOW:    { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)", text: "#10b981" },
    MEDIUM: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#f59e0b" },
    HIGH:   { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.4)",  text: "#ef4444" },
  };
  const rc = riskLevel ? riskColors[riskLevel] : null;
  const sc = SECTOR_COLORS[stock.sector] || "#6366f1";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(8px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#0d1526", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, width:"100%", maxWidth:680, maxHeight:"90vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, background:`${sc}22`, border:`1px solid ${sc}44`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:sc }}>{stock.symbol.slice(0,2)}</div>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>{stock.symbol}</div>
              <div style={{ color:"rgba(255,255,255,.4)", fontSize:12 }}>{stock.name}</div>
            </div>
            <div style={{ marginLeft:8 }}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:18 }}>₹{stock.price.toLocaleString("en-IN")}</div>
              <div style={{ color: stock.change >= 0 ? "#10b981" : "#ef4444", fontSize:13, fontWeight:600 }}>{stock.change >= 0 ? "▲" : "▼"} {Math.abs(stock.change)}%</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {rc && <div style={{ background:rc.bg, border:`1px solid ${rc.border}`, color:rc.text, padding:"6px 12px", borderRadius:20, fontSize:11, fontWeight:700 }}>{riskLevel} RISK</div>}
            <button onClick={onClose} style={{ background:"rgba(255,255,255,.08)", border:"none", color:"#fff", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:18 }}>×</button>
          </div>
        </div>
        <div style={{ padding:"10px 24px", background:"rgba(16,185,129,.05)", borderBottom:"1px solid rgba(16,185,129,.1)", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#10b981" }} />
          <span style={{ color:"#10b981", fontSize:12, fontWeight:600 }}>TradeIQ AI Agent — Educational Analysis Mode</span>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          {loading && !messages.length && (
            <div style={{ color:"rgba(255,255,255,.5)", fontSize:14 }}>Analyzing {stock.symbol}…</div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display:"flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role === "assistant" && <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#10b981,#059669)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, marginRight:8, flexShrink:0 }}>🤖</div>}
              <div style={{ padding:"14px 16px", borderRadius:12, fontSize:14, lineHeight:1.6, maxWidth:"90%", whiteSpace:"pre-wrap", background: m.role === "user" ? "rgba(16,185,129,.15)" : "rgba(255,255,255,.05)", border: m.role === "user" ? "1px solid rgba(16,185,129,.3)" : "1px solid rgba(255,255,255,.08)", color:"#e2e8f0" }}>{m.content}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding:"16px 24px", borderTop:"1px solid rgba(255,255,255,.08)", display:"flex", gap:10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder={`Ask about ${stock.symbol}…`}
            style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", color:"#fff", padding:"12px 16px", borderRadius:10, flex:1, fontSize:14, fontFamily:"inherit", outline:"none" }} />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background:"linear-gradient(135deg,#10b981,#059669)", border:"none", color:"#fff", padding:"12px 18px", borderRadius:10, cursor:"pointer", fontSize:16 }}>→</button>
        </div>
        <div style={{ padding:"8px 24px 14px", color:"rgba(255,255,255,.25)", fontSize:11, textAlign:"center" }}>⚠️ Educational only. Not financial advice.</div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit() {
    setError("");
    if (!email || !password || (isSignup && !name)) { setError("Please fill all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await loadFirebase();
      const { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, doc, setDoc } = window._fb;
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        await updateProfile(cred.user, { displayName: name });
        await setDoc(doc(firebaseDb, "users", cred.user.uid), { name, email, watchlist: [], createdAt: new Date().toISOString() });
        onLogin({ uid: cred.user.uid, name, email });
      } else {
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        onLogin({ uid: cred.user.uid, name: cred.user.displayName || email.split("@")[0], email });
      }
    } catch (e) {
      const msgs = { "auth/email-already-in-use":"Email already in use.", "auth/user-not-found":"No account found.", "auth/wrong-password":"Incorrect password.", "auth/invalid-email":"Invalid email.", "auth/invalid-credential":"Invalid email or password." };
      setError(msgs[e.code] || e.message);
    }
    setLoading(false);
  }

  const inp = { background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", color:"#fff", padding:"14px 16px", borderRadius:10, width:"100%", fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };

  return (
    <div style={{ minHeight:"100vh", background:"#050a14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ width:420, padding:"0 20px" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:36, height:36, background:"linear-gradient(135deg,#10b981,#059669)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📈</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff" }}>TradeIQ</span>
          </div>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:14 }}>AI-Powered Nifty50 Intelligence Platform</p>
        </div>
        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:16, padding:36 }}>
          <h2 style={{ color:"#fff", fontWeight:700, fontSize:22, marginBottom:6 }}>{isSignup ? "Create account" : "Welcome back"}</h2>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:28 }}>{isSignup ? "Start your trading journey" : "Sign in to your portfolio"}</p>
          {error && <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", color:"#fca5a5", padding:"12px 14px", borderRadius:8, fontSize:14, marginBottom:16 }}>{error}</div>}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {isSignup && <input style={inp} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />}
            <input style={inp} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={inp} type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{ background:"linear-gradient(135deg,#10b981,#059669)", border:"none", color:"#fff", padding:15, borderRadius:10, width:"100%", fontSize:16, fontWeight:600, cursor:"pointer", fontFamily:"inherit", marginTop:24, opacity:loading?.7:1 }}>
            {loading ? "Please wait…" : isSignup ? "Create Account" : "Sign In"}
          </button>
          <p style={{ textAlign:"center", color:"rgba(255,255,255,.4)", fontSize:14, marginTop:20 }}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <span style={{ color:"#10b981", cursor:"pointer", fontWeight:500 }} onClick={() => { setIsSignup(!isSignup); setError(""); }}>{isSignup ? "Sign in" : "Sign up free"}</span>
          </p>
        </div>
        <p style={{ textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:12, marginTop:20 }}>🔒 Secured by Firebase Authentication</p>
      </div>
    </div>
  );
}

function WatchlistSidebar({ watchlist, stocks, onRemove, onSelect, onClose }) {
  const wStocks = stocks.filter(s => watchlist.includes(s.symbol));
  return (
    <div style={{ position:"fixed", right:0, top:0, bottom:0, width:320, background:"#0a1628", borderLeft:"1px solid rgba(255,255,255,.08)", zIndex:200, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid rgba(255,255,255,.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>⭐ My Watchlist</div>
          <div style={{ color:"rgba(255,255,255,.3)", fontSize:12, marginTop:2 }}>{wStocks.length} stocks saved</div>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,.08)", border:"none", color:"#fff", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:18 }}>×</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:16 }}>
        {wStocks.length === 0 ? (
          <div style={{ textAlign:"center", color:"rgba(255,255,255,.3)", padding:"60px 0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⭐</div>
            <div>No stocks yet</div>
            <div style={{ fontSize:12, marginTop:6 }}>Click ⭐ on any stock card</div>
          </div>
        ) : wStocks.map(s => (
          <div key={s.symbol} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:12, padding:14, marginBottom:10, cursor:"pointer" }} onClick={() => onSelect(s)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{s.symbol}</div>
                <div style={{ color:"rgba(255,255,255,.35)", fontSize:11, marginTop:2 }}>{s.name}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); onRemove(s.symbol); }} style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", color:"#ef4444", borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Remove</button>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
              <span style={{ color:"#fff", fontWeight:700 }}>₹{s.price.toLocaleString("en-IN")}</span>
              <span style={{ color: s.change >= 0 ? "#10b981" : "#ef4444", fontSize:13, fontWeight:600 }}>{s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedStock, setSelected]  = useState(null);
  const [search, setSearch]           = useState("");
  const [sectorFilter, setSector]     = useState("All");
  const [sortBy, setSort]             = useState("default");
  const [watchlist, setWatchlist]     = useState([]);
  const [showWatchlist, setShowWL]    = useState(false);
  const [prices, setPrices]           = useState(() => Object.fromEntries(NIFTY50_STOCKS.map(s => [s.symbol, s.price])));

  const sectors = ["All", ...new Set(NIFTY50_STOCKS.map(s => s.sector))];

  useEffect(() => {
    (async () => {
      try {
        await loadFirebase();
        const { onAuthStateChanged, doc, getDoc } = window._fb;
        onAuthStateChanged(firebaseAuth, async fbUser => {
          if (fbUser) {
            const snap = await getDoc(doc(firebaseDb, "users", fbUser.uid));
            const data = snap.exists() ? snap.data() : {};
            setUser({ uid: fbUser.uid, name: fbUser.displayName || fbUser.email.split("@")[0], email: fbUser.email });
            setWatchlist(data.watchlist || []);
          } else {
            setUser(null); setWatchlist([]);
          }
          setAuthLoading(false);
        });
      } catch { setAuthLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        const s = NIFTY50_STOCKS[Math.floor(Math.random() * NIFTY50_STOCKS.length)];
        next[s.symbol] = Math.max(1, prev[s.symbol] + (Math.random() - 0.5) * 3);
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, [user]);

  async function toggleWatchlist(symbol) {
    if (!user) return;
    const { doc, updateDoc, arrayUnion, arrayRemove } = window._fb;
    const isIn = watchlist.includes(symbol);
    setWatchlist(isIn ? watchlist.filter(s => s !== symbol) : [...watchlist, symbol]);
    try { await updateDoc(doc(firebaseDb, "users", user.uid), { watchlist: isIn ? arrayRemove(symbol) : arrayUnion(symbol) }); }
    catch (e) { console.error(e); }
  }

  async function handleLogout() {
    await loadFirebase();
    await window._fb.signOut(firebaseAuth);
    setUser(null); setWatchlist([]);
  }

  const filtered = NIFTY50_STOCKS
    .filter(s => (sectorFilter === "All" || s.sector === sectorFilter) && (s.symbol.includes(search.toUpperCase()) || s.name.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === "price_asc" ? a.price - b.price : sortBy === "price_desc" ? b.price - a.price : sortBy === "change" ? b.change - a.change : 0);

  if (authLoading) return (
    <div style={{ minHeight:"100vh", background:"#050a14", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:40, height:40, border:"3px solid rgba(16,185,129,.2)", borderTop:"3px solid #10b981", borderRadius:"50%", margin:"0 auto 16px", animation:"spin 1s linear infinite" }} />
        <div style={{ color:"rgba(255,255,255,.4)" }}>Loading TradeIQ…</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!user) return <LoginPage onLogin={u => setUser(u)} />;

  return (
    <div style={{ minHeight:"100vh", background:"#050a14", fontFamily:"'DM Sans',sans-serif", color:"#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:3px}.sc{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:16px;cursor:pointer;transition:all .2s}.sc:hover{background:rgba(255,255,255,.06);border-color:rgba(16,185,129,.3);transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,.3)}@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>

      {/* Navbar */}
      <div style={{ background:"rgba(5,10,20,.95)", backdropFilter:"blur(10px)", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"0 24px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, background:"linear-gradient(135deg,#10b981,#059669)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📈</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800 }}>TradeIQ</span>
            <span style={{ background:"rgba(16,185,129,.15)", border:"1px solid rgba(16,185,129,.3)", color:"#10b981", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:10 }}>NIFTY50</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#10b981" }} />
                <span style={{ color:"#10b981", fontWeight:700, fontSize:16 }}>₹24,356.75</span>
                <span style={{ color:"#10b981", fontSize:13 }}>▲ 0.23%</span>
              </div>
              <div style={{ color:"rgba(255,255,255,.3)", fontSize:11 }}>NIFTY 50 • Live</div>
            </div>
            <button onClick={() => setShowWL(!showWatchlist)} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#fff", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontFamily:"inherit", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
              ⭐ Watchlist <span style={{ background:"rgba(16,185,129,.2)", color:"#10b981", borderRadius:10, padding:"1px 7px", fontSize:12, fontWeight:700 }}>{watchlist.length}</span>
            </button>
            <div style={{ background:"rgba(255,255,255,.06)", borderRadius:8, padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, background:"linear-gradient(135deg,#10b981,#059669)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>{user.name[0].toUpperCase()}</div>
              <div>
                <div style={{ color:"#fff", fontSize:13, fontWeight:600, textTransform:"capitalize" }}>{user.name}</div>
                <div style={{ color:"rgba(255,255,255,.3)", fontSize:11 }}>Investor</div>
              </div>
              <button onClick={handleLogout} style={{ background:"none", border:"none", color:"rgba(255,255,255,.3)", cursor:"pointer", fontSize:18, marginLeft:4 }}>⏻</button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div style={{ background:"rgba(16,185,129,.05)", borderBottom:"1px solid rgba(16,185,129,.1)", padding:"8px 0", overflow:"hidden", whiteSpace:"nowrap" }}>
        <div style={{ display:"inline-block", animation:"ticker 40s linear infinite" }}>
          {[...NIFTY50_STOCKS, ...NIFTY50_STOCKS].map((s, i) => (
            <span key={i} style={{ margin:"0 24px", fontSize:12 }}>
              <span style={{ color:"rgba(255,255,255,.6)", fontWeight:600 }}>{s.symbol}</span>
              <span style={{ color:"#fff", margin:"0 6px" }}>₹{(prices[s.symbol]||s.price).toFixed(2)}</span>
              <span style={{ color:s.change>=0?"#10b981":"#ef4444", fontWeight:600 }}>{s.change>=0?"▲":"▼"}{Math.abs(s.change)}%</span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1400, margin:"0 auto", padding:24 }}>
        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
          {[
            { label:"Total Stocks", value:"50",             sub:"Nifty50 Index",    icon:"📊" },
            { label:"Gainers",      value:NIFTY50_STOCKS.filter(s=>s.change>0).length,  sub:"Trading higher", icon:"📈", color:"#10b981" },
            { label:"Losers",       value:NIFTY50_STOCKS.filter(s=>s.change<0).length,  sub:"Trading lower",  icon:"📉", color:"#ef4444" },
            { label:"Watchlist",    value:watchlist.length, sub:"Saved to Firebase", icon:"⭐", color:"#f59e0b" },
          ].map((s,i) => (
            <div key={i} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:"18px 20px", display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ fontSize:28 }}>{s.icon}</div>
              <div>
                <div style={{ color:s.color||"#fff", fontWeight:800, fontSize:24, fontFamily:"'Syne',sans-serif" }}>{s.value}</div>
                <div style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{s.label}</div>
                <div style={{ color:"rgba(255,255,255,.35)", fontSize:12 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,.3)" }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search stocks…"
              style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"#fff", padding:"10px 16px 10px 40px", borderRadius:10, fontSize:14, fontFamily:"inherit", outline:"none", width:260 }} />
          </div>
          <select value={sortBy} onChange={e=>setSort(e.target.value)} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"#fff", padding:"9px 14px", borderRadius:8, fontFamily:"inherit", fontSize:13, outline:"none" }}>
            <option value="default">Sort: Default</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="change">Top Gainers</option>
          </select>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {sectors.map(s => (
              <button key={s} onClick={()=>setSector(s)} style={{ background:sectorFilter===s?"rgba(16,185,129,.15)":"rgba(255,255,255,.04)", border:sectorFilter===s?"1px solid rgba(16,185,129,.4)":"1px solid rgba(255,255,255,.08)", color:sectorFilter===s?"#10b981":"rgba(255,255,255,.5)", padding:"7px 14px", borderRadius:20, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ color:"rgba(255,255,255,.4)", fontSize:13, marginBottom:16 }}>{filtered.length} stocks • Click any card for AI analysis • ⭐ to save to watchlist</div>

        {/* Stock Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
          {filtered.map(stock => {
            const isPos = stock.change >= 0;
            const live  = prices[stock.symbol] || stock.price;
            const sc    = SECTOR_COLORS[stock.sector] || "#6366f1";
            const inWL  = watchlist.includes(stock.symbol);
            return (
              <div key={stock.symbol} className="sc" onClick={()=>setSelected(stock)}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:36, height:36, background:`${sc}22`, border:`1px solid ${sc}44`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:sc, flexShrink:0 }}>{stock.symbol.slice(0,2)}</div>
                    <div>
                      <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{stock.symbol}</div>
                      <div style={{ color:"rgba(255,255,255,.35)", fontSize:11 }}>{stock.sector}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <button title={inWL?"Remove":"Add to watchlist"} onClick={e=>{e.stopPropagation();toggleWatchlist(stock.symbol);}}
                      style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, opacity:inWL?1:.3, transition:"all .15s" }}>⭐</button>
                    <div style={{ background:"rgba(16,185,129,.1)", border:"1px solid rgba(16,185,129,.2)", borderRadius:6, padding:"4px 8px", fontSize:11, color:"#10b981", fontWeight:600 }}>AI ✦</div>
                  </div>
                </div>
                <div style={{ color:"rgba(255,255,255,.4)", fontSize:11, marginBottom:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{stock.name}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:18 }}>₹{live.toFixed(2)}</div>
                    <div style={{ color:isPos?"#10b981":"#ef4444", fontSize:13, fontWeight:600 }}>{isPos?"▲":"▼"} {Math.abs(stock.change)}%</div>
                  </div>
                  <MiniChart positive={isPos} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:12, marginTop:40, paddingTop:20, borderTop:"1px solid rgba(255,255,255,.05)" }}>
          TradeIQ © 2025 • Secured by Firebase • For educational purposes only
        </div>
      </div>

      {showWatchlist && <WatchlistSidebar watchlist={watchlist} stocks={NIFTY50_STOCKS} onRemove={toggleWatchlist} onSelect={s=>{setSelected(s);setShowWL(false);}} onClose={()=>setShowWL(false)} />}
      {selectedStock && <AIModal stock={selectedStock} onClose={()=>setSelected(null)} />}
    </div>
  );
}
