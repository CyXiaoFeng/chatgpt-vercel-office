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

export const deleteUsers = async (id: string) => {
  const rlt = await pool.sql`DELETE FROM users WHERE id = ${id};`
  return rlt
}

export const listUsers = async () => {
  const { rows } = await pool.sql`SELECT * FROM users;`
  return rows
}

export const insertUser = async (newuser: any) => {
  const rlt =
    await pool.sql`Insert into users (name,pwd,createTime,expireTime,apikey,wechat)
     values(${newuser.name},${newuser.pwd},${newuser.createTime},${newuser.expireTime},${newuser.apikey},${newuser.wechat});`
  return rlt
}
