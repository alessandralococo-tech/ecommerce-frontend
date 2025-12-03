const BASE_URL = "http://localhost:8000/api";

export async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error("Errore nel fetch delle categorie");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
