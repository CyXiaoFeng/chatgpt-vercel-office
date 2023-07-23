// import { sql } from "@vercel/postgres"
import { createPool } from "@vercel/postgres"
// eslint-disable-next-line @typescript-eslint/naming-convention
const POSTGRES_URL = import.meta.env.POSTGRES_URL
const pool = createPool({
  connectionString: POSTGRES_URL
})
export const Users = async () => {
  const { rows } = await pool.sql`SELECT * FROM users;`
  return rows
}

export const User = async (pwd: string) => {
  const { rows } = await pool.sql`SELECT * FROM users WHERE pwd = ${pwd};`
  if (rows !== null && rows.length > 0) return rows[0]
}
