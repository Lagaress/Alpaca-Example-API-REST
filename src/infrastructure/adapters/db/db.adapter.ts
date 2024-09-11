import { FieldPacket, ResultSetHeader, RowDataPacket } from 'mysql2';

import { Pool } from 'mysql2/promise';
import knexLib from 'knex';
import { Dependencies } from '../../../container';

type AllowedTypes = string | number | boolean | Date;
export type SQLQuery = {
  sql: string;
  params?: (AllowedTypes | (AllowedTypes)[])[];
};

type Row = {
  [key: string]: AllowedTypes;
};

type QueryResult = [
  RowDataPacket[], FieldPacket[]
];

type InsertResult = [ ResultSetHeader ];

type DbConfig = {
  HOST: string;
  USERNAME: string;
  PASSWORD: string;
  DATABASE: string;
}

export enum DBErrors {
  CONSTRAINT_VIOLATION = '23000',
}

export default ({ mysql2, knex }: Dependencies) => (dbConfig: DbConfig): DbAdapterInterface => {
  const pool = mysql2.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USERNAME,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
    timezone: '+00:00',
    dateStrings: true,
  }).promise();

  const db = knex({
    client: 'mysql2',
    connection: {
      host: dbConfig.HOST,
      user: dbConfig.USERNAME,
      password: dbConfig.PASSWORD,
      database: dbConfig.DATABASE,
      timezone: '+00:00',
      dateStrings: true,
    },
  });

  async function query({ sql, params = [] }: SQLQuery): Promise<QueryResult | InsertResult> {
    try {
      const res = await pool.query(sql, params);
      return res as QueryResult;
    } catch (error) {
      console.error({ error }, 'Error with the db');
      throw error;
    }
  }

  function buildInsertQuery(table: string, row: Row): SQLQuery {
    const fieldsArray = Object.keys(row).filter(key => row[key] !== undefined);
    const templateString = fieldsArray.map(() => '?').join(', ');
    return {
      sql: `INSERT INTO ${table} (${fieldsArray.join(', ')}) VALUES (${templateString})`,
      params: fieldsArray.map(key => row[key]),
    };
  }

  function buildUpdateQuery(table: string, keys: Row, row: Row): SQLQuery {
    const fieldsArray = Object.keys(row).filter(key => row[key] !== undefined);
    const updateString = fieldsArray.map(field => `${field} = ?`).join(', ');
    const conditionString = Object.keys(keys)
      .map(field => `${field} = ?`)
      .join(' AND ');

    return {
      sql: `UPDATE ${table} SET ${updateString} WHERE (${conditionString})`,
      params: fieldsArray.map(key => row[key]).concat(Object.keys(keys).map(key => keys[key])),
    };
  }

  return {
    pool,
    db,
    query,
    async findRecords(sqlQuery: SQLQuery): Promise<QueryResult[0]> {
      const [ result ] = await query(sqlQuery);
      return result as RowDataPacket[];
    },
    async closeConnection() {
      await pool.end();
    },

    async insert(table: string, rows: Row[]) {
      const ids = [];
      try {
        for (const row of rows) {
          const [ result ] = await query(buildInsertQuery(table, row)) as InsertResult;
          if (result && result.insertId) {
            ids.push(result.insertId);
          } else {
            ids.push(null);
          }
        }
        return ids;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async updateByFields(table: string, keys: Row, object: Row) {
      return query(buildUpdateQuery(table, keys, object)) as Promise<QueryResult>;
    },
  };
};

export interface DbAdapterInterface {
  pool: Pool,
  db: ReturnType<typeof knexLib>;
  closeConnection(): Promise<void>;
  query(query: SQLQuery): Promise<QueryResult | InsertResult>;
  findRecords(query: SQLQuery): Promise<QueryResult[0]>;
  insert(table: string, rows: Row[]): Promise<number[]>;
  updateByFields(table: string, keys: Row, object: Row): Promise<QueryResult>;
}
