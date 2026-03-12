export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  const body = req.body;
  const messages = [];
  if (body.system) messages.push({ role: "system", content: body.system });
  body.messages.forEach(m => messages.push({ role: m.role, content: m.content }));
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({ model: "llama3-70b-8192", messages, max_tokens: 1000 })
  });
  const data = await response.json();
  res.status(200).json({
    content: [{ text: data.choices?.[0]?.message?.content || "Unable to analyze." }]
  });
}
```

**Commit changes ✅**

---

**Then go to `src/App.jsx` → edit → find and replace BOTH occurrences of:**
```
https://api.anthropic.com/v1/messages
```
**with:**
```
/api/chat
