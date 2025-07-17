import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "backend";
import { suggestRecipe } from "backend";

export type Item = {
	id: number;
	name: string;
	emote: string;
	discovered: boolean;
};

export type Recipe = {
	id: number;
	ingredientA: string;
	ingredientB: string;
	result: string;
};

export type CraftingRecipe = {
	ingredients: [string, string];
	result: string;
};

const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "http://localhost:3001/",
		}),
	],
});

export async function setItemDiscovered(
	id: number,
	discovered: boolean,
): Promise<Item> {
	return await trpc.setItemDiscovered.mutate({ id, discovered });
}

export async function getAllItems(): Promise<Item[]> {
	const items = await trpc.getItems.query();
	return items;
}

export async function createItem(name: string, emote: string): Promise<Item> {
	return await trpc.createItem.mutate({ name, emote });
}

export async function getAllRecipes(): Promise<Recipe[]> {
	return await trpc.getRecipes.query();
}

export async function createRecipe(
	ingredientA: string,
	ingredientB: string,
	result: string,
): Promise<Recipe> {
	return await trpc.createRecipe.mutate({
		ingredientA,
		ingredientB,
		result,
	});
}

export async function findOrCreateRecipe(
	a: string,
	b: string,
): Promise<CraftingRecipe | undefined> {
	const recipes = await getAllRecipes();

	const found = recipes.find(
		(r) =>
			(r.ingredientA === a && r.ingredientB === b) ||
			(r.ingredientA === b && r.ingredientB === a),
	);
	if (found) {
		return {
			ingredients: [found.ingredientA, found.ingredientB],
			result: found.result,
		};
	}

	const result = await suggestRecipe(a, b);
	if (!result) return undefined;

	const items = await getAllItems();
	const existingItem = items.find((item) => item.name === result.name);

	if (!existingItem) {
		await createItem(result.name, result.emote || "");
	}

	await createRecipe(a, b, result.name);

	return {
		ingredients: [a, b],
		result: result.name,
	};
}
