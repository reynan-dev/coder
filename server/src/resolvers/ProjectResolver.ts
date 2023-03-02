import { Args, Mutation, Ctx, Query, Resolver, Authorized } from 'type-graphql';

import { Project } from 'models/Project';
import { ProjectServices } from 'services/ProjectServices';

import { GlobalContext } from 'utils/types/GlobalContext';
import {
	createArgs,
	deleteArgs,
	favoriteProjectArgs,
	getAllByLanguageArgs,
	getAllByTemplateArgs,
	getByIdArgs,
	getByMemberArgs,
	getByNameArgs,
	shareProjectArgs,
	updateActiveFileArgs,
	updateIsPublic,
	updateIsTemplateArgs,
	updateNameArgs
} from 'resolvers/args/ProjectArgs';

import { ErrorMessages } from 'utils/enums/ErrorMessages';
import { ProgramingLanguageServices } from 'services/ProgramingLanguageServices';
import { FileProjectServices } from 'services/FileProjectServices';
import { MemberServices } from 'services/MemberServices';

@Resolver(Project)
export class ProjectResolver {
	ProjectServices: ProjectServices = new ProjectServices();
	LanguageServices: ProgramingLanguageServices = new ProgramingLanguageServices();
	FileProjectServices: FileProjectServices = new FileProjectServices();
	MemberServices: MemberServices = new MemberServices();
	@Authorized()
	@Query(() => Project)
	async getAllPublicProjects(): Promise<Project[]> {
		// TODO: Need include pagination here
		return this.ProjectServices.findAllPublic();
	}

	@Authorized()
	@Query(() => Project)
	async getAllByOwner(@Ctx() context: GlobalContext): Promise<Project[]> {
		// TODO: Need to add pagination here
		return this.ProjectServices.findByOwner(context.user?.id as string);
	}

	@Authorized()
	@Query(() => Project)
	async getAllByEditor(@Ctx() context: GlobalContext): Promise<Project[]> {
		// TODO: Need to add pagination here
		return this.ProjectServices.findByEditorId(context.user?.id as string);
	}

	@Authorized()
	@Query(() => Project)
	async getFavoritedByMember(@Args() { memberId }: getByMemberArgs): Promise<Project[]> {
		// TODO: Need to add pagination here
		return this.ProjectServices.findByFavorites(memberId);
	}

	@Authorized()
	@Query(() => Project)
	async getAllByTemplate(@Args() { templateId }: getAllByTemplateArgs): Promise<Project[]> {
		// TODO: Need to add pagination here
		return this.ProjectServices.findByTemplate(templateId);
	}

	@Authorized()
	@Query(() => Project)
	async getAllByLanguage(@Args() { languageId }: getAllByLanguageArgs): Promise<Project[]> {
		// TODO: Need to add pagination here
		return this.ProjectServices.findByLanguage(languageId);
	}

	@Authorized()
	@Query(() => Project)
	async getById(@Args() { projectId }: getByIdArgs): Promise<Project> {
		return this.ProjectServices.findById(projectId);
	}

	@Authorized()
	@Query(() => Project)
	async getByName(@Args() { projectName }: getByNameArgs): Promise<Project> {
		return this.ProjectServices.findOneBy({ projectName });
	}

	@Authorized()
	@Mutation(() => Project)
	async create(
		@Args() { name, languageId, templateId, activeFileId, isTemplate, isPublic }: createArgs,
		@Ctx() context: GlobalContext
	): Promise<Project> {
		const member = await this.MemberServices.findById(context.user?.id as string);

		const language = await this.LanguageServices.findById(languageId);

		if (!language) throw Error(ErrorMessages.LANGUAGE_NOT_FOUND);

		const template = await this.ProjectServices.findById(templateId);

		const file = await this.FileProjectServices.findById(activeFileId);

		return this.ProjectServices.create({
			name: name,
			owner: member,
			programmingLanguage: language,
			template: template,
			activeFile: file,
			isTemplate: isTemplate,
			isPublic: isPublic
		});
	}

	@Authorized()
	@Query(() => Project)
	async favoriteProject(
		@Args() { projectId }: favoriteProjectArgs,
		@Ctx() context: GlobalContext
	): Promise<Project> {
		return this.ProjectServices.addToFavorite(context.user?.id as string, projectId);
	}

	@Authorized()
	@Mutation(() => Project)
	async shareProject(@Args() { projectId, membersId }: shareProjectArgs): Promise<Project> {
		const members = new Array();
		membersId.map((id) => {
			const member = this.MemberServices.findById(id);
			if (!member) throw Error(ErrorMessages.MEMBER_NOT_FOUND);
			members.push(member);
		});

		return this.ProjectServices.share(projectId, members);
	}

	@Authorized()
	@Mutation(() => Project)
	async updateName(@Args() { projectId, name }: updateNameArgs): Promise<Project> {
		const project = await this.ProjectServices.findById(projectId);

		if (!project) throw Error(ErrorMessages.PROJECT_NOT_FOUND);

		return this.ProjectServices.update(project.id, { name });
	}

	@Authorized()
	@Mutation(() => Project)
	async updateActiveFile(
		@Args() { projectId, activeFile }: updateActiveFileArgs
	): Promise<Project> {
		const project = await this.ProjectServices.findById(projectId);

		if (!project) throw Error(ErrorMessages.PROJECT_NOT_FOUND);

		return this.ProjectServices.update(project.id, { activeFile });
	}

	@Authorized()
	@Mutation(() => Project)
	async updateIsTemplate(
		@Args() { projectId, isTemplate }: updateIsTemplateArgs
	): Promise<Project> {
		const project = await this.ProjectServices.findById(projectId);

		if (!project) throw Error(ErrorMessages.PROJECT_NOT_FOUND);

		return this.ProjectServices.update(project.id, { isTemplate });
	}

	@Authorized()
	@Mutation(() => Project)
	async updateIsPublic(@Args() { projectId, isPublic }: updateIsPublic): Promise<Project> {
		const project = await this.ProjectServices.findById(projectId);

		if (!project) throw Error(ErrorMessages.PROJECT_NOT_FOUND);

		return this.ProjectServices.update(project.id, { isPublic });
	}

	@Authorized()
	@Mutation(() => Project)
	async delete(@Args() { projectId }: deleteArgs): Promise<Project> {
		const project = await this.ProjectServices.findById(projectId);

		if (!project) throw Error(ErrorMessages.PROJECT_NOT_FOUND);

		return this.ProjectServices.delete(projectId);
	}
}
