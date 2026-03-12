import { useState, useEffect, useRef } from "react";

const NIFTY50_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2847.35, change: 1.24, sector: "Energy" },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3912.10, change: -0.43, sector: "IT" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1678.55, change: 0.87, sector: "Banking" },
  { symbol: "INFY", name: "Infosys", price: 1823.20, change: -1.12, sector: "IT" },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1245.80, change: 2.15, sector: "Banking" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: 2345.60, change: 0.34, sector: "FMCG" },
  { symbol: "ITC", name: "ITC Limited", price: 478.25, change: 1.67, sector: "FMCG" },
  { symbol: "SBIN", name: "State Bank of India", price: 812.40, change: -0.22, sector: "Banking" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1567.90, change: 3.41, sector: "Telecom" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 7234.15, change: -2.34, sector: "Finance" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: 1892.30, change: 0.56, sector: "Banking" },
  { symbol: "LT", name: "Larsen & Toubro", price: 3456.75, change: 1.89, sector: "Infrastructure" },
  { symbol: "WIPRO", name: "Wipro", price: 567.45, change: -0.78, sector: "IT" },
  { symbol: "ASIANPAINT", name: "Asian Paints", price: 2987.60, change: 0.12, sector: "Consumer" },
  { symbol: "MARUTI", name: "Maruti Suzuki", price: 12456.30, change: 2.67, sector: "Auto" },
  { symbol: "TITAN", name: "Titan Company", price: 3678.90, change: -1.45, sector: "Consumer" },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement", price: 9876.20, change: 0.98, sector: "Cement" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", price: 1567.40, change: 1.23, sector: "Pharma" },
  { symbol: "POWERGRID", name: "Power Grid Corp", price: 345.60, change: 0.45, sector: "Utilities" },
  { symbol: "NTPC", name: "NTPC Limited", price: 389.75, change: -0.34, sector: "Utilities" },
  { symbol: "ONGC", name: "Oil & Natural Gas Corp", price: 287.30, change: 1.56, sector: "Energy" },
  { symbol: "COALINDIA", name: "Coal India", price: 456.80, change: 2.34, sector: "Mining" },
  { symbol: "ADANIENT", name: "Adani Enterprises", price: 2876.45, change: -3.21, sector: "Conglomerate" },
  { symbol: "HCLTECH", name: "HCL Technologies", price: 1678.90, change: 0.67, sector: "IT" },
  { symbol: "TECHM", name: "Tech Mahindra", price: 1234.55, change: -1.89, sector: "IT" },
  { symbol: "NESTLEIND", name: "Nestle India", price: 24567.80, change: 0.23, sector: "FMCG" },
  { symbol: "DRREDDY", name: "Dr. Reddy's Labs", price: 6789.40, change: 1.12, sector: "Pharma" },
  { symbol: "CIPLA", name: "Cipla", price: 1456.70, change: -0.56, sector: "Pharma" },
  { symbol: "DIVISLAB", name: "Divi's Laboratories", price: 4567.30, change: 2.89, sector: "Pharma" },
  { symbol: "EICHERMOT", name: "Eicher Motors", price: 4789.60, change: 1.45, sector: "Auto" },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto", price: 9234.50, change: 0.78, sector: "Auto" },
  { symbol: "M&M", name: "Mahindra & Mahindra", price: 2345.80, change: -2.12, sector: "Auto" },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: 989.45, change: 3.67, sector: "Auto" },
  { symbol: "TATASTEEL", name: "Tata Steel", price: 167.35, change: -1.23, sector: "Metals" },
  { symbol: "JSWSTEEL", name: "JSW Steel", price: 987.60, change: 2.45, sector: "Metals" },
  { symbol: "HINDALCO", name: "Hindalco Industries", price: 678.90, change: 0.89, sector: "Metals" },
  { symbol: "VEDL", name: "Vedanta", price: 456.70, change: -0.67, sector: "Metals" },
  { symbol: "GRASIM", name: "Grasim Industries", price: 2345.60, change: 1.34, sector: "Diversified" },
  { symbol: "INDUSINDBK", name: "IndusInd Bank", price: 1456.30, change: -2.78, sector: "Banking" },
  { symbol: "AXISBANK", name: "Axis Bank", price: 1234.80, change: 0.45, sector: "Banking" },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv", price: 1876.40, change: -1.56, sector: "Finance" },
  { symbol: "HDFCLIFE", name: "HDFC Life Insurance", price: 689.30, change: 0.34, sector: "Insurance" },
  { symbol: "SBILIFE", name: "SBI Life Insurance", price: 1567.80, change: 1.23, sector: "Insurance" },
  { symbol: "BRITANNIA", name: "Britannia Industries", price: 5678.90, change: -0.89, sector: "FMCG" },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp", price: 4567.20, change: 2.12, sector: "Auto" },
  { symbol: "BPCL", name: "Bharat Petroleum", price: 345.60, change: 0.78, sector: "Energy" },
  { symbol: "IOC", name: "Indian Oil Corp", price: 178.90, change: -0.34, sector: "Energy" },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals", price: 6789.30, change: 3.45, sector: "Healthcare" },
  { symbol: "TATACONSUM", name: "Tata Consumer Products", price: 1234.50, change: 0.56, sector: "FMCG" },
  { symbol: "UPL", name: "UPL Limited", price: 567.80, change: -1.78, sector: "Agrochemicals" },
];

