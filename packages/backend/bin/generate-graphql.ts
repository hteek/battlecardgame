#!/usr/bin/env node
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { printSchemaWithDirectives } from '@graphql-tools/utils';

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const schema = loadSchemaSync([join(__dirname, '../types.graphql'), join(__dirname, '../cdk.out/schema.*.graphql')], {
  loaders: [new GraphQLFileLoader()],
  typeDefs: [],
});
writeFileSync(join(__dirname, '../../frontend/schema.graphql'), printSchemaWithDirectives(schema));
