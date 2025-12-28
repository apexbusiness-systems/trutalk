import { create } from 'zustand';

interface EngagementState {
  streak: number;
  dailyChallenge: string;
  completedToday: boolean;
  lastActiveDate: string;
  incrementStreak: () => void;
  completeChallenge: () => void;
}

const challenges = [
  "Describe your perfect day in 30 seconds",
  "Share what made you smile today",
  "Talk about your favorite childhood memory",
  "What's something you're grateful for?",
  "Describe your dream vacation",
  "Share a fun fact about yourself",
  "What's your go-to comfort food?",
];

const getDailyChallenge = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return challenges[dayOfYear % challenges.length];
};

export const useEngagementStore = create<EngagementState>((set, get) => ({
  streak: 0,
  dailyChallenge: getDailyChallenge(),
  completedToday: false,
  lastActiveDate: new Date().toISOString().split('T')[0],

  incrementStreak: () => {
    const today = new Date().toISOString().split('T')[0];
    const { lastActiveDate, streak } = get();

    if (lastActiveDate !== today) {
      set({ streak: streak + 1, lastActiveDate: today });
    }
  },

  completeChallenge: () => {
    set({ completedToday: true });
    get().incrementStreak();
  },
}));
