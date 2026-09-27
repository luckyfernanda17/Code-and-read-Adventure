import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Mission, Badge } from '../../types/game';
import { BADGES } from '../../data/mockData';
import { speechService } from '../../services/speechService';
import { Sparkles, Trophy, CheckCircle, ArrowRight, Award, Star } from 'lucide-react';

interface StepRewardProps {
  mission: Mission;
  totalXpEarned: number;
  hintsUsed: number;
  onFinish: () => void;
}

export const StepReward: React.FC<StepRewardProps> = ({
  mission,
  totalXpEarned,
  hintsUsed,
  onFinish,
}) => {
  const earnedBadge = mission.badgeRewardId
    ? BADGES.find((b) => b.id === mission.badgeRewardId)
    : BADGES[0];

  useEffect(() => {
    // Launch celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    speechService.speak(
      `Selamat! Kamu berhasil menyelesaikan ${mission.title}! Kamu mendapatkan ${totalXpEarned} XP dan lencana detektif!`
    );
  }, [mission, totalXpEarned]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border-4 border-amber-300 p-8 sm:p-10 text-center shadow-xl relative overflow-hidden">
        {/* Floating Stars */}
        <div className="absolute top-4 left-6 text-3xl animate-bounce">⭐</div>
        <div className="absolute top-8 right-6 text-3xl animate-bounce delay-150">🎉</div>

        {/* Big Celebration Icon */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 border-4 border-amber-200 flex items-center justify-center text-6xl shadow-lg mb-4 animate-pulse">
          🏆
        </div>

        <span className="text-xs font-black text-amber-700 bg-amber-100 px-4 py-1 rounded-full uppercase tracking-wider">
          MISI BERHASIL DIPECAHKAN!
        </span>

        <h2 className="font-display font-black text-3xl sm:text-4xl text-amber-950 mt-2 mb-1">
          Luar Biasa, Detektif Cilik!
        </h2>
        <p className="text-slate-600 font-bold text-sm sm:text-base max-w-md mx-auto mb-6">
          Kamu telah membaca cerita <strong>"{mission.storyTitle}"</strong> dengan cermat dan menyusun kode penyelamatan dengan sukses!
        </p>

        {/* XP Breakdown Box */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-5 border-2 border-amber-300 mb-6 text-left">
          <h4 className="font-display font-extrabold text-sm text-amber-900 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Rincian Hadiah Detektif:
          </h4>

          <div className="space-y-2 text-xs font-bold text-slate-700">
            <div className="flex justify-between items-center py-1 border-b border-amber-200/60">
              <span>Menjawab Pertanyaan Bacaan</span>
              <span className="text-emerald-600 font-black">+30 XP</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-amber-200/60">
              <span>Menyelesaikan Block Coding di Maze</span>
              <span className="text-emerald-600 font-black">+30 XP</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-amber-200/60">
              <span>Tantangan Nalar AI BACA-BOT</span>
              <span className="text-emerald-600 font-black">+20 XP</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-amber-200/60">
              <span>Bonus Penyelesaian Misi</span>
              <span className="text-emerald-600 font-black">+20 XP</span>
            </div>
            {hintsUsed === 0 && (
              <div className="flex justify-between items-center py-1 text-amber-800">
                <span>Bonus Mandiri Tanpa Bantuan Hint! ⭐</span>
                <span className="text-amber-600 font-black">+10 XP</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 text-sm text-amber-950 font-black">
              <span>TOTAL XP YANG DIPEROLEH:</span>
              <span className="text-amber-600 font-display text-xl">+{totalXpEarned} XP</span>
            </div>
          </div>
        </div>

        {/* Unlocked Badge Showcase */}
        {earnedBadge && (
          <div className="bg-indigo-50 border-3 border-indigo-200 rounded-3xl p-4 sm:p-5 mb-8 flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-3xl shrink-0 shadow-md">
              {earnedBadge.icon}
            </div>
            <div>
              <span className="text-[10px] font-black text-indigo-700 uppercase bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                LENCANA BARU TERBUKA!
              </span>
              <h3 className="font-display font-black text-lg text-indigo-950 mt-0.5">
                {earnedBadge.title}
              </h3>
              <p className="text-xs text-indigo-900/80 font-medium">
                {earnedBadge.description}
              </p>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={onFinish}
          className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-display font-black text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 border-3 border-amber-300 cursor-pointer active:scale-95"
        >
          <span>KEMBALI KE PETA PETUALANGAN</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
