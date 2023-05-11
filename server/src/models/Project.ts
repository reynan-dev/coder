import { IsBoolean, IsDate, IsString } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import {
	Column,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	OneToMany
} from 'typeorm';

import { FileProject } from 'models/FileProject';
import { Member } from 'models/Member';
import { BaseModel } from 'models/base/BaseModel';
import { SandpackTemplates } from 'utils/enums/SandpackTemplates';

@Entity()
@ObjectType()
export class Project extends BaseModel {
	@Column()
	@Field()
	@IsString()
	name: string;

	@Field(() => Member)
	@ManyToOne(() => Member, (member) => member.ownedProjects, { eager: true })
	@JoinColumn()
	owner: Member;

	@Field(() => [Member], { nullable: true, defaultValue: [] })
	@ManyToMany(() => Member, (member) => member.projectsInvitedOn, { eager: true, nullable: true })
	editors: Member[];

	@Field(() => [Member], { nullable: true, defaultValue: [] })
	@ManyToMany(() => Member, (member) => member.favoritedProjects, { eager: true, nullable: true })
	favoritedBy: Member[];

	@Column({
		type: 'enum',
		enum: SandpackTemplates,
		nullable: true
	})
	sandpackTemplate: SandpackTemplates;

	@Field(() => [FileProject], { nullable: true, defaultValue: [] })
	@OneToMany(() => FileProject, (file) => file.project, {
		eager: true,
		nullable: true,
		cascade: true
	})
	files: FileProject[];

	@Column('boolean', { default: false })
	@Field()
	@IsBoolean()
	isTemplate: boolean;

	@Column('boolean', { default: false })
	@Field()
	@IsBoolean()
	isPublic: boolean;

	@DeleteDateColumn()
	@IsDate()
	deletedAt: Date;
}
