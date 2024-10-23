import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  // Define o schema de validação para o corpo da requisição
  const authenticateBodySchema = z.object({
    email: z.string().email(),
  });

  const { email } = authenticateBodySchema.parse(request.body);

  try {
    // Verifica se o usuário existe no banco de dados
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return reply.status(401).send({ error: "User not found" });
    }

    // Gera o token JWT
    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id } }
    );

    // Gera o refresh token com expiração curta
    const refreshToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: "7d" } }
    );

    // Define o cookie do refresh token
    reply.setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true, // Use true se estiver em produção (HTTPS)
      sameSite: true,
      httpOnly: true,
    });

    // Retorna o token, refresh token e dados do usuário
    return reply.status(200).send({
      user,
      token,
      refreshToken,
    });
  } catch (err) {
    console.error("Erro na autenticação:", err);
    return reply.status(500).send({ message: "Erro interno do servidor." });
  }
}
