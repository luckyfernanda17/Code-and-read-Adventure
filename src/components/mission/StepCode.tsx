import React, { useState, useEffect, useRef } from 'react';
import { Mission, BlockType, CodeBlockItem } from '../../types/game';
import { CODE_BLOCK_DEFINITIONS } from '../../data/mockData';
import { speechService } from '../../services/speechService';
import { Play, RotateCcw, Trash2, ArrowRight, Sparkles, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface StepCodeProps {
  mission: Mission;
  onComplete: (score: number) => void;
}

export const StepCode: React.FC<StepCodeProps> = ({ mission, onComplete }) => {
  const [codeSequence, setCodeSequence] = useState<BlockType[]>([
    'MOVE_FORWARD',
    'TALK',
    'MOVE_FORWARD',
    'RESCUE',
  ]);

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [execStatus, setExecStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [failReason, setFailReason] = useState<string>('');

  // Character live position in maze
  const [playerPos, setPlayerPos] = useState({
    x: mission.mazeConfig.startPos.x,
    y: mission.mazeConfig.startPos.y,
    dir: mission.mazeConfig.startPos.dir,
  });

  const [hasTalkedToPakAndi, setHasTalkedToPakAndi] = useState(false);
  const [hasRescuedCat, setHasRescuedCat] = useState(false);

  const timerRef = useRef<any>(null);

  // Reset character to start pos
  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setActiveStepIndex(null);
    setExecStatus('idle');
    setFailReason('');
    setPlayerPos({
      x: mission.mazeConfig.startPos.x,
      y: mission.mazeConfig.startPos.y,
      dir: mission.mazeConfig.startPos.dir,
    });
    setHasTalkedToPakAndi(false);
    setHasRescuedCat(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAddBlock = (type: BlockType) => {
    if (isRunning) return;
    if (codeSequence.length >= 10) return; // Limit for kid clarity
    setCodeSequence((prev) => [...prev, type]);
  };

  const handleRemoveBlock = (index: number) => {
    if (isRunning) return;
    setCodeSequence((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    if (isRunning) return;
    setCodeSequence([]);
    handleReset();
  };

  // Run the code blocks sequentially on the maze!
  const handleRunCode = () => {
    if (isRunning) return;
    handleReset();
    setIsRunning(true);
    speechService.speak('Menjalankan algoritma coding!');

    // Clone sequence and expand REPEAT if present
    const expandedSteps: BlockType[] = [];
    for (const b of codeSequence) {
      if (b === 'REPEAT_2') {
        expandedSteps.push('MOVE_FORWARD', 'MOVE_FORWARD');
      } else {
        expandedSteps.push(b);
      }
    }

    let stepIdx = 0;
    let currX = mission.mazeConfig.startPos.x;
    let currY = mission.mazeConfig.startPos.y;
    let currDir = mission.mazeConfig.startPos.dir;
    let talked = false;
    let rescued = false;

    const executeNextStep = () => {
      if (stepIdx >= codeSequence.length) {
        // Finished executing all blocks: check win condition
        setIsRunning(false);
        setActiveStepIndex(null);

        // Win condition: Must have talked to Pak Andi AND rescued cat, or reached target
        if (rescued && talked) {
          setExecStatus('success');
          speechService.speak('Kode berhasil! Rani dan Pak Andi berhasil menyelamatkan kucing oren! 🎉');
        } else if (!talked) {
          setExecStatus('failed');
          setFailReason('Rani belum meminta bantuan Pak Andi seperti yang diceritakan!');
          speechService.speak('Coba temui Pak Andi dulu untuk meminta bantuan ya!');
        } else if (!rescued) {
          setExecStatus('failed');
          setFailReason('Kucing oren belum diselamatkan! Tambahkan balok SELAMATKAN KUCING.');
          speechService.speak('Jangan lupa selamatkan kucingnya!');
        } else {
          setExecStatus('success');
        }
        return;
      }

      setActiveStepIndex(stepIdx);
      const action = codeSequence[stepIdx];

      if (action === 'MOVE_FORWARD') {
        let nextX = currX;
        let nextY = currY;

        if (currDir === 'right') nextX += 1;
        else if (currDir === 'left') nextX -= 1;
        else if (currDir === 'down') nextY += 1;
        else if (currDir === 'up') nextY -= 1;

        // Check bounds & walls
        const isWall = mission.mazeConfig.walls.some((w) => w.x === nextX && w.y === nextY);
        const isOutOfBounds =
          nextX < 0 ||
          nextX >= mission.mazeConfig.gridSize.width ||
          nextY < 0 ||
          nextY >= mission.mazeConfig.gridSize.height;

        if (isWall || isOutOfBounds) {
          setIsRunning(false);
          setExecStatus('failed');
          setFailReason('Oops! Rani menabrak semak/rintangan di jalan!');
          speechService.speak('Aduh, Rani menabrak rintangan! Periksa arah belokanmu ya.');
          return;
        }

        currX = nextX;
        currY = nextY;
        setPlayerPos({ x: currX, y: currY, dir: currDir });
      } else if (action === 'TURN_RIGHT') {
        const turns: Record<string, 'up' | 'down' | 'left' | 'right'> = {
          up: 'right',
          right: 'down',
          down: 'left',
          left: 'up',
        };
        currDir = turns[currDir];
        setPlayerPos({ x: currX, y: currY, dir: currDir });
      } else if (action === 'TURN_LEFT') {
        const turns: Record<string, 'up' | 'down' | 'left' | 'right'> = {
          up: 'left',
          left: 'down',
          down: 'right',
          right: 'up',
        };
        currDir = turns[currDir];
        setPlayerPos({ x: currX, y: currY, dir: currDir });
      } else if (action === 'TALK') {
        talked = true;
        setHasTalkedToPakAndi(true);
      } else if (action === 'RESCUE') {
        rescued = true;
        setHasRescuedCat(true);
      } else if (action === 'REPEAT_2') {
        // Repeat forward twice
        currX = Math.min(mission.mazeConfig.gridSize.width - 1, currX + 1);
        setPlayerPos({ x: currX, y: currY, dir: currDir });
      }

      stepIdx++;
      timerRef.current = setTimeout(executeNextStep, 650);
    };

    timerRef.current = setTimeout(executeNextStep, 300);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border-4 border-amber-300 p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-purple-100 border-2 border-purple-300 flex items-center justify-center text-2xl font-black text-purple-900">
              🧩
            </span>
            <div>
              <span className="text-xs font-black text-purple-700 uppercase tracking-wider block">
                STEP 3: BLOCK CODING PETUALANGAN
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-slate-800">
                Susun Algoritma Menyelamatkan Kucing Oren!
              </h3>
            </div>
          </div>

          <div className="bg-amber-100 px-3 py-1.5 rounded-2xl border border-amber-200 text-xs font-bold text-amber-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            +30 XP Coding
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2">
          Ingat cerita tadi: Rani berjalan maju, meminta bantuan <strong>Pak Andi 👨‍🌾</strong>, lalu bersama-sama <strong>menyelamatkan Kucing Oren 🐱</strong>!
        </p>
      </div>

      {/* Main Coding Workspace: 2-Columns (Maze + Blocks) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 2D Maze Simulation (5 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-4 border-amber-300 p-5 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-extrabold text-base text-slate-800 flex items-center gap-2">
              🗺️ Peta Jalur Menuju Sekolah
            </h4>
            <span className="text-[11px] font-bold text-slate-500">
              Posisi Rani: ({playerPos.x}, {playerPos.y})
            </span>
          </div>

          {/* Interactive Maze Grid */}
          <div className="bg-emerald-100 p-2 sm:p-4 rounded-3xl border-3 border-emerald-300 shadow-inner flex justify-center overflow-x-auto">
            <div
              className="grid gap-1.5 sm:gap-2 max-w-full"
              style={{
                gridTemplateColumns: `repeat(${mission.mazeConfig.gridSize.width}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: mission.mazeConfig.gridSize.height }).map((_, row) =>
                Array.from({ length: mission.mazeConfig.gridSize.width }).map((_, col) => {
                  const isPlayer = playerPos.x === col && playerPos.y === row;
                  const isWall = mission.mazeConfig.walls.some((w) => w.x === col && w.y === row);
                  const isStart =
                    mission.mazeConfig.startPos.x === col && mission.mazeConfig.startPos.y === row;
                  const isTarget =
                    mission.mazeConfig.targetPos.x === col && mission.mazeConfig.targetPos.y === row;
                  const isNpc =
                    mission.mazeConfig.npcPos &&
                    mission.mazeConfig.npcPos.x === col &&
                    mission.mazeConfig.npcPos.y === row;
                  const isItem =
                    mission.mazeConfig.itemPos &&
                    mission.mazeConfig.itemPos.x === col &&
                    mission.mazeConfig.itemPos.y === row;

                  return (
                    <div
                      key={`${col}-${row}`}
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative transition-all border-2 text-xl sm:text-2xl select-none ${
                        isWall
                          ? 'bg-emerald-700 border-emerald-900 shadow-xs'
                          : 'bg-amber-100/90 border-amber-300'
                      }`}
                    >
                      {/* Wall icon */}
                      {isWall && <span className="text-base sm:text-xl">🌳</span>}

                      {/* NPC Pak Andi */}
                      {isNpc && !isPlayer && (
                        <div className="flex flex-col items-center leading-none">
                          <span className="text-xl sm:text-2xl animate-pulse">👨‍🌾</span>
                          <span className="text-[8px] sm:text-[9px] font-bold text-emerald-900 bg-white/80 px-1 rounded-xs mt-0.5">
                            Pak Andi
                          </span>
                        </div>
                      )}

                      {/* Cat item */}
                      {isItem && !isPlayer && !hasRescuedCat && (
                        <div className="flex flex-col items-center leading-none">
                          <span className="text-xl sm:text-2xl animate-bounce">🐱</span>
                          <span className="text-[8px] sm:text-[9px] font-bold text-amber-900 bg-white/80 px-1 rounded-xs mt-0.5">
                            Kucing
                          </span>
                        </div>
                      )}

                      {/* Start position badge */}
                      {isStart && !isPlayer && (
                        <span className="text-[8px] sm:text-[10px] font-black text-amber-800">START</span>
                      )}

                      {/* Player Avatar */}
                      {isPlayer && (
                        <div className="relative flex items-center justify-center">
                          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-400 border-2 border-amber-600 flex items-center justify-center text-xl sm:text-2xl shadow-md transform scale-105 sm:scale-110">
                            👧🎒
                          </div>
                          {/* Direction Indicator */}
                          <span className="absolute -top-1 -right-1 bg-white text-[9px] sm:text-[10px] font-black px-1 rounded-full border border-amber-600">
                            {playerPos.dir === 'right' ? '▶' : playerPos.dir === 'down' ? '▼' : playerPos.dir === 'left' ? '◀' : '▲'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Status Indicator during run */}
          <div className="mt-4 p-3 rounded-2xl border-2 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Pak Andi:</span>
              <span className={hasTalkedToPakAndi ? 'text-emerald-600' : 'text-slate-400'}>
                {hasTalkedToPakAndi ? '✅ Ditemui' : '⏳ Belum'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Kucing Oren:</span>
              <span className={hasRescuedCat ? 'text-emerald-600' : 'text-slate-400'}>
                {hasRescuedCat ? '🎉 Selamat!' : '⏳ Terjebak'}
              </span>
            </div>
          </div>

          {/* Result Alert */}
          {execStatus === 'success' && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 text-sm font-display font-black flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                Hore! Algoritmamu berhasil menyelesaikan masalah! 🎉
              </span>
              <button
                onClick={() => onComplete(50)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Lanjut ke AI Challenge →
              </button>
            </div>
          )}

          {execStatus === 'failed' && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-100 border-2 border-rose-400 text-rose-950 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{failReason || 'Urutan instruksi belum pas. Coba lagi!'}</span>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Code Blocks Palette & Program Canvas (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Palette Blocks */}
          <div className="bg-white rounded-3xl border-4 border-amber-300 p-5 shadow-md">
            <h4 className="font-display font-extrabold text-sm text-slate-800 mb-2 flex items-center gap-1.5">
              <span>📦 Balok Perintah (Klik untuk menambah):</span>
            </h4>

            <div className="flex flex-wrap gap-2">
              {mission.availableBlocks.map((bType) => {
                const def = CODE_BLOCK_DEFINITIONS[bType];
                if (!def) return null;

                return (
                  <button
                    key={bType}
                    onClick={() => handleAddBlock(bType)}
                    disabled={isRunning}
                    className={`px-3 py-2 rounded-xl font-display font-extrabold text-xs shadow-xs border-2 transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${def.color}`}
                  >
                    <span>{def.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Program Canvas: Snapped Blocks */}
          <div className="bg-amber-50 rounded-3xl border-4 border-amber-300 p-5 shadow-md">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm text-amber-950">
                  📜 URUTAN KODE RANI ({codeSequence.length} Langkah)
                </span>
              </div>
              <button
                onClick={handleClearAll}
                disabled={isRunning || codeSequence.length === 0}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Semua
              </button>
            </div>

            {/* Start Hat block */}
            <div className="mb-2">
              <div className="w-36 py-2 px-3 bg-amber-500 text-white font-display font-black text-xs rounded-t-2xl rounded-br-2xl shadow-xs border-2 border-amber-600 flex items-center gap-1.5">
                <span>🚩 KETIKA DIKLIK MULAI</span>
              </div>
            </div>

            {/* Stack of Interlocking Code Blocks */}
            <div className="space-y-1.5 pl-3 min-h-[160px]">
              {codeSequence.length === 0 ? (
                <div className="p-6 text-center text-slate-400 font-bold text-xs border-2 border-dashed border-amber-300 rounded-2xl">
                  Klik balok di atas untuk menyusun algoritma!
                </div>
              ) : (
                codeSequence.map((type, idx) => {
                  const def = CODE_BLOCK_DEFINITIONS[type];
                  const isActive = activeStepIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`relative flex items-center justify-between p-2.5 rounded-xl border-2 text-xs font-display font-black shadow-xs transition-all ${
                        def?.color || 'bg-blue-500 text-white'
                      } ${isActive ? 'anim-code-active scale-102 ring-4 ring-yellow-400' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-black/20 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{def?.label || type}</span>
                      </div>

                      <button
                        onClick={() => handleRemoveBlock(idx)}
                        disabled={isRunning}
                        className="p-1 hover:bg-black/20 rounded-md text-white/80 hover:text-white cursor-pointer"
                        title="Hapus baris"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Execution Control Buttons */}
            <div className="mt-5 pt-3 border-t border-amber-200 flex items-center gap-3">
              <button
                onClick={handleRunCode}
                disabled={isRunning || codeSequence.length === 0}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-display font-black text-base rounded-2xl shadow-md flex items-center justify-center gap-2 border-2 border-emerald-400 disabled:opacity-40 cursor-pointer active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{isRunning ? 'SEDANG JALAN...' : '▶ JALANKAN CODE'}</span>
              </button>

              <button
                onClick={handleReset}
                disabled={isRunning}
                className="p-3.5 bg-white hover:bg-amber-100 text-amber-900 border-2 border-amber-300 rounded-2xl font-bold flex items-center justify-center cursor-pointer"
                title="Kembalikan Rani ke Posisi Awal"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
