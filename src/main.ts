import {appBuilder} from './server'
import {Pool, PoolConfig} from "pg";

const port = 3000;

const pool: PoolConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

appBuilder(pool)
    .listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });