import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()

  const { sub } = request.user as { sub: string }

  const user = await prisma.user.findUnique({
    where: {
      id: sub,
    },
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}