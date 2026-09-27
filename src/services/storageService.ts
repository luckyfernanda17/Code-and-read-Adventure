import { UserProfile, StudentProgressRecord, CharacterId } from '../types/game';
import { INITIAL_STUDENT_RECORDS } from '../data/mockData';

const USER_KEY = 'code_read_current_user';
const STUDENTS_KEY = 'code_read_students_list';

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse user profile', e);
    return null;
  }
}

export function saveUser(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Sync to student records list if student
  if (user.role === 'student') {
    const list = getStudentsList();
    const existingIndex = list.findIndex((s) => s.studentName.toLowerCase() === user.name.toLowerCase());
    const progressPercent = Math.min(100, Math.round((user.completedMissions.length / 5) * 100));

    const updatedRecord: StudentProgressRecord = {
      studentId: user.id,
      studentName: user.name,
      classCode: user.classCode || '3A',
      characterId: user.characterId,
      readingScore: Math.round(
        (user.scores.literal + user.scores.sequence + user.scores.causeEffect + user.scores.conclusion) / 4
      ),
      codingScore: user.scores.coding,
      progressPercent: progressPercent > 0 ? progressPercent : 20,
      weakness: user.scores.causeEffect < 70 ? 'Sebab-Akibat' : user.scores.conclusion < 70 ? 'Kesimpulan' : 'Tidak ada',
      preTestScore: user.preTestScore ?? 60,
      postTestScore: user.postTestScore ?? 0,
      hintsUsedCount: 2,
      categoryBreakdown: {
        literal: user.scores.literal,
        sequence: user.scores.sequence,
        causeEffect: user.scores.causeEffect,
        inferential: user.scores.inferential,
        conclusion: user.scores.conclusion,
        coding: user.scores.coding,
      },
    };

    if (existingIndex >= 0) {
      list[existingIndex] = updatedRecord;
    } else {
      list.unshift(updatedRecord);
    }
    saveStudentsList(list);
  }
}

export function getStudentsList(): StudentProgressRecord[] {
  if (typeof window === 'undefined') return INITIAL_STUDENT_RECORDS;
  const data = localStorage.getItem(STUDENTS_KEY);
  if (!data) {
    saveStudentsList(INITIAL_STUDENT_RECORDS);
    return INITIAL_STUDENT_RECORDS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_STUDENT_RECORDS;
  }
}

export function saveStudentsList(list: StudentProgressRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(list));
}

export function createDefaultStudent(name: string, classCode: string, characterId: CharacterId): UserProfile {
  return {
    id: 'student_' + Date.now(),
    name: name.trim(),
    classCode: classCode.trim() || '3A',
    characterId,
    role: 'student',
    level: 1,
    xp: 50,
    badges: ['reading_detective'],
    completedMissions: [],
    preTestScore: undefined,
    postTestScore: undefined,
    scores: {
      literal: 80,
      characters: 85,
      sequence: 85,
      causeEffect: 65,
      inferential: 60,
      conclusion: 55,
      coding: 75,
      debugging: 70,
    },
  };
}

export function createTeacherUser(): UserProfile {
  return {
    id: 'teacher_1',
    name: 'Ibu Guru Wahyu, S.Pd.',
    classCode: '3A',
    characterId: 'sinta',
    role: 'teacher',
    level: 99,
    xp: 9999,
    badges: ['reading_detective', 'coding_explorer', 'master_reader', 'bug_hunter'],
    completedMissions: ['mission-1-1', 'mission-1-2'],
    scores: {
      literal: 100,
      characters: 100,
      sequence: 100,
      causeEffect: 100,
      inferential: 100,
      conclusion: 100,
      coding: 100,
      debugging: 100,
    },
  };
}

export function clearUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}
