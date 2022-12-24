import { IsEmail } from 'class-validator';
import { randomBytes } from 'crypto';
import { Field, ObjectType } from 'type-graphql';
import { BeforeInsert, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export default class RoutingToken {
	constructor(email: string) {
		this.email = email;
	}

	@PrimaryColumn('varchar', { length: 32 })
	token: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@BeforeInsert()
	setToken() {
		this.token = randomBytes(16).toString('hex');
	}
}
