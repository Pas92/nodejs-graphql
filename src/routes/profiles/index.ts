import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if ((await profile) === null) {
        const err = fastify.httpErrors.notFound(
          `Profile with id ${request.params.id} does not exist`
        );
        reply.send(err);
        throw err;
      }

      return profile as Promise<ProfileEntity>;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      // const requiredFields = createProfileBodySchema.required;
      // const bodyFields: Partial<typeof requiredFields> = Object.keys(
      //   request.body
      // ) as unknown as Partial<typeof requiredFields>;

      // let isInvalid: boolean = bodyFields.length === requiredFields.length;

      // if (isInvalid) {
      //   requiredFields.forEach((e) => {
      //     if (!bodyFields.includes(e)) {
      //       isInvalid = true;
      //     }
      //   });
      // }

      // if (isInvalid) {
      //   const err = fastify.httpErrors.badRequest(
      //     `Incorrect Body. Field is missing`
      //   );
      //   reply.send(err);
      //   throw err;
      // }

      const profile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: request.body.userId,
      });

      if (profile) {
        const err = fastify.httpErrors.badRequest(
          `User is already has a profile`
        );
        reply.send(err);
        throw err;
      }

      if (request.body.memberTypeId !== 'basic') {
        const err = fastify.httpErrors.badRequest(`Invalid member type`);
        reply.send(err);
        throw err;
      }
      return fastify.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (profile === null) {
        const err = fastify.httpErrors.badRequest(
          `User with id ${request.params.id} does not exist`
        );
        reply.send(err);
        throw err;
      }

      return fastify.db.profiles.delete(request.params.id);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (profile === null) {
        const err = fastify.httpErrors.badRequest(
          `Profile with id ${request.params.id} does not exist`
        );
        reply.send(err);
        throw err;
      }

      return fastify.db.profiles.change(request.params.id, request.body);
    }
  );
};

export default plugin;
