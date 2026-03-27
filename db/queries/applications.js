import db from "../client.js";

export async function createApplication(app) {
  const sql = `
  INSERT INTO applications
    (user_id, company, role, status, job_url, date_applied, notes, contact_name, contact_email, followup_date)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *;
  `;

  const {
    rows: [application],
  } = await db.query(sql, [
    app.userId,
    app.company,
    app.role,
    app.status,
    app.jobUrl,
    app.dateApplied,
    app.notes,
    app.contactName,
    app.contactEmail,
    app.followUpDate,
  ]);

  return application;
}

export async function getAllApplications() {
  const sql = `
  SELECT *
  FROM applications
  ORDER BY created_at DESC
  `;
  const { rows: applications } = await db.query(sql);
  return applications;
}

export async function getApplicationById(appId) {
  const sql = `
  SELECT *
  FROM applications
  WHERE id = $1
  `;
  const {
    rows: [application],
  } = await db.query(sql, [appId]);
  return application;
}

export async function deleteApplicationById(appId) {
  const sql = `
  DELETE FROM applications
  WHERE id = $1
  RETURNING *
  `;
  const {
    rows: [application],
  } = await db.query(sql, [appId]);
  return application;
}

export async function updateApplicationById(appId, app) {
  const sql = `
  UPDATE applications
  SET COMPANY = $2, role = $3, status = $4, date_applied = $5, notes = $6, contact_name = $7, contact_email = $8, followup_date = $9 
  WHERE id = $1
  RETURNING *
  `;
  const {
    rows: [application],
  } = await db.query(sql, [
    appId,
    app.company,
    app.role,
    app.status,
    app.dateApplied,
    app.notes,
    app.contactName,
    app.contactEmail,
    app.followUpDate,
  ]);
  return application;
}

export async function getApplicationsByUserId(userId) {
  const sql = `
  SELECT *
  FROM applications
  WHERE user_id = $1
  ORDER BY created_at DESC
  `;
  const { rows: applications } = await db.query(sql, [userId]);
  return applications;
}
