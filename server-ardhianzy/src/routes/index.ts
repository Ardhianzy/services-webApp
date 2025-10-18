import { Router } from "express";

import authRoutes from "./auth_routes";
import totRoutes from "./ToT_routes";
import shopRoutes from "./shop";
import megazine from "./megazine";
import researchRoutes from "./research";
import MonologuesHandler from "./monologues";
import articelRoutes from "./articel";
import totMetaRoutes from "./tot_meta";

const router = Router();

router.use("/auth", authRoutes);
router.use("/ToT", totRoutes);
router.use("/shop", shopRoutes);
router.use("/megazine", megazine);
router.use("/research", researchRoutes); //ini tuh nanti ada file pdf nya
router.use("/monologues", MonologuesHandler);
router.use("/articel", articelRoutes);
router.use("/tot-meta", totMetaRoutes);

export default router;
