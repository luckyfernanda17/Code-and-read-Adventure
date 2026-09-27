import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Initialize GoogleGenAI with server-side API Key
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: BACA-BOT Hint Provider (Socratic Scaffolding)
app.post('/api/ai/hint', async (req, res) => {
  try {
    const { question, story, studentAnswer, attemptCount = 1, category = 'literal' } = req.body;

    if (ai) {
      const prompt = `Kamu adalah BACA-BOT 🤖, robot asisten belajar membaca dan coding untuk anak kelas 3 SD (usia 8-9 tahun).
Karaktermu: Sangat ramah, ceria, sabar, menggunakan emoji, dan bahasa Indonesia sederhana serta membangkitkan semangat.

Prinsip Scaffolding Socratic:
- JANGAN PERNAH langsung memberikan jawaban yang benar!
- Pada petunjuk ke-${attemptCount}:
  ${attemptCount === 1 ? '- Ajak anak melihat kembali bagian cerita tertentu (misalnya kalimat pertama atau kedua).' : ''}
  ${attemptCount === 2 ? '- Berikan pertanyaan pemandu kecil (contoh: "Apa yang Rani dengar waktu berjalan?").' : ''}
  ${attemptCount >= 3 ? '- Berikan petunjuk yang lebih terarah agar anak mudah menemukan kata kuncinya.' : ''}

Cerita yang dibaca anak:
"${story}"

Pertanyaan yang dijawab anak:
"${question}"

Jawaban anak yang kurang tepat:
"${studentAnswer || 'Belum menjawab'}"

Berikan respon hint ramah anak dalam 2-3 kalimat singkat saja. Tambahkan emoji ramah!`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const hintText = response.text?.trim();
      if (hintText) {
        return res.json({ hint: hintText });
      }
    }

    // Fallback if AI not available
    let fallbackHint = "Hmm, coba baca kembali bagian ketika Rani mendengar suara dari balik semak!";
    if (attemptCount === 2) {
      fallbackHint = "Petunjuk kedua: Suara apa yang didengar Rani, dan siapa yang terjebak di selokan?";
    } else if (attemptCount >= 3) {
      fallbackHint = "Lihat kalimat ketiga dan keempat dalam cerita ya, detektif cilik! Kamu pasti bisa!";
    }

    return res.json({ hint: fallbackHint });
  } catch (error) {
    console.error('Hint API error:', error);
    return res.json({
      hint: "BACA-BOT 🤖: Coba baca kembali teks ceritanya pelan-pelan ya. Kamu anak pintar, coba cari kata kuncinya!",
    });
  }
});

