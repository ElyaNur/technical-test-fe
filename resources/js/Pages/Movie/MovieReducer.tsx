export const initialState = {
    movies: [],
    movie: {},
    category: 'now_playing',
    loading: true,
    currentPage: 1
}

export default function movieReducer(state = initialState, action: { type: string, payload: any }) {
    switch (action.type) {
        case 'FETCH_MOVIES':
            return {
                ...state,
                movies: action.payload
            }
        case 'LOAD_MORE_MOVIES':
            return {
                ...state,
                movies: state.movies.concat(action.payload)
            }
        case 'FETCH_MOVIE':
            return {
                ...state,
                movie: action.payload
            }
        case 'SET_CATEGORY':
            return {
                ...state,
                category: action.payload
            }
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'SET_CURRENT_PAGE':
            return {
                ...state,
                currentPage: action.payload
            }
        default:
            return state
    }
}
