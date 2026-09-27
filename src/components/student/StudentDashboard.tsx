import React, { useState } from 'react';
import { UserProfile, Badge } from '../../types/game';
import { CHARACTERS, BADGES, INITIAL_WORLDS } from '../../data/mockData';
import { WorldMap } from './WorldMap';
import { Sparkles, Trophy, Award, MapPin, Bug, FileText, CheckCircle2, Star, ArrowRight } from 'lucide-react';

interface StudentDashboardProps {
  user: UserProfile;
  onStartMission: (missionId: string) => void;
  onStartDebugging: () => void;
  onStartPreTest: () => void;
  onStartPostTest: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onStartMission,
  onStartDebugging,
  onStartPreTest,
  onStartPostTest,
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'badges' | 'progress' | 'profile'>('map');

  const character = CHARACTERS.find((c) => c.id === user.characterId) || CHARACTERS[0];
  const userBadges = BADGES.filter((b) => user.badges.includes(b.id));

  // Progress calculations
  const totalMissions = 5;
  const completedCount = user.completedMissions.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalMissions) * 100));

  // XP for next level (100 XP per level)
  const xpCurrentLevel = user.xp % 100;
  const nextLevelPercent = Math.min(100, xpCurrentLevel);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Banner / Hero Card */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-amber-950 border-4 border-amber-300 shadow-lg relative overflow-hidden mb-6">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Avatar and Welcome */}
          <div className="flex items-center gap-4 sm:gap-5 text-center sm:text-left flex-1">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/90 border-4 border-amber-200 flex items-center justify-center text-5xl sm:text-6xl shadow-md shrink-0">
              {character.avatar}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-900/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>LEVEL {user.level} DETEKTIF</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-amber-950 tracking-tight leading-none mb-1">
                Halo, {user.name}! 👋
              </h2>
              <p className="text-amber-900/90 font-bold text-sm sm:text-base">
                Karakter: <strong>{character.name}</strong> • Kelas <strong>{user.classCode}</strong> • Siap pecahkan misteri?
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            {/* XP Box */}
            <div className="bg-white/90 backdrop-blur-xs rounded-2xl px-5 py-3 border-2 border-amber-200 text-center min-w-[120px] shadow-sm">
              <span className="text-xs font-bold text-slate-500 block uppercase">TOTAL XP</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-amber-600 flex items-center justify-center gap-1">
                <Sparkles className="w-5 h-5 fill-amber-500 text-amber-600" />
                {user.xp}
              </span>
            </div>

            {/* Badges Box */}
            <div className="bg-white/90 backdrop-blur-xs rounded-2xl px-5 py-3 border-2 border-amber-200 text-center min-w-[120px] shadow-sm">
              <span className="text-xs font-bold text-slate-500 block uppercase">LENCANA</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-indigo-700 flex items-center justify-center gap-1">
                <Trophy className="w-5 h-5 fill-indigo-400 text-indigo-600" />
                {user.badges.length}
              </span>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => onStartMission('mission-1-1')}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-950 hover:bg-black text-white font-display font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <span>LANJUT MAIN</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-4 border-t border-amber-300/60">
          <div className="flex justify-between items-center text-xs font-extrabold text-amber-950 mb-1.5">
            <span>PROGRES LEVEL BERIKUTNYA</span>
            <span>{nextLevelPercent}% ({xpCurrentLevel}/100 XP)</span>
          </div>
          <div className="w-full h-4 bg-amber-900/20 rounded-full overflow-hidden p-0.5 border border-amber-300">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${Math.max(5, nextLevelPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b-2 border-amber-200 pb-3">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-5 py-2.5 rounded-2xl font-display font-bold text-base transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'map'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white hover:bg-amber-100 text-slate-700 border-2 border-amber-200'
          }`}
        >
          <MapPin className="w-5 h-5" />
          MAP PETUALANGAN
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`px-5 py-2.5 rounded-2xl font-display font-bold text-base transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'badges'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white hover:bg-amber-100 text-slate-700 border-2 border-amber-200'
          }`}
        >
          <Award className="w-5 h-5" />
          BADGE & LENCANA ({user.badges.length})
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`px-5 py-2.5 rounded-2xl font-display font-bold text-base transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'progress'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white hover:bg-amber-100 text-slate-700 border-2 border-amber-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          PROGRES LITERASI
        </button>

        <button
          onClick={onStartDebugging}
          className="ml-auto px-4 py-2.5 rounded-2xl font-display font-black text-sm bg-rose-500 hover:bg-rose-600 text-white border-2 border-rose-600 shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <Bug className="w-5 h-5" />
          TANTANGAN BUG HUNTER 🐞
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'map' && (
        <WorldMap
          worlds={INITIAL_WORLDS}
          userCompletedMissions={user.completedMissions}
          onSelectMission={onStartMission}
        />
      )}

      {activeTab === 'badges' && (
        <div className="bg-white rounded-3xl border-4 border-amber-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">
              🏆
            </div>
            <div>
              <h3 className="font-display font-black text-2xl text-slate-800">
                Lencana Detektif Cilik
              </h3>
              <p className="text-slate-500 font-medium text-sm">
                Kumpulkan semua lencana dengan menuntaskan misi membaca dan tantangan coding!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BADGES.map((badge) => {
              const isUnlocked = user.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-3xl border-3 transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-400 shadow-md'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-xs border-2 ${
                        isUnlocked
                          ? 'bg-amber-200 border-amber-400'
                          : 'bg-slate-200 border-slate-300 grayscale'
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <h4 className="font-display font-black text-lg text-slate-800">
                          {badge.title}
                        </h4>
                        {isUnlocked && (
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                            TERBUKA
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="bg-white rounded-3xl border-4 border-amber-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-black text-2xl text-slate-800">
                Peta Kemampuan Detektif
              </h3>
              <p className="text-slate-500 font-medium text-sm">
                Perkembangan pemahaman membaca dan kemampuan computational thinking
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onStartPreTest}
                className="px-4 py-2 rounded-xl bg-blue-100 text-blue-800 hover:bg-blue-200 font-display font-bold text-xs border border-blue-300"
              >
                Ujian Pre-Test ({user.preTestScore !== undefined ? `${user.preTestScore}%` : 'Belum'})
              </button>
              <button
                onClick={onStartPostTest}
                className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-display font-bold text-xs border border-emerald-300"
              >
                Ujian Post-Test ({user.postTestScore !== undefined ? `${user.postTestScore}%` : 'Belum'})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Literacy Dimensions */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border-2 border-amber-200">
              <h4 className="font-display font-extrabold text-amber-950 text-base mb-4 flex items-center gap-2">
                📖 Dimensi Pemahaman Bacaan
              </h4>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>1. Informasi Tersurat (Fakta Langsung)</span>
                    <span className="text-amber-800 font-black">{user.scores.literal}%</span>
                  </div>
                  <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${user.scores.literal}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>2. Urutan Kejadian (Kronologi Cerita)</span>
                    <span className="text-amber-800 font-black">{user.scores.sequence}%</span>
                  </div>
                  <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${user.scores.sequence}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>3. Sebab-Akibat (Mengapa & Alasan)</span>
                    <span className="text-amber-800 font-black">{user.scores.causeEffect}%</span>
                  </div>
                  <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${user.scores.causeEffect}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>4. Menarik Kesimpulan</span>
                    <span className="text-amber-800 font-black">{user.scores.conclusion}%</span>
                  </div>
                  <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${user.scores.conclusion}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Computational Thinking Dimensions */}
            <div className="bg-blue-50/70 p-5 rounded-2xl border-2 border-blue-200">
              <h4 className="font-display font-extrabold text-blue-950 text-base mb-4 flex items-center gap-2">
                🧩 Computational Thinking & Coding
              </h4>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>1. Sequencing Blok Kode</span>
                    <span className="text-blue-800 font-black">{user.scores.coding}%</span>
                  </div>
                  <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${user.scores.coding}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>2. Debugging (Menemukan Bug)</span>
                    <span className="text-blue-800 font-black">{user.scores.debugging}%</span>
                  </div>
                  <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${user.scores.debugging}%` }} />
                  </div>
                </div>

                {/* Socratic AI Feedback preview */}
                <div className="mt-5 p-3.5 rounded-xl bg-white border border-blue-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
                    <span>🤖 BACA-BOT Berkata:</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    "Kamu sangat hebat dalam memahami alur cerita dan urutan balok coding! Terus berlatih mencari alasan sebab-akibat agar menjadi Master Detective!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
