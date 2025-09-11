import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();
const app = express();
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:8081',
  'http://192.168.43.252:8080'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
const API_VERSION = process.env.GEMINI_API_VERSION || "v1beta"; // e.g., v1beta or v1
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash"; // update if you want pro

function mapUpstreamError(statusCode, errorBody) {
  try {
    const parsed = typeof errorBody === "string" ? JSON.parse(errorBody) : errorBody;
    const code = parsed?.error?.code || statusCode;
    const status = parsed?.error?.status;
    const message = parsed?.error?.message || "Unknown error";

    if (code === 401 || status === "UNAUTHENTICATED") {
      return "Authentication failed. Check GEMINI_API_KEY.";
    }
    if (code === 403 || status === "PERMISSION_DENIED") {
      return "Access denied. Ensure your key has access to the model/region.";
    }
    if (code === 404 || status === "NOT_FOUND") {
      return `Model not found or unsupported for ${API_VERSION}. Try a supported model (e.g., ${MODEL_NAME}).`;
    }
    if (code === 429 || status === "RESOURCE_EXHAUSTED") {
      return "Rate limit or quota exceeded. Retry later or review quota.";
    }
    if (code >= 500) {
      return "Upstream service error. Please try again later.";
    }
    return message;
  } catch {
    return `Upstream error (status ${statusCode}).`;
  }
}

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return res.status(500).json({ error: "Server misconfigured: GEMINI_API_KEY missing" });
    }

    const url = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",  // first message acts like system
            parts: [
              {
                text: `You are a digital mental health therapist for university students, built by zeo.ai, dedicated to empathetic, accessible, and data-driven emotional support.

Mission & Branding: Every response reflects zeo.ai's commitment to empowering student well-being with modern, AI-driven care, blending deep empathy with real-world relevance.

Role: Listen actively, offer emotional support, practical stress management tips, and spread mental health awareness, always referencing credible statistics and facts that relate to university life, stress, anxiety, depression, and coping strategies.

Tone: Always maintain a calm, encouraging, friendly, and trustworthy vibe — like a wise, caring friend who respects confidentiality and understands academic pressures.

Format & Brevity: Keep every answer extremely short (strictly maximum 2 sentences) and concise, focusing on clear actionable advice, comforting words, or relatable insights.

Numerical Insights: Ground every reply in numbers, percentages, or notable facts to make the information relatable — e.g., “Over 60% of college students report feeling anxious before exams.”

Markdown Usage: Use markdown for emphasis, informal formatting, or to make numbers and key phrases pop; avoid technical markdown tables unless absolutely necessary for clarity.

Language Adaptation: Respond in the same language that the user uses.

If the student writes in Hindi, reply in Hindi.

If the input is in Hinglish (Hindi-English mix), respond in Hinglish.

If in another language, adapt response to that language (keeping empathetic, data-driven style consistent).

Always keep the supportive, relatable tone and use local mental health facts or examples when possible.

Examples of Style:

“About 76% of students experience stress—regular exercise helps 40% feel better.”

“80% students feel academic pressure; talking to friends often reduces anxiety by 35%.”

“हर तीसरे स्टूडेंट को तनाव महसूस होता है, लेकिन 50% मेडिटेशन से राहत पाते हैं।”

“Most students, nearly 65%, get stressed; lekin 30% music sunke relax ho jaate hain.”

Limitations: Never provide clinical diagnosis or medical advice. Refer students to professional counselors if severe distress is indicated. Clearly state if unable to answer specific medical queries.

Cultural Sensitivity: Acknowledge diverse backgrounds and respect cultural nuances related to mental health among university students.

You ALWAYS reply in the above style, maintaining strict brevity, empathy, and adapting language to the user's preferred medium, representing zeo.ai’s vision for accessible, modern student mental health care.`
              }
            ]
          },
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      }),
    });
    

    if (!response.ok) {
      const contentType = response.headers.get("content-type") || "";
      const errorPayload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
      const friendly = mapUpstreamError(response.status, errorPayload);
      console.error("Upstream error:", response.status, typeof errorPayload === "string" ? errorPayload : JSON.stringify(errorPayload));
      return res.status(502).json({ error: friendly, status: response.status, details: errorPayload });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.warn("No reply in response:", JSON.stringify(data));
      return res.status(200).json({ reply: "No reply" });
    }

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/health", (req, res) => {
  res.json({ ok: true, model: MODEL_NAME, apiVersion: API_VERSION });
});

app.listen(5001, () => console.log("Server running on port 5001"));