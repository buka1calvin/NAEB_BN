import { Router } from "express";
import upload from "../../config/multer";
import {
  createApplication,
  getApplications,
  updateApplicationStatus,
} from "../../controllers/application.controller";

const router = Router();

router.post("/", upload.single("licenceCopy"), createApplication);
router.patch("/:id", updateApplicationStatus);
router.get('/',getApplications)
export default router;
