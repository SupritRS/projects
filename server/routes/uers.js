import express from "express";
import{
    getUser,
    getUserFriends,
    addRemoveFriends,

} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

/* read */
router.get("/:id", verifyToken, getUserFriends );

/* UPDATE */
router.patch("/:id/:friendID", verifyToken, addRemoveFriends)
export default router;

