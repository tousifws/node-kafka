// ***********************************************************
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

/// <reference types="cypress" />
import "./commands";

import "cypress-jest-adapter";
import "@cypress/code-coverage/support";
import { configure } from "@testing-library/cypress";
configure({ testIdAttribute: "data-test" });
