import { Args, Mutation, Ctx, Query, Resolver, Authorized } from 'type-graphql';

import Member from '../entities/Member';
import MemberServices from '../services/MemberServices';

import { SignInArgs, SignUpArgs } from './args/MemberArgs';

import { GlobalContext } from '../utils/GlobalContext';

@Resolver(Member)
export default class MemberResolver {
	@Mutation(() => Member)
	async signIn(
		@Args() { email, password }: SignInArgs,
		@Ctx() context: GlobalContext
	): Promise<Member> {
		const { user } = await MemberServices.signIn(email, password);

		return user;
	}

	@Authorized()
	@Query(() => Member)
	async profile(@Ctx() context: GlobalContext): Promise<Member> {
		return context.user as Member;
	}

	@Mutation(() => Member)
	async signUp(@Args() { username, email, password }: SignUpArgs): Promise<Member> {
		const { user } = await MemberServices.signUp(username, email, password);

		return user;
	}
}
