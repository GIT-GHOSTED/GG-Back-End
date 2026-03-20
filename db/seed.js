import db from "#db/client";
import { faker } from "@faker-js/faker";

import { createUser } from "./queries/users.js";
import { createApplication } from "./queries/applications.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

// create 3 users
async function seed() {
  try {
    const users = [];

    for (let i = 0; i < 3; i++) {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const user = await createUser(email, password);
      users.push(user);
    }

    // create 10 applications per user
    for (const user of users) {
      for (let i = 0; i < 10; i++) {
        const appObj = {
          user_id: user.id,
          company: faker.company.name(),
          role: faker.person.jobTitle(),
          status: "applied",
          job_url: faker.internet.url(),
          date_applied: faker.date.past(),
          notes: faker.lorem.sentence(),
          contact_name: faker.person.fullName(),
          contact_email: faker.internet.email(),
        };

        await createApplication(appObj);
      }
    }
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  }
}
