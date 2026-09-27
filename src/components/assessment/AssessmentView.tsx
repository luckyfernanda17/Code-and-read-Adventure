import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PRE_TEST_DATA, POST_TEST_DATA, TestQuestion } from '../../data/mockData';
import { UserProfile } from '../../types/game';
import { speechService } from '../../services/speechService';
import { ArrowLeft, CheckCircle2, ArrowRight, Sparkles, Volume2, BookOpen, Star } from 'lucide-react';

interface AssessmentViewProps {
  type: 'pre' | 'post';
  user: UserProfile;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  type,
  user,
  onComplete,
  onBack,
}) => {
  const data = type === 'pre' ? PRE_TEST_DATA : POST_TEST_DATA;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  const currentQ: TestQuestion = data.questions[currentIdx];

  const handleSelect = (optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIdx + 1 < data.questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate score
      let correct = 0;
      data.questions.forEach((q, idx) => {
        if (answers[idx] === q.correctIndex) {
          correct++;
        }
      });

      const scorePercent = Math.round((correct / data.questions.length) * 100);
      setCalculatedScore(scorePercent);
      setIsCompleted(true);
      confetti();

      speechService.speak(
        `Luar biasa! Kamu telah menyelesaikan ${data.title}! Skor kamu adalah ${scorePercent}! Semangat terus belajar!`
      );
      onComplete(scorePercent);
    }
  };

  const handleSpeak = () => {
    if (currentQ) {
      speechService.speak(currentQ.question);
    }
  };

  if (isCompleted && calculatedScore !== null) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-center">
        <div className="bg-white rounded-3xl border-4 border-amber-300 p-8 shadow-xl">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-5xl mx-auto mb-4 animate-bounce">
            🎉
          </div>
          <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase">
            {type === 'pre' ? 'PRE-TEST SELESAI' : 'POST-TEST SELESAI'}
          </span>
          <h2 className="font-display font-black text-3xl text-slate-800 mt-2 mb-2">
            Terima Kasih, Detektif {user.name}!
          </h2>
          <p className="text-slate-600 font-medium text-sm mb-6">
            Hasil pengerjaanmu telah tercatat dengan rapi. Guru dapat melihat perkembangan kemampuan literasimu.
          </p>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-300 mb-6">
            <span className="text-xs font-bold text-slate-500 uppercase block">SKOR KAMU</span>
            <span className="font-display font-black text-5xl text-amber-600">
              {calculatedScore}%
            </span>
          </div>

          <button
            onClick={onBack}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-display font-black text-lg rounded-2xl shadow-md cursor-pointer"
          >
            KEMBALI KE DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-4 shadow-xs flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-amber-900 font-bold text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Keluar</span>
        </button>

        <div className="text-center">
          <h3 className="font-display font-black text-lg text-slate-800">{data.title}</h3>
          <span className="text-xs font-bold text-amber-700">
            Soal {currentIdx + 1} dari {data.questions.length}
          </span>
        </div>

        <div className="w-16" />
      </div>

      {/* Story Reference Card */}
      <div className="bg-amber-50/70 rounded-3xl border-3 border-amber-200 p-5 sm:p-6 shadow-xs">
        <h4 className="font-display font-black text-sm text-amber-950 mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-700" />
          Teks Bacaan:
        </h4>
        <p className="font-display text-base text-slate-800 leading-relaxed font-semibold">
          "{data.story}"
        </p>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border-4 border-amber-300 p-6 sm:p-8 shadow-md">
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-xs font-black bg-blue-100 text-blue-900 px-3 py-1 rounded-full border border-blue-200">
            Kategori: {currentQ.categoryLabel}
          </span>
          <button
            onClick={handleSpeak}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Bacakan Soal"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <h3 className="font-display font-bold text-xl text-slate-900 mb-6">
          {currentIdx + 1}. {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = answers[currentIdx] === optIdx;
            const letter = ['A', 'B', 'C', 'D'][optIdx];

            return (
              <button
                key={optIdx}
                onClick={() => handleSelect(optIdx)}
                className={`w-full p-4 rounded-2xl border-3 flex items-center gap-3 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 font-bold'
                    : 'bg-slate-50 border-slate-200 hover:bg-amber-50/60'
                }`}
              >
                <span className="w-8 h-8 rounded-xl bg-white border-2 border-inherit flex items-center justify-center font-display font-black text-sm shrink-0">
                  {letter}
                </span>
                <span className="font-display text-base text-slate-800 flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={answers[currentIdx] === undefined}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-display font-black text-base rounded-2xl shadow-md disabled:opacity-40 cursor-pointer flex items-center gap-2"
          >
            <span>{currentIdx + 1 < data.questions.length ? 'SOAL BERIKUTNYA' : 'SELESAIKAN TES'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
