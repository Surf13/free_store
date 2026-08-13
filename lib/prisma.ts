import { PrismaClient } from "@prisma/client";
import { Signer } from "@aws-sdk/rds-signer";

const HOST =
  "database-products.cluster-ck7oc204czjj.us-east-1.rds.amazonaws.com";

const REGION = "us-east-1";
const PORT = 5432;
const USERNAME = "webstore";
const DATABASE = "postgres";

// IAM tokens are valid for 15 minutes.
// Refresh before expiration.
const TOKEN_REFRESH_MS = 10 * 60 * 1000;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaCreatedAt?: number;
};

async function createPrismaClient(): Promise<PrismaClient> {
  console.log("Generating RDS IAM authentication token...");

  const signer = new Signer({
    region: REGION,
    hostname: HOST,
    port: PORT,
    username: USERNAME,
  });

  const token = await signer.getAuthToken();

  const databaseUrl =
    `postgresql://${USERNAME}:${encodeURIComponent(token)}` +
    `@${HOST}:${PORT}/${DATABASE}` +
    `?sslmode=require&connection_limit=1`;

  console.log("Creating Prisma client with IAM authentication...");

  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
}

export async function getPrisma(): Promise<PrismaClient> {
  const now = Date.now();

  // Reuse the existing client while its IAM token is still fresh.
  if (
    globalForPrisma.prisma &&
    globalForPrisma.prismaCreatedAt &&
    now - globalForPrisma.prismaCreatedAt < TOKEN_REFRESH_MS
  ) {
    return globalForPrisma.prisma;
  }

  // Disconnect an old client before replacing it.
  if (globalForPrisma.prisma) {
    try {
      await globalForPrisma.prisma.$disconnect();
    } catch {
      // Ignore disconnect errors while refreshing.
    }

    globalForPrisma.prisma = undefined;
    globalForPrisma.prismaCreatedAt = undefined;
  }

  const prisma = await createPrismaClient();

  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaCreatedAt = now;

  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect();

    globalForPrisma.prisma = undefined;
    globalForPrisma.prismaCreatedAt = undefined;
  }
}