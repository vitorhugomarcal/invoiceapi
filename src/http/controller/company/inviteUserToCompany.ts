import { prisma } from "@/lib/prisma";

export async function inviteUserToCompany(email: string, companyId: string, invitedById: string) {
  const existingInvite = await prisma.pendingUser.findUnique({ where: { email } });

  if (existingInvite) {
    throw new Error("Usuário já foi convidado.");
  }

  await prisma.pendingUser.create({
    data: {
      email,
      company_id: companyId,
      invited_by: invitedById,
    },
  });
  console.log("Convite enviado.");
}
