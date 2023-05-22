import { SandpackFile } from '@codesandbox/sandpack-react/types';
import Loader from 'components/svgs/loader';
import ProjectContext from 'context/project.context';
import { SandpackTemplates } from 'enums/sandpack-templates';
import { Files, Project, projectFixtures } from 'fixtures/projects-fixtures';
import { useGetQueryParam } from 'hooks/use-get-query-param';
import { useContext } from 'react';
import { CodePage } from './code.page';

export type Dependencies = Record<string, string>;
export type SandpackTemplate = (typeof SandpackTemplates)[keyof typeof SandpackTemplates];

const getDependenciesFromJson = (projectData: Project): Dependencies => {
	return JSON.parse(projectData.files.filter((e) => e.name === '/package.json')[0].code)
		.dependencies;
};

const getDevDependenciesFromJson = (projectData: Project): Dependencies => {
	return JSON.parse(projectData.files.filter((e) => e.name === '/package.json')[0].code)
		.devDependencies;
};

const mapFilesForSandpack = (files: Files) => {
	let filesObject: Record<string, string | SandpackFile> = {};

	files.map((e) => {
		return e.name && (filesObject[e.name] = `${e.code}`);
	});

	return filesObject;
};

const mapFilesForMonacoEditor = (files: Files) => {
	let filesObject: Record<string, { code: string | SandpackFile; programmingLanguage: string }> =
		{};

	files.map((e) => {
		return (
			e.name &&
			(filesObject[e.name] = { code: `${e.code}`, programmingLanguage: e.programmingLanguage })
		);
	});

	return filesObject;
};

export const CodeContainer = () => {
	const { projectData, setProjectData } = useContext(ProjectContext);
	const templateParam = useGetQueryParam('template');

	const checkedTemplateParam = (_templateParam: string | null) => {
		const validSandpackTemplates = Object.values(SandpackTemplates);

		if (!_templateParam) return undefined;
		if (!validSandpackTemplates.some((validTemplate) => validTemplate !== _templateParam)) {
			console.log('prout');
			console.log();
			return undefined;
		}

		return _templateParam as SandpackTemplate;
	};

	return (
		<>
			{projectData === null ? (
				<Loader />
			) : (
				<CodePage
					mappedFilesForSandpack={mapFilesForSandpack(projectFixtures.files)}
					mappedFilesForMonacoEditor={mapFilesForMonacoEditor(projectFixtures.files)}
					dependencies={getDependenciesFromJson(projectData)}
					devDependencies={getDevDependenciesFromJson(projectData)}
					setProjectData={setProjectData}
					template={checkedTemplateParam(templateParam)}
				/>
			)}
		</>
	);
};
