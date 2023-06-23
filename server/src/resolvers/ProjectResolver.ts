import { Member } from 'models/Member';
import { Project } from 'models/Project';
import {
	createProjectArgs,
	deleteProjectArgs,
	favoriteProjectArgs,
	getAllProjectsByMemberArgs,
	getAllProjectsByTemplateArgs,
	getProjectByIdArgs,
	shareProjectArgs,
	updateProjectArgs
} from 'resolvers/args/ProjectArgs';
import { MemberServices } from 'services/MemberServices';
import { ProjectServices } from 'services/ProjectServices';
import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { ErrorMessages } from 'utils/enums/ErrorMessages';
import { GlobalContext } from 'utils/types/GlobalContext';
import { UUID } from 'utils/types/Uuid';

@Resolver(Project)
export class ProjectResolver {
	private ProjectServices: ProjectServices = new ProjectServices();
	private MemberServices: MemberServices = new MemberServices();

	@Authorized()
	@Mutation(() => Project)
	async createProject(
		@Args() { name, isTemplate, isPublic, sandpackTemplate, files }: createProjectArgs,
		@Ctx() context: GlobalContext
	): Promise<Project> {
		const member = await this.MemberServices.findById(context.user?.id as UUID);

		return this.ProjectServices.create({
			name: name,
			owner: member,
			isTemplate: isTemplate,
			isPublic: isPublic,
			sandpackTemplate: sandpackTemplate,
			files: files
		});
	}

	@Authorized()
	@Mutation(() => Project)
	async deleteProject(@Args() { projectId }: deleteProjectArgs): Promise<Project> {
		const project = await this.ProjectServices.findById(projectId);

		if (!project) throw Error(ErrorMessages.PROJECT_NOT_FOUND);

		return this.ProjectServices.delete(projectId);
	}

	@Authorized()
	@Mutation(() => Project)
	async favoriteProject(
		@Args() { projectId }: favoriteProjectArgs,
		@Ctx() context: GlobalContext
	): Promise<Project> {
		const project = await this.ProjectServices.findById(projectId);

		if (!project) throw new Error(ErrorMessages.PROJECT_NOT_FOUND);

		if (project.favoritedBy.includes(context.user))
			throw new Error(ErrorMessages.MEMBER_ALREADY_ADDED);

		return this.ProjectServices.addToFavorite(context.user as Member, project);
	}

	@Authorized()
	@Query(() => Project)
	async getAllFavoritedProjectsByMember(
		@Args() { memberId }: getAllProjectsByMemberArgs
	): Promise<Project[]> {
		// TODO: Need to add pagination here
		return this.ProjectServices.findAllByFavorites(memberId);
	}

	@Authorized()
	@Query(() => Project)
	async getAllProjectsByEditor(@Ctx() context: GlobalContext): Promise<Project[]> {
		// TODO: Need to add pagination here
		return this.ProjectServices.findAllByEditorId(context.user?.id as UUID);
	}

	@Authorized()
	@Query(() => Project)
	async getAllProjectsByOwner(@Ctx() context: GlobalContext): Promise<Project[]> {
		// TODO: Need to add pagination here
		return this.ProjectServices.findAllByOwner(context.user?.id as UUID);
	}

	@Authorized()
	@Query(() => Project)
	async getAllProjectsByTemplate(
		@Args() { template }: getAllProjectsByTemplateArgs
	): Promise<Project[]> {
		// TODO: Need to add pagination here
		return this.ProjectServices.findAllByTemplate(template);
	}

	@Authorized()
	@Query(() => Project)
	async getAllProjectsPublicProjects(): Promise<Project[]> {
		// TODO: Need include pagination here
		return this.ProjectServices.findAllPublic();
	}

	@Authorized()
	@Query(() => Project)
	async getProjectById(
		@Args() { projectId }: getProjectByIdArgs,
		@Ctx() context: GlobalContext
	): Promise<Project> {
		const project = await this.ProjectServices.findById(projectId);

		if (project.owner.id !== context.user?.id) throw Error(ErrorMessages.PROJECT_NOT_FOUND);

		return project;
	}

	@Authorized()
	@Mutation(() => Project)
	async shareProject(@Args() { projectId, membersId }: shareProjectArgs): Promise<Project> {
		const members = new Array();

		membersId.map(async (id) => {
			const member = (await this.MemberServices.findById(id)) as Member;
			if (!member) throw Error(ErrorMessages.MEMBER_NOT_FOUND);

			const project = await this.ProjectServices.findById(projectId);
			if (project.editors.includes(...members)) throw new Error(ErrorMessages.MEMBER_ALREADY_ADDED);

			members.push(member);
		});

		const project = await this.ProjectServices.findById(projectId);

		if (!project) throw new Error(ErrorMessages.PROJECT_NOT_FOUND);

		return this.ProjectServices.share(project, members);
	}

	@Authorized()
	@Mutation(() => Project)
	async updateProject(
		@Args() { name, isTemplate, isPublic, sandpackTemplate, files, projectId }: updateProjectArgs
	): Promise<Project> {
		return this.ProjectServices.update(projectId, {
			name: name,
			isTemplate: isTemplate,
			isPublic: isPublic,
			sandpackTemplate: sandpackTemplate,
			files: files
		});
	}
}
