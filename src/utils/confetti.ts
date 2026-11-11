import confetti from 'canvas-confetti';

export function fireBirthdayConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#F59E0B', '#FBBF24', '#D97706', '#38BDF8', '#818CF8'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#F59E0B', '#EF4444', '#10B981', '#6366F1'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#FBBF24', '#34D399', '#60A5FA', '#F472B6'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#F59E0B', '#FCD34D', '#FFFFFF'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#6366F1', '#A855F7', '#EC4899'],
  });
}
