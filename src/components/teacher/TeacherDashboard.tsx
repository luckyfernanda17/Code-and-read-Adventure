import React, { useState } from 'react';
import { StudentProgressRecord } from '../../types/game';
import { getStudentsList } from '../../services/storageService';
import { getAiRecommendations, RecommendationResult } from '../../services/aiService';
import { CHARACTERS } from '../../data/mockData';
import {
  Users,
  TrendingUp,
  Brain,
  Sparkles,
  BookOpen,
  Code2,
  FileSpreadsheet,
  Search,
  ChevronRight,
  X,
  Award,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface TeacherDashboardProps {
  onBackToStudent: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBackToStudent }) => {
  const [students, setStudents] = useState<StudentProgressRecord[]>(() => getStudentsList());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressRecord | null>(null);

  // AI recommendations state for modal
  const [aiRec, setAiRec] = useState<RecommendationResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Filter students
  const filteredStudents = students.filter(
    (s) =>
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.classCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Metrics
  const avgReading = Math.round(
    students.reduce((acc, s) => acc + s.readingScore, 0) / (students.length || 1)
  );
  const avgCoding = Math.round(
    students.reduce((acc, s) => acc + s.codingScore, 0) / (students.length || 1)
  );
  const avgProgress = Math.round(
    students.reduce((acc, s) => acc + s.progressPercent, 0) / (students.length || 1)
  );

  // Normalized Gain average
  const validGainStudents = students.filter((s) => s.postTestScore > 0 && s.preTestScore < 100);
  const avgGain =
    validGainStudents.length > 0
      ? (
          validGainStudents.reduce((acc, s) => {
            const g = (s.postTestScore - s.preTestScore) / (100 - s.preTestScore);
            return acc + g;
          }, 0) / validGainStudents.length
        ).toFixed(2)
      : '0.52';

  const handleOpenStudentDetail = async (student: StudentProgressRecord) => {
    setSelectedStudent(student);
    setIsLoadingAi(true);
    setAiRec(null);

    const rec = await getAiRecommendations({
      studentName: student.studentName,
      scores: student.categoryBreakdown,
    });
    setAiRec(rec);
    setIsLoadingAi(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-700 text-indigo-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                PORTAL GURU & ANALISIS KELAS 3 SD
              </span>
              <span className="text-xs text-indigo-300 font-bold">Tahun Ajaran 2026/2027</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
              Dashboard Literasi & Computational Thinking
            </h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-2xl font-medium">
              Pantau pemahaman membaca, penyusunan algoritma balok coding, hasil Pre/Post-Test, serta rekomendasi intervensi pedagogis AI.
            </p>
          </div>

          <button
            onClick={onBackToStudent}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-display font-black text-sm rounded-2xl shadow-md transition-all self-start md:self-auto cursor-pointer"
          >
            ← Kembali ke Mode Siswa
          </button>
        </div>
      </div>

      {/* Class Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-3xl border-3 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>SISWA TERDAFTAR</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-display font-black text-3xl text-slate-800">{students.length} Siswa</div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Kelas 3A & 3B Aktif</span>
        </div>

        {/* Avg Reading */}
        <div className="bg-white p-5 rounded-3xl border-3 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>RATA-RATA READING</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display font-black text-3xl text-amber-600">{avgReading}%</div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Tersurat & Alur Baik</span>
        </div>

        {/* Avg Coding */}
        <div className="bg-white p-5 rounded-3xl border-3 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>RATA-RATA CODING</span>
            <Code2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-display font-black text-3xl text-blue-600">{avgCoding}%</div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Sequencing & Debugging</span>
        </div>

        {/* Normalized Gain (Hake's g) */}
        <div className="bg-white p-5 rounded-3xl border-3 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>NORMALIZED GAIN (g)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display font-black text-3xl text-emerald-600">g = {avgGain}</div>
          <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
            Efektivitas Sedang-Tinggi
          </span>
        </div>
      </div>

      {/* Main Student Progress Table */}
      <div className="bg-white rounded-3xl border-4 border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 sm:p-6 border-b-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-black text-xl text-slate-800">
              Daftar Kemampuan Literasi & Coding Siswa
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Klik pada nama siswa untuk membuka diagnosis AI dan rincian kemampuan.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border-2 border-slate-200 focus:border-indigo-500 text-xs font-bold outline-hidden"
            />
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Nama Siswa</th>
                <th className="py-3.5 px-4 text-center">Kelas</th>
                <th className="py-3.5 px-4 text-center">Reading</th>
                <th className="py-3.5 px-4 text-center">Coding</th>
                <th className="py-3.5 px-4 text-center">Progress</th>
                <th className="py-3.5 px-4">Kelemahan Terdeteksi</th>
                <th className="py-3.5 px-4 text-center">Pre / Post</th>
                <th className="py-3.5 px-4 text-center">Gain (g)</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
              {filteredStudents.map((std) => {
                const char = CHARACTERS.find((c) => c.id === std.characterId);
                const hasPost = std.postTestScore > 0;
                const gain = hasPost
                  ? ((std.postTestScore - std.preTestScore) / (100 - std.preTestScore)).toFixed(2)
                  : '-';

                return (
                  <tr
                    key={std.studentId}
                    onClick={() => handleOpenStudentDetail(std)}
                    className="hover:bg-indigo-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <span className="text-2xl">{char?.avatar || '🧒'}</span>
                      <div>
                        <div className="font-display font-black text-sm text-slate-900">
                          {std.studentName}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {std.hintsUsedCount}x bantuan AI hint
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center font-extrabold text-slate-600">
                      {std.classCode}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-black ${
                          std.readingScore >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {std.readingScore}%
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-black ${
                          std.codingScore >= 80
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {std.codingScore}%
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="w-20 bg-slate-200 h-2.5 rounded-full mx-auto overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${std.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        {std.progressPercent}%
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          std.weakness.includes('Tidak')
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {std.weakness}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center font-medium">
                      <span>{std.preTestScore}%</span>
                      <span className="text-slate-400 mx-1">→</span>
                      <span className={hasPost ? 'text-emerald-700 font-black' : 'text-slate-400'}>
                        {hasPost ? `${std.postTestScore}%` : 'Belum'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold ${
                          hasPost && Number(gain) >= 0.7
                            ? 'bg-emerald-100 text-emerald-800'
                            : hasPost && Number(gain) >= 0.3
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {gain}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button className="p-1.5 rounded-xl bg-slate-100 hover:bg-indigo-100 text-slate-700">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal with AI Recommendations */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-indigo-200 max-w-3xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-4xl shadow-xs">
                {CHARACTERS.find((c) => c.id === selectedStudent.characterId)?.avatar || '🧒'}
              </div>
              <div>
                <span className="text-xs font-black text-indigo-700 uppercase bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Rapor Literasi & Computational Thinking
                </span>
                <h3 className="font-display font-black text-2xl text-slate-900 mt-1">
                  {selectedStudent.studentName} ({selectedStudent.classCode})
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Misi Selesai: {selectedStudent.progressPercent}% • Bantuan Hint AI: {selectedStudent.hintsUsedCount} kali
                </p>
              </div>
            </div>

            {/* 6 Literacy & CT Breakdown Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-slate-700 block mb-2">
                  📖 Dimensi Pemahaman Membaca
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-600 mb-0.5">
                      <span>Informasi Tersurat:</span>
                      <span>{selectedStudent.categoryBreakdown.literal}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedStudent.categoryBreakdown.literal}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-600 mb-0.5">
                      <span>Urutan Kejadian:</span>
                      <span>{selectedStudent.categoryBreakdown.sequence}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${selectedStudent.categoryBreakdown.sequence}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-600 mb-0.5">
                      <span>Sebab-Akibat:</span>
                      <span className="text-rose-600 font-black">{selectedStudent.categoryBreakdown.causeEffect}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${selectedStudent.categoryBreakdown.causeEffect}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-600 mb-0.5">
                      <span>Menarik Kesimpulan:</span>
                      <span>{selectedStudent.categoryBreakdown.conclusion}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${selectedStudent.categoryBreakdown.conclusion}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-slate-700 block mb-2">
                  🧩 Computational Thinking
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-600 mb-0.5">
                      <span>Sequencing Block:</span>
                      <span>{selectedStudent.categoryBreakdown.coding}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selectedStudent.categoryBreakdown.coding}%` }} />
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-slate-500 text-[11px] block">
                      Analisis Waktu & Ketekunan:
                    </span>
                    <span className="font-bold text-slate-700 text-xs">
                      Siswa tekun mengulang kode maze hingga mencapai tujuan tanpa frustrasi.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Pedagogical Recommendations */}
            <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 rounded-2xl border-2 border-indigo-300 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-indigo-700" />
                <h4 className="font-display font-black text-indigo-950 text-base">
                  Rekomendasi Tindakan AI Pedagogis
                </h4>
              </div>

              {isLoadingAi ? (
                <div className="py-4 text-center text-xs font-bold text-indigo-700 flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  BACA-BOT Konsultan AI sedang menganalisis pola kesalahan siswa...
                </div>
              ) : aiRec ? (
                <div className="space-y-3 text-xs text-slate-700">
                  <div className="p-3 bg-white/90 rounded-xl border border-indigo-200">
                    <strong className="text-rose-700 block mb-0.5">
                      Fokus Intervensi: {aiRec.mainWeakness}
                    </strong>
                    <p className="leading-relaxed">{aiRec.summary}</p>
                  </div>

                  <div className="p-3 bg-white/90 rounded-xl border border-indigo-200">
                    <strong className="text-indigo-900 block mb-0.5">
                      Langkah Aksi yang Disarankan untuk Guru:
                    </strong>
                    <p className="leading-relaxed">{aiRec.recommendation}</p>
                  </div>

                  {aiRec.recommendedMissions && aiRec.recommendedMissions.length > 0 && (
                    <div>
                      <span className="font-bold text-slate-600 block mb-1">
                        Misi Latihan Terarah:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {aiRec.recommendedMissions.map((m, idx) => (
                          <span
                            key={idx}
                            className="bg-amber-100 text-amber-900 px-3 py-1 rounded-lg font-bold text-[11px] border border-amber-300"
                          >
                            ⭐ {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup Rapor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
