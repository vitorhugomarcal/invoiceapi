import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma"; // Assumindo que você usa Prisma para interagir com o banco

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Pega o ID do usuário autenticado do token JWT (sub é o subject, que é o user.id)
    const userId = request.user.sub;

    // Busca o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, company_id:true, createdAt: true },
    });

    if (!user) {
      return reply.status(404).send({ message: "Usuário não encontrado." });
    }

    // Retorna as informações do usuário
    return reply.status(200).send({ user });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return reply.status(500).send({ message: "Erro interno do servidor." });
  }
}
