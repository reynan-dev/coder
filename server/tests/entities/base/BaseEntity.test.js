import BaseEntity from '../../../dist/entities/base/BaseEntity.js';

describe('Base Entity', () => {
  it('should be a class', () => {
    expect(BaseEntity).toBeInstanceOf(BaseEntity);
  });

  it("should be extended from 'BaseEntity' class", () => {
    expect(BaseEntity.prototype).toBeInstanceOf(BaseEntity);
  });
});
