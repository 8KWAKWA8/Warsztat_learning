/*
  Warnings:

  - A unique constraint covering the columns `[ingredientA,ingredientB,result]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Recipe_ingredientA_ingredientB_result_key" ON "Recipe"("ingredientA", "ingredientB", "result");
