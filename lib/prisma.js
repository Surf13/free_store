const { PrismaClient } = require("@prisma/client");
const { Signer } = require("@aws-sdk/rds-signer");

const HOST =
  "database-products.cluster-ck7oc204czjj.us-east-1.rds.amazonaws.com";

const REGION = "us-east-1";
const USERNAME = "webstore";
const DATABASE = "postgres";
const PORT = 5432;

let prisma = null;

async function createPrismaClient() {
  console.log("🔑 Generating fresh RDS IAM token...");

  const signer = new Signer({
    region: REGION,
    hostname: HOST,
    port: PORT,
    username: USERNAME,
  });

  const token = await signer.getAuthToken();

  const databaseUrl =
    `postgresql://${USERNAME}:${encodeURIComponent(token)}` +
    `@${HOST}:${PORT}/${DATABASE}?sslmode=require`;

  process.env.DATABASE_URL = databaseUrl;

  console.log("🚀 Creating Prisma client...");

  const client = new PrismaClient();

  await client.$connect();

  console.log("✅ Prisma connected to RDS using IAM");

  return client;
}

async function getPrisma() {
  if (!prisma) {
    prisma = await createPrismaClient();
  }

  return prisma;
}

async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    console.log("🔌 Prisma disconnected");
  }
}

module.exports = {
  getPrisma,
  disconnectPrisma,
};