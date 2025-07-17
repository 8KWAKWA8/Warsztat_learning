import { prisma } from "./src/prismaclient";

const items = [
	{ name: "Wood", emote: "🌲" },
	{ name: "Stone", emote: "🪨" },
	{ name: "Plank", emote: "🪵" },
	{ name: "Stick", emote: "🦯" },
	{ name: "Axe", emote: "🪓" },
	{ name: "Pickaxe", emote: "⛏️" },
	{ name: "Fire", emote: "🔥" },
	{ name: "Coal", emote: "⚫" },
	{ name: "Torch", emote: "🔥" },
	{ name: "Campfire", emote: "🏕️" },
	{ name: "Bow", emote: "🏹" },
	{ name: "Arrow", emote: "🏹" },
	{ name: "String", emote: "🧵" },
	{ name: "Net", emote: "🕸️" },
	{ name: "Spear", emote: "🗡️" },
	{ name: "Hammer", emote: "🔨" },
	{ name: "Rope", emote: "🪢" },
];

const recipes = [
	{ ingredientA: "Wood", ingredientB: "Stone", result: "Pickaxe" },
	{ ingredientA: "Wood", ingredientB: "Wood", result: "Plank" },
	{ ingredientA: "Plank", ingredientB: "Plank", result: "Stick" },
	{ ingredientA: "Stick", ingredientB: "Stone", result: "Axe" },
	{ ingredientA: "Wood", ingredientB: "Plank", result: "Fire" },
	{ ingredientA: "Fire", ingredientB: "Wood", result: "Coal" },
	{ ingredientA: "Stick", ingredientB: "Coal", result: "Torch" },
	{ ingredientA: "Fire", ingredientB: "Stone", result: "Campfire" },
	{ ingredientA: "Stick", ingredientB: "Stick", result: "String" },
	{ ingredientA: "Stick", ingredientB: "String", result: "Bow" },
	{ ingredientA: "Stone", ingredientB: "Stick", result: "Spear" },
	{ ingredientA: "Plank", ingredientB: "Stick", result: "Rope" },
];

async function main() {
	for (const item of items) {
		await prisma.item.upsert({
			where: { name: item.name },
			update: {},
			create: item,
		});
	}

	for (const recipe of recipes) {
		const existing = await prisma.recipe.findFirst({
			where: {
				ingredientA: recipe.ingredientA,
				ingredientB: recipe.ingredientB,
				result: recipe.result,
			},
		});

		if (!existing) {
			await prisma.recipe.create({
				data: recipe,
			});
		}
	}

	console.log("Seeding complete");
}

main()
	.catch((e) => {
		console.error("Seeding error:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
