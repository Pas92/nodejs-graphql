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
      const user = fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if ((await user) === null) {
        const err = fastify.httpErrors.notFound(
          `User with id ${request.params.id} does not exist`
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
      // if (
      //   !request.body.email ||
      //   !request.body.firstName ||
      //   !request.body.lastName
      // ) {
      //   const err = fastify.httpErrors.badRequest(
      //     `Incorrect Body. Field is missing`
      //   );
      //   reply.send(err);
      //   throw err;
      // }

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
      const user = fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if ((await user) === null) {
        const err = fastify.httpErrors.badRequest(
          `User with id ${request.params.id} does not exist`
        );
        reply.status(400).send(err);
        throw err;
      }

      const users = await fastify.db.users.findMany();
      users.map(async (user) => {
        const newUserData = {
          ...user,
          subscribedToUserIds: user.subscribedToUserIds.filter(
            (id) => id !== request.params.id
          ),
        };

        await fastify.db.users.change(newUserData.id, newUserData);

        return newUserData;
      });

      const posts = await fastify.db.posts.findMany();
      posts.filter(async (post) => {
        if (post.userId === request.params.id) {
          await fastify.db.posts.delete(post.id);
          return false;
        }

        return true;
      });

      const profiles = await fastify.db.profiles.findMany();
      profiles.filter(async (profile) => {
        if (profile.userId === request.params.id) {
          await fastify.db.profiles.delete(profile.id);
          return false;
        }

        return true;
      });

      return fastify.db.users.delete(request.params.id);
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
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (user === null) {
        const err = fastify.httpErrors.badRequest(
          `User with id ${request.body.userId} does not exist`
        );
        reply.send(err);
        throw err;
      }

      const user2 = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (user2 === null) {
        const err = fastify.httpErrors.badRequest(
          `User with id ${request.params.id} does not exist`
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

      user.subscribedToUserIds.push(request.params.id);

      return fastify.db.users.change(request.body.userId, user);
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

      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      const user2 = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (user === null) {
        const err = fastify.httpErrors.badRequest(
          `User with id ${request.params.id} does not exist`
        );
        reply.send(err);
        throw err;
      }

      if (user2 === null) {
        const err = fastify.httpErrors.badRequest(
          `User with id ${request.body.userId} does not exist`
        );
        reply.send(err);
        throw err;
      }

      if (!user2.subscribedToUserIds.includes(request.params.id)) {
        const err = fastify.httpErrors.badRequest(
          `User with id ${request.params.id} does not follow to user with id ${request.body.userId}  exist`
        );
        reply.send(err);
        throw err;
      }
      user2.subscribedToUserIds = user2.subscribedToUserIds.filter(
        (id) => id !== request.params.id
      );

      return fastify.db.users.change(request.body.userId, user2);
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
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (user === null) {
        const err = fastify.httpErrors.badRequest(
          `User with id ${request.params.id} does not exist`
        );
        reply.send(err);
        throw err;
      }

      return fastify.db.users.change(request.params.id, request.body);
    }
  );
};

export default plugin;
