import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile, BlockType } from '../../types/game';
import { CODE_BLOCK_DEFINITIONS } from '../../data/mockData';
import { speechService } from '../../services/speechService';
import { Bug, Play, RotateCcw, ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, Trash2, ArrowRight } from 'lucide-react';

interface BugHunterModeProps {
  user: UserProfile;
  onCompleted: (updatedUser: UserProfile) => void;
  onBack: () => void;
}

export const BugHunterMode: React.FC<BugHunterModeProps> = ({
  user,
  onCompleted,
  onBack,
}) => {
  // Buggy code sequence from Raka:
  // Intended path to book across garden:
  // MAJU -> MAJU -> BELOK KIRI -> MAJU -> AMBIL PETUNJUK
  // Raka wrote:
  // MAJU -> BELOK KANAN (BUG: walks into pond!) -> MAJU -> BELOK KIRI -> MAJU -> AMBIL PETUNJUK
  const [blocks, setBlocks] = useState<BlockType[]>([
    'MOVE_FORWARD',
    'TURN_RIGHT', // The bug!
    'MOVE_FORWARD',
    'TURN_LEFT',
    'MOVE_FORWARD',
    'PICK',
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'failed' | 'success'>('idle');
  const [message, setMessage] = useState<string>('');

  // 4x4 Grid for debugging scenario
  // Start: (0, 0), facing right.
  // Pond obstacle at (1, 1). If turns right at (1,0) and moves forward, falls into pond!
  // Target book at (3, 0) or (2, 0).
  const [player, setPlayer] = useState({ x: 0, y: 0, dir: 'right' });

  const handleReset = () => {
    setIsRunning(false);
    setActiveStep(null);
    setStatus('idle');
    setMessage('');
    setPlayer({ x: 0, y: 0, dir: 'right' });
  };

  const handleRemoveBlock = (idx: number) => {
    if (isRunning) return;
    setBlocks((prev) => prev.filter((_, i) => i !== idx));
    handleReset();
  };

  const handleAddBlock = (type: BlockType) => {
    if (isRunning) return;
    if (blocks.length >= 8) return;
    setBlocks((prev) => [...prev, type]);
    handleReset();
  };

  const handleRun = () => {
    if (isRunning) return;
    handleReset();
    setIsRunning(true);
    speechService.speak('Menjalankan pengujian bug!');

    let step = 0;
    let currX = 0;
    let currY = 0;
    let currDir = 'right';
    let picked = false;

    const interval = setInterval(() => {
      if (step >= blocks.length) {
        clearInterval(interval);
        setIsRunning(false);
        setActiveStep(null);

        // Win condition: Must not hit pond (1, 1), reached target (2, 0) or picked
        if (picked && currX === 2 && currY === 0) {
          setStatus('success');
          setMessage('Luar biasa! Kamu berhasil menghapus balok bug dan Raka selamat mengambil buku! 🎉');
          speechService.speak('Luar biasa! Bug berhasil diperbaiki!');
          confetti();

          // Award Bug Hunter Badge
          const updatedBadges = Array.from(new Set([...user.badges, 'bug_hunter']));
          const updatedUser: UserProfile = {
            ...user,
            xp: user.xp + 40,
            badges: updatedBadges,
            scores: {
              ...user.scores,
              debugging: 95,
              coding: Math.min(100, user.scores.coding + 10),
            },
          };
          onCompleted(updatedUser);
        } else {
          setStatus('failed');
          setMessage('Kode belum tepat. Pastikan Raka tidak belok ke arah kolam lumpur ya!');
          speechService.speak('Kode belum tepat. Coba periksa belokan Raka!');
        }
        return;
      }

      setActiveStep(step);
      const action = blocks[step];

      if (action === 'MOVE_FORWARD') {
        if (currDir === 'right') currX += 1;
        else if (currDir === 'down') currY += 1;
        else if (currDir === 'left') currX -= 1;
        else if (currDir === 'up') currY -= 1;

        // Check pond trap at (1, 1) or out of bounds
        if (currX === 1 && currY === 1) {
          clearInterval(interval);
          setIsRunning(false);
          setStatus('failed');
          setMessage('🐞 BUG DITEMUKAN! Raka tercebur ke kolam lumpur karena belok kanan terlalu cepat!');
          speechService.speak('Aduh, Raka tercebur ke kolam karena belok kanan! Cari dan hapus balok belok kanan itu!');
          return;
        }

        if (currX < 0 || currX > 3 || currY < 0 || currY > 2) {
          clearInterval(interval);
          setIsRunning(false);
          setStatus('failed');
          setMessage('Raka keluar dari jalur taman!');
          return;
        }

        setPlayer({ x: currX, y: currY, dir: currDir });
      } else if (action === 'TURN_RIGHT') {
        const map: any = { up: 'right', right: 'down', down: 'left', left: 'up' };
        currDir = map[currDir];
        setPlayer({ x: currX, y: currY, dir: currDir });
      } else if (action === 'TURN_LEFT') {
        const map: any = { up: 'left', left: 'down', down: 'right', right: 'up' };
        currDir = map[currDir];
        setPlayer({ x: currX, y: currY, dir: currDir });
      } else if (action === 'PICK') {
        picked = true;
      }

      step++;
    }, 700);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border-4 border-rose-300 p-6 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 border-2 border-rose-400 flex items-center justify-center text-3xl shrink-0 animate-bounce">
            🐞
          </div>
          <div>
            <span className="text-xs font-black text-rose-700 uppercase tracking-wider block">
              TANTANGAN KHUSUS DETEKTIF CODING
            </span>
            <h2 className="font-display font-black text-2xl text-slate-800">
              Bug Hunter: Perbaiki Kode Raka!
            </h2>
          </div>
        </div>

        <div className="bg-rose-100 text-rose-950 font-bold text-xs px-3 py-1.5 rounded-xl border border-rose-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-rose-600" />
          Lencana: Bug Hunter 🐞
        </div>
      </div>

      {/* Story & Problem Context */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-3xl border-3 border-rose-200 p-5 shadow-xs">
        <h4 className="font-display font-black text-rose-950 text-base mb-1">
          Kasus: "Kode Raka Memiliki Kesalahan (Bug)!"
        </h4>
        <p className="text-slate-700 text-sm leading-relaxed">
          Raka ingin mengambil buku catatan petualangan di seberang taman (kotak hijau). Tapi saat kodenya dijalankan, Raka malah berbelok ke arah <strong>kolam lumpur 💦</strong>! Temukan baris balok yang salah dan hapus dengan menekan tanda <strong>✕</strong>, lalu jalankan lagi kodenya!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Garden Simulation Maze */}
        <div className="bg-white rounded-3xl border-4 border-rose-300 p-5 shadow-md">
          <h4 className="font-display font-extrabold text-base text-slate-800 mb-3">
            Taman Raka & Kolam Lumpur
          </h4>

          <div className="bg-emerald-100 p-4 rounded-2xl border-2 border-emerald-300 flex justify-center">
            <div className="grid grid-cols-3 gap-2">
              {/* Row 0 */}
              <div className="w-20 h-20 bg-amber-100 rounded-xl border-2 border-amber-300 flex items-center justify-center relative">
                {player.x === 0 && player.y === 0 && <span className="text-3xl animate-bounce">🧒🎒</span>}
                <span className="text-[10px] font-black text-amber-800 absolute bottom-1">START</span>
              </div>
              <div className="w-20 h-20 bg-amber-100 rounded-xl border-2 border-amber-300 flex items-center justify-center">
                {player.x === 1 && player.y === 0 && <span className="text-3xl animate-bounce">🧒🎒</span>}
              </div>
              <div className="w-20 h-20 bg-emerald-200 rounded-xl border-2 border-emerald-400 flex flex-col items-center justify-center">
                {player.x === 2 && player.y === 0 ? (
                  <span className="text-3xl">🎉</span>
                ) : (
                  <>
                    <span className="text-2xl">📖</span>
                    <span className="text-[9px] font-bold text-emerald-900">Buku Target</span>
                  </>
                )}
              </div>

              {/* Row 1 */}
              <div className="w-20 h-20 bg-emerald-700 rounded-xl border-2 border-emerald-800 flex items-center justify-center text-2xl">
                🌳
              </div>
              <div className="w-20 h-20 bg-blue-300 rounded-xl border-2 border-blue-500 flex flex-col items-center justify-center text-center">
                <span className="text-2xl animate-pulse">💦</span>
                <span className="text-[9px] font-black text-blue-950">Kolam Lumpur!</span>
              </div>
              <div className="w-20 h-20 bg-emerald-700 rounded-xl border-2 border-emerald-800 flex items-center justify-center text-2xl">
                🌳
              </div>
            </div>
          </div>

          {/* Feedback status */}
          {status === 'failed' && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-100 border-2 border-rose-400 text-rose-950 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 text-xs font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                {message}
              </span>
              <button
                onClick={onBack}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Kembali
              </button>
            </div>
          )}
        </div>

        {/* Code Blocks Workspace */}
        <div className="bg-amber-50 rounded-3xl border-4 border-amber-300 p-5 shadow-md">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200">
            <h4 className="font-display font-black text-sm text-amber-950">
              Balok Kode Raka (Klik ✕ untuk membuang bug):
            </h4>
          </div>

          <div className="space-y-2 min-h-[180px]">
            {blocks.map((blockType, idx) => {
              const def = CODE_BLOCK_DEFINITIONS[blockType];
              const isActive = activeStep === idx;
              const isBuggy = blockType === 'TURN_RIGHT' || blockType === 'TURN_LEFT';

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border-2 text-xs font-display font-black shadow-xs transition-all ${
                    def?.color || 'bg-blue-500 text-white'
                  } ${isActive ? 'ring-4 ring-yellow-400 scale-102' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-black/20 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{def?.label || blockType}</span>
                    {isBuggy && (
                      <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded-xs animate-pulse">
                        Curigai Ini 🔍
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveBlock(idx)}
                    disabled={isRunning}
                    className="p-1 hover:bg-black/20 rounded-md text-white/90 hover:text-white cursor-pointer"
                    title="Buang Balok Ini"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Add Blocks */}
          <div className="mt-4 pt-3 border-t border-amber-200">
            <span className="text-xs font-bold text-slate-600 block mb-1.5">
              Tambah balok pengganti:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAddBlock('MOVE_FORWARD')}
                className="px-2.5 py-1.5 rounded-lg bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                + MAJU
              </button>
              <button
                onClick={() => handleAddBlock('PICK')}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-xs cursor-pointer"
              >
                + AMBIL BUKU
              </button>
            </div>
          </div>

          {/* Action Runner */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={handleRun}
              disabled={isRunning || blocks.length === 0}
              className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-display font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? 'MENGUJI...' : 'UJI KODE TANPA BUG!'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-3 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
