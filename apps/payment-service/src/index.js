import { serve } from '@hono/node-server';
import { Hono } from 'hono';
const app = new Hono();
app.get('/', (c) => {
    return c.text('Payment endpoint is working!');
});
serve({
    fetch: app.fetch,
    port: 3004
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
