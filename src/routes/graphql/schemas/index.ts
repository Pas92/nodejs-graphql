import { GraphQLSchema } from 'graphql';
import { memberType } from './member-type.schema';
import { mutationType } from './mutation';
import { profileType } from './profile.schema';
import { queryType } from './query';
import { userType } from './user.schema';

export const schema = new GraphQLSchema({
  query: queryType,
  types: [memberType, userType, profileType],
  mutation: mutationType,
});
