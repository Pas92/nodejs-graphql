import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { memberTypeEnum } from './member-type.schema';

export type CreateProfileDTO = Omit<ProfileEntity, 'id'>;
export type ChangeProfileDTO = Partial<Omit<ProfileEntity, 'id' | 'userId'>>;

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
      type: GraphQLID,
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
      type: GraphQLID,
    },
  }),
});
