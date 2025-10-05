import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller";
import { isAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/", isAdmin, createCategory);
router.put("/:id", isAdmin, updateCategory);
router.delete("/:id", isAdmin, deleteCategory);
router.get("/", getCategories);

export default router;
