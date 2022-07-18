import { reducible, type Reducer } from '$lib/reducible';
import type { CatQuery } from './graphql/generated-operations';

export type CatModel = Omit<Required<CatQuery['cat']>, '__typename'>;

export type ClientDimensions = {
	left: number;
	top: number;
	width: number;
	height: number;
};

type Action =
	| {
			type: 'mouseMovedInBox';
			x: number;
			y: number;
	  }
	| {
			type: 'mouseLeftBox';
	  }
	| {
			type: 'mouseHeldStillOverThreshold';
			x: number;
			y: number;
	  }
	| {
			type: 'loadedCatImage';
			x: number;
			y: number;
			cat: CatModel;
			dimensions: ClientDimensions;
	  };

type Step =
	| {
			key: 'promptUserToMoveCursor';
	  }
	| {
			key: 'promptUserToHoldStill';
			x: number;
			y: number;
	  }
	| {
			key: 'loadingCat';
			x: number;
			y: number;
	  }
	| {
			key: 'showingCat';
			cat: CatModel;
			x: number;
			y: number;
			dimensions: ClientDimensions;
	  };

export type State = {
	boops: number;
	step: Step;
};

const reducer: Reducer<State, Action> = (prevState, action): State => {
	switch (action.type) {
		case 'mouseMovedInBox':
			return {
				...prevState,
				step: {
					key: 'promptUserToHoldStill',
					x: action.x,
					y: action.y
				}
			};
		case 'mouseLeftBox':
			return {
				...prevState,
				step: {
					key: 'promptUserToMoveCursor'
				}
			};
		case 'mouseHeldStillOverThreshold':
			return {
				...prevState,
				step: {
					key: 'loadingCat',
					x: action.x,
					y: action.y
				}
			};
		case 'loadedCatImage':
			return {
				...prevState,
				step: {
					x: action.x,
					y: action.y,
					key: 'showingCat',
					cat: action.cat,
					dimensions: action.dimensions
				},
				boops: prevState.boops + 1
			};
		default:
			return prevState;
	}
};

export function getStore() {
	const initialState: State = {
		boops: 0,
		step: {
			key: 'promptUserToMoveCursor'
		}
	};

	return reducible(initialState, reducer);
}
