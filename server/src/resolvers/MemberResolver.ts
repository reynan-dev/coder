import { Args, Mutation, Ctx, Query, Resolver, Authorized } from 'type-graphql';

import Member from 'entities/Member';
import MemberServices from 'services/MemberServices';

import {
	DeleteAccountArgs,
	SignInArgs,
	SignUpArgs,
	UpdateEmailArgs,
	UpdatePasswordArgs,
	UpdateUsernameArgs
} from 'resolvers/args/MemberArgs';

import { GlobalContext } from 'utils/types/GlobalContext';
import { ErrorMessages } from 'utils/enums/ErrorMessages';
import { Cookie } from 'utils/methods/Cookie';

@Resolver(Member)
export default class MemberResolver {
	@Mutation(() => Member)
	async signIn(
		@Args() { email, password }: SignInArgs,
		@Ctx() context: GlobalContext
	): Promise<Member> {
		const { user, session } = await MemberServices.signIn(email, password);

		Cookie.setSessionToken(context, session.token);
		return user;
	}
	@Mutation(() => Member)
	async signUp(@Args() { username, email, password }: SignUpArgs): Promise<Member> {
		const user = MemberServices.signUp(username, email, password);

		return user;
	}

	@Authorized()
	@Mutation(() => Boolean)
	async signOut(@Ctx() context: GlobalContext): Promise<any> {
		const token = Cookie.getSessionToken(context) as string;

		return await MemberServices.signOut(token);
	}

	@Authorized()
	@Query(() => Member)
	async profile(@Ctx() context: GlobalContext): Promise<Member> {
		return context.user as Member;
	}

	@Authorized()
	@Mutation(() => Member)
	async updateUsername(
		@Args() { username }: UpdateUsernameArgs,
		@Ctx() context: GlobalContext
	): Promise<Member> {
		const username_registered = (await MemberServices.findOneBy({ username })) as Member;

		if (username_registered) throw Error(ErrorMessages.USERNAME_ALREADY_REGISTERED_ERROR_MESSAGE);

		const user = await MemberServices.findBySessionToken(Cookie.getSessionToken(context) as string);

		if (!user) throw Error(ErrorMessages.INVALID_CREDENTIALS_ERROR_MESSAGE);

		return await MemberServices.updateUsername(user.id, username);
	}

	@Authorized()
	@Mutation(() => Member)
	async updateEmail(
		@Args() { email }: UpdateEmailArgs,
		@Ctx() context: GlobalContext
	): Promise<Member> {
		const email_registered = (await MemberServices.findOneBy({ email })) as Member;

		if (email_registered) throw Error(ErrorMessages.EMAIL_ALREADY_REGISTERED_ERROR_MESSAGE);

		const user = await MemberServices.findBySessionToken(Cookie.getSessionToken(context) as string);

		if (!user) throw Error(ErrorMessages.INVALID_CREDENTIALS_ERROR_MESSAGE);

		return await MemberServices.updateEmail(user.id, email);
	}

	@Authorized()
	@Mutation(() => Member)
	async updatePassword(
		@Args() { new_password, confirm_password, old_password }: UpdatePasswordArgs,
		@Ctx() context: GlobalContext
	): Promise<Member> {
		const user = await MemberServices.findBySessionToken(Cookie.getSessionToken(context) as string);

		if (!user) throw Error(ErrorMessages.INVALID_CREDENTIALS_ERROR_MESSAGE);

		return MemberServices.updatePassword(user.email, new_password, confirm_password, old_password);
	}

	@Authorized()
	@Mutation(() => Member)
	async deleteAccount(
		@Args() { password }: DeleteAccountArgs,
		@Ctx() context: GlobalContext
	): Promise<Member> {
		const user = await MemberServices.findBySessionToken(Cookie.getSessionToken(context) as string);

		if (!user) throw Error(ErrorMessages.INVALID_CREDENTIALS_ERROR_MESSAGE);

		return MemberServices.deleteAccount(user.id, password);
	}
}
