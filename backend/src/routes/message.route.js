import express from "express"//prim
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();//prim

router.get("/users",protectRoute,getUsersForSidebar)
export default router;//prim