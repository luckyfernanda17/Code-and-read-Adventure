import React, { useState } from 'react';
import { Mission, Question, MultipleChoiceQuestion, SequenceQuestion } from '../../types/game';
import { BacaBotBubble } from '../common/BacaBotBubble';
import { getAiHint } from '../../services/aiService';
import { speechService } from '../../services/speechService';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Volume2, MoveUp, MoveDown, HelpCircle } from 'lucide-react';

interface StepInvestigateProps {
  mission: Mission;
  onComplete: (score: number, hintsUsed: number) => void;
}

export const StepInvestigate: React.FC<StepInvestigateProps> = ({ mission, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Scaffolding hint state
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);

  // For sequence questions: ordered items
  const currentQ = mission.questions[currentIdx];
  const [sequenceItems, setSequenceItems] = useState(() => {
    if (currentQ?.type === 'sequence_order') {
      // Shuffle initially to make it an active challenge
      return [...currentQ.items].sort(() => Math.random() - 0.5);
    }
    return [];
  });

  const handleSpeakQuestion = () => {
    if (currentQ) {
      speechService.speak(currentQ.question);
    }
  };

  const handleSelectOption = (index: number) => {
    if (feedback === 'correct') return; // already solved
    setSelectedOption(index);
    setFeedback(null);
  };

  const handleCheckAnswer = async () => {
    if (!currentQ) return;

    if (currentQ.type === 'multiple_choice') {
      if (selectedOption === null) return;
      const isCorrect = selectedOption === currentQ.correctIndex;

      if (isCorrect) {
        setFeedback('correct');
        const bonus = hintLevel === 0 ? 20 : 10;
        setEarnedXP((prev) => prev + bonus);
        speechService.speak('Hebat sekali! Jawabanmu benar! 🎉');
      } else {
        setFeedback('wrong');
        const nextLevel = hintLevel + 1;
        setHintLevel(nextLevel);
        setTotalHintsUsed((prev) => prev + 1);

        // Call Socratic BACA-BOT Hint
        setIsAiThinking(true);
        const hint = await getAiHint({
          question: currentQ.question,
          story: mission.storyText,
          studentAnswer: currentQ.options[selectedOption],
          attemptCount: nextLevel,
          category: currentQ.category,
        });
        setIsAiThinking(false);
        setHintMessage(hint);
        speechService.speak(hint);
      }
    } else if (currentQ.type === 'sequence_order') {
      // Check sequence order
      const isOrderCorrect = sequenceItems.every((item, idx) => item.correctOrder === idx);

      if (isOrderCorrect) {
        setFeedback('correct');
        const bonus = hintLevel === 0 ? 25 : 15;
        setEarnedXP((prev) => prev + bonus);
        speechService.speak('Urutan ceritamu sempurna! Kerja detektif yang luar biasa! 🎉');
      } else {
        setFeedback('wrong');
        const nextLevel = hintLevel + 1;
        setHintLevel(nextLevel);
        setTotalHintsUsed((prev) => prev + 1);

        setIsAiThinking(true);
        const hint = await getAiHint({
          question: currentQ.question,
          story: mission.storyText,
          studentAnswer: 'Urutan belum sesuai',
          attemptCount: nextLevel,
          category: 'sequence',
        });
        setIsAiThinking(false);
        setHintMessage(hint);
        speechService.speak(hint);
      }
    }
  };

  const handleMoveSequenceItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sequenceItems.length) return;
    const updated = [...sequenceItems];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setSequenceItems(updated);
    setFeedback(null);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setFeedback(null);
    setHintMessage(null);
    setHintLevel(0);

    if (currentIdx + 1 < mission.questions.length) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextQ = mission.questions[nextIdx];
      if (nextQ.type === 'sequence_order') {
        setSequenceItems([...nextQ.items].sort(() => Math.random() - 0.5));
      }
    } else {
      // All questions completed!
      onComplete(earnedXP + 30, totalHintsUsed);
    }
  };

  const handleRequestMoreHint = async () => {
    const nextLevel = hintLevel + 1;
    setHintLevel(nextLevel);
    setTotalHintsUsed((prev) => prev + 1);
    setIsAiThinking(true);
    const hint = await getAiHint({
      question: currentQ.question,
      story: mission.storyText,
      attemptCount: nextLevel,
      category: currentQ.category,
    });
    setIsAiThinking(false);
    setHintMessage(hint);
    speechService.speak(hint);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-3xl border-4 border-amber-300 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-xl font-black text-amber-900">
              {currentIdx + 1}
            </span>
            <div>
              <span className="text-xs font-black text-amber-700 uppercase tracking-wider block">
                STEP 2: INVESTIGASI BACAAN
              </span>
              <h3 className="font-display font-black text-xl text-slate-800">
                Pertanyaan {currentIdx + 1} dari {mission.questions.length}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 font-black text-xs px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              +{earnedXP} XP Terkumpul
            </span>
            <button
              onClick={handleSpeakQuestion}
              className="p-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
              title="Bacakan Pertanyaan"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="bg-amber-50/60 rounded-2xl p-5 border-2 border-amber-200/80 mb-6">
          <p className="font-display font-bold text-lg sm:text-xl text-slate-900 leading-snug">
            "{currentQ.question}"
          </p>
        </div>

        {/* Options for Multiple Choice */}
        {currentQ.type === 'multiple_choice' && (
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const letter = ['A', 'B', 'C', 'D'][idx];

              let buttonStyle =
                'bg-slate-50 border-slate-200 text-slate-800 hover:bg-amber-50 hover:border-amber-300';
              if (isSelected) {
                buttonStyle = 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 font-bold';
              }
              if (feedback === 'correct' && idx === currentQ.correctIndex) {
                buttonStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
              }
              if (feedback === 'wrong' && isSelected) {
                buttonStyle = 'bg-rose-100 border-rose-400 text-rose-950';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border-3 flex items-center gap-3 text-left transition-all cursor-pointer ${buttonStyle}`}
                >
                  <span className="w-8 h-8 rounded-xl bg-white border-2 border-inherit flex items-center justify-center font-display font-black text-sm shrink-0">
                    {letter}
                  </span>
                  <span className="font-display text-base sm:text-lg flex-1">{opt}</span>
                  {feedback === 'correct' && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                  {feedback === 'wrong' && isSelected && (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Sequence Ordering View */}
        {currentQ.type === 'sequence_order' && (
          <div className="space-y-3 mb-6">
            <p className="text-xs font-bold text-slate-500 mb-2">
              💡 Gunakan tombol panah Naik (▲) atau Turun (▼) untuk menyusun urutan kejadian yang benar:
            </p>
            {sequenceItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 font-display font-black text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-display font-bold text-sm sm:text-base text-slate-800">
                    {item.text}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={idx === 0 || feedback === 'correct'}
                    onClick={() => handleMoveSequenceItem(idx, idx - 1)}
                    className="p-2 rounded-xl bg-white hover:bg-amber-200 border border-amber-300 text-amber-900 disabled:opacity-30 cursor-pointer"
                    title="Pindahkan Ke Atas"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={idx === sequenceItems.length - 1 || feedback === 'correct'}
                    onClick={() => handleMoveSequenceItem(idx, idx + 1)}
                    className="p-2 rounded-xl bg-white hover:bg-amber-200 border border-amber-300 text-amber-900 disabled:opacity-30 cursor-pointer"
                    title="Pindahkan Ke Bawah"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-amber-100">
          {feedback !== 'correct' ? (
            <button
              onClick={handleCheckAnswer}
              disabled={
                currentQ.type === 'multiple_choice' ? selectedOption === null : false
              }
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-black text-lg rounded-2xl shadow-md disabled:opacity-40 cursor-pointer transition-transform active:scale-95"
            >
              PERIKSA JAWABAN
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black text-lg rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>{currentIdx + 1 < mission.questions.length ? 'PERTANYAAN BERIKUTNYA' : 'LANJUT KE CODING 🧩'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {feedback !== 'correct' && hintLevel === 0 && (
            <button
              onClick={handleRequestMoreHint}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              Butuh Petunjuk AI?
            </button>
          )}
        </div>
      </div>

      {/* Socratic BACA-BOT Scaffolding Hint */}
      {(hintMessage || isAiThinking) && (
        <BacaBotBubble
          message={hintMessage || ''}
          hintLevel={hintLevel}
          isThinking={isAiThinking}
          canAskMore={hintLevel < 3 && feedback !== 'correct'}
          onAskMore={handleRequestMoreHint}
        />
      )}
    </div>
  );
};
