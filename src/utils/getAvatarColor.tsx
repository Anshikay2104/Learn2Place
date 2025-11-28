export function getAvatarColor(seed: string): string {
  if (!seed) return "bg-indigo-500";

  const colors = [
    "bg-indigo-500",
    "bg-purple-500",
    "bg-violet-500",
    "bg-blue-500",
    "bg-indigo-600",
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash % colors.length);
  return colors[index];
}
