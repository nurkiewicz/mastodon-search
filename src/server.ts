import express, {Request, Response} from 'express';
import axios from 'axios';
import fs from 'fs';

import {Pool, QueryResult} from 'pg';

// create a connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const port: number = 3000;

let server = express()
    .get('/', (req: Request, res: Response) => {
        res.send({'hello': 'world'});
    })
    .get('/users/:id', async (req: Request, res: Response) => {
        const {id} = req.params;
        try {
            const {rows} = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            if (rows.length > 0) {
                res.send(rows[0]);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error retrieving user');
        }
    })
    .get('/fetch', async (req, res) => {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
            res.json(response.data);
        } catch (error) {
            console.error('Error fetching data from API:', error);
            res.status(500).json({error: 'Error fetching data from API'});
        }
    })
    .get('/file', (req, res) => {
        const filePath = 'package.json';
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                res.status(500).json({error: 'Error reading file'});
                return;
            }
            res.send(data);
        });
    })
    .get('/numbers', (req, res) => {
        const {count} = req.query;
        const numbers = [];

        for (let i = 1; i <= Number(count); i++) {
            numbers.push(i);
        }
        res.json(numbers);
    })
    .listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

export default server;
