import { useDeleteAccount } from 'api/profile/use-delete-account';
import { useUpdateEmail } from 'api/profile/use-update-email';
import { useUpdatePassword } from 'api/profile/use-update-password';
import { useUpdateUsername } from 'api/profile/use-update-username';
import { SIGN_UP_PATH } from 'constants/paths';
import AuthContext from 'context/auth.context';
import { areSameValues } from 'helpers/are-same-values';
import { getFormErrors } from 'helpers/get-form-errors';
import { getGraphQLErrorMessage } from 'helpers/get-graphql-error-message';
import { isContainingEmptyValue } from 'helpers/is-containing-empty-value';
import { AccountPage } from 'pages/account/account.page';
import { DeleteAccountForm } from 'pages/account/components/delete-account-form';
import { UpdateInformationsForm } from 'pages/account/components/update-informations-form';
import { UpdatePasswordForm } from 'pages/account/components/update-password-form';
import { ErrorMessages } from 'pages/sign-up/sign-up.container';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AccountContainer = () => {
	const { profile: profileData, refetch: refetchProfile } = useContext(AuthContext);

	const initialEmail = profileData?.profile.email;
	const initialUsername = profileData?.profile.username;

	const [newEmail, setNewEmail] = useState(initialEmail);
	const [newUsername, setNewUsername] = useState(initialUsername);

	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmedNewPassword, setConfirmedNewPassword] = useState('');
	const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
	const [formErrorMessages, setFormErrorMessages] = useState<ErrorMessages | null>(null);

	const informationsFormState = {
		formErrorMessages,
		setFormErrorMessages,
		newEmail,
		setNewEmail,
		newUsername,
		setNewUsername
	};

	const passwordFormState = {
		formErrorMessages,
		setFormErrorMessages,
		oldPassword,
		setOldPassword,
		newPassword,
		setNewPassword,
		confirmedNewPassword,
		setConfirmedNewPassword
	};

	const deleteAccountFormState = {
		deleteAccountPassword,
		setDeleteAccountPassword
	};

	const onDeleteAccountSuccess = async () => {
		try {
			await refetchProfile();
		} finally {
			navigate(SIGN_UP_PATH);
			toast.success(`Account successfully deleted`);
		}
	};

	const { updateEmail, loading: isUpdateEmailLoading } = useUpdateEmail();
	const { updateUsername, loading: isUpdateUsernameLoading } = useUpdateUsername();
	const { updatePassword, loading: isUpdatePasswordLoading } = useUpdatePassword();
	const { deleteAccount, loading: isDeleteAccountLoading } =
		useDeleteAccount(onDeleteAccountSuccess);

	const navigate = useNavigate();

	const submitInformationsForm = async () => {
		if (newEmail && newUsername) {
			try {
				if (!areSameValues({ email: initialEmail }, { email: newEmail })) {
					await updateEmail({
						variables: { email: newEmail }
					});
				}
				if (!areSameValues({ username: initialUsername }, { username: newUsername })) {
					await updateUsername({
						variables: { username: newUsername }
					});
				}
				toast.success(`Informations successfully saved`);
				refetchProfile();
			} catch (error) {
				toast.error(getGraphQLErrorMessage(error), { autoClose: 10000 });
			}
		}
		return;
	};

	const handleInformationsForm = async () => {
		const formErrors = getFormErrors({ username: newUsername, email: newEmail });
		if (formErrors) {
			setFormErrorMessages(formErrors);
			return;
		}
		await submitInformationsForm();
	};

	const submitPasswordForm = async () => {
		try {
			await updatePassword({
				variables: { oldPassword, newPassword, confirmedNewPassword }
			});
			toast.success(`Password successfully changed`);
			setNewPassword('');
			setConfirmedNewPassword('');
			setOldPassword('');
		} catch (error) {
			toast.error(getGraphQLErrorMessage(error), { autoClose: 10000 });
		}
		return;
	};

	const handlePasswordForm = async () => {
		if (!isContainingEmptyValue([newPassword, oldPassword, confirmedNewPassword])) {
			return toast.error('Please fill all relating password fields', { autoClose: 10000 });
		}
		const formErrors = getFormErrors({
			password: newPassword,
			confirmedPassword: confirmedNewPassword
		});
		if (formErrors) {
			setFormErrorMessages(formErrors);
			return;
		}
		await submitPasswordForm();
	};

	const submitDeleteAccountForm = async () => {
		try {
			await deleteAccount({
				variables: { password: deleteAccountPassword }
			});
		} catch (error) {
			toast.error(getGraphQLErrorMessage(error), { autoClose: 10000 });
		}
		return;
	};

	const handleDeleteAccountForm = async () => {
		if (isContainingEmptyValue([deleteAccountPassword])) {
			return toast.error('Please type your password to delete your account', { autoClose: 10000 });
		}
		await submitDeleteAccountForm();
	};

	return (
		<AccountPage
			updateInformationsForm={
				<UpdateInformationsForm
					isLoading={isUpdateEmailLoading || isUpdateUsernameLoading}
					state={informationsFormState}
					handleInformationsForm={handleInformationsForm}
					initialInformations={{ email: initialEmail, username: initialUsername }}
				/>
			}
			updatePasswordForm={
				<UpdatePasswordForm
					isLoading={isUpdatePasswordLoading}
					state={passwordFormState}
					handlePasswordForm={handlePasswordForm}
				/>
			}
			deleteAccountForm={
				<DeleteAccountForm
					isLoading={isDeleteAccountLoading}
					state={deleteAccountFormState}
					handleDeleteAccountForm={handleDeleteAccountForm}
				/>
			}
		/>
	);
};
