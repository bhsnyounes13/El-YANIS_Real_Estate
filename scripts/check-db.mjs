/**
 * Vérifie si quelque chose écoute sur localhost:5432 (PostgreSQL attendu).
 * Usage : npm run check:db
 */
import net from "node:net";

const host = "127.0.0.1";
const port = Number(process.env.PG_CHECK_PORT ?? process.env.PGPORT ?? "5432") || 5432;

const socket = net.createConnection({ host, port }, () => {
  console.log(`OK — port ${port} ouvert sur ${host} (PostgreSQL probable).`);
  socket.end();
  process.exit(0);
});

socket.setTimeout(4000, () => {
  socket.destroy();
  console.error(`
Nothing is listening on ${host}:${port}.

PostgreSQL installed locally (no Docker):
  1. Start the PostgreSQL service (Windows Services / pg_ctl / your OS).
  2. Create database and user matching DATABASE_URL in .env (see .env.example).
  3. Run: npm run db:setup

Optional — Postgres via Docker:
  npm run db:setup:docker
`);
  process.exit(1);
});

socket.on("error", () => {
  socket.destroy();
  console.error(`Connexion refusée sur ${host}:${port}.`);
  process.exit(1);
});
