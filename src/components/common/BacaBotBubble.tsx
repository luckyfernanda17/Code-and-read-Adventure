import React from 'react';
import { speechService } from '../../services/speechService';
import { Volume2, Sparkles, Lightbulb } from 'lucide-react';

interface BacaBotBubbleProps {
  message: string;
  hintLevel?: number; // 1, 2, 3
  isThinking?: boolean;
  onAskMore?: () => void;
  canAskMore?: boolean;
}

export const BacaBotBubble: React.FC<BacaBotBubbleProps> = ({
  message,
  hintLevel,
  isThinking = false,
  onAskMore,
  canAskMore = false,
}) => {
  const handleSpeak = () => {
    speechService.speak(message);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border-3 border-blue-300 rounded-3xl p-4 sm:p-5 shadow-md relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-blue-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl shadow-sm animate-bounce">
            🤖
          </div>
          <div>
            <h4 className="font-display font-extrabold text-blue-900 text-base flex items-center gap-1.5">
              BACA-BOT Sahabat Literasi
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            </h4>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
              {hintLevel ? `Petunjuk Bertahap ke-${hintLevel}` : 'Tutor Pintar AI SD'}
            </span>
          </div>
        </div>

        {/* Audio Button */}
        <button
          onClick={handleSpeak}
          className="flex items-center gap-1.5 bg-white text-blue-700 hover:bg-blue-100 border-2 border-blue-200 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-colors"
        >
          <Volume2 className="w-4 h-4 text-blue-600" />
          <span>Bacakan</span>
        </button>
      </div>

      {/* Message content */}
      <div className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed pl-1 py-1">
        {isThinking ? (
          <div className="flex items-center gap-2 text-blue-700 font-bold py-2">
            <span className="inline-block animate-spin">⚙️</span>
            BACA-BOT sedang membaca ceritamu dan memikirkan petunjuk ramah...
          </div>
        ) : (
          <p className="whitespace-pre-line">{message}</p>
        )}
      </div>

      {/* Action Footer */}
      {canAskMore && onAskMore && !isThinking && (
        <div className="mt-3 pt-2 border-t border-blue-150 flex justify-end">
          <button
            onClick={onAskMore}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95"
          >
            <Lightbulb className="w-4 h-4 fill-amber-700 text-amber-900" />
            Minta Petunjuk Lanjutan 💡
          </button>
        </div>
      )}
    </div>
  );
};
