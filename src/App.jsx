import React, { useEffect, useState } from 'react';

import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import MovieList from './components/MovieList';
import Movie from './components/Movie';
import EditMovieForm from './components/EditMovieForm';
import MovieHeader from './components/MovieHeader';
import FavoriteMovieList from './components/FavoriteMovieList';
import axios from 'axios';
import useLocalStorage from './hooks/useLocalStorage';
import { AddMovieForm } from './components/AddMovieForm';

const App = (props) => {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setfavoriteMovies] = useState([]);
  const [darkMode, setDarkMode] = useLocalStorage('s11d3', true);
  const history = useHistory();
  useEffect(() => {
    axios
      .get('https://nextgen-project.onrender.com/api/s11d3/movies')
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [movies]);

  const deleteMovie = (id) => {
    const filtre = favoriteMovies.filter((item) => item.id !== id);
    setfavoriteMovies(filtre);

    axios
      .delete(`https://nextgen-project.onrender.com/api/s11d3/movies/${id}`)
      .then(function (response) {
        setMovies(response.data);
        history.push('/movies');
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  };

  const switchclick = () => {
    setDarkMode(!darkMode);
  };

  const addToFavorites = (movie) => {
    const filtre = favoriteMovies.find((item) => item.id === movie.id);

    if (!filtre) {
      setfavoriteMovies([...favoriteMovies, movie]);
    }
  };
  // <FavoriteMovieList main-container />
  return (
    <div
      id="main-container"
      className={darkMode ? 'dark bg-slate-900 h-screen' : ''}
    >
      <nav className=" bg-zinc-800 text-white px-6 py-3 dark:bg-gray-800 ">
        <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>{' '}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            data-testid="darkMode-toggle"
            checked={darkMode}
            onChange={switchclick}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3  font-medium text-gray-900 dark:text-gray-300">
            {darkMode ? 'Dark Mode On' : 'Dark Mode Off'}
          </span>
        </label>
      </nav>
      <div className=" max-w-4xl mx-auto px-3 pb-4 ">
        <MovieHeader />
        <div className="flex flex-col sm:flex-row gap-4">
          <FavoriteMovieList
            favoriteMovies={favoriteMovies}
            darkMode={darkMode}
          />
          <Switch>
            <Route exact path="/">
              <Redirect to="/movies" />
            </Route>
            <Route exact path="/movies/add">
              <AddMovieForm setMovies={setMovies} movies={movies} />
            </Route>
            <Route exact path="/movies/edit/:id">
              <EditMovieForm />
            </Route>
            <Route exact path="/movies/:id">
              <Movie
                addToFavorites={addToFavorites}
                deleteMovie={deleteMovie}
              />
            </Route>
            <Route exact path="/movies">
              <MovieList movies={movies} setMovies={setMovies} />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
