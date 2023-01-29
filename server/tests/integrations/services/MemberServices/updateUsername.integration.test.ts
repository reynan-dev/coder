import MemberServices from 'services/MemberServices';

import { dataSource, closeDatabase, startDatabase } from 'db';

describe('Update a Member username integration test', () => {
	beforeAll(async () => {
		await startDatabase();
	});

	afterAll(async () => {
		await closeDatabase();
	});

	beforeEach(async () => {
		for (const entity of dataSource.entityMetadatas) {
			const repository = dataSource.getRepository(entity.name);
			await repository.query(`TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`);
		}
	});

	describe('when update username', () => {
		it('return an member', async () => {
			const username = 'username';
			const email = 'unknown@email.com';
			const password = 'password';

			const member = await MemberServices.signUp(username, email, password);

			const newUsername = 'newUsername';

			const updated = await MemberServices.updateUsername(member.id, newUsername);

			expect(updated.username).toEqual(newUsername);
		});
	});
});
