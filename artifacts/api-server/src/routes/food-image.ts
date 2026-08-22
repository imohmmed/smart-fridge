import { Router, type IRouter } from "express";

const router: IRouter = Router();
const spoonacularFallback = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300";

router.get("/food-image", async (req, res) => {
  const name = typeof req.query.name === "string" ? req.query.name.trim() : "";
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!name || !apiKey) {
    res.status(name ? 503 : 400).json({ image: null, fallback: spoonacularFallback });
    return;
  }
  try {
    const url = new URL("https://api.spoonacular.com/recipes/search");
    url.searchParams.set("query", name);
    url.searchParams.set("number", "1");
    url.searchParams.set("apiKey", apiKey);
    const response = await fetch(url);
    if (!response.ok) {
      res.status(502).json({ image: null, fallback: spoonacularFallback });
      return;
    }
    const data = await response.json() as { results?: Array<{ id?: number }> };
    const id = data.results?.[0]?.id;
    res.json({ image: id ? `https://spoonacular.com/recipeImages/${id}-312x231.jpg` : null, fallback: spoonacularFallback });
  } catch {
    res.json({ image: null, fallback: spoonacularFallback });
  }
});

export default router;