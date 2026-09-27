import React, { useState } from 'react';
import { World, Mission } from '../../types/game';
import { Lock, Play, CheckCircle2, Star, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

interface WorldMapProps {
  worlds: World[];
  userCompletedMissions: string[];
  onSelectMission: (missionId: string) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  worlds,
  userCompletedMissions,
  onSelectMission,
}) => {
  const [selectedWorldId, setSelectedWorldId] = useState<string>('world-1');

  const selectedWorld = worlds.find((w) => w.id === selectedWorldId) || worlds[0];

  return (
    <div className="space-y-6">
      {/* Worlds Ribbon / Adventure Path */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border-4 border-amber-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-black text-xl text-amber-950 flex items-center gap-2">
              🗺️ PETA DUNIA PETUALANGAN LITERASI
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Pilih dunia untuk membuka misi membaca dan coding!
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            5 Dunia Petualangan
          </span>
        </div>

        {/* Worlds Horizontal Road */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {worlds.map((world, idx) => {
            const isUnlocked = world.isUnlocked || idx === 0;
            const isSelected = selectedWorldId === world.id;

            return (
              <button
                key={world.id}
                type="button"
                onClick={() => {
                  if (isUnlocked) setSelectedWorldId(world.id);
                }}
                disabled={!isUnlocked}
                className={`p-3.5 rounded-2xl border-3 flex flex-col items-center text-center transition-all relative ${
                  isSelected
                    ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 shadow-md scale-102'
                    : isUnlocked
                    ? 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50 cursor-pointer'
                    : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Lock or Check Indicator */}
                {!isUnlocked ? (
                  <span className="absolute top-2 right-2 bg-slate-300 p-1 rounded-lg text-slate-600">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 bg-emerald-500 text-white p-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-white" />
                  </span>
                )}

                <div className="text-4xl mb-1.5 filter drop-shadow-xs">{world.icon}</div>
                <span className="text-[11px] font-black text-amber-900 uppercase">
                  WORLD {world.number}
                </span>
                <h4 className="font-display font-black text-sm text-slate-800 leading-tight">
                  {world.name}
                </h4>
                <span className="text-[10px] font-bold text-slate-500 mt-1 line-clamp-1">
                  {world.focus}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected World Mission Hub */}
      <div className="bg-white rounded-3xl border-4 border-amber-300 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-amber-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-4xl shadow-xs">
              {selectedWorld.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                  WORLD {selectedWorld.number}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Fokus: {selectedWorld.focus}
                </span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-800 mt-0.5">
                {selectedWorld.name}
              </h2>
              <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
                {selectedWorld.theme}
              </p>
            </div>
          </div>
        </div>

        {/* Missions in this World */}
        <div className="space-y-4">
          <h3 className="font-display font-extrabold text-lg text-amber-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            Daftar Misi Detektif:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedWorld.missions.map((mission, index) => {
              const isCompleted = userCompletedMissions.includes(mission.id);

              return (
                <div
                  key={mission.id}
                  className={`rounded-3xl border-3 p-5 sm:p-6 transition-all relative overflow-hidden flex flex-col justify-between ${
                    isCompleted
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-sm'
                      : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-amber-500 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Top status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{mission.storyIllustration}</span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          SELESAI (100 XP)
                        </span>
                      ) : (
                        <span className="bg-amber-400 text-amber-950 font-extrabold text-xs px-2.5 py-1 rounded-full shadow-xs">
                          +{mission.rewardXP} XP
                        </span>
                      )}
                    </div>

                    <h4 className="font-display font-black text-xl text-slate-800 mb-1">
                      {mission.title}
                    </h4>
                    <p className="text-xs font-bold text-amber-800 mb-2">
                      {mission.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 font-medium mb-4 leading-relaxed line-clamp-2">
                      {mission.storyText}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">
                      5 Langkah Investigasi & Coding
                    </span>

                    <button
                      onClick={() => onSelectMission(mission.id)}
                      className={`px-4 py-2 rounded-xl font-display font-extrabold text-sm flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isCompleted ? 'Main Ulang' : 'Mulai Misi'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
