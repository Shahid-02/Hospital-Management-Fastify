import { FastifyReply, FastifyRequest } from "fastify";

const authenticationUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const publicRoutes = new Set([
    "/api/v1/user/patient/register",
    "/api/v1/user/login",
  ]);

  const requestUrl = request.raw.url ?? "";

  // Allow public routes to bypass authentication
  if (publicRoutes.has(requestUrl)) {
    return;
  }

  try {
    // Get the token from cookies
    const cookie = request.headers.cookie;
    let patientToken: string | null = null;
    let adminToken: string | null = null;

    if (cookie) {
      const matchedPatient = cookie.match(/patientToken=([^;]*)/);
      const matchedAdmin = cookie.match(/adminToken=([^;]*)/);

      patientToken = matchedPatient ? matchedPatient[1] : null;
      adminToken = matchedAdmin ? matchedAdmin[1] : null;
    }

    // If neither patientToken nor adminToken is found, throw an error
    if (!patientToken && !adminToken) {
      throw new Error("Token not found");
    }

    // Attach the token to the request headers so that jwtVerify can use it
    if (adminToken) {
      request.headers.authorization = `Bearer ${adminToken}`;
    } else if (patientToken) {
      request.headers.authorization = `Bearer ${patientToken}`;
    }

    // Verify the JWT token
    await request.jwtVerify();
  } catch (error) {
    reply.code(401).send({
      message: (error as Error).message || "Unauthorized",
    });
  }
};

export default authenticationUser;
