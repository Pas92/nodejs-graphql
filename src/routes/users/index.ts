import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = fastify.db.users.findOne(request.id);

      if ((await user) === null) {
        const err = fastify.httpErrors.notFound(
          `User with id ${request.id} does not exist`
        );
        reply.send(err);
        throw err;
      } else {
        return user as Promise<UserEntity>;
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      if (
        !request.body.email ||
        !request.body.firstName ||
        !request.body.lastName
      ) {
        const err = fastify.httpErrors.badRequest(
          `Incorrect Body. Field is missing`
        );
        reply.send(err);
        throw err;
      }

      return fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = fastify.db.users.findOne(request.id);

      if ((await user) === null) {
        const err = fastify.httpErrors.badRequest(
          `User with id ${request.id} does not exist`
        );
        reply.status(400).send(err);
        throw err;
      }

      const users = await fastify.db.users.findMany();
      users.map((user) => {
        return { ...user, subscribedToUserIds: [] };
      });
      return fastify.db.users.delete(request.id);
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne(request.id);

      if (user === null) {
        const err = fastify.httpErrors.notFound(
          `User with id ${request.id} does not exist`
        );
        reply.send(err);
        throw err;
      }

      if (!request.body.userId) {
        const err = fastify.httpErrors.badRequest(
          `Incorrect Body. Field is missing`
        );
        reply.send(err);
        throw err;
      }

      user.subscribedToUserIds.push(request.body.userId);

      return fastify.db.users.change(request.id, user);
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      if (!request.body.userId) {
        const err = fastify.httpErrors.badRequest(
          `Incorrect Body. Field is missing`
        );
        reply.send(err);
        throw err;
      }

      const user = await fastify.db.users.findOne(request.id);

      if (user === null) {
        const err = fastify.httpErrors.notFound(
          `User with id ${request.id} does not exist`
        );
        reply.send(err);
        throw err;
      }

      user.subscribedToUserIds.length = 0;

      return fastify.db.users.change(request.id, user);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne(request.id);
      if (user === null) {
        const err = fastify.httpErrors.notFound(
          `User with id ${request.id} does not exist`
        );
        reply.send(err);
        throw err;
      }

      if (
        !request.body.email ||
        !request.body.firstName ||
        !request.body.lastName
      ) {
        const err = fastify.httpErrors.badRequest(
          `Incorrect Body. Field is missing`
        );
        reply.send(err);
        throw err;
      }

      return fastify.db.users.change(request.id, request.body);
    }
  );
};

export default plugin;
