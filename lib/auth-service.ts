import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const syncUser = async () => {
  const self = await currentUser();
  if (!self) throw new Error("Unauthorized");

  let user = await db.user.findUnique({
    where: { externalUserId: self.id },
    include: { stream: true },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        externalUserId: self.id,
        username: self.username ?? `user_${self.id.slice(0, 6)}`,
        email: self.emailAddresses[0].emailAddress,
        imageUrl: self.imageUrl,
        stream: {
          create: {
            title: `${self.username}'s stream`,
          },
        },
      },
      include: { stream: true },
    });
  }

  return user;
};

export const getSelf = async () => {
  const self = await currentUser();
  if (!self) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { externalUserId: self.id },
    include: { stream: true },
  });

  if (!user) throw new Error("User not found");

  return user;
};

export const getSelfByUsername = async (username: string) => {
  const self = await currentUser();
  if (!self) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { username },
    include: { stream: true },
  });

  if (!user) throw new Error("User not found");

  if (user.externalUserId !== self.id) {
    throw new Error("Unauthorized");
  }

  return user;
};
