import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true })

    const { role, sub } = request.user

    const token = await reply.jwtSign(
      { role },
      { sign: { sub, expiresIn: '20s' } }
    )

    const refreshToken = await reply.jwtSign(
      { role },
      { sign: { sub, expiresIn: '20s' } }
    )

    reply.setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: 'strict', // Melhor segurança
      httpOnly: true,
    })

    return reply.status(200).send({ token })
  } catch (error) {
    return reply.status(401).send({ error: 'Token inválido ou expirado.' })
  }
}
