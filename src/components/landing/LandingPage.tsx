import React, { useState } from 'react';
import { CHARACTERS } from '../../data/mockData';
import { speechService } from '../../services/speechService';
import { PWAInstallModal } from '../common/PWAInstallModal';
import { Play, Shield, HelpCircle, BookOpen, Cpu, Sparkles, Trophy, CheckCircle, ChevronRight, X, Smartphone } from 'lucide-react';

interface LandingPageProps {
  onStartAdventure: () => void;
  onOpenTeacherPortal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAdventure,
  onOpenTeacherPortal,
}) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);

  const handleSpeakIntro = () => {
    speechService.speak(
      'Selamat datang di Code and Read Adventure! Petualangan membaca dan coding untuk menjadi Reading Detective kelas tiga sekolah dasar!'
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-4 py-8 sm:py-14 max-w-6xl mx-auto w-full">
        {/* Decorative Floating Elements */}
        <div className="absolute top-2 left-6 text-4xl animate-bounce delay-100 hidden sm:block">🌳</div>
        <div className="absolute top-10 right-10 text-4xl animate-pulse hidden sm:block">🏰</div>
        <div className="absolute bottom-6 left-12 text-3xl animate-bounce delay-300 hidden sm:block">🧭</div>
        <div className="absolute bottom-10 right-20 text-4xl hidden sm:block">🏝️</div>

        <div className="text-center max-w-3xl mx-auto relative z-10">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 bg-amber-200/80 border-2 border-amber-300 px-4 py-1.5 rounded-full text-amber-950 font-bold text-xs sm:text-sm shadow-xs mb-4">
            <Sparkles className="w-4 h-4 text-amber-700 fill-amber-500" />
            <span>Game Edukasi Bahasa Indonesia & Block Coding Kelas 3 SD</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-amber-950 tracking-tight leading-none drop-shadow-xs mb-3">
            CODE & READ
            <span className="block text-amber-600 mt-1">ADVENTURE</span>
          </h1>

          {/* Subtitle & Tagline */}
          <p className="font-display text-xl sm:text-2xl font-bold text-amber-800 mb-2">
            "Baca. Pahami. Coding. Pecahkan!" 🔍💻
          </p>
          <p className="text-slate-600 font-medium text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Petualangan seru membaca cerita, memecahkan teka-teki literasi bersama{' '}
            <strong className="text-blue-700">BACA-BOT 🤖</strong>, dan menyusun balok kode untuk
            menyelamatkan misi menjadi <span className="text-amber-800 font-bold">Reading Detective</span> sejati!
          </p>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-10">
            <button
              onClick={() => {
                handleSpeakIntro();
                onStartAdventure();
              }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-display font-extrabold text-xl sm:text-2xl rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 border-4 border-amber-300 active:scale-95 cursor-pointer"
            >
              <Play className="w-7 h-7 fill-white" />
              MULAI PETUALANGAN
            </button>

            <button
              onClick={onOpenTeacherPortal}
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-indigo-50 text-indigo-900 border-3 border-indigo-200 hover:border-indigo-400 font-display font-extrabold text-lg sm:text-xl rounded-3xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-6 h-6 text-indigo-600" />
              PORTAL GURU
            </button>

            <button
              onClick={() => setShowPwaModal(true)}
              className="w-full sm:w-auto px-5 py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-2 border-emerald-300 font-bold text-base rounded-3xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Smartphone className="w-5 h-5 text-emerald-700" />
              MAIN DI HP / LAPTOP
            </button>

            <button
              onClick={() => setShowAboutModal(true)}
              className="w-full sm:w-auto px-5 py-4 bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 font-bold text-base rounded-3xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-5 h-5 text-amber-800" />
              TENTANG GAME
            </button>
          </div>

          {/* Hero Character Lineup Showcase */}
          <div className="bg-white/80 backdrop-blur-xs border-4 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-md">
            <h3 className="font-display font-extrabold text-amber-950 text-lg sm:text-xl mb-4">
              PILIH DETEKTIF CILIK FAVORITMU! 🎒
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CHARACTERS.map((char) => (
                <div
                  key={char.id}
                  onClick={onStartAdventure}
                  className="bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 text-center hover:scale-105 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="text-4xl sm:text-5xl mb-2 transform group-hover:scale-110 transition-transform">
                    {char.avatar}
                  </div>
                  <h4 className="font-display font-black text-slate-800 text-lg">{char.name}</h4>
                  <p className="text-xs font-bold text-amber-800">{char.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Concept Steps */}
      <section className="bg-gradient-to-b from-amber-100/50 to-amber-200/50 border-t-4 border-amber-300 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-amber-950">
              ALUR BELAJAR BERMAKNA KELAS 3 SD 🗺️
            </h2>
            <p className="text-slate-600 font-medium text-sm sm:text-base">
              Coding menyatu dengan pemahaman bacaan: Setiap bacaan adalah petunjuk, setiap coding adalah solusi!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl mb-3">
                📖
              </div>
              <h3 className="font-display font-extrabold text-slate-800 text-base mb-1">1. READ</h3>
              <p className="text-xs text-slate-600">
                Membaca teks cerita bergambar yang sesuai dengan usia anak, dilengkapi text-to-speech.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center text-2xl mb-3">
                🔍
              </div>
              <h3 className="font-display font-extrabold text-slate-800 text-base mb-1">2. INVESTIGATE</h3>
              <p className="text-xs text-slate-600">
                Menemukan fakta, tokoh, latar, dan mengurutkan kejadian dengan bimbingan BACA-BOT 🤖.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center text-2xl mb-3">
                🧩
              </div>
              <h3 className="font-display font-extrabold text-slate-800 text-base mb-1">3. CODE</h3>
              <p className="text-xs text-slate-600">
                Menyusun balok kode algoritma untuk menggerakkan tokoh di maze menyelesaikan masalah cerita.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-2xl mb-3">
                🏆
              </div>
              <h3 className="font-display font-extrabold text-slate-800 text-base mb-1">4. SOLVE & REWARD</h3>
              <p className="text-xs text-slate-600">
                Tantangan nalar AI terbuka, perolehan XP, kenaikan level, dan pembukaan lencana badge!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-amber-300 max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl">
                🔎
              </div>
              <div>
                <h3 className="font-display font-extrabold text-2xl text-amber-950">
                  Tentang CODE & READ ADVENTURE
                </h3>
                <p className="text-xs font-bold text-amber-700">Platform Literasi & Computational Thinking</p>
              </div>
            </div>

            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p>
                <strong>CODE & READ ADVENTURE</strong> dirancang khusus untuk siswa kelas 3 Sekolah Dasar (usia 8-9 tahun) dengan menggabungkan:
              </p>
              <ul className="space-y-2 list-none pl-1">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Pemahaman Bacaan Bahasa Indonesia:</strong> Informasi tersurat, urutan kejadian, sebab-akibat, dan simpulan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Artificial Intelligence (BACA-BOT):</strong> Socratic scaffolding hint yang membimbing anak tanpa membocorkan jawaban langsung.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Block-Based Coding & Debugging:</strong> Menyusun instruksi gerakan karakter sesuai alur kejadian dalam cerita.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Evaluasi Terukur:</strong> Pre-test, Post-test, dan Normalized Gain ($g$) untuk diagnosis guru yang komprehensif.</span>
                </li>
              </ul>
              <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-amber-900 text-xs font-medium">
                💡 <em>"Coding tidak terpisah dari membaca. Isi cerita menjadi dasar pemecahan masalah algoritma."</em>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowAboutModal(false);
                  onStartAdventure();
                }}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-base rounded-2xl shadow-md"
              >
                Mulai Main Sekarang!
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PWA Install Guide Modal */}
      <PWAInstallModal isOpen={showPwaModal} onClose={() => setShowPwaModal(false)} />
    </div>
  );
};
