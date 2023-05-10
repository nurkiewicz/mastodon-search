import request from 'supertest';
import {appBuilder, pool} from '../server';
import {PostgreSqlContainer} from "testcontainers";
import {StartedPostgreSqlContainer} from "testcontainers/dist/src/modules/postgresql/postgresql-container";
import {Express} from "express";


let container: StartedPostgreSqlContainer;
let app: Express;

beforeAll(async () => {
    container = await new PostgreSqlContainer().start();
    app = appBuilder({
        user: container.getUsername(),
        host: container.getHost(),
        database: container.getDatabase(),
        password: container.getPassword(),
        port: container.getPort(),
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    })
})

afterAll(async () => {
    await pool.end();
    await container.stop();
});

describe('Test endpoints', () => {

    test('It should response the GET method', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    describe('Calling database', () => {

        test('Make database query and return 404', async () => {
            const response = await request(app).get('/users/100');
            expect(response.statusCode).toBe(404);
        });

        test('Make database query for existing user', async () => {
            const response = await request(app).get('/users/1');
            expect(response.statusCode).toBe(200);
        });

    })

});
