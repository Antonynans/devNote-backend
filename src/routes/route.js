import express from "express";
import user from "../controller/user.js";
import form from "../controller/form.js";

const router = express.Router();

router.use("/", user);
router.use("/", form);



export default router;