const SECTOR_COLORS = {
  "IT": "#6366f1", "Banking": "#0ea5e9", "Energy": "#f59e0b", "FMCG": "#10b981",
  "Finance": "#8b5cf6", "Telecom": "#ec4899", "Infrastructure": "#f97316",
  "Consumer": "#14b8a6", "Auto": "#ef4444", "Pharma": "#06b6d4",
  "Utilities": "#84cc16", "Mining": "#a78bfa", "Conglomerate": "#fb923c",
  "Cement": "#94a3b8", "Metals": "#fbbf24", "Diversified": "#34d399",
  "Insurance": "#60a5fa", "Healthcare": "#f472b6", "Agrochemicals": "#4ade80",
};

function MiniChart({ positive }) {
  const points = Array.from({ length: 20 }, (_, i) => {
    const base = 50;
    const trend = positive ? i * 1.2 : -i * 1.2;
    const noise = (Math.random() - 0.5) * 15;
    return Math.max(5, Math.min(95, base + trend + noise));
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / 19) * 100} ${p}`).join(" ");
  const color = positive ? "#10b981" : "#ef4444";
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L 100 100 L 0 100 Z`} fill={`url(#g${positive})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill all fields"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    onLogin({ name: email.split("@")[0], email });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050a14",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: `${200 + i * 80}px`, height: `${200 + i * 80}px`,
            borderRadius: "50%",
            border: "1px solid rgba(16,185,129,0.08)",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            animation: `pulse ${3 + i}s ease-in-out infinite`,
          }} />
        ))}
        <div style={{
          position: "absolute", top: "20%", right: "10%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:translate(-50%,-50%) scale(1)} 50%{opacity:0.6;transform:translate(-50%,-50%) scale(1.02)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .input-field { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); color:#fff; padding:14px 16px; border-radius:10px; width:100%; font-size:15px; font-family:inherit; outline:none; transition:all 0.2s; box-sizing:border-box; }
        .input-field:focus { border-color:rgba(16,185,129,0.6); background:rgba(16,185,129,0.05); }
        .btn-primary { background:linear-gradient(135deg,#10b981,#059669); border:none; color:#fff; padding:15px; border-radius:10px; width:100%; font-size:16px; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.2s; }
        .btn-primary:hover { transform:translateY(-1px); box-shadow:0 8px 25px rgba(16,185,129,0.35); }
        .btn-primary:disabled { opacity:0.7; cursor:not-allowed; }
      `}</style>

      <div style={{ animation: "fadeUp 0.6s ease", width: "420px", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg,#10b981,#059669)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📈</div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>TradeIQ</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>AI-Powered Nifty50 Intelligence Platform</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "36px" }}>
          <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "22px", marginBottom: "6px" }}>{isSignup ? "Create account" : "Welcome back"}</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "28px" }}>{isSignup ? "Start your trading journey" : "Sign in to your portfolio"}</p>

          {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", padding: "12px 14px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px" }}>{error}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {isSignup && <input className="input-field" placeholder="Full Name" />}
            <input className="input-field" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input-field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>

          <button className="btn-primary" style={{ marginTop: "24px" }} onClick={handleSubmit} disabled={loading}>
            {loading ? "Authenticating..." : isSignup ? "Create Account" : "Sign In"}
          </button>

          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "14px", marginTop: "20px" }}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <span style={{ color: "#10b981", cursor: "pointer", fontWeight: 500 }} onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Sign in" : "Sign up free"}
            </span>
          </p>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "12px", marginTop: "20px" }}>
          Demo: any email & password works
        </p>
      </div>
    </div>
  );
}

