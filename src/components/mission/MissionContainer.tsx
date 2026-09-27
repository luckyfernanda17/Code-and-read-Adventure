import React, { useState } from 'react';
import { Mission, UserProfile } from '../../types/game';
import { StepRead } from './StepRead';
import { StepInvestigate } from './StepInvestigate';
import { StepCode } from './StepCode';
import { StepAIChallenge } from './StepAIChallenge';
import { StepReward } from './StepReward';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

interface MissionContainerProps {
  mission: Mission;
  user: UserProfile;
  onMissionCompleted: (updatedUser: UserProfile) => void;
  onBackToDashboard: () => void;
}

export type MissionStep = 'read' | 'investigate' | 'code' | 'ai_challenge' | 'reward';

export const MissionContainer: React.FC<MissionContainerProps> = ({
  mission,
  user,
  onMissionCompleted,
  onBackToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<MissionStep>('read');
  const [accumulatedXP, setAccumulatedXP] = useState(0);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);

  const stepsList: { key: MissionStep; label: string; icon: string }[] = [
    { key: 'read', label: '1. BACA', icon: '📖' },
    { key: 'investigate', label: '2. INVESTIGASI', icon: '🔍' },
    { key: 'code', label: '3. CODING', icon: '🧩' },
    { key: 'ai_challenge', label: '4. NALAR AI', icon: '🤖' },
    { key: 'reward', label: '5. HADIAH', icon: '🏆' },
  ];

  const currentStepIndex = stepsList.findIndex((s) => s.key === currentStep);

  const handleFinishReading = () => {
    setCurrentStep('investigate');
  };

  const handleFinishInvestigate = (score: number, hintsUsed: number) => {
    setAccumulatedXP((prev) => prev + score);
    setHintsUsedCount(hintsUsed);
    setCurrentStep('code');
  };

  const handleFinishCode = (score: number) => {
    setAccumulatedXP((prev) => prev + score);
    setCurrentStep('ai_challenge');
  };

  const handleFinishAIChallenge = (score: number) => {
    const totalXP = accumulatedXP + score + 20; // +20 completion bonus
    setAccumulatedXP(totalXP);

    // Update user profile
    const updatedCompleted = Array.from(new Set([...user.completedMissions, mission.id]));
    const updatedBadges = mission.badgeRewardId
      ? Array.from(new Set([...user.badges, mission.badgeRewardId]))
      : user.badges;

    const newTotalXP = user.xp + totalXP;
    const newLevel = Math.floor(newTotalXP / 100) + 1;

    const updatedUser: UserProfile = {
      ...user,
      xp: newTotalXP,
      level: newLevel,
      completedMissions: updatedCompleted,
      badges: updatedBadges,
      scores: {
        ...user.scores,
        literal: Math.min(100, user.scores.literal + 5),
        sequence: Math.min(100, user.scores.sequence + 5),
        causeEffect: Math.min(100, user.scores.causeEffect + 5),
        coding: Math.min(100, user.scores.coding + 5),
      },
    };

    onMissionCompleted(updatedUser);
    setCurrentStep('reward');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Navigation & Step Indicator */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Back Button */}
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-slate-600 hover:text-amber-900 font-bold text-sm cursor-pointer group"
        >
          <span className="p-2 rounded-xl bg-slate-100 group-hover:bg-amber-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </span>
          <span>Kembali ke Peta</span>
        </button>

        {/* 5-Step Visual Progress Bar */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full pb-1">
          {stepsList.map((step, idx) => {
            const isCompleted = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step.key} className="flex items-center gap-1 shrink-0">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <span>{isCompleted ? '✓' : step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {idx < stepsList.length - 1 && (
                  <span className="text-slate-300 font-bold text-xs">→</span>
                )}
              </div>
            );
          })}
        </div>

        {/* XP earned counter */}
        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-xl border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>+{accumulatedXP} XP</span>
        </div>
      </div>

      {/* Dynamic Step View */}
      {currentStep === 'read' && (
        <StepRead mission={mission} onFinishedReading={handleFinishReading} />
      )}

      {currentStep === 'investigate' && (
        <StepInvestigate
          mission={mission}
          onComplete={handleFinishInvestigate}
        />
      )}

      {currentStep === 'code' && (
        <StepCode mission={mission} onComplete={handleFinishCode} />
      )}

      {currentStep === 'ai_challenge' && (
        <StepAIChallenge
          mission={mission}
          onComplete={handleFinishAIChallenge}
        />
      )}

      {currentStep === 'reward' && (
        <StepReward
          mission={mission}
          totalXpEarned={accumulatedXP}
          hintsUsed={hintsUsedCount}
          onFinish={onBackToDashboard}
        />
      )}
    </div>
  );
};
