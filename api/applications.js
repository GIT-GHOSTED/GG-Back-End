import express from "express";
import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";

import {
  createApplication,
  getAllApplications,
  getApplicationById,
  getApplicationsByUserId,
  updateApplicationById,
  deleteApplicationById,
} from "../db/queries/applications.js";

const router = express.Router();
const requireFields = [
  "company",
  "role",
  "status",
  "jobUrl",
  "dateApplied",
  "notes",
  "contactName",
  "contactEmail",
  "followUpDate",
];

router.use(requireUser);

router.get("/user/:userId", async (req, res, next) => {
  const applications = await getApplicationsByUserId(req.params.userId);
  res.json({ applications });
});

router.post("/", requireBody(requireFields), async (req, res, next) => {
  const {
    company,
    role,
    status,
    jobUrl,
    dateApplied,
    notes,
    contactName,
    contactEmail,
    followUpDate,
  } = req.body;
  console.log("req.user.id", req.user.id);
  const application = await createApplication({
    userId: req.user.id,
    company: company,
    role: role,
    status: status,
    jobUrl: jobUrl,
    dateApplied: dateApplied,
    notes: notes,
    contactName: contactName,
    contactEmail: contactEmail,
    followUpDate: followUpDate,
  });
  res.status(201).json({ application });
});

router.param("id", async (req, res, next, id) => {
  const application = await getApplicationById(id);

  if (!application) return res.status(404).send("Application not found.");

  if (application.user_id !== req.user.id)
    return res
      .status(403)
      .send("You do not have permission to access this application.");

  req.application = application;
  next();
});

router.get("/", async (req, res, next) => {
  const applications = await getApplicationsByUserId(req.user.id);
  res.json({ applications });
});

router.get("/:id", async (req, res, next) => {
  res.json({ application: req.application });
});

router.put(
  "/:id",
  requireBody([
    "company",
    "role",
    "status",
    "dateApplied",
    "notes",
    "contactName",
    "contactEmail",
    "followUpDate",
  ]),
  async (req, res, next) => {
    const {
      company,
      role,
      status,
      dateApplied,
      notes,
      contactName,
      contactEmail,
      followUpDate,
    } = req.body;
    const updatedApp = await updateApplicationById(req.params.id, {
      company: company,
      role: role,
      status: status,
      dateApplied: dateApplied,
      notes: notes,
      contactName: contactName,
      contactEmail: contactEmail,
      followUpDate: followUpDate,
    });
    res.json({ updatedApp });
  },
);

router.delete("/:id", async (req, res, next) => {
  const deletedApp = await deleteApplicationById(req.params.id);
  res.json({ deletedApp });
});

export default router;
