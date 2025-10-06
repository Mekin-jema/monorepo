import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { isAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/", createProduct);
router.put("/:id", isAdmin, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
