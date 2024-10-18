import { prisma } from "@/lib/prisma";

export async function registerUser(email: string) {
  const invite = await prisma.pendingUser.findUnique({ where: { email } });

  if (!invite) {
    throw new Error("Convite não encontrado.");
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      role: "BASIC",
      company_id: invite.company_id,
    },
  });

  await prisma.pendingUser.delete({ where: { email } });

  console.log("Usuário registrado e vinculado à companhia.");
  return newUser;
}
