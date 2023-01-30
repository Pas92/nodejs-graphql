import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql } from 'graphql';
import { graphqlBodySchema } from './schema';
import { schema } from './schemas';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const response = await graphql({
        schema: schema,
        source: request.body.query!,
        contextValue: {
          db: fastify.db,
        },
        variableValues: request.body.variables,
      });

      console.log(request.body.variables);
      console.log(request.body.query);
      reply.send(response);
    }
  );
};

export default plugin;
