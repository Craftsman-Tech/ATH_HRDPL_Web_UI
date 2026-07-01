export function initials(name: string) {
  return name.split(' ').slice(0,2).map(p => p[0]).join('').toUpperCase();
}
