import db from "./client.js";
import { createUser } from "./queries/users.js";
import { createApplication } from "./queries/applications.js";
import { faker } from "@faker-js/faker";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

// Helper to enforce length constraints
function limit(str, max) {
  if (!str) return str;
  return str.length > max ? str.slice(0, max) : str;
}

// create users + applications
async function seed() {
  try {
    const users = [];
    const LIMITS = {
      email: 64,
      password: 64,
      company: 32,
      role: 32,
      jobUrl: 255,
      notes: 255,
      contactName: 64,
      contactEmail: 64,
    };

    // create 3 users
    for (let i = 0; i < 3; i++) {
      const email = limit(faker.internet.email(), LIMITS.email);
      const password = limit(faker.internet.password(), LIMITS.password);

      const user = await createUser(email, password);
      users.push(user);
    }

    // create 10 applications per user
    for (const user of users) {
      for (let i = 0; i < 10; i++) {
        const app = {
          user_id: user.id,
          company: limit(faker.company.name(), LIMITS.company),
          role: limit(faker.person.jobTitle(), LIMITS.role),
          status: "applied",
          job_url: limit(faker.internet.url(), LIMITS.job_url),
          date_applied: faker.date.past(),
          notes: limit(faker.lorem.sentence(), LIMITS.notes),
          contactName: limit(faker.person.fullName(), LIMITS.contactName),
          contactEmail: limit(faker.internet.email(), LIMITS.contactEmail),
        };

        await createApplication(app);
      }
    }
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  }
}
