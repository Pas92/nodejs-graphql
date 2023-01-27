import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const user = fastify.db.memberTypes.findOne(request.id);

      if ((await user) === null) {
        const err = fastify.httpErrors.notFound(
          `Member with id ${request.id} does not exist`
        );
        reply.send(err);
        throw err;
      } else {
        return user as Promise<MemberTypeEntity>;
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const user = await fastify.db.memberTypes.findOne(request.id);

      if (user === null) {
        const err = fastify.httpErrors.badRequest(
          `Member with id ${request.id} does not exist`
        );
        reply.send(err);
        throw err;
      }

      user.discount = request.body.discount || user.discount;
      user.monthPostsLimit =
        request.body.monthPostsLimit || user.monthPostsLimit;

      // if (!request.body.discount || !request.body.monthPostsLimit) {
      //   throw fastify.httpErrors.notFound(`Incorrect Body. Field is missing`);
      // }

      return fastify.db.memberTypes.change(request.id, user);
    }
  );
};

export default plugin;
