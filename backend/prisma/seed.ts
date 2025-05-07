import prisma from "../src/prismaClient";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      email: "test@example.com",
      username: "testuser",
      password: hashedPassword,
      profile: {
        create: {
          bio: "This is a test bio",
          hobbies: "Reading, Coding",
          socialLinks: {
            twitter: "https://twitter.com/testuser",
            github: "https://github.com/testuser",
          },
          customHtml: "<p>Welcome to my profile!</p>",
          theme: "light",
        },
      },
    },
  });

  console.log("User with profile created!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
