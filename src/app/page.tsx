/* eslint-disable @next/next/no-img-element */
'use client'

import { ALPHABETS } from '@/lib/gameConstants'
import React, { useState, useEffect } from 'react'
import '@/style/word-game.css'
import { topMovies } from '@/data/topMovies'
import { Movie, MovieDetail } from '@/lib/types'
import GameOver from '@/components/GameOver'

const WordGame = () => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(topMovies[0])
  const [currentMovieDetails, setCurrentMovieDetails] =
    useState<MovieDetail | null>(null)
  const [movieIndex, setMovieIndex] = useState<number>(0)

  const [currentGuess, setCurrentGuess] = useState<string[]>([])
  const [tries, setTries] = useState(0)
  const [progress, setProgress] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const alphabets: string[] = ALPHABETS.split('')

  const currentMovieTitle = () => currentMovie?.title.toUpperCase()
  const currentMovieTitleCompacted = () =>
    currentMovieTitle()?.replaceAll(' ', '')

  const progressPercent = () =>
    Math.round((progress / (currentMovieTitleCompacted()?.length || 1)) * 100)
  const degrees = () =>
    Math.round((progress / (currentMovieTitleCompacted()?.length || 1)) * 360)

  const puzzleSolved = () =>
    !!currentMovieTitleCompacted()?.length &&
    progress === currentMovieTitleCompacted()?.length

  const triesWord = () => (tries == 1 ? 'try' : 'tries')

  const reset = () => {
    setCurrentMovie(null)
    setCurrentGuess([])
    setTries(0)
    setProgress(0)
  }

  const loadMovieDetails = async (id: number) => {
    const movieData = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=8ca937dcbd59473494640021e762b66b`
    ).then(d => d.json())

    setCurrentMovieDetails(movieData)
    console.log(movieData)
  }

  const loadGame = () => {
    reset()

    // const rnd: number = Math.floor(Math.random() * topMovies.length)
    const movie = topMovies[movieIndex]

    if (movieIndex === topMovies.length - 1) {
      setGameOver(true)
      return
    }

    setMovieIndex(movieIndex + 1)
    setCurrentMovie(movie)
    loadMovieDetails(movie.id)
  }

  const reveal = () => {
    document.querySelectorAll('input').forEach(e => {
      e.innerText = e.value
    })
  }

  const uniqueCharacters = (): string[] => {
    const allChars = currentMovieTitleCompacted()?.split('')
    const set = new Set(allChars)
    return Array.from(set)
  }

  const getGuessedLetter = (index: number): string => {
    if (currentMovieTitle() === undefined) return ''

    if (currentGuess.includes(currentMovieTitle()?.[index] ?? '******')) {
      return currentMovieTitle()?.[index] ?? '******'
    }

    return ''
  }

  const getLetterButtonClass = (letter: string): string => {
    return currentGuess.includes(letter)
      ? 'letter-button-disabled'
      : 'letter-button'
  }

  const makeGuess = (letter: string) => {
    if (currentGuess.includes(letter)) return
    setCurrentGuess([...currentGuess, letter])
    setTries(tries + 1)

    const correctGuesses: number =
      currentMovieTitleCompacted()
        ?.split('')
        .filter(e => e === letter).length ?? 0
    console.log({
      correctGuesses: currentMovieTitleCompacted()?.split(''),
    })
    setProgress(progress + correctGuesses)
  }

  useEffect(() => {
    loadGame()
  }, [])

  return (
    <>
      {gameOver && <GameOver />}
      <div className='card p-6 relative'>
        <div className='flex-none'>
          <img src='/undraw_horror_movie_3988.svg' alt='popcorn' width={512} />
        </div>
        <div className='flex flex-col justify-center items-center'>
          <h1>Guess the movie!</h1>
          {/* <div className='debug'>{currentMovieTitle()}</div> */}
          <h4 className='mt-6 my-4'>Movie {movieIndex}</h4>
          <div className='flex mt-2 mb-4 text-lg'>
            <div
              className='rounded-sm p-2 bg-amber-100 text-amber-700 mr-2'
              style={{ textTransform: 'uppercase', fontWeight: 600 }}
            >
              <i className='lni lni-popup mr-2 relative top-[2px]'></i>
              <span className='text-sm'>
                {currentMovieDetails?.genres?.map(g => g.name).join(', ')}
              </span>
            </div>{' '}
            <div className='rounded-sm p-2 bg-purple-100 text-purple-700 mr-2'>
              <i className='lni lni-calendar mr-2'></i>
              {new Date(currentMovie?.release_date || '').toLocaleDateString(
                'en-US',
                { month: 'short', year: 'numeric' }
              )}
            </div>
            <div className='rounded-sm p-2 bg-green-100 text-green-700 mr-2'>
              <i className='lni lni-star-fill mr-2'></i>
              {currentMovie?.vote_average} stars
            </div>
            <div
              className='rounded-sm p-2 bg-blue-100 text-blue-700'
              style={{ textTransform: 'uppercase', fontWeight: 600 }}
            >
              <i className='fa fa-info-circle mr-2' aria-hidden='true'></i>
              <span className='text-sm'>
                {currentMovie?.clue?.join(', ') ?? 'N/A'}
              </span>
            </div>{' '}
          </div>

          <div className='progress-circle'>
            <div className='pc-overlay'>{progressPercent()}%</div>
            <div
              className='pc-background'
              style={{
                background: `conic-gradient(teal ${degrees()}deg, #ddd ${degrees()}deg)`,
              }}
            ></div>
          </div>

          <div className='text-[teal] bg-teal-600/10 py-2 px-6 text-lg absolute top-[20px] right-[20px] text-bold rounded-full'>
            {tries} tries
          </div>

          <div className='flex flex-wrap justify-center items-center mb-6 sm:mb-8'>
            {currentMovieTitle()
              ?.split('')
              .map((l, i) => {
                if (l === ' ') return <span className='mx-8'></span>
                return (
                  <input
                    key={i}
                    readOnly
                    className='outline-0 border-0 border-b-2 w-[3vw] md:w-[40px] xl:w-[60px] h-[3vw] md:h-[40px] lg:h-[60px] mx-2 pb-0 bg-transparent text-center text-xs md:text-lg text-sky-800'
                    value={getGuessedLetter(i)}
                  />
                )
              })}
          </div>

          <div className='button-container'>
            <div
              className='absolute w-full h-full'
              style={{
                pointerEvents: puzzleSolved() ? 'all' : 'none',
              }}
            ></div>
            {alphabets.map(l => (
              <button
                key={l}
                className={getLetterButtonClass(l)}
                title={
                  currentGuess.includes(l) ? `${l} already picked` : `Pick ${l}`
                }
                style={{
                  cursor: currentGuess.includes(l) ? 'default' : 'pointer',
                }}
                onClick={() => makeGuess(l)}
              >
                {l}
              </button>
            ))}
          </div>
          {puzzleSolved() && (
            <div
              className='my-4 mt-8 text-md text-center'
              style={{ fontSize: 18 }}
            >
              Congratulations! You guessed the movie{' '}
              <span style={{ fontWeight: 'bold' }}>{currentMovieTitle()}</span>{' '}
              in {tries} {triesWord()} (
              {Math.round((uniqueCharacters().length / tries) * 100)}%
              efficiency)! Click on the button below to begin a new game.
            </div>
          )}
          <div className='my-4 flex justify-center items-center'>
            {/* <button
              id='reveal'
              className={
                'my-4 py-3 px-8 border-0 rounded-sm shadow-lg cursor-pointer text-white text-md flex justify-center items-center'
              }
              onClick={reveal}
            >
              <i className='lni lni-game mr-4' style={{ fontSize: 32 }}></i>
              Reveal
            </button> */}
            <button
              id='new_game'
              className={
                'my-4 py-3 px-8 border-0 rounded-sm shadow-lg cursor-pointer text-white text-md flex justify-center items-center'
              }
              onClick={loadGame}
            >
              <i className='lni lni-game mr-4' style={{ fontSize: 32 }}></i>
              New Game
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default WordGame
