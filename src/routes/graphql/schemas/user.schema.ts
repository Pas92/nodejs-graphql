import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { memberType } from './member-type.schema';
import { postType } from './post.schema';
import { profileType } from './profile.schema';

export const userType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

export const userWithContentType = new GraphQLObjectType({
  name: 'userWithContent',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    profile: {
      type: profileType,
      resolve: async (source, args, context, info) => {
        return await context.db.profiles.findOne({
          key: 'userId',
          equals: source.id,
        });
      },
    },
    post: {
      type: new GraphQLList(postType),
      resolve: async (source, args, context, info) => {
        return context.db.posts
          .findMany()
          .then((posts: PostEntity[]) =>
            posts.filter((post: PostEntity) => post.userId === source.id)
          );
      },
    },
    memberType: {
      type: memberType,
      resolve: async (source, args, context, info) => {
        const profile = await context.db.profiles.findOne({
          key: 'userId',
          equals: source.id,
        });

        if (profile) {
          return context.db.memberTypes.findOne({
            key: 'id',
            equals: profile.memberTypeId,
          });
        }

        return null;
      },
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

export const userInputType = new GraphQLInputObjectType({
  name: 'userInput',
  fields: () => ({
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});
