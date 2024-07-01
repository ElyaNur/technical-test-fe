import {Head, Link} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {PageProps} from "@/types";
import {useEffect, useMemo, useReducer} from "react";
import movieReducer, {initialState} from "@/Pages/Movie/MovieReducer";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Dropdown from "@/Components/Dropdown";

interface MovieProps extends PageProps {
    token: string;
}

const Movie = ({auth, token}: MovieProps) => {
    const [state, dispatch] = useReducer(movieReducer, initialState)

    const options = useMemo(() => ({
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }), [token])

    const fetchMovies = (category = state.category) => {
        dispatch({type: 'SET_LOADING', payload: true})
        fetch(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`, options)
            .then(response => response.json())
            .then(response => {
                dispatch({type: 'FETCH_MOVIES', payload: response.results})
                dispatch({type: 'SET_LOADING', payload: false})
                dispatch({type: 'SET_CATEGORY', payload: category})
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        fetchMovies()
    }, []);

    const loadMore = () => {
        dispatch({type: 'SET_LOADING', payload: true})
        fetch(`https://api.themoviedb.org/3/movie/${state.category}?language=en-US&page=${state.currentPage + 1}`, options)
            .then(response => response.json())
            .then(response => {
                dispatch({type: 'LOAD_MORE_MOVIES', payload: response.results})
                dispatch({type: 'SET_CURRENT_PAGE', payload: state.currentPage + 1})
                dispatch({type: 'SET_LOADING', payload: false})
            })
            .catch(err => console.error(err));
    }

    const dropdownCategory: { [p: string]: string } = {
        'now_playing': 'Now Playing',
        'popular': 'Popular',
        'top_rated': 'Top Rated',
        'upcoming': 'Upcoming',
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex gap-5 items-center md:justify-start justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Movies</h2>
                    <div className="hidden gap-2 sm:flex">
                        {state.category === 'now_playing'
                            ? <PrimaryButton>Now Playing</PrimaryButton>
                            : <SecondaryButton onClick={() => fetchMovies('now_playing')}>Now Playing</SecondaryButton>}
                        {state.category === 'popular'
                            ? <PrimaryButton>Popular</PrimaryButton>
                            : <SecondaryButton onClick={() => fetchMovies('popular')}>Popular</SecondaryButton>}
                        {state.category === 'top_rated'
                            ? <PrimaryButton>Top Rated</PrimaryButton>
                            : <SecondaryButton onClick={() => fetchMovies('top_rated')}>Top Rated</SecondaryButton>}
                        {state.category === 'upcoming'
                            ? <PrimaryButton>Upcoming</PrimaryButton>
                            : <SecondaryButton onClick={() => fetchMovies('upcoming')}>Upcoming</SecondaryButton>}
                    </div>
                    <div className="flex sm:hidden">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                    >
                                        {dropdownCategory[state.category]} {state.loading && '...'}
                                        <svg
                                            className="ms-2 -me-0.5 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Button onClick={() => fetchMovies('now_playing')}>Now
                                    Playing</Dropdown.Button>
                                <Dropdown.Button onClick={() => fetchMovies('popular')}>Popular</Dropdown.Button>
                                <Dropdown.Button onClick={() => fetchMovies('top_rated')}>Top Rated</Dropdown.Button>
                                <Dropdown.Button onClick={() => fetchMovies('upcoming')}>Upcoming</Dropdown.Button>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            }
        >
            <Head title="Movies"/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
                    {state.movies.length > 0 && !state.loading && state.movies.map((movie: any) => (
                        <div key={movie.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg relative">
                            <div className="flex items-center absolute bg-white rounded p-1 bg-opacity-70">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor"
                                     className="size-5 fill-current text-yellow-400">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                                </svg>
                                <p className="text-sm font-bold">{Math.round(movie.vote_average)} / 10</p>
                            </div>
                            <Link href={route('movie.detail', movie.id)}>
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
                            </Link>
                            <div className="p-6 text-gray-900">
                                <h3 className="font-extrabold text-xl hover:text-blue-400">
                                    <Link href={route('movie.detail', movie.id)}>
                                        {movie.title}
                                    </Link>
                                </h3>
                                <span>
                                    {Intl.DateTimeFormat('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }).format(new Date(movie.release_date))}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {state.movies.length < 1 && (
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex justify-center mt-5 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-20 animate-spin">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                        </svg>
                        <h1 className="text-5xl font-bold">Loading...</h1>
                    </div>
                )}

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex justify-center mt-5">
                    <PrimaryButton disabled={state.loading} onClick={loadMore}>Load more...</PrimaryButton>
                </div>

            </div>
        </AuthenticatedLayout>
    );
};

export default Movie;
