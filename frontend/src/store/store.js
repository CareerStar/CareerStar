import { createStore, applyMiddleware } from 'redux';
import { thunk } from "redux-thunk";

const initialState = {
    starCount: 0
};

const starReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INCREMENT_STAR':
            return {
                ...state,
                starCount: state.starCount + action.payload
            };
        case "SET_STAR_COUNT":
            return { ...state, 
                starCount: action.payload };
        default:
            return state;
    }
};

const store = createStore(starReducer, applyMiddleware(thunk));

export default store;