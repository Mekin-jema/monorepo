import { productPrisma,productType } from "@repo/db";
import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
  const data: productType.Prisma.CategoryCreateInput = req.body;

  const category = await productPrisma.category.create({ data });
  res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: productType.Prisma.CategoryUpdateInput = req.body;
  console.log("Updating category with data:", data);

  const category = await productPrisma.category.update({
    where: { id },
    data,
  });

  return res.status(200).json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await productPrisma.category.delete({
    where: { id }
  });

  return res.status(200).json(category);
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await productPrisma.category.findMany();

  return res.status(200).json(categories);
};
