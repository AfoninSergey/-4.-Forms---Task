import { useState } from 'react';
const initialState = {
	email: '',
	password: '',
	passwordAgain: '',
	validationError: null,
};

export const useStore = () => {
	const [state, setState] = useState(initialState);

	return {
		getState: () => state,
		updateState: (newValues) => {
			setState({
				...state,
				...newValues
			});
		},
		resetState() {
			setState(initialState);
		},
	};
};