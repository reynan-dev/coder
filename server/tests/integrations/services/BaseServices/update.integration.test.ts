import { closeDatabase, dataSource, startDatabase } from '../../../../src/db';
import MemberServices from '../../../../src/services/MemberServices';
import {
	EMPTY_FIELD_ERROR_MESSAGE,
	NOT_FOUND_ERROR_MESSAGE,
  NOT_UPDATED_ERROR_MESSAGE
} from '../../../../src/utils/errorMessage';
import {v4 as uuid} from 'uuid';

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

	describe('when update a invalid element', () => {
		describe('when data is empty', () => {
			it('throw an error empty field', async () => {
				const member = await MemberServices.signUp('usertest', 'unknow@test.com', 'password');

				expect(() => MemberServices.update(member.id, {})).rejects.toThrowError(
					EMPTY_FIELD_ERROR_MESSAGE
				);
			});
		});
		describe('when id is invalid', () => {
			it('throw an error not found', async () => {
				expect(() => MemberServices.update(uuid(), { username: 'tested' })).rejects.toThrowError(
					NOT_FOUND_ERROR_MESSAGE
				);
			});
		});
	});

	describe('when update a valid element', () => {
    describe.skip('when update is not successful', () => {
      it ('throw an error', async () => {
				const member = await MemberServices.signUp('usertest', 'unknow@test.com', 'password');

				expect(await MemberServices.update(member.id, { username: 'tested' })).rejects.toThrowError(
					NOT_UPDATED_ERROR_MESSAGE
				);
      });
    });
    describe('when update is successful', () => {
      it('returns an element', async () => {
				const member = await MemberServices.signUp('usertest', 'unknow@test.com', 'password');

        const update = await MemberServices.update(member.id, { username: 'tested' });

        const updated = await MemberServices.findById(member.id);

				expect(update).toEqual(updated);
      });
    });
	});
});