function AIModal({ stock, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [riskLevel, setRiskLevel] = useState(null);
  const bottomRef = useRef(null);
  const isPositive = stock.change >= 0;

  useEffect(() => {
    analyzeStock();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const analyzeStock = async () => {
    setLoading(true);
    const systemPrompt = `You are TradeIQ, an expert Indian stock market analyst specializing in Nifty50 stocks. 
You provide educational investment analysis. Always:
1. Start with a clear RISK LEVEL: LOW, MEDIUM, or HIGH
2. Explain the stock's current position
3. Give 3 key reasons for your recommendation
4. Add educational tips about the sector
5. Always remind users this is educational, not financial advice
Keep responses concise, use emojis, and format clearly. Be friendly and educational.`;

    const userMsg = `Analyze ${stock.symbol} (${stock.name}):
- Current Price: ₹${stock.price.toLocaleString("en-IN")}
- Today's Change: ${stock.change > 0 ? "+" : ""}${stock.change}%
- Sector: ${stock.sector}
Provide risk assessment and educational recommendation for a retail investor.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userMsg }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "Unable to analyze at this time.";
      
      // Detect risk level from response
      if (text.toLowerCase().includes("risk level: low") || text.toLowerCase().includes("low risk")) setRiskLevel("LOW");
      else if (text.toLowerCase().includes("risk level: high") || text.toLowerCase().includes("high risk")) setRiskLevel("HIGH");
      else setRiskLevel("MEDIUM");

      setMessages([{ role: "assistant", content: text }]);
    } catch {
      setMessages([{ role: "assistant", content: "⚠️ Analysis temporarily unavailable. Please try again." }]);
      setRiskLevel("MEDIUM");
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userInput = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userInput }]);
    setLoading(true);

    try {
      const history = [...messages, { role: "user", content: userInput }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are TradeIQ, an expert Indian stock market educator. The user is asking about ${stock.symbol} (${stock.name}), currently at ₹${stock.price}, ${stock.change > 0 ? "up" : "down"} ${Math.abs(stock.change)}% today in the ${stock.sector} sector. Be educational, concise, and always remind them this is not financial advice.`,
          messages: history.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "Unable to respond.";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const riskColors = { LOW: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)", text: "#10b981", label: "LOW RISK" }, MEDIUM: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#f59e0b", label: "MEDIUM RISK" }, HIGH: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#ef4444", label: "HIGH RISK" } };
  const riskInfo = riskLevel ? riskColors[riskLevel] : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateY(30px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        .msg-bubble { padding:14px 16px; border-radius:12px; font-size:14px; line-height:1.6; max-width:90%; white-space:pre-wrap; }
        .chat-input { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#fff; padding:12px 16px; border-radius:10px; flex:1; font-size:14px; font-family:inherit; outline:none; }
        .chat-input:focus { border-color:rgba(16,185,129,0.5); }
        .send-btn { background:linear-gradient(135deg,#10b981,#059669); border:none; color:#fff; padding:12px 18px; border-radius:10px; cursor:pointer; font-size:16px; }
        .send-btn:disabled { opacity:0.5; cursor:not-allowed; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
      `}</style>

      <div style={{ background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", width: "100%", maxWidth: "680px", maxHeight: "90vh", display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "44px", height: "44px", background: `${SECTOR_COLORS[stock.sector]}22`, border: `1px solid ${SECTOR_COLORS[stock.sector]}44`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: SECTOR_COLORS[stock.sector] }}>
              {stock.symbol.slice(0, 2)}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>{stock.symbol}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{stock.name}</div>
            </div>
            <div style={{ marginLeft: "8px" }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>₹{stock.price.toLocaleString("en-IN")}</div>
              <div style={{ color: isPositive ? "#10b981" : "#ef4444", fontSize: "13px", fontWeight: 600 }}>
                {isPositive ? "▲" : "▼"} {Math.abs(stock.change)}%
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {riskInfo && (
              <div style={{ background: riskInfo.bg, border: `1px solid ${riskInfo.border}`, color: riskInfo.text, padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
                {riskInfo.label}
              </div>
            )}
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", fontSize: "18px" }}>×</button>
          </div>
        </div>

        {/* AI Tag */}
        <div style={{ padding: "10px 24px", background: "rgba(16,185,129,0.05)", borderBottom: "1px solid rgba(16,185,129,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 600 }}>TradeIQ AI Agent — Educational Analysis Mode</span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {loading && messages.length === 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", animation: `pulse ${0.6 + i * 0.2}s ease-in-out infinite alternate` }} />)}
              </div>
              Analyzing {stock.symbol} with market data...
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role === "assistant" && (
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", marginRight: "8px", flexShrink: 0 }}>🤖</div>
              )}
              <div className="msg-bubble" style={{
                background: m.role === "user" ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
                border: m.role === "user" ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.08)",
                color: "#e2e8f0",
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && messages.length > 0 && (
            <div style={{ display: "flex", gap: "4px", alignItems: "center", paddingLeft: "36px" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", animation: `pulse ${0.6 + i * 0.2}s ease-in-out infinite alternate` }} />)}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "10px" }}>
          <input className="chat-input" placeholder={`Ask about ${stock.symbol}... (e.g. "Is this good for long term?")`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
          <button className="send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>→</button>
        </div>
        <div style={{ padding: "8px 24px 14px", color: "rgba(255,255,255,0.25)", fontSize: "11px", textAlign: "center" }}>
          ⚠️ Educational purposes only. Not financial advice. Consult a SEBI-registered advisor before investing.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [prices, setPrices] = useState(() => Object.fromEntries(NIFTY50_STOCKS.map(s => [s.symbol, s.price])));

  const sectors = ["All", ...new Set(NIFTY50_STOCKS.map(s => s.sector))];

  // Simulate live price updates
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        const stock = NIFTY50_STOCKS[Math.floor(Math.random() * NIFTY50_STOCKS.length)];
        const delta = (Math.random() - 0.5) * 3;
        next[stock.symbol] = Math.max(1, prev[stock.symbol] + delta);
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const filtered = NIFTY50_STOCKS
    .filter(s => (sectorFilter === "All" || s.sector === sectorFilter) && (s.symbol.includes(search.toUpperCase()) || s.name.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === "price_asc" ? a.price - b.price : sortBy === "price_desc" ? b.price - a.price : sortBy === "change" ? b.change - a.change : 0);

  const niftyIndex = 24356.75 + (Math.random() - 0.5) * 5;
  const gainers = NIFTY50_STOCKS.filter(s => s.change > 0).length;
  const losers = NIFTY50_STOCKS.filter(s => s.change < 0).length;

  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <div style={{ minHeight: "100vh", background: "#050a14", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar{width:6px;height:6px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        .stock-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius:14px; padding:16px; cursor:pointer; transition:all 0.2s; animation:fadeIn 0.3s ease; }
        .stock-card:hover { background: rgba(255,255,255,0.06); border-color:rgba(16,185,129,0.3); transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,0,0,0.3); }
        .filter-btn { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:rgba(255,255,255,0.5); padding:7px 14px; border-radius:20px; cursor:pointer; font-size:13px; font-family:inherit; transition:all 0.2s; white-space:nowrap; }
        .filter-btn.active { background:rgba(16,185,129,0.15); border-color:rgba(16,185,129,0.4); color:#10b981; }
        .select-input { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:#fff; padding:8px 14px; border-radius:8px; font-family:inherit; font-size:13px; cursor:pointer; outline:none; }
        .search-input { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; padding:10px 16px 10px 40px; border-radius:10px; font-size:14px; font-family:inherit; outline:none; width:280px; }
        .search-input:focus { border-color:rgba(16,185,129,0.5); }
        .ticker-wrap { overflow:hidden; white-space:nowrap; }
        .ticker-inner { display:inline-block; animation: ticker 40s linear infinite; }
      `}</style>

      {/* Navbar */}
      <div style={{ background: "rgba(5,10,20,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#10b981,#059669)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📈</div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>TradeIQ</span>
            <span style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", letterSpacing: "0.5px" }}>NIFTY50</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", animation: "blink 1.5s infinite" }} />
                <span style={{ color: "#10b981", fontWeight: 700, fontSize: "16px" }}>₹{niftyIndex.toFixed(2)}</span>
                <span style={{ color: "#10b981", fontSize: "13px" }}>▲ 0.23%</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>NIFTY 50 • Live</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg,#10b981,#059669)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600, textTransform: "capitalize" }}>{user.name}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>Investor</div>
              </div>
              <button onClick={() => setUser(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "18px", marginLeft: "4px" }}>⏻</button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div style={{ background: "rgba(16,185,129,0.05)", borderBottom: "1px solid rgba(16,185,129,0.1)", padding: "8px 0" }}>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...NIFTY50_STOCKS, ...NIFTY50_STOCKS].map((s, i) => (
              <span key={i} style={{ margin: "0 24px", fontSize: "12px" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{s.symbol}</span>
                <span style={{ color: "#fff", margin: "0 6px" }}>₹{prices[s.symbol]?.toFixed(2)}</span>
                <span style={{ color: s.change >= 0 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
                  {s.change >= 0 ? "▲" : "▼"}{Math.abs(s.change)}%
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Stocks", value: "50", sub: "Nifty50 Index", icon: "📊" },
            { label: "Gainers", value: gainers, sub: "Trading higher", icon: "📈", color: "#10b981" },
            { label: "Losers", value: losers, sub: "Trading lower", icon: "📉", color: "#ef4444" },
            { label: "AI Analyses", value: "∞", sub: "Powered by Claude", icon: "🤖", color: "#8b5cf6" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ fontSize: "28px" }}>{s.icon}</div>
              <div>
                <div style={{ color: s.color || "#fff", fontWeight: 800, fontSize: "24px", fontFamily: "'Syne',sans-serif" }}>{s.value}</div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "13px" }}>{s.label}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ position: "relative", flex: "0 0 auto" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: "16px" }}>🔍</span>
            <input className="search-input" placeholder="Search stocks..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="select-input" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="change">Top Gainers</option>
          </select>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {sectors.map(s => (
              <button key={s} className={`filter-btn ${sectorFilter === s ? "active" : ""}`} onClick={() => setSectorFilter(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{filtered.length} stocks • Click any to get AI analysis</div>
          <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
            <span style={{ color: "#10b981" }}>● Low Risk</span>
            <span style={{ color: "#f59e0b" }}>● Medium Risk</span>
            <span style={{ color: "#ef4444" }}>● High Risk</span>
          </div>
        </div>

        {/* Stock Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
          {filtered.map(stock => {
            const isPos = stock.change >= 0;
            const livePrice = prices[stock.symbol] || stock.price;
            const sectorColor = SECTOR_COLORS[stock.sector] || "#6366f1";
            return (
              <div key={stock.symbol} className="stock-card" onClick={() => setSelectedStock(stock)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <div style={{ width: "32px", height: "32px", background: `${sectorColor}22`, border: `1px solid ${sectorColor}44`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: sectorColor }}>
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{stock.symbol}</div>
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>{stock.sector}</div>
                      </div>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", marginTop: "2px" }}>{stock.name}</div>
                  </div>
                  <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "6px", padding: "4px 8px", fontSize: "11px", color: "#10b981", fontWeight: 600 }}>
                    AI ✦
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>₹{livePrice.toFixed(2)}</div>
                    <div style={{ color: isPos ? "#10b981" : "#ef4444", fontSize: "13px", fontWeight: 600 }}>
                      {isPos ? "▲" : "▼"} {Math.abs(stock.change)}%
                    </div>
                  </div>
                  <MiniChart positive={isPos} />
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <div style={{ fontSize: "16px" }}>No stocks found</div>
          </div>
        )}

        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "12px", marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          TradeIQ © 2025 • For educational purposes only • Not SEBI registered investment advice
        </div>
      </div>

      {selectedStock && <AIModal stock={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
