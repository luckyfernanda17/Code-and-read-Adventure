import React, { useState } from 'react';
import { CharacterId, UserProfile } from '../../types/game';
import { CHARACTERS } from '../../data/mockData';
import { createDefaultStudent } from '../../services/storageService';
import { speechService } from '../../services/speechService';
import { Sparkles, ArrowRight, User, School, Check, HeartHandshake } from 'lucide-react';

interface StudentLoginProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBackToLanding: () => void;
  onTeacherLogin: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  onLoginSuccess,
  onBackToLanding,
  onTeacherLogin,
}) => {
  const [name, setName] = useState('');
  const [classCode, setClassCode] = useState('3A');
  const [selectedCharId, setSelectedCharId] = useState<CharacterId>('raka');
  const [greeting, setGreeting] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const char = CHARACTERS.find((c) => c.id === selectedCharId);
    const greetingText = `Halo, ${name.trim()}! 👋 Siap menjadi Reading Detective bersama ${char?.name}?`;
    setGreeting(greetingText);
    speechService.speak(greetingText);

    setTimeout(() => {
      const user = createDefaultStudent(name, classCode, selectedCharId);
      onLoginSuccess(user);
    }, 1200);
  };

  const handleQuickSelect = (studentName: string, charId: CharacterId) => {
    setName(studentName);
    setSelectedCharId(charId);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-300 p-6 sm:p-8 max-w-xl w-full shadow-xl relative">
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-amber-100 rounded-3xl text-3xl mb-2 border-2 border-amber-300 animate-pulse">
            🎒
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-amber-950">
            MASUK DETEKTIF CILIK
          </h2>
          <p className="text-slate-600 font-medium text-sm">
            Isi nama dan pilih karaktermu untuk mulai berpetualang!
          </p>
        </div>

        {/* Greeting Banner when logging in */}
        {greeting && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 text-center font-display font-extrabold text-lg animate-bounce">
            {greeting}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student Name */}
          <div>
            <label className="block font-display font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" />
              Nama Siswa:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Raka / Sinta"
              className="w-full px-4 py-3 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 outline-hidden font-display text-lg text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Class Code */}
          <div>
            <label className="block font-display font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
              <School className="w-4 h-4 text-amber-600" />
              Kode Kelas SD:
            </label>
            <div className="flex gap-2">
              {['3A', '3B', '3C'].map((code) => (
                <button
                  type="button"
                  key={code}
                  onClick={() => setClassCode(code)}
                  className={`flex-1 py-2 rounded-xl font-display font-bold text-sm border-2 transition-all cursor-pointer ${
                    classCode === code
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  Kelas {code}
                </button>
              ))}
            </div>
          </div>

          {/* Character Selection */}
          <div>
            <label className="block font-display font-bold text-slate-800 text-sm mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Pilih Karakter Detektif:
              </span>
              <span className="text-xs text-amber-700 font-semibold">Klik salah satu</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CHARACTERS.map((char) => {
                const isSelected = selectedCharId === char.id;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      setSelectedCharId(char.id);
                      speechService.speak(`Karakter ${char.name} dipilih!`);
                    }}
                    className={`p-3 rounded-2xl border-3 flex flex-col items-center text-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 shadow-md scale-102'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                    <span className="text-3xl mb-1">{char.avatar}</span>
                    <span className="font-display font-extrabold text-sm text-slate-800">{char.name}</span>
                    <span className="text-[10px] font-semibold text-amber-800 leading-tight">
                      {char.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Demo Student Picker */}
          <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200 text-xs">
            <span className="font-bold text-amber-900 block mb-1">⚡ Atau Coba Masuk Cepat:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickSelect('Raka', 'raka')}
                className="bg-white hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg font-bold text-slate-700"
              >
                🧒 Raka
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('Sinta', 'sinta')}
                className="bg-white hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg font-bold text-slate-700"
              >
                👧 Sinta
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('Bimo', 'bimo')}
                className="bg-white hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg font-bold text-slate-700"
              >
                🧒 Bimo
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('Citra', 'citra')}
                className="bg-white hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg font-bold text-slate-700"
              >
                👧 Citra
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name.trim() || !!greeting}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-extrabold text-xl rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-3 border-amber-300 disabled:opacity-50 cursor-pointer"
          >
            <span>MULAI PETUALANGAN!</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>

        {/* Footer switches */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={onBackToLanding}
            className="hover:text-amber-800 font-bold underline cursor-pointer"
          >
            ← Kembali ke Halaman Utama
          </button>
          <button
            onClick={onTeacherLogin}
            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4" />
            Masuk sebagai Guru
          </button>
        </div>
      </div>
    </div>
  );
};
