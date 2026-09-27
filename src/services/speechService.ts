/**
 * Web Speech API text-to-speech helper for Indonesian elementary students
 */

class SpeechService {
  private isAudioEnabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const stored = localStorage.getItem('code_read_audio_enabled');
      this.isAudioEnabled = stored !== 'false';
    }
  }

  public isEnabled(): boolean {
    return this.isAudioEnabled;
  }

  public toggleAudio(): boolean {
    this.isAudioEnabled = !this.isAudioEnabled;
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      localStorage.setItem('code_read_audio_enabled', String(this.isAudioEnabled));
    }
    if (!this.isAudioEnabled) {
      this.stop();
    }
    return this.isAudioEnabled;
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onStart?: () => void;
    }
  ): void {
    if (!this.isAudioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    // Stop current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = options?.rate ?? 0.95; // Slightly slower for 3rd graders
    utterance.pitch = options?.pitch ?? 1.1; // Friendly and upbeat

    // Attempt to pick Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(
      (v) => v.lang.startsWith('id') || v.lang.includes('ID')
    );
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    utterance.onstart = () => {
      if (options?.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (options?.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error/interrupted:', e);
      this.currentUtterance = null;
      if (options?.onEnd) options.onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }
}

export const speechService = new SpeechService();
