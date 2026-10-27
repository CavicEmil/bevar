/* The order of this array defines the onboarding flow. */
export const ONBOARDING_STEPS = [
  { id: "fruit", title: "What fruit do you have?", description: "Choose one or more. We’ll find ways to make the most out of them." },
  { id: "time", title: "How much time do you have?", description: "Choose how long you’d like to spend preparing your fruit." },
  { id: "category", title: "What would you like to try?", description: "Pick one or more methods." },
];

export const ONBOARDING_TIMES = [
  { id: "under30", label: "Under 30 minutes", description: "Quick ways to save your fruit", max: 30 },
  { id: "30to60", label: "30–60 minutes", description: "A little kitchen project", min: 30, max:60 },
  { id: "60to120", label: "1–2 hours", description: "I have some more time", min: 60, max: 120 },
  { id: "all", label: "No time limit", description: "Show me all the possibilities" },
];

export const ONBOARDING_STORAGE_KEY = "bevar:onboarding:v1";
export const emptyPreferences = () => ({ fruitIds: [], categoryIds: [], preparationTime: "all" });
