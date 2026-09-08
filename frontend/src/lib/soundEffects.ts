class SoundEffectsManager {
  public setMuted(_muted: boolean) {}

  public getIsMuted(): boolean {
    return true;
  }

  public playAlertPing(_type?: 'critical' | 'warning' | 'radar') {
    // Sound effects are completely disabled
  }
}

export const soundEffects = new SoundEffectsManager();
