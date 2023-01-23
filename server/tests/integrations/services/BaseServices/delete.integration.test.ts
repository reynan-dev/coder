import { closeDatabase, dataSource, startDatabase } from '../../../../src/db';
import MemberServices from '../../../../src/services/MemberServices';
import { NOT_FOUND_ERROR_MESSAGE } from '../../../../src/utils/errorMessage';
import { v4 as uuid } from 'uuid';

describe('BaseService.find', () => {
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

	describe('when delete a element', () => {
		describe('when id is invalid', () => {
			it('throws an error not found', async () => {
				expect(() => MemberServices.delete(uuid())).rejects.toThrowError(NOT_FOUND_ERROR_MESSAGE);
			});
		});
		describe('when id is valid', () => {
			it('deletes item', async () => {
				const member = await MemberServices.signUp('usertest', 'unknow@test.com', 'password');

				await MemberServices.delete(member.id);

				expect(await MemberServices.findById(member.id)).toBeNull();
			});
		});
	});
});
