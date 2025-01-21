import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify({ onlyCookie: true })

    const { role, sub } = request.user

    const token = await reply.jwtSign(
      { role },
      { sign: { sub, expiresIn: '15m' } }
    )

    const refreshToken = await reply.jwtSign(
      { role },
      { sign: { sub, expiresIn: '30d' } }
    )

    reply.setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: 'strict', // Melhor segurança
      httpOnly: true,
    })

    return reply.status(200).send({ token })
  
}
