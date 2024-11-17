// import * as express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";

import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers/index";
import * as express from "express";

// Step 1: Define GraphQL schema
const schema = buildSchema(typeDefs);

const app = express();

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: resolvers,
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});
