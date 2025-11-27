export function getAvatarColor(id: string) {
  const colors = [
    "bg-red-600",
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-indigo-600",
    "bg-orange-600",
    "bg-teal-600",
  ];

  if (!id) return colors[0];

  // Create a stable number based on the user ID
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);

  return colors[sum % colors.length];
}
