export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    
    let prompt = "";
    if (body.system) prompt += body.system + "\n\n";
    body.messages.forEach(m => {
      prompt += (m.role === "user" ? "User: " : "Assistant: ") + m.content + "\n";
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1000 }
        })
      }
    );

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data));
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to analyze.";
    res.status(200).json({ content: [{ text }] });

  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: err.message });
  }
}
```

---

## After pasting on GitHub → Commit ✅

---

## Then check Vercel Environment Variables:

Make sure you have:
```
GEMINI_API_KEY = AIzaXXXXXXXXXXXXXXXX
