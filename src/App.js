import { useEffect, useRef } from 'react';
import { useStore } from './hooks/useStore';
import { EMAIL_REGEXP, PASSWORD_REGEXP } from './constans/constans';
import styles from './App.module.css';

const sendFormData = (formData) => {
	console.log(formData);
};


export const App = () => {
	const { getState, updateState, resetState: resetForm } = useStore();
	const { email, password, passwordAgain, validationError } = getState();

	const sendButton = useRef();
	let errorMessage = null;

	useEffect(() => {
		if (email.length !== 0 &&
			password.length !== 0 &&
			passwordAgain.length !== 0 &&
			EMAIL_REGEXP.test(email) &&
			password.length >= 5 &&
			passwordAgain.length >= 5 &&
			password === passwordAgain
		) sendButton.current.focus()
	}, [email, password, passwordAgain]);

	const onSubmit = (event) => {
		event.preventDefault();
		sendFormData(getState());
		sendButton.current.blur()
		resetForm();
	};

	const onChange = ({ target: { name, value, type } }) => {
		if (type === 'password' && !PASSWORD_REGEXP.test(value)) {
			errorMessage =
				'Пароль может содержать только латинские буквы, цифры и символы \\w!@#$%^&*+-';
		} else if (type === 'password' && value.length > 20) {
			errorMessage = 'Пароль не должен быть длиннее 20 символов';
		}

		updateState({
			[name]: value,
			validationError: errorMessage,
		});

	};

	const onFocus = () => updateState({ validationError: null });

	const validateFormForSend = () => {
		if (
			email.length === 0 ||
			password.length === 0 ||
			passwordAgain.length === 0
		) {
			errorMessage = 'Заполните все поля!';
		} else if (!EMAIL_REGEXP.test(email)) {
			errorMessage = 'Введите корретный e-mail адрес!';
		} else if (password.length < 5 || passwordAgain.length < 5) {
			errorMessage = 'Пароль не должен быть короче 5 символов';
		} else if (password !== passwordAgain) {
			errorMessage = 'Пароли не совпадают!';
		}
		updateState({ validationError: errorMessage });
	};



	return (
		<form className={styles.form} onSubmit={onSubmit}>
			{validationError && (
				<div className={styles.validationError}>{validationError}</div>
			)}
			<input
				type="email"
				name="email"
				placeholder="Ваш e-mail"
				value={email}
				onFocus={onFocus}
				onChange={onChange}
			/>
			<input
				type="password"
				name="password"
				placeholder="Пароль"
				value={password}
				onFocus={onFocus}
				onChange={onChange}
			/>
			<input
				type="password"
				name="passwordAgain"
				placeholder="Пароль ещё раз"
				value={passwordAgain}
				onFocus={onFocus}
				onChange={onChange}
			/>
			<button
				disabled={validationError !== null}
				type="submit"
				ref={sendButton}
				onClick={validateFormForSend}
			>
				Зарегистрироваться
			</button>
		</form>
	);
};