import { Client, createClient, SubscribePayload } from "graphql-ws";
import * as ws from "ws";

// export const getWSClient = (port: number) => {
//     return createClient({
//         url: `ws://localhost:${port}/graphql`,
//         webSocketImpl: ws.WebSocket,
//         lazy: false,
//     });
// };

const port = 8080;

const subscriptionClient = createClient({
    url: `ws://localhost:${port}/graphql`,
    webSocketImpl: ws.WebSocket,
});

class Subscription {
    public events: Array<Record<string, any>>;
    public unsubscribe: () => void;
    private client: Client;

    public constructor(client: Client, payload: SubscribePayload) {
        this.events = [];
        this.client = client;
        this.unsubscribe = client.subscribe(payload, {
            next: this.next,
            error: this.error,
            complete: this.complete,
        });
    }

    private complete = () => {
        this.unsubscribe();
    };

    private next = (event: Record<string, any>) => {
        // events come down in the format of
        // { data: <subscriptionName> : event }
        this.events.push(event.data);
    };

    private error = (err: Error) => {
        console.error(err.message);
        throw err;
    };
}

async function execute(client: Client, payload: SubscribePayload) {
    return new Promise((resolve, reject) => {
        let result;

        client.subscribe(payload, {
            next: (data) => {
                result = data;
                return data;
            },
            error: reject,
            complete: () => resolve(result),
        });
    });
}

export function subscribe(payload: SubscribePayload) {
    return new Subscription(subscriptionClient, payload);
    // return execute(subscriptionClient, payload);
}
