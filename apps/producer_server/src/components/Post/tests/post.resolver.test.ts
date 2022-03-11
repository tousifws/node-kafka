import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import supertest, { SuperTest, Test } from "supertest";
import Application from "@/application";
import createSimpleUuid from "@/utils/helpers/createSimpleUuid";
import { clearDatabase } from "@/utils/helpers/clearDatabase";
import { loadFixtures } from "@/utils/helpers/loadFixture";

let request: SuperTest<Test>;
let app: Application;
let em: EntityManager<IDatabaseDriver<Connection>>;

describe("PostResolver tests", () => {
    beforeAll(async () => {
        app = new Application();
        await app.init();

        em = app.orm.em.fork();

        request = supertest(app.server);
    });

    beforeEach(async () => {
        await clearDatabase(app.orm);
        await loadFixtures(em);
    });

    afterAll(async () => {
        app.server.close();
    });

    it("should get posts", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `query {
                    getPosts {
                      id title userName createdAt
                    }
                  }
                `,
            })
            .expect(200);
        expect(response.body.data.getPosts).toEqual(expect.toBeArray());
    });
});
