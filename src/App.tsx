/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, Mission } from './types/game';
import { INITIAL_WORLDS } from './data/mockData';
import { getStoredUser, saveUser, clearUser, createTeacherUser } from './services/storageService';
import { Header } from './components/common/Header';
import { LandingPage } from './components/landing/LandingPage';
import { StudentLogin } from './components/auth/StudentLogin';
import { StudentDashboard } from './components/student/StudentDashboard';
import { MissionContainer } from './components/mission/MissionContainer';
import { BugHunterMode } from './components/debugging/BugHunterMode';
import { AssessmentView } from './components/assessment/AssessmentView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredUser());
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeMissionId, setActiveMissionId] = useState<string>('mission-1-1');

  // Auto direct to dashboard if user is already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'teacher') {
        setCurrentView('teacher');
      } else {
        setCurrentView('dashboard');
      }
    }
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    saveUser(user);
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleTeacherLogin = () => {
    const teacher = createTeacherUser();
    saveUser(teacher);
    setCurrentUser(teacher);
    setCurrentView('teacher');
  };

  const handleLogout = () => {
    clearUser();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleStartMission = (missionId: string) => {
    setActiveMissionId(missionId);
    setCurrentView('mission');
  };

  const handleMissionCompleted = (updatedUser: UserProfile) => {
    saveUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  const handleDebuggingCompleted = (updatedUser: UserProfile) => {
    saveUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  const handlePreTestComplete = (score: number) => {
    if (currentUser) {
      const updated: UserProfile = {
        ...currentUser,
        preTestScore: score,
        xp: currentUser.xp + 50,
      };
      saveUser(updated);
      setCurrentUser(updated);
    }
  };

  const handlePostTestComplete = (score: number) => {
    if (currentUser) {
      const updated: UserProfile = {
        ...currentUser,
        postTestScore: score,
        xp: currentUser.xp + 50,
      };
      saveUser(updated);
      setCurrentUser(updated);
    }
  };

  // Find active mission
  let currentMission: Mission = INITIAL_WORLDS[0].missions[0];
  for (const world of INITIAL_WORLDS) {
    const found = world.missions.find((m) => m.id === activeMissionId);
    if (found) {
      currentMission = found;
      break;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-amber-100/60 text-slate-800 flex flex-col font-sans">
      {/* Top Universal App Header */}
      <Header
        user={currentUser}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'dashboard' && currentUser?.role === 'teacher') {
            setCurrentView('teacher');
          } else {
            setCurrentView(view);
          }
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full">
        {currentView === 'landing' && (
          <LandingPage
            onStartAdventure={() => setCurrentView('login')}
            onOpenTeacherPortal={handleTeacherLogin}
          />
        )}

        {currentView === 'login' && (
          <StudentLogin
            onLoginSuccess={handleLoginSuccess}
            onBackToLanding={() => setCurrentView('landing')}
            onTeacherLogin={handleTeacherLogin}
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <StudentDashboard
            user={currentUser}
            onStartMission={handleStartMission}
            onStartDebugging={() => setCurrentView('debugging')}
            onStartPreTest={() => setCurrentView('pre-test')}
            onStartPostTest={() => setCurrentView('post-test')}
          />
        )}

        {currentView === 'mission' && currentUser && (
          <MissionContainer
            mission={currentMission}
            user={currentUser}
            onMissionCompleted={handleMissionCompleted}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'debugging' && currentUser && (
          <BugHunterMode
            user={currentUser}
            onCompleted={handleDebuggingCompleted}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'pre-test' && currentUser && (
          <AssessmentView
            type="pre"
            user={currentUser}
            onComplete={handlePreTestComplete}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'post-test' && currentUser && (
          <AssessmentView
            type="post"
            user={currentUser}
            onComplete={handlePostTestComplete}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard
            onBackToStudent={() => {
              if (currentUser && currentUser.role === 'student') {
                setCurrentView('dashboard');
              } else {
                setCurrentView('login');
              }
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on mobile screens for students) */}
      {currentUser && currentUser.role === 'student' && (
        <div className="md:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-amber-300 px-3 py-2 flex items-center justify-around shadow-lg">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              currentView === 'dashboard'
                ? 'text-amber-800 bg-amber-100'
                : 'text-slate-600 hover:text-amber-900'
            }`}
          >
            <span className="text-base">🗺️</span>
            <span>Peta Misi</span>
          </button>
          <button
            onClick={() => setCurrentView('pre-test')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              currentView === 'pre-test'
                ? 'text-amber-800 bg-amber-100'
                : 'text-slate-600 hover:text-amber-900'
            }`}
          >
            <span className="text-base">📝</span>
            <span>Pre-Test</span>
          </button>
          <button
            onClick={() => setCurrentView('post-test')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              currentView === 'post-test'
                ? 'text-amber-800 bg-amber-100'
                : 'text-slate-600 hover:text-amber-900'
            }`}
          >
            <span className="text-base">🏆</span>
            <span>Post-Test</span>
          </button>
          <button
            onClick={() => setCurrentView('debugging')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              currentView === 'debugging'
                ? 'text-rose-800 bg-rose-100'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <span className="text-base">🐞</span>
            <span>Bug Hunt</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t-2 border-amber-200/80 bg-white/70 py-4 px-4 text-center text-xs text-slate-500 font-semibold mb-12 md:mb-0">
        <p>
          CODE & READ ADVENTURE • Game Edukasi Literasi & Computational Thinking Siswa Kelas 3 SD • Powered by BACA-BOT 🤖
        </p>
      </footer>
    </div>
  );
}
