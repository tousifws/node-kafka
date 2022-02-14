import { cleanEnv, str, url } from "envalid";

const env = cleanEnv(process.env, {
    NODE_ENV: str({
        choices: ["development", "test", "production", "staging"],
    }),
    API_BASE_URL: url({ default: "http://localhost" }),
});

export default {
    env,
    graphqlChannels: {
        NEW_POST: "NEW_POST",
    },
};
