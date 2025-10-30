export interface NewsItem {
  id: number;
  titulo: string;
  fecha: string;
  descripcion: string;
  imagen: string;
}

export async function getNovedades(): Promise<NewsItem[]> {
  const res = await fetch('https://localhost:7168/api/Novedad/api/v1/novedades', {
    // Si estás usando app router y querés ISR, podés usar: next: { revalidate: 60 }
    cache: 'no-store'
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Error fetching novedades: ${res.status} ${text}`);
  }

  const data = await res.json();
  // Si la API puede devolver estructura distinta, normalizala aquí.
  return data as NewsItem[];
}
