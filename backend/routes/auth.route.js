import express from "express"
import { signin, signOut, signup } from "../controller/auth.controller.js"
import { isAuthenticated } from "../middleware/auth.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.get("/signout", isAuthenticated, signOut)

export default router
