const BASE_URL="http://localhost:8000/api"

export async function getProducts() {
    try{
        const res = await fetch(`${BASE_URL}/products`);
        if(!res.ok) throw new Error("Errore nel fetch dei prodotti");
        return await res.json();
    }catch (error){
        console.error(error);
        return [];
    }
}

export async function getProductById(id) {
    try{
        const res = await fetch(`${BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error("Prodotto non trovato");
        return await res.json();
    } catch (error){
        console.error(error);
        return null;
    }
}