import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { memberTypeEnum } from './member-type.schema';

export type ProfileInputType = Partial<Omit<PostEntity, 'id' | 'userId'>> &
  Required<Pick<PostEntity, 'userId'>>;

export const profileType = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    avatar: {
      type: GraphQLString,
    },
    sex: {
      type: GraphQLString,
    },
    birthday: {
      type: GraphQLString,
    },
    country: {
      type: GraphQLString,
    },
    street: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    memberTypeId: {
      type: memberTypeEnum,
    },
    userId: {
      type: GraphQLString,
    },
  }),
});

export const profileInputType = new GraphQLInputObjectType({
  name: 'profileInput',
  fields: () => ({
    avatar: {
      type: GraphQLString,
    },
    sex: {
      type: GraphQLString,
    },
    birthday: {
      type: GraphQLString,
    },
    country: {
      type: GraphQLString,
    },
    street: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    memberTypeId: {
      type: memberTypeEnum,
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});
