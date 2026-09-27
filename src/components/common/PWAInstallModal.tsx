import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Laptop, X, Share, PlusSquare, CheckCircle2, QrCode } from 'lucide-react';

export const PWAInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isIOS, isInstalled, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border-4 border-amber-300 max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-amber-500 flex items-center justify-center text-2xl shadow-xs">
            📱
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-amber-950">
              Main di HP, Tablet & Laptop
            </h3>
            <p className="text-xs font-bold text-amber-700">
              Bisa dimainkan offline tanpa kuota internet di ruang kelas! 🎒⚡
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Quick Install Action if browser supports beforeinstallprompt */}
          {isInstallable && !isInstalled && (
            <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="font-display font-extrabold text-emerald-900 block text-sm">
                  ⚡ Pasang Langsung ke Layar Utama
                </span>
                <span className="text-xs text-emerald-700 font-medium">
                  Game akan terbuka cepat layar penuh seperti aplikasi resmi!
                </span>
              </div>
              <button
                onClick={async () => {
                  await install();
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>PASANG SEKARANG</span>
              </button>
            </div>
          )}

          {/* Guide for HP Android (Chrome) */}
          <div className="bg-amber-50/70 border-2 border-amber-200 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 font-display font-bold text-amber-950 text-sm mb-1.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Cara di HP Android (Google Chrome):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-xs font-medium pl-1">
              <li>Buka link game di browser <strong>Google Chrome</strong> di HP.</li>
              <li>Ketuk ikon titik tiga (<strong>⋮</strong>) di pojok kanan atas layar.</li>
              <li>Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Install Aplikasi"</strong>.</li>
              <li>Ikon <em>Code & Read</em> akan muncul di layar HP siswa seperti game sungguhan!</li>
            </ol>
          </div>

          {/* Guide for iPhone / iPad (Safari) */}
          <div className="bg-blue-50/70 border-2 border-blue-200 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 font-display font-bold text-blue-950 text-sm mb-1.5">
              <Share className="w-4 h-4 text-blue-600" />
              <span>Cara di iPhone / iPad (Safari):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-xs font-medium pl-1">
              <li>Buka link game menggunakan browser <strong>Safari</strong>.</li>
              <li>Ketuk tombol <strong>Share / Bagikan</strong> (<Share className="w-3.5 h-3.5 inline mx-0.5" />) di bagian bawah.</li>
              <li>Geser ke bawah dan pilih <strong>"Add to Home Screen" (Tambah ke Layar Utama)</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-0.5" />).</li>
              <li>Tekan <strong>"Add / Tambah"</strong> di kanan atas.</li>
            </ol>
          </div>

          {/* Guide for Laptop / PC / Chromebook */}
          <div className="bg-purple-50/70 border-2 border-purple-200 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 font-display font-bold text-purple-950 text-sm mb-1.5">
              <Laptop className="w-4 h-4 text-purple-600" />
              <span>Cara di Laptop / Komputer / Chromebook:</span>
            </div>
            <p className="text-slate-600 text-xs font-medium pl-1 leading-relaxed">
              Buka di <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong>. Klik ikon instal (komputer dengan panah bawah) di bilah alamat URL sebelah kanan, atau tekan <kbd className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">Ctrl + D</kbd> untuk bookmark.
            </p>
          </div>

          {/* Share / Copy Link for Students */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-bold truncate max-w-xs">
              Link: <span className="font-mono text-slate-700">{currentUrl}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-display font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>LINK TERSALIN!</span>
                </>
              ) : (
                <>
                  <Share className="w-4 h-4" />
                  <span>SALIN LINK GAME</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
