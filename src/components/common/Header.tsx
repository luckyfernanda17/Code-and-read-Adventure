import React, { useState } from 'react';
import { UserProfile } from '../../types/game';
import { CHARACTERS } from '../../data/mockData';
import { speechService } from '../../services/speechService';
import { PWAInstallModal } from './PWAInstallModal';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Volume2, VolumeX, Sparkles, LogOut, Compass, FileCheck2, UserCheck, Shield, Smartphone, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  user: UserProfile | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentView,
  onNavigate,
  onLogout,
}) => {
  const [audioOn, setAudioOn] = useState(speechService.isEnabled());
  const [showPwaModal, setShowPwaModal] = useState(false);
  const { isInstallable, isInstalled, isOnline } = usePWAInstall();

  const handleToggleAudio = () => {
    const nextState = speechService.toggleAudio();
    setAudioOn(nextState);
    if (nextState) {
      speechService.speak('Suara narasi aktif! Selamat bertualang!');
    }
  };

  const character = user ? CHARACTERS.find((c) => c.id === user.characterId) : null;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-amber-200 shadow-sm px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Brand */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center text-xl sm:text-2xl shadow-md border-2 border-amber-300 transform group-hover:scale-105 transition-transform">
              🔍
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-extrabold text-xl sm:text-2xl tracking-wide text-amber-900 group-hover:text-amber-700 transition-colors">
                  CODE & READ
                </span>
                <span className="bg-amber-400 text-amber-950 font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  SD KELAS 3
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 hidden sm:block">
                "Baca. Pahami. Coding. Pecahkan!" 🚀
              </p>
            </div>
          </div>

          {/* Navigation & Status */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Offline/Online Classroom Indicator */}
            {!isOnline && (
              <div
                title="Mode Offline Kelas: Misi, cerita, dan coding tetap berjalan lancar tanpa kuota internet!"
                className="flex items-center gap-1 bg-amber-100 border border-amber-400 text-amber-900 px-2 py-1 rounded-xl text-[11px] font-bold animate-pulse"
              >
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Offline Kelas</span>
              </div>
            )}

            {/* Install / Main di HP Button */}
            {!isInstalled && (
              <button
                onClick={() => setShowPwaModal(true)}
                title="Pasang di Layar HP & Laptop"
                className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-bold text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-sm border-2 border-amber-300 active:scale-95 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Main di HP</span>
                <span className="sm:hidden">HP</span>
              </button>
            )}

            {user && (
              <>
                {/* Quick Nav Links */}
                {user.role === 'student' ? (
                  <div className="hidden md:flex items-center gap-1 bg-amber-100/70 p-1 rounded-2xl border border-amber-200">
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 ${
                        currentView === 'dashboard'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-amber-900 hover:bg-amber-200/60'
                      }`}
                    >
                      <Compass className="w-4 h-4" />
                      Peta Dunia
                    </button>
                    <button
                      onClick={() => onNavigate('pre-test')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 ${
                        currentView === 'pre-test'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-amber-900 hover:bg-amber-200/60'
                      }`}
                    >
                      <FileCheck2 className="w-4 h-4" />
                      Pre-Test
                    </button>
                    <button
                      onClick={() => onNavigate('post-test')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 ${
                        currentView === 'post-test'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-amber-900 hover:bg-amber-200/60'
                      }`}
                    >
                      <FileCheck2 className="w-4 h-4" />
                      Post-Test
                    </button>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-2xl border border-indigo-200 text-indigo-900 font-bold text-sm">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    Mode Portal Guru
                  </div>
                )}

                {/* Student Profile Pill */}
                {user.role === 'student' ? (
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl shadow-xs">
                    <div className="text-lg sm:text-xl">{character?.avatar || '🧒'}</div>
                    <div className="hidden lg:block text-left">
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {user.name} ({user.classCode})
                      </div>
                      <div className="text-[11px] font-semibold text-amber-700">
                        Level {user.level} • {user.xp} XP
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-400 text-amber-950 font-bold text-xs px-2 py-0.5 rounded-lg shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                      <span>{user.xp} XP</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-indigo-100 border-2 border-indigo-300 px-3 py-1 rounded-2xl">
                    <UserCheck className="w-5 h-5 text-indigo-700" />
                    <span className="font-bold text-xs text-indigo-950">{user.name}</span>
                  </div>
                )}
              </>
            )}

            {/* Sound Toggle Button */}
            <button
              onClick={handleToggleAudio}
              title={audioOn ? 'Matikan Suara Narasi' : 'Nyalakan Suara Narasi'}
              className={`p-2 sm:p-2.5 rounded-2xl border-2 transition-all font-bold flex items-center justify-center ${
                audioOn
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {audioOn ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Switch Role / Exit */}
            {user && (
              <button
                onClick={onLogout}
                title="Keluar / Ganti Akun"
                className="p-2 sm:p-2.5 rounded-2xl border-2 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* PWA Install Modal */}
      <PWAInstallModal isOpen={showPwaModal} onClose={() => setShowPwaModal(false)} />
    </>
  );
};
