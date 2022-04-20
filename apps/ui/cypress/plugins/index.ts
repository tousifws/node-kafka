/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import * as fs from "fs";
import * as autoRecord from "cypress-autorecord/plugin";
import * as coverage from "@cypress/code-coverage/task";
import { startDevServer } from "@cypress/vite-dev-server";

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config

    if (config.testingType === "component") {
        on("dev-server:start", async (options) =>
            startDevServer({
                options,
            })
        );
    }

    autoRecord(on, config, fs);
    coverage(on, config);

    return config;
};