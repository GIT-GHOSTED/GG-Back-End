import db from "#db/client";

export async function createApplication(appObj) {
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
    appObj.user_id,
    appObj.company,
    appObj.role,
    appObj.status,
    appObj.jobUrl,
    appObj.dateApplied,
    appObj.notes,
    appObj.contactName,
    appObj.contactEmail,
    appObj.followUpDate,
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

export async function updateApplicationById(id, appObj) {
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
    appObj.user_id,
    appObj.company,
    appObj.role,
    appObj.status,
    appObj.job_url,
    appObj.date_applied,
    appObj.notes,
    appObj.contact_name,
    appObj.contact_email,
  ]);
  return application;
}

export async function getApplicationByUserId(id) {
  const sql = `
  SELECT *
  FROM applications
  WHERE user_id = $1
  ORDER BY created_at DESC
  `;
  const { rows: applications } = await db.query(sql, [id]);
  return applications;
}
