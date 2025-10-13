import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller";
import { isAdmin, isAuthenticated } from "@repo/auth";

const router: Router = Router();

router.post("/", isAuthenticated,  createCategory);
router.put("/:id", isAuthenticated, isAdmin, updateCategory);
router.delete("/:id", isAuthenticated, isAdmin, deleteCategory);
router.get("/", isAuthenticated, getCategories);

export default router;
