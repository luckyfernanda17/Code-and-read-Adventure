import React, { useState } from 'react';
import { Mission } from '../../types/game';
import { evaluateStudentAnswer } from '../../services/aiService';
import { speechService } from '../../services/speechService';
import { Sparkles, Send, CheckCircle2, ArrowRight, Volume2, HelpCircle } from 'lucide-react';

interface StepAIChallengeProps {
  mission: Mission;
  onComplete: (score: number) => void;
}

export const StepAIChallenge: React.FC<StepAIChallengeProps> = ({ mission, onComplete }) => {
  const [studentInput, setStudentInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [earnedXP, setEarnedXP] = useState(0);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!studentInput.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setFeedback(null);

    const result = await evaluateStudentAnswer({
      question: mission.aiChallenge.question,
      story: mission.storyText,
      studentAnswer: studentInput,
      expectedConcept: mission.aiChallenge.expectedConcept,
    });

    setIsEvaluating(false);
    setIsCorrect(result.isCorrect);
    setFeedback(result.feedback);
    setEarnedXP(result.xpEarned);

    speechService.speak(result.feedback);
  };

  const handleUseSuggestion = (suggestion: string) => {
    setStudentInput(suggestion);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border-4 border-amber-300 p-6 sm:p-8 shadow-md">
        {/* Step Banner */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-amber-100">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-2xl font-black text-blue-900 animate-pulse">
              🤖
            </span>
            <div>
              <span className="text-xs font-black text-blue-700 uppercase tracking-wider block">
                STEP 4: TANTANGAN NALAR BACA-BOT
              </span>
              <h3 className="font-display font-black text-xl text-slate-800">
                Pikirkan & Ungkapkan Pendapatmu!
              </h3>
            </div>
          </div>

          <div className="bg-amber-100 px-3 py-1 rounded-2xl border border-amber-300 text-xs font-bold text-amber-950 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            +20 XP Nalar
          </div>
        </div>

        {/* AI Question */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-200 mb-6">
          <span className="text-xs font-bold text-blue-700 block mb-1">Pertanyaan BACA-BOT:</span>
          <p className="font-display font-bold text-lg sm:text-xl text-blue-950 leading-relaxed">
            "{mission.aiChallenge.question}"
          </p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Tulis jawabanmu dengan bahasamu sendiri (AI akan memahami maknamu):
            </label>
            <textarea
              rows={3}
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              placeholder="Ketik jawabanmu di sini... Contoh: Karena kucingnya terjebak di dalam selokan..."
              className="w-full p-4 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 outline-hidden font-display text-base text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Quick Click Suggestions for 3rd graders */}
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1.5">
              💡 Atau pilih ide jawaban bantuan berikut:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleUseSuggestion('Karena kucingnya terjebak di selokan dan sulit diambil sendiri.')}
                className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl font-medium cursor-pointer"
              >
                🐱 Karena kucingnya terjebak di selokan
              </button>
              <button
                type="button"
                onClick={() => handleUseSuggestion('Rani masih anak sekolah sehingga butuh bantuan orang dewasa Pak Andi.')}
                className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl font-medium cursor-pointer"
              >
                👨‍🌾 Butuh bantuan orang dewasa Pak Andi
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            {feedback === null || !isCorrect ? (
              <button
                type="submit"
                disabled={!studentInput.trim() || isEvaluating}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-display font-black text-lg rounded-2xl shadow-md flex items-center justify-center gap-2 border-2 border-blue-400 disabled:opacity-40 cursor-pointer transition-transform active:scale-95"
              >
                {isEvaluating ? (
                  <span>🤖 BACA-BOT Sedang Menilai Jawabanmu...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>KIRIM JAWABAN KE BACA-BOT</span>
                  </>
                )}
              </button>
            ) : null}
          </div>
        </form>

        {/* AI Feedback Display */}
        {feedback && (
          <div
            className={`mt-6 p-5 rounded-2xl border-3 transition-all ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-amber-50 border-amber-400 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{isCorrect ? '🎉' : '🤖'}</span>
              <h4 className="font-display font-black text-base">
                {isCorrect ? 'Tanggapan BACA-BOT: Luar Biasa!' : 'Tanggapan BACA-BOT: Coba Perbaiki'}
              </h4>
            </div>

            <p className="font-display text-base font-semibold leading-relaxed mb-4">
              {feedback}
            </p>

            {isCorrect ? (
              <button
                onClick={() => onComplete(earnedXP)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-base rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <span>AMBIL HADIAH & LENCANA!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFeedback(null);
                  setIsCorrect(null);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Coba Tulis Jawaban Lain
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
