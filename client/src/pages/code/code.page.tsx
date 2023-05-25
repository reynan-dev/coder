import {
	SandpackCodeEditor,
	SandpackConsole,
	SandpackLayout,
	SandpackPreview,
	SandpackProvider
} from '@codesandbox/sandpack-react';
import { ProjectState } from 'pages/code/code.container';
import { FileExplorerPanel } from 'pages/code/components/file-explorer-panel';
import { ProjectPanel } from 'pages/code/components/project-panel';
import { SandpackContainer } from 'pages/code/components/sandpack.container';
import { sandpackCustomTheme } from 'styles/sandpack-theme';
import { SandpackTemplate } from 'types/sandpack';

interface CodePageProps {
	// dependencies: Dependencies;
	// devDependencies: Dependencies;
	template: SandpackTemplate | undefined;
	state: ProjectState;
}

export const CodePage = ({ template, state }: CodePageProps) => {
	return (
		<SandpackProvider theme={sandpackCustomTheme} style={{ height: '100%' }} template={template}>
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
							<FileExplorerPanel className='h-100 w-100 flex flex-1 flex-col' />
						</div>

						<div className='h-full flex-1 border border-b-0 border-l-0 border-t-0 border-r-dark-700 bg-dark-900'>
							<SandpackCodeEditor
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
	);
};
