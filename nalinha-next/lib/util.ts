export function norm(t: string): string {
  return (t || '').toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
export function slug(t: string): string {
  return norm(t).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
