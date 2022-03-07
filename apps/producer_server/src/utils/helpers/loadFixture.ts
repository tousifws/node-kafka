import { MikroORM } from "@mikro-orm/core";
import faker from "@faker-js/faker";
import { Post } from "@/components/Post/post.entity";
import createSimpleUuid from "@/utils/helpers/createSimpleUuid";

export const loadFixtures = async (orm: MikroORM): Promise<void> => {
    try {
        const posts = await Promise.all(
            [...Array.from({ length: 5 })].map(async (_, index) => {
                const user = new Post({
                    userName: `user ${index + 1}`,
                    title: faker.lorem.sentences(2),
                });

                // Setting temporary id for test purposes
                user.id = createSimpleUuid(index + 1);

                await orm.em.persist(user);
                return user;
            })
        );

        await orm.em.flush();
    } catch (error) {
        console.error("📌 Could not load fixtures", error);
    }
};
