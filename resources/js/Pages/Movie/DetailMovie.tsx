import {Head, useForm} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {PageProps} from "@/types";
import React, {useCallback, useEffect, useMemo, useReducer, useState} from "react";
import movieReducer, {initialState} from "@/Pages/Movie/MovieReducer";
import Camera from "react-html5-camera-photo";
import 'react-html5-camera-photo/build/css/index.css';
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import {Bounce, toast} from "react-toastify";

interface DetailMovieProps extends PageProps {
    token: string;
    movieId: number;
    movie: any;
}

type Form = {
    movie_id: number;
    title: string;
    photo: string | File;
}

const DetailMovie = ({auth, movie, token, movieId}: DetailMovieProps) => {
    const [state, dispatch] = useReducer(movieReducer, initialState)
    const [dataUri, setDataUri] = useState('');
    const [takePhoto, setTakePhoto] = useState(false);
    const [tempMovie, setTempMovie] = useState<any>(movie)

    const {setData, post, processing, reset} = useForm<Form>({
        movie_id: movieId,
        title: movie?.title || '',
        photo: ''
    })

    const options = useMemo(() => ({
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }), [token])

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options)
            .then(response => response.json())
            .then(response => {
                dispatch({type: 'FETCH_MOVIE', payload: response})
                dispatch({type: 'SET_LOADING', payload: false})
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        setData(data => ({
            ...data,
            title: state.movie.title
        }))
    }, [state.movie]);

    useEffect(() => {
        setTempMovie(movie)
    }, [movie]);

    const convertToHourAndMinutes = useCallback((runtime: number) => {
        const hours = Math.floor(runtime / 60);
        const minutes = runtime % 60;
        return `${hours}h ${minutes}m`;
    }, [state.movie]);

    const convertBase64ToFile = (base64: string, filename: string) => {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    }

    function handleTakePhoto(dataUri: string) {
        setData('photo', convertBase64ToFile(dataUri, 'foto'));
        setDataUri(dataUri)
    }

    const submitPhoto = () => {
        const url = movie ? route('movie.update', movie.id) : route('movie.create');

        post(url, {
            onSuccess: () => {
                reset();
                setDataUri('');
                setTakePhoto(false);
                setTempMovie(movie)
                toast.success(movie ? 'Success updated photo' : 'Success add photo', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            },
            onError: () => {
                reset();
                setDataUri('');
                toast.error('Failed add photo', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Movies"/>

            <div>

                {!state.loading &&
                    <>
                        <div
                            className='bg-[left_calc((50vw_-_170px)_-_340px)_top] bg-no-repeat'
                            style={{backgroundImage: `url('https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${state.movie.backdrop_path}')`}}>
                            <div
                                className="bg-gradient-to-r from-black from-20% to-orange-950/70 flex justify-center">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                                    <div className="flex flex-col sm:flex-row items-center">
                                        <div className="flex-none">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${state.movie.poster_path}`}
                                                alt={state.movie.title} className="w-48 sm:w-64"/>
                                        </div>
                                        <div className="sm:ms-6 mt-6 sm:mt-0">
                                            <h2 className="text-3xl font-semibold text-white">{state.movie.title}
                                                <span
                                                    className="ml-2 font-normal text-gray-300">({new Date(state.movie.release_date).getFullYear()})</span>
                                            </h2>
                                            <div className="flex items-center text-white gap-1">
                                                <span>{new Intl.DateTimeFormat('id-ID').format(new Date(state.movie.release_date))}</span>
                                                <span
                                                    className="before:content-['•'] before:mr-1">{state.movie.genres.map((genre: any) => genre.name).join(', ')}</span>
                                                <span
                                                    className="before:content-['•'] before:mr-1">{convertToHourAndMinutes(state.movie.runtime)}</span>
                                            </div>
                                            <p className="text-lg text-gray-300 my-5 italic">{state.movie.tagline}</p>
                                            <p className="text-lg text-white mt-2">{state.movie.overview}</p>
                                            <p className="text-lg text-white mt-2">Rating: {Math.round(state.movie.vote_average)} /
                                                10</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-5 grid grid-cols-6 gap-4">
                            <div>
                                <h3 className="font-semibold">Production Companies</h3>
                                <div className="flex gap-5 mt-3">
                                    {state.movie.production_companies.map((company: any) => (
                                        <div key={company.id}>
                                            <img src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                                 alt={company.name} className="w-32"/>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold">Status</h3>
                                <p className="mt-3">{state.movie.status}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Original Language</h3>
                                <p className="mt-3">{state.movie.original_language}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Status</h3>
                                <p className="mt-3">{state.movie.status}</p>
                            </div>
                        </div>
                    </>
                }

                {!tempMovie ?
                    <div className="flex justify-center">
                        {takePhoto ?
                            <>
                                {dataUri ?
                                    <div className="my-10 flex flex-col items-center">
                                        <img src={dataUri} alt="photo" width={500}/>
                                        <div className="flex gap-3">
                                            <SecondaryButton
                                                onClick={() => setData('photo', '')}
                                                className="mt-3"
                                            >
                                                Retake
                                            </SecondaryButton>
                                            <PrimaryButton
                                                onClick={submitPhoto}
                                                className="mt-3"
                                                disabled={processing}
                                            >
                                                Save
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                    :
                                    <div className="max-w-2xl my-10 flex flex-col items-center">
                                        <Camera
                                            onTakePhoto={(dataUri) => {
                                                handleTakePhoto(dataUri);
                                            }}
                                            idealResolution={{width: 640, height: 480}}
                                        />
                                        <PrimaryButton
                                            className="mt-5"
                                            onClick={() => setTakePhoto(false)}
                                        >
                                            Cancle
                                        </PrimaryButton>
                                    </div>
                                }
                            </>
                            :
                            <PrimaryButton className="mt-20" onClick={() => setTakePhoto(true)}>Take
                                Photo</PrimaryButton>
                        }
                    </div>
                    :
                    <div className="flex justify-center">
                        <div className="my-10 flex flex-col">
                            <img src={`/storage/images/movies/${movie.photo}`} alt="photo" width={500}/>
                            <div className="flex justify-center">
                                <PrimaryButton className="mt-5" onClick={() => {
                                    setTakePhoto(true)
                                    setTempMovie(null)
                                }}>
                                    Retake Photo
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </AuthenticatedLayout>
    );
};

export default DetailMovie;
