/* eslint-disable max-nested-callbacks */
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import supertest, { SuperTest, Test } from "supertest";
import faker from "@faker-js/faker";
import Application from "@/application";
import { clearDatabase } from "@/utils/helpers/clearDatabase";
import { loadFixtures } from "@/utils/helpers/loadFixture";
import { subscribe } from "@/utils/helpers/graphqlWSClient";
import { KafkaPubSub } from "graphql-kafkajs-subscriptions";
import config from "@/config";

const port = 8080;

let request: SuperTest<Test>;
let app: Application;
let em: EntityManager<IDatabaseDriver<Connection>>;
let pubSub: KafkaPubSub;

describe("Post tests", () => {
    let client;
    beforeAll(async () => {
        app = new Application(port);
        const { pubsub } = await app.init();
        pubSub = pubsub;
        em = app.orm.em.fork();

        request = supertest(app.server);
    });

    beforeEach(async () => {
        await clearDatabase(app.orm);
        await loadFixtures(em);
    });

    afterAll(async () => {
        app.orm.close();
        app.server.close();
    });

    describe("getPosts query", () => {
        it("should get all posts", async () => {
            const response = await request
                .post("/graphql")
                .send({
                    query: `query {
                    getPosts(sortBy: "createdAt") {
                      id title userName createdAt
                    }
                  }
                `,
                })
                .expect(200);
            expect(response.body.data.getPosts).toEqual(expect.toBeArray());
        });
    });

    describe("subscription query", () => {
        // let client;

        // beforeAll(async () => {
        //     client = getWSClient(port);
        // });
        it("should get new posts", async () => {
            const newPost = {
                userName: faker.name.findName(),
                title: faker.lorem.sentences(2),
            };
            const query = `subscription{
                newPosts{
                  createdAt
                  updatedAt
                  title
                  userName
                }
              }`;

            const subscription = subscribe({ query });
            // console.log(pubSub);
            await pubSub.publish(config.graphqlChannels.NEW_POST, JSON.stringify(newPost));
            subscription.unsubscribe();
            console.log(subscription);
            // expect(subscription.events.length).toBe(1);
        });
    });
});
