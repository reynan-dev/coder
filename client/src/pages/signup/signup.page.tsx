import clsx from 'clsx';
import Container from '../../components/Container';
import LogoSvg from '../../components/Svgs/LogoSvg';
import { BLACK, WHITE } from '../../styles/colors';
import SignUpForm from './sections/SignUpForm';

export default function SignUpPage() {
	return (
		<Container>
			<div className='flex h-full w-full flex-col items-center justify-center'>
				<div className='full-center-col mt-8 mb-16 space-y-5'>
					<div className='flex space-x-3'>
						<LogoSvg color={BLACK.DEFAULT} backgroundColor={WHITE.DEFAULT} size='50px' />
						<h1>Sign-up</h1>
					</div>
					<h4>Enter your informations</h4>
				</div>
				<SignUpForm className={clsx('w-full', 'sm:w-3/4', 'md:w-3/5', 'lg:w-1/2', 'xl:max-w-md')} />
			</div>
		</Container>
	);
}
