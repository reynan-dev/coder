import { SANDBOX_TEMPLATES } from '@codesandbox/sandpack-react';
import { useCreateProjectService } from 'pages/create-project/create-project.service';
import { useState } from 'react';
import { FaAngular, FaHtml5, FaReact, FaVuejs } from 'react-icons/fa';
import {
	SiAstro,
	SiJavascript,
	SiJest,
	SiNextdotjs,
	SiNodedotjs,
	SiSvelte,
	SiTypescript,
	SiVite
} from 'react-icons/si';
import { TbBrandSolidjs } from 'react-icons/tb';
import { twJoin } from 'tailwind-merge';
import { SandpackTemplate } from 'types/sandpack';

interface TemplateLinkProps {
	sandpackTemplate: SandpackTemplate | undefined;
}

export const ChooseTemplateLink = ({ sandpackTemplate }: TemplateLinkProps) => {
	const renderContent = (template: string | undefined) => {
		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'static')
			return {
				icon: <FaHtml5 size={20} className='mt-1 text-orange-500' />,
				name: 'HTML / CSS'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'angular')
			return {
				icon: <FaAngular size={20} className='mt-1 text-red-500' />,
				name: 'Angular'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'react')
			return {
				icon: <FaReact size={20} className='mt-1 text-primary' />,
				name: 'React'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'react-ts')
			return {
				icon: <FaReact size={20} className='mt-1 text-primary' />,
				name: 'React TypeScript'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'solid')
			return {
				icon: <TbBrandSolidjs size={20} className='mt-1 text-blue-600' />,
				name: 'Solid'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'svelte')
			return {
				icon: <SiSvelte size={20} className='mt-1 text-orange-600' />,
				name: 'Svelte'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'test-ts')
			return {
				icon: <SiJest size={20} className='mt-1 text-red-800' />,
				name: 'Jest TypeScript'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'vanilla-ts')
			return {
				icon: <SiTypescript size={20} className='mt-1 text-blue-800' />,
				name: 'TypeScript'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'vanilla')
			return {
				icon: <SiJavascript size={20} className='mt-0.5 text-yellow-500' />,
				name: 'JavaScript'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'vue')
			return {
				icon: <FaVuejs size={20} className='mt-1 text-green-400' />,
				name: 'Vue'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'vue-ts')
			return {
				icon: <FaVuejs size={20} className='mt-1 text-green-400' />,
				name: 'Vue TypeScript'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'node')
			return {
				icon: <SiNodedotjs size={20} className='mt-1 text-green-700' />,
				name: 'Node'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'nextjs')
			return {
				icon: <SiNextdotjs size={20} className='mt-1 ' />,
				name: 'Next.JS'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'vite')
			return {
				icon: <SiVite size={20} className='mt-1 text-purple-500' />,
				name: 'Vite'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'vite-react')
			return {
				icon: <FaReact size={20} className='mt-1 text-primary' />,
				name: 'Vite React'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'vite-react-ts')
			return {
				icon: <FaReact size={20} className='mt-1 text-primary' />,
				name: 'Vite React - TypeScript'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'vite-vue')
			return {
				icon: <FaVuejs size={20} className='mt-1 text-green-400' />,
				name: 'Vite Vue'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'vite-vue-ts')
			return {
				icon: <FaVuejs size={20} className='mt-1 text-green-400' />,
				name: 'Vite Vue - TypeScript'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'vite-svelte')
			return {
				icon: <SiSvelte size={20} className='mt-1 text-orange-600' />,
				name: 'Vite Svelte'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'vite-svelte-ts')
			return {
				icon: <SiSvelte size={20} className='mt-1 text-orange-600' />,
				name: 'Vite Svelte - TypeScript'
			};

		if (Object.keys(SANDBOX_TEMPLATES).find((key) => key === template) === 'astro')
			return {
				icon: <SiAstro size={20} className='mt-1 ' />,
				name: 'Astro'
			};

		return undefined;
	};

	const [linkContent] = useState(renderContent(sandpackTemplate));
	const { createProject } = useCreateProjectService();

	if (linkContent === undefined) return null;

	const handleOnClick = async () => {
		if (sandpackTemplate === undefined) return console.error('ERROR');

		return await createProject({
			name: 'untitled',
			files: SANDBOX_TEMPLATES[sandpackTemplate].files,
			environment: SANDBOX_TEMPLATES[sandpackTemplate].environment,
			main: SANDBOX_TEMPLATES[sandpackTemplate].main,
			sandpackTemplate
		});
	};

	return (
		<button
			onClick={() => handleOnClick()}
			className={twJoin(
				'flex',
				'space-x-2 p-5',
				'rounded-lg border border-dark-700 text-lg',
				'transition duration-150 ease-in-out',
				'hover:bg-dark-800'
			)}
		>
			{linkContent.icon}
			<span>{linkContent.name}</span>
		</button>
	);
};
