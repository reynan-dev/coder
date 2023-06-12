import {
	SandpackCodeEditor,
	SandpackConsole,
	SandpackLayout,
	SandpackPreview,
	SandpackProvider
} from '@codesandbox/sandpack-react';
import { ErrorLoading } from 'components/error/error-loading';
import { ProjectState } from 'pages/code/code.container';
import { FileExplorerPanel } from 'pages/code/_components/file-explorer-panel';
import { ProjectPanel } from 'pages/code/_components/project-panel';
import { SandpackContainer } from 'pages/code/_components/sandpack.container';
import { FaExclamationCircle } from 'react-icons/fa';
import { sandpackCustomTheme } from 'styles/sandpack-theme';
import { getCheckedTemplateParam } from 'helpers/get-cheked-template-param';

interface CodePageProps {
	state: ProjectState;
}

export const CodePage = ({ state }: CodePageProps) => {
	return (
		<>
			{state.currentProjectData ? (
				<SandpackProvider
					theme={sandpackCustomTheme}
					style={{ height: '100%' }}
					template={getCheckedTemplateParam(state.currentProjectData.sandpackTemplate ?? '')}
				>
					<SandpackContainer>
						<SandpackLayout
							style={{
								width: '100%',
								height: '100%',
								borderRadius: '0',
								border: 'none'
							}}
						>
							<ProjectPanel className='w-full flex-1' state={state} />
							<div className='flex h-full w-full'>
								<div className='h-100 flex w-2/12 min-w-56 flex-col'>
									<FileExplorerPanel
										files={state.files}
										className='h-100 w-100 flex flex-1 flex-col'
									/>
								</div>

								<div className='h-full flex-1 border border-b-0 border-l-0 border-t-0 border-r-dark-700 bg-dark-900'>
									<SandpackCodeEditor
										closableTabs={true}
										style={{
											width: '100%',
											height: '100%'
										}}
									/>
								</div>

								<div className='flex h-full flex-1 flex-col'>
									<div className='h-1/2'>
										<SandpackPreview
											className=''
											showNavigator
											showOpenInCodeSandbox={false}
											style={{
												height: '100%'
											}}
										/>
									</div>
									<div className='h-1/2'>
										<SandpackConsole
											style={{
												height: '100%'
											}}
										/>
									</div>
								</div>
							</div>
						</SandpackLayout>
					</SandpackContainer>
				</SandpackProvider>
			) : (
				<ErrorLoading
					errorMessage='Failed to load project, please try again'
					icon={<FaExclamationCircle size={24} />}
				/>
			)}
		</>
	);
};
