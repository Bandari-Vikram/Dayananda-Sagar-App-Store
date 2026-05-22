export const NAV_TRANSITION_KEY = "apps-nav-transition";

export type StoreApp = {
  id: string;
  name: string;
  description: string;
  category: string;
  iconLabel: string;
  gradient: string;
  installed: boolean;
  rating: number;
  size: string;
};

export const STORE_APPS: StoreApp[] = [
  {
    id: "campus-hub",
    name: "Campus Hub",
    description: "Events, notices, and campus life in one place.",
    category: "Productivity",
    iconLabel: "CH",
    gradient: "from-violet-500 to-indigo-600",
    installed: true,
    rating: 4.8,
    size: "24 MB",
  },
  {
    id: "dsu-learn",
    name: "DSU Learn",
    description: "Lecture notes, quizzes, and AI study assistant.",
    category: "Education",
    iconLabel: "DL",
    gradient: "from-sky-500 to-cyan-600",
    installed: false,
    rating: 4.7,
    size: "38 MB",
  },
  {
    id: "code-lab",
    name: "Code Lab",
    description: "Practice DSA, run snippets, and track streaks.",
    category: "Developer",
    iconLabel: "CL",
    gradient: "from-emerald-500 to-teal-600",
    installed: false,
    rating: 4.9,
    size: "52 MB",
  },
  {
    id: "fit-track",
    name: "Fit Track",
    description: "Workouts, steps, and wellness challenges.",
    category: "Health",
    iconLabel: "FT",
    gradient: "from-orange-500 to-rose-500",
    installed: true,
    rating: 4.5,
    size: "18 MB",
  },
  {
    id: "bus-live",
    name: "Bus Live",
    description: "Real-time shuttle routes and arrival alerts.",
    category: "Transport",
    iconLabel: "BL",
    gradient: "from-amber-500 to-yellow-600",
    installed: false,
    rating: 4.4,
    size: "15 MB",
  },
  {
    id: "canteen-go",
    name: "Canteen Go",
    description: "Pre-order meals and skip the lunch queue.",
    category: "Food",
    iconLabel: "CG",
    gradient: "from-pink-500 to-fuchsia-600",
    installed: false,
    rating: 4.6,
    size: "21 MB",
  },
  {
    id: "library-plus",
    name: "Library+",
    description: "Book slots, digital resources, and due reminders.",
    category: "Education",
    iconLabel: "L+",
    gradient: "from-blue-600 to-indigo-700",
    installed: true,
    rating: 4.3,
    size: "12 MB",
  },
  {
    id: "club-connect",
    name: "Club Connect",
    description: "Join clubs, RSVP events, and chat with peers.",
    category: "Social",
    iconLabel: "CC",
    gradient: "from-purple-500 to-violet-700",
    installed: false,
    rating: 4.2,
    size: "29 MB",
  },
];

export const APP_CATEGORIES = ["All", "Education", "Productivity", "Developer", "Health", "Social"] as const;
