import { IRoast } from '@/types';

export const ROAST_LIBRARY: IRoast[] = [
  // Mild roasts
  {
    message: "Well, well, well... look who couldn't handle a simple to-do list.",
    severity: 'mild',
  },
  {
    message: "Procrastination: 1, You: 0. Better luck next time, champ.",
    severity: 'mild',
  },
  {
    message: "You had ONE job. Well, actually multiple jobs. And you failed them all.",
    severity: 'mild',
  },
  {
    message: "I've seen snails move faster than your task completion rate.",
    severity: 'mild',
  },
  {
    message: "Your tasks called. They said they're tired of waiting for you.",
    severity: 'mild',
  },

  // Medium roasts
  {
    message: "Congratulations! You've achieved what few dare to do: absolutely nothing.",
    severity: 'medium',
  },
  {
    message: "Your future self is calling. They're disappointed. Very disappointed.",
    severity: 'medium',
  },
  {
    message: "I'd say 'nice try,' but... there wasn't much trying happening here, was there?",
    severity: 'medium',
  },
  {
    message: "You know what's dead? Your productivity. And now, you.",
    severity: 'medium',
  },
  {
    message: "Breaking news: Local person fails to do literally anything on their list.",
    severity: 'medium',
  },
  {
    message: "Your procrastination skills are impressive. Your task completion? Not so much.",
    severity: 'medium',
  },
  {
    message: "Even my code runs faster than you complete tasks.",
    severity: 'medium',
  },

  // Savage roasts
  {
    message: "You didn't just drop the ball. You threw it into a volcano and watched it burn.",
    severity: 'savage',
  },
  {
    message: "Your deadlines sent me a letter. It just says 'lol' over and over.",
    severity: 'savage',
  },
  {
    message: "I've seen rocks with more motivation than you right now.",
    severity: 'savage',
  },
  {
    message: "Somewhere, a to-do list is crying. That to-do list is yours.",
    severity: 'savage',
  },
  {
    message: "You had the audacity to set deadlines and then completely ghost them. Bold move.",
    severity: 'savage',
  },
  {
    message: "Your tasks didn't just expire. They decomposed, fossilized, and became archaeological artifacts.",
    severity: 'savage',
  },
  {
    message: "Achievement unlocked: Professional Procrastinator. Too bad it doesn't pay the bills.",
    severity: 'savage',
  },
  {
    message: "I'd tell you to get your life together, but you couldn't even get your tasks together.",
    severity: 'savage',
  },
];

// Get random roast, optionally filtered by severity
export function getRandomRoast(severity?: 'mild' | 'medium' | 'savage'): string {
  const filtered = severity 
    ? ROAST_LIBRARY.filter(r => r.severity === severity)
    : ROAST_LIBRARY;
  
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex].message;
}

// Get roast based on how badly they failed
export function getRoastBySeverity(tasksCompleted: number, totalTasks: number): string {
  const completionRate = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;

  if (completionRate >= 50) {
    return getRandomRoast('mild');
  } else if (completionRate >= 25) {
    return getRandomRoast('medium');
  } else {
    return getRandomRoast('savage');
  }
}
