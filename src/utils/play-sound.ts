export const playFeedbackSound = (type: 'success' | 'failure' = 'success') => {
    const audioContext = new (window.AudioContext ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
  
    oscillator.type = "sine";
  
    if (type === 'success') {
      // Original beep sound - ascending tone
      oscillator.frequency.setValueAtTime(1800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        500,
        audioContext.currentTime + 0.1
      );
      
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } else {
      // Failure sound - descending buzzer-like tone
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        150,
        audioContext.currentTime + 0.3
      );
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
  };
  
  // Convenience functions for backward compatibility and clarity
  export const playSuccessSound = () => playFeedbackSound('success');
  export const playFailureSound = () => playFeedbackSound('failure');