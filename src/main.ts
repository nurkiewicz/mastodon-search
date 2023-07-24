import {appBuilder} from './server'
import {PoolConfig} from "pg";
import {default as EventSource} from "eventsource";

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

appBuilder(pool).then(app =>
    app.listen(port, () => {
        const eventSource = new EventSource('https://mstdn.social/api/v1/streaming/public');
        eventSource.onerror = (err: MessageEvent<any>) => {
            console.error('Error occurred:', err);
        };
        eventSource.onopen = () => {
            console.log("Connected")
        };

        function parse(e: MessageEvent<any>) {
            const eventData = JSON.parse(e.data);
            console.log(e.type, eventData);
        }

        ['update', 'delete', 'status.update'].forEach(name =>
            eventSource.addEventListener(name, parse)
        );
        console.log(`Server running at http://localhost:${port}`);
    }));