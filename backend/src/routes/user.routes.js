import {Router} from "express";
import {login , register , addToHistory , getUserHistory ,getUser} from '../controllers/user.controller.js'
const router = Router();
router.route("/login").post(login);  //creating a post request on login with function as value
router.route('/register').post(register);
router.route("/add_to_activity").post(addToHistory);
router.route("/get_all_activity").get(getUserHistory);
router.route("/getUser").get(getUser);

export default router;