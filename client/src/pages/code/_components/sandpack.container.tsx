import { SandpackFiles, useSandpack } from '@codesandbox/sandpack-react';
import ProjectContext from 'context/project/project.context';
import { getAddedFilePath } from 'helpers/get-added-file-path';
import { hasSandpackFilesChanged } from 'helpers/has-sandpack-files-changed';
import { useContext, useEffect, useRef } from 'react';
import { ProjectContextData } from 'types/project';

interface SandpackContainerProps {
	children: JSX.Element;
}

export const SandpackContainer = ({ children }: SandpackContainerProps) => {
	const { sandpack } = useSandpack();
	const {
		setCurrentProjectData,
		currentProjectData,
		setActiveFile,
		setVisibleFiles,
		visibleFiles
	} = useContext(ProjectContext);

	const previousFilesRef = useRef<SandpackFiles | null>(
		currentProjectData !== null ? currentProjectData.files : null
	);

	useEffect(() => {
		setActiveFile(sandpack.activeFile);
	}, [sandpack.activeFile, setActiveFile]);

	useEffect(() => {
		if (sandpack.visibleFiles.length !== visibleFiles.length) {
			setVisibleFiles(sandpack.visibleFiles);
		}
	}, [sandpack.visibleFiles, setVisibleFiles, visibleFiles.length]);

	useEffect(() => {
		const newFilePath = getAddedFilePath(previousFilesRef.current, sandpack.files);

		if (
			previousFilesRef.current !== null &&
			hasSandpackFilesChanged(previousFilesRef.current, sandpack.files)
		) {
			previousFilesRef.current = sandpack.files;
			if (
				currentProjectData?.files !== undefined &&
				Object.keys(sandpack.files).includes(currentProjectData?.main)
			) {
				console.log('dont change');
				return setCurrentProjectData(
					(previousState) =>
						({
							...previousState,
							files: sandpack.files
						} as ProjectContextData)
				);
			}

			setCurrentProjectData(
				(previousState) =>
					({
						...previousState,
						main: newFilePath,
						files: sandpack.files
					} as ProjectContextData)
			);
		}
	}, [
		currentProjectData?.files,
		currentProjectData?.main,
		sandpack,
		sandpack.files,
		setCurrentProjectData
	]);

	return <>{children}</>;
};
