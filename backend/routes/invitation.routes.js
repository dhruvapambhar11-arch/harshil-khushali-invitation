const express = require("express");
const router = express.Router();
const controller = require("../controllers/invitation.controller");

router.get("/", controller.getAll);
router.get("/:subdomain", controller.getBySubdomain);
router.post("/", controller.createInvitation);
router.put("/:id", controller.updateInvitation);

module.exports = router;
