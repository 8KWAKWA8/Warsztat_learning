export type ItemType =
  | 'Wood'
  | 'Stone'
  | 'Plank'
  | 'Stick'
  | 'Axe'
  | 'Pickaxe'
  | 'Fire'
  | 'Coal'
  | 'Torch'
  | 'Campfire'
  | 'Bow'
  | 'Arrow'
  | 'String'
  | 'Net'
  | 'Spear'
  | 'Hammer'
  | 'Rope';

export type CraftingRecipe = {
  ingredients: [ItemType, ItemType];
  result: ItemType;
};

export const craftingRecipes: CraftingRecipe[] = [
  { ingredients: ['Wood', 'Stone'], result: 'Pickaxe' },
  { ingredients: ['Wood', 'Wood'], result: 'Plank' },
  { ingredients: ['Plank', 'Plank'], result: 'Stick' },
  { ingredients: ['Stick', 'Stone'], result: 'Axe' },
  { ingredients: ['Wood', 'Plank'], result: 'Fire' },
  { ingredients: ['Fire', 'Wood'], result: 'Coal' },
  { ingredients: ['Stick', 'Coal'], result: 'Torch' },
  { ingredients: ['Fire', 'Stone'], result: 'Campfire' },
  { ingredients: ['Stick', 'Stick'], result: 'String' },
  { ingredients: ['Stick', 'String'], result: 'Bow' },
  { ingredients: ['Stone', 'Stick'], result: 'Spear' },
  { ingredients: ['Plank', 'Stick'], result: 'Rope' },
];

export const itemEmotes: Record<ItemType, string> = {
  Wood: "🌲",
  Stone: "🪨",
  Plank: "🪵",
  Stick: "🦯",
  Axe: "🪓",
  Pickaxe: "⛏️",
  Fire: "🔥",
  Coal: "⚫",
  Torch: "🔥",
  Campfire: "🏕️",
  Bow: "🏹",
  Arrow: "🏹",
  String: "🧵",
  Net: "🕸️",
  Spear: "🗡️",
  Hammer: "🔨",
  Rope: "🪢",
};

const generatedRecipes: CraftingRecipe[] = [];

import { suggestRecipe, type OllamaRecipeResult } from '../ollama-recipe-helper';

export async function findOrCreateRecipe(
  a: ItemType,
  b: ItemType
): Promise<CraftingRecipe | undefined> {
  let recipe =
    craftingRecipes.find(
      r =>
        (r.ingredients[0] === a && r.ingredients[1] === b) ||
        (r.ingredients[0] === b && r.ingredients[1] === a)
    ) ||
    generatedRecipes.find(
      r =>
        (r.ingredients[0] === a && r.ingredients[1] === b) ||
        (r.ingredients[0] === b && r.ingredients[1] === a)
    );

  if (recipe) return recipe;

  const result = await suggestRecipe(a, b);
  if (!result) return undefined;

  // result.name is the new item name, result.emote is the emoji
  const newItem = result.name as ItemType;
  if (!(newItem in itemEmotes)) {
    itemEmotes[newItem] = result.emote || itemEmotes[a];
  }

  recipe = { ingredients: [a, b], result: newItem };
  generatedRecipes.push(recipe);
  return recipe;
}

export function getAllRecipes() {
  return [...craftingRecipes, ...generatedRecipes];
}