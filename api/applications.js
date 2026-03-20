import express from "express";
const router = express.Router();
export default router;

import requireUser from "#middleware/requireUser";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  getApplicationByUserId,
  updateApplicationById,
  deleteApplicationById,
} from "#db/queries/applications";

router.use(requireUser);

router.post("/", async (req, res, next) => {
  try {
    const application = await createApplication(req.body);
    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const applications = await getAllApplications();
    res.json({ applications });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const application = await getApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json({ application });
  } catch (err) {
    next(err);
  }
});

router.get("/user/:userId", async (req, res, next) => {
  try {
    const applications = await getApplicationByUserId(req.params.userId);
    res.json({ applications });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const application = await updateApplicationById(req.params.id, req.body);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json({ application });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const application = await deleteApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json({ application });
  } catch (err) {
    next(err);
  }
});
