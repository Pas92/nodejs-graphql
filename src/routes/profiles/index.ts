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
      const profile = fastify.db.profiles.findOne(request.id);

      if ((await profile) === null) {
        const err = fastify.httpErrors.notFound(
          `User with id ${request.id} does not exist`
        );
        reply.code(404).send(err);
        throw err;
      } else {
        return profile as Promise<ProfileEntity>;
      }
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
      const requiredFields = createProfileBodySchema.required;
      const bodyFields: Partial<typeof requiredFields> = Object.keys(
        request.body
      ) as unknown as Partial<typeof requiredFields>;

      let isInvalid: boolean = bodyFields.length === requiredFields.length;

      if (isInvalid) {
        requiredFields.forEach((e) => {
          if (!bodyFields.includes(e)) {
            isInvalid = true;
          }
        });
      }

      if (isInvalid) {
        throw fastify.httpErrors.notFound(`Incorrect Body. Field is missing`);
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
      const profile = fastify.db.profiles.findOne(request.id);
      if (profile === null) {
        const err = fastify.httpErrors.notFound(
          `User with id ${request.id} does not exist`
        );
        reply.send(err);
        throw err;
      } else {
        return fastify.db.profiles.delete(request.id);
      }
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
      const requiredFields = createProfileBodySchema.required;
      const bodyFields: Partial<typeof requiredFields> = Object.keys(
        request.body
      ) as unknown as Partial<typeof requiredFields>;

      let isInvalid: boolean = bodyFields.length === requiredFields.length;

      if (isInvalid) {
        requiredFields.forEach((e) => {
          if (!bodyFields.includes(e)) {
            isInvalid = true;
          }
        });
      }

      if (isInvalid) {
        throw fastify.httpErrors.notFound(`Incorrect Body. Field is missing`);
      }

      return fastify.db.profiles.change(request.id, request.body);
    }
  );
};

export default plugin;
