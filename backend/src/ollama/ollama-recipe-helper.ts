const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL = 'llama3.2-vision';

 type OllamaRecipeResult = { name: string; emote: string | null };

 async function suggestRecipe(ingredientA: string, ingredientB: string): Promise<OllamaRecipeResult | null> {
  const prompt = `Suggest a creative crafting recipe result for combining "${ingredientA}" and "${ingredientB}" in my crafting game. Respond with only the name of the resulting item and a fitting emoji for it, separated by "::". Try not to repeat existing items. Also don't use the words that the other two ingredients are part of. Example: "Magic Dust::✨" DON'T add quotation marks to the names or emotes. ONLY use one emote per item and the most fitting emoji to the item. Try to make the recipes makes sens, the could be able to make made with one another in real life or have a close resemblance.`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt, 
        messages: [
          { role: 'user', content: prompt }
        ], 
        stream: false
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    let text: string | undefined;
    if (typeof data?.response === 'string') {
      text = data.response.trim();
    } else if (typeof data?.message?.content === 'string') {
      text = data.message.content.trim();
    }
    if (!text) return null;

    const [name, emote] = text.split('::').map(s => s.trim());
    if (!name) return null;
    return { name, emote: emote || null };
  } catch (err) {
    console.error('Ollama API error:', err);
    return null;
  }
}

export { suggestRecipe, type OllamaRecipeResult };