// API: Open-Ended Answer Evaluation (AI Challenge)
app.post('/api/ai/evaluate-answer', async (req, res) => {
  try {
    const { question, story, studentAnswer, expectedConcept } = req.body;

    if (!studentAnswer || studentAnswer.trim().length === 0) {
      return res.json({
        isCorrect: false,
        feedback: "Yuk ketikkan jawabanmu dulu ya! BACA-BOT siap membaca pendapatmu.",
        xpEarned: 0,
      });
    }

    if (ai) {
      const prompt = `Kamu adalah BACA-BOT 🤖 penguji pemahaman membaca kelas 3 SD.
Tugasmu: Mengevaluasi jawaban anak secara semantik (makna), BUKAN sekadar pencocokan kata persis!

Cerita:
"${story}"

Pertanyaan:
"${question}"

Konsep Inti Kunci Jawaban:
"${expectedConcept || 'Karena kucing terjebak di selokan dan Rani butuh bantuan orang dewasa/Pak Andi untuk menolongnya'}"

Jawaban siswa kelas 3 SD:
"${studentAnswer}"

Tentukan apakah jawaban anak menangkap inti makna cerita dengan benar atau masuk akal.
Format respon HANYA dalam JSON:
{
  "isCorrect": true atau false,
  "feedback": "Pujian spesifik jika benar (1-2 kalimat) ATAU kalimat dorongan hangat + arahan lembut jika belum tepat (1-2 kalimat)",
  "xpEarned": 20 jika benar, 5 jika mencoba
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        isCorrect: parsed.isCorrect ?? true,
        feedback: parsed.feedback || "Hebat sekali! Kamu memahami isi cerita dengan sangat baik! 🎉",
        xpEarned: parsed.xpEarned ?? 20,
      });
    }

    // Heuristic fallback
    const lower = studentAnswer.toLowerCase();
    const isReasonable =
      lower.includes('terjebak') ||
      lower.includes('selokan') ||
      lower.includes('tolong') ||
      lower.includes('bantu') ||
      lower.includes('kucing') ||
      lower.includes('selamat');

    if (isReasonable) {
      return res.json({
        isCorrect: true,
        feedback: "Benar sekali! 🎉 Kamu hebat bisa memahami alasan Rani meminta bantuan Pak Andi.",
        xpEarned: 20,
      });
    } else {
      return res.json({
        isCorrect: false,
        feedback: "Belum tepat, nih. Coba baca lagi bagian saat Rani melihat apa yang ada di dalam selokan ya! 🐱",
        xpEarned: 5,
      });
    }
  } catch (error) {
    console.error('Evaluation API error:', error);
    return res.json({
      isCorrect: true,
      feedback: "Jawabanmu sudah diterima! Kerja bagus, Detektif Cilik! 🌟",
      xpEarned: 15,
    });
  }
});

// API: AI Recommendations for Teacher Dashboard
app.post('/api/ai/recommendations', async (req, res) => {
  try {
    const { studentName, scores } = req.body;

    if (ai) {
      const prompt = `Kamu adalah Konsultan Pedagogi AI untuk pembelajaran literasi dan computational thinking kelas 3 SD.
Data Siswa:
Nama: ${studentName}
Nilai Informasi Tersurat: ${scores?.literal ?? 80}%
Nilai Urutan Kejadian: ${scores?.sequence ?? 85}%
Nilai Sebab-Akibat: ${scores?.causeEffect ?? 60}%
Nilai Informasi Tersirat: ${scores?.inferential ?? 55}%
Nilai Kesimpulan: ${scores?.conclusion ?? 50}%
Nilai Block Coding: ${scores?.coding ?? 85}%

Berikan analisis singkat untuk guru dalam format JSON:
{
  "mainWeakness": "Nama domain yang paling membutuhkan perhatian",
  "summary": "Ringkasan diagnosis 1-2 kalimat yang obyektif",
  "recommendation": "Rekomendasi tindakan latihan terarah untuk guru/siswa (2 kalimat)",
  "recommendedMissions": ["Judul misi latihan yang disarankan"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    // Default pedagogical logic
    return res.json({
      mainWeakness: "Sebab-Akibat & Membuat Kesimpulan",
      summary: `${studentName} sangat mahir pada pemahaman alur urutan dan coding logika, namun membutuhkan bimbingan pada relasi kausalitas dan penarikan simpulan tersirat.`,
      recommendation: `Berikan latihan scaffolding cerita bergambar bertema sebab-akibat (World 3) dan ajak siswa berdiskusi dengan pertanyaan 'Mengapa' dan 'Apa yang akan terjadi jika'.`,
      recommendedMissions: ["Jembatan Logika: Mengapa Pohon Tumbang?", "Kastil Misteri: Menemukan Petunjuk Rahasia"],
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return res.json({
      mainWeakness: "Sebab-Akibat",
      summary: "Memerlukan penguatan pemahaman hubungan sebab akibat dalam teks cerita.",
      recommendation: "Disarankan mengerjakan latihan World 3: Jembatan Sebab-Akibat.",
      recommendedMissions: ["Misteri Jembatan Roboh"],
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CODE & READ ADVENTURE server running at http://localhost:${port}`);
  });
}

startServer();
