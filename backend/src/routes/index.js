import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import transactionRoutes from "./transaction.routes.js";
import categoryRoutes from "./category.routes.js";
import receiptRoutes from "./receipt.routes.js";

const router = Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);
router.use("/categories", categoryRoutes);
router.use("/receipts", receiptRoutes);

export default router;