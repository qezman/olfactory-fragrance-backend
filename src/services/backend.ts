export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getFragrances() {
  const res = await fetch(`${API_BASE}/fragrances`);
  if (!res.ok) throw new Error('Failed to fetch fragrances');
  return res.json();          // ← adjust the type as needed
}

/* Example: fetch a single fragrance */
export async function getFragrance(id: string) {
  const res = await fetch(`${API_BASE}/fragrances/${id}`);
  if (!res.ok) throw new Error(`Fragrance ${id} not found`);
  return res.json();
}
