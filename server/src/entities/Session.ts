import { IsDate, IsHexadecimal } from 'class-validator';
import { randomBytes } from 'crypto';
import { Field, ObjectType } from 'type-graphql';
import { BeforeInsert, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import Member from './Member';

@Entity()
@ObjectType()
export default class Session {
	constructor(member: Member) {
		this.member = member;
	}

	@PrimaryColumn('varchar', { length: 32 })
	@IsHexadecimal()
	token: string;

	@ManyToOne(() => Member, { eager: true })
	@Field()
	member: Member;

	@CreateDateColumn()
	@Field()
	@IsDate()
	createdAt: Date;

	@BeforeInsert()
	setToken() {
		this.token = randomBytes(16).toString('hex');
	}
}
