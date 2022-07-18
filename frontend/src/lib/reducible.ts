import { writable } from 'svelte/store';

export type Reducer<State, Action> = (prevState: State, action: Action) => State;

export function reducible<State, Action>(initialState: State, reducer: Reducer<State, Action>) {
	const { update, subscribe } = writable(initialState);

	function dispatch(action: Action) {
		update((state) => reducer(state, action));
	}

	return [{ subscribe }, dispatch] as const;
}
