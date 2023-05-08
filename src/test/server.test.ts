import request from 'supertest';
import server from '../server';


afterAll((done: jest.DoneCallback) => {
    server.close(done);
});

describe('Test endpoints', () => {

    test('It should response the GET method', async () => {
        const response = await request(server).get('/');
        expect(response.statusCode).toBe(200);
    });

    describe('Calling database', () => {

        test('Make database query and return 404', async () => {
            const response = await request(server).get('/users/100');
            expect(response.statusCode).toBe(404);
        });

        test('Make database query for existing user', async () => {
            const response = await request(server).get('/users/1');
            expect(response.statusCode).toBe(200);
        });

    })

});
