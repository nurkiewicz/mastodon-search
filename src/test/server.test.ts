import request from 'supertest';
import {appBuilder, pool} from '../server';
import {DockerComposeEnvironment, StartedDockerComposeEnvironment} from "testcontainers";
import {Express} from "express";


let environment: StartedDockerComposeEnvironment | null;
let app: Express;

beforeAll(async () => {
    environment = await new DockerComposeEnvironment('.', 'docker-compose.yml').up();
    const container = environment.getContainer("masearch_postgres");
    app = await appBuilder({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: container.getMappedPort(5432),
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    })
}, 60000);

afterAll(async () => {
    await pool.end();
    await environment?.stop();
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
