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

export async function getApplicationById(id) {
  const sql = `
  SELECT *
  FROM applications
  WHERE id = $1
  `;
  const {
    rows: [application],
  } = await db.query(sql, [id]);
  return application;
}

export async function deleteApplicationById(id) {
  const sql = `
  DELETE FROM applications
  WHERE id = $1
  RETURNING *
  `;
  const {
    rows: [application],
  } = await db.query(sql, [id]);
  return application;
}

export async function updateApplicationById(id, app) {
  const sql = `
  UPDATE applications
  SET user_id = $2, company = $3, role = $4, status = $5, job_url = $6, date_applied = $7, notes = $8, contact_name = $9, contact_email = $10
  WHERE id = $1
  RETURNING *
  `;
  const {
    rows: [application],
  } = await db.query(sql, [
    id,
    app.userId,
    app.company,
    app.role,
    app.status,
    app.jobUrl,
    app.dateApplied,
    app.notes,
    app.contactName,
    app.contactEmail,
  ]);
  return application;
}

export async function getApplicationsByUserId(id) {
  const sql = `
  SELECT *
  FROM applications
  WHERE user_id = $1
  ORDER BY created_at DESC
  `;
  const { rows: applications } = await db.query(sql, [id]);
  return applications;
}
