/** Returns up to 2 uppercase initials of a name, e.g. "Dr. Meera Sharma" → "DM". */
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');
}
