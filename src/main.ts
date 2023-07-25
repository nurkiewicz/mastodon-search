import {appBuilder} from './server'
import {PoolConfig} from "pg";
import {default as EventSource} from "eventsource";

import {sendMessage, consumeMessages, EventType} from "./kafka"

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
        eventSource.onopen = () => console.log("Connected to Mastodon SSE");

        function parse(type: EventType, e: MessageEvent<any>) {
            sendMessage('raw_toots', type, e.data);
        }

        consumeMessages('raw_toots');

        ['update', 'delete', 'status.update'].forEach(type =>
            eventSource.addEventListener(type, e => parse(type as EventType, e))
        );
        console.log(`Server running at http://localhost:${port}`);
    }));