export async function getDigikalaPrice(productName: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/searchSite/checkProductPrice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productName }),
        });

        if (!res.ok) return null;

        console.log("fetch response status:", res.status);
        const data = await res.json();
        console.log("Digikala API response:", data);

        return data.product || null;
    } catch (error) {
        console.error("Error fetching Digikala price:", error);
        return null;
    }
}
