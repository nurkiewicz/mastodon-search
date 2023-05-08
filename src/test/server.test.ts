import request from 'supertest';
import {app, pool} from '../server';


afterAll(() => pool.end());

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
