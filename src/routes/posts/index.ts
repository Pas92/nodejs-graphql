import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = fastify.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if ((await post) === null) {
        const err = fastify.httpErrors.notFound(
          `Post with id ${request.id} does not exist`
        );
        reply.send(err);
        throw err;
      } else {
        return post as Promise<PostEntity>;
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      if (!request.body.content || !request.body.title) {
        const err = fastify.httpErrors.badRequest(
          `Incorrect Body. Field is missing`
        );
        reply.send(err);
        throw err;
      }

      return fastify.db.posts.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (post === null) {
        const err = fastify.httpErrors.badRequest(
          `Post with id ${request.params.id} does not exist`
        );
        reply.send(err);
        throw err;
      }
      return fastify.db.posts.delete(request.params.id);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (post === null) {
        const err = fastify.httpErrors.badRequest(
          `Post with id ${request.params.id} does not exist`
        );
        reply.send(err);
        throw err;
      }

      return fastify.db.posts.change(request.params.id, request.body);
    }
  );
};

export default plugin;
