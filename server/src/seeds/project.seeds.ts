import { Member } from 'models/Member';
import { Project } from 'models/Project';
import { MemberResolver } from 'resolvers/MemberResolver';
import { createProjectArgs } from 'resolvers/args/ProjectArgs';
import { memberFixtures } from 'seeds/member.seeds';
import { DataSource } from 'typeorm';
import { Database } from 'utils/configs/database';

export const generateProjectFixture: (member: Member) => createProjectArgs = (member: Member) => {
	return {
		name: 'Admin project',
		memberId: member.id,
		isTemplate: false,
		isPublic: false
	};
};

export const createProjects = async () => {
	const seeds = async (dataSource: DataSource) => {
		const _MemberResolver = new MemberResolver();
		const member = await _MemberResolver.getMemberByEmail({ email: memberFixtures[0].email });

		if (!member) return console.error('Provided fixture member does not exist');

		const projectFixture = generateProjectFixture(member);
		await dataSource.createQueryBuilder().insert().into(Project).values(projectFixture).execute();
	};

	await Database.seed(seeds);
};
