import path from "path";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Manually point to the .env file in the root directory
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function main() {
  console.log("--- Starting Password Hashing ---");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in your .env file");
  }

  const users = await prisma.user.findMany();

  for (const user of users) {
    // Check if the password is already hashed (bcrypt hashes are 60 chars long)
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      console.log(`Skipping User: ${user.username} (Already hashed)`);
      continue;
    }

    // Hash the current plain text password ("12345")
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    console.log(`Updated User: ${user.username}`);
  }

  console.log("--- Finished! ---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });