import React, { useState, useEffect } from 'react';
import { Mission } from '../../types/game';
import { speechService } from '../../services/speechService';
import { Volume2, VolumeX, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

interface StepReadProps {
  mission: Mission;
  onFinishedReading: () => void;
}

export const StepRead: React.FC<StepReadProps> = ({ mission, onFinishedReading }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const handleToggleSpeech = () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speechService.speak(
        `Judul cerita: ${mission.storyTitle}. ${mission.storyText}`,
        {
          rate: 0.9,
          onEnd: () => setIsPlaying(false),
        }
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Reading Card */}
      <div className="bg-white rounded-3xl border-4 border-amber-300 p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 font-display font-black text-xs px-5 py-2 rounded-bl-3xl shadow-xs">
          Halaman 1 dari 1 📖
        </div>

        {/* Header with Title and Speech Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-amber-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-xs">
              {mission.storyIllustration.slice(0, 2)}
            </div>
            <div>
              <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider block">
                {mission.readingFocus}
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-amber-950">
                {mission.storyTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={handleToggleSpeech}
            className={`px-5 py-3 rounded-2xl font-display font-bold text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              isPlaying
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-5 h-5" />
                <span>Hentikan Suara</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>▶ Dengarkan Cerita</span>
              </>
            )}
          </button>
        </div>

        {/* Illustration Banner */}
        <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 rounded-3xl p-6 text-center border-2 border-amber-200 mb-6">
          <div className="text-6xl sm:text-7xl mb-2 animate-bounce">{mission.storyIllustration}</div>
          <p className="font-display font-bold text-xs sm:text-sm text-amber-900">
            "Matahari bersinar hangat di jalan menuju sekolah. Dengarkan suaranya dengan seksama!"
          </p>
        </div>

        {/* Story Text Box with Kid-Friendly Font */}
        <div className="bg-amber-50/50 rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 mb-8">
          <p className="font-display text-xl sm:text-2xl text-slate-800 leading-relaxed font-semibold tracking-wide">
            "{mission.storyText}"
          </p>
        </div>

        {/* Tip for young reader */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs font-bold text-blue-900 mb-6">
          <span className="text-xl">💡</span>
          <span>
            Tips Detektif Cilik: Ingat tokoh yang ada di cerita, apa yang terjadi, dan urutan tindakannya ya!
          </span>
        </div>

        {/* Done Reading Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              speechService.stop();
              onFinishedReading();
            }}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-black text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 border-3 border-amber-300 cursor-pointer active:scale-95"
          >
            <CheckCircle className="w-6 h-6" />
            <span>SAYA SUDAH MEMBACA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
