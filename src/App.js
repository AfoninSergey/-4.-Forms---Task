import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useRef } from 'react';
import { EMAIL_REGEXP, PASSWORD_REGEXP } from './constans/constans';
import styles from './App.module.css';

const sendFormData = (formData) => {
	console.log(formData);
};

const fieldsSchema = yup.object().shape({
	email: yup
		.string()
		.required('Заполните все поля!')
		.matches(EMAIL_REGEXP, 'Введите корретный e-mail адрес!'),
	password: yup
		.string()
		.required('Заполните все поля!')
		.matches(
			PASSWORD_REGEXP,
			'Пароль может содержать только латинские буквы, цифры и символы \\w!@#$%^&*+-',
		)
		.max(20, 'Пароль не должен быть длиннее 20 символов')
		.min(5, 'Пароль должен быть не короче 5 символов'),
	passwordAgain: yup
		.string()
		.oneOf([yup.ref('password'), null], 'Пароли не совпадают!'),
});

export const App = () => {
	const {
		reset,
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
			passwordAgain: '',
		},
		resolver: yupResolver(fieldsSchema),
	});

	const sendButton = useRef();

	const validationError =
		errors.email?.message ||
		errors.password?.message ||
		errors.passwordAgain?.message;

	const onSubmit = (formData) => {
		sendFormData(formData);
		reset();
		sendButton.current.blur();
	};

	useEffect(() => {
		if (isValid) sendButton.current.focus();
	}, [isValid]);

	return (
		<form noValidate className={styles.form} onSubmit={handleSubmit(onSubmit)}>
			{validationError && (
				<div className={styles.validationError}>{validationError}</div>
			)}
			<input
				type="email"
				name="email"
				placeholder="Ваш e-mail"
				{...register('email')}
			/>
			<input
				type="password"
				name="password"
				placeholder="Пароль"
				{...register('password')}
			/>
			<input
				type="password"
				name="passwordAgain"
				placeholder="Пароль ещё раз"
				{...register('passwordAgain')}
			/>
			<button
				disabled={!!validationError}
				type="submit"
				ref={sendButton}
			>
				Зарегистрироваться
			</button>
		</form>
	);
};
