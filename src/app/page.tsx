'use client'

import { ALPHABETS } from '@/lib/gameConstants'
import React, { useState, useEffect } from 'react'
import '@/style/word-game.css'
import { topMovies } from '@/data/topMovies'
import { Movie } from '@/lib/types'

const WordGame = () => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null)

  const [ei, setEi] = useState(0)
  const [currentGuess, setCurrentGuess] = useState<string[]>([])
  const [tries, setTries] = useState(0)
  const [progress, setProgress] = useState(0)

  const alphabets: string[] = ALPHABETS.split('')

  const currentMovieTitle = () => currentMovie?.title

  // const progressPercent: number = Math.round(
  //   (progress / currentWord.length) * 100
  // )
  // const degrees: number = Math.round((progress / currentWord.length) * 360)

  const puzzleSolved = () =>
    !!currentMovieTitle()?.replaceAll(' ', '').length &&
    progress === currentMovieTitle()?.length

  const triesWord = () => (tries == 1 ? 'try' : 'tries')

  const reset = () => {
    setCurrentMovie(null)
    setEi(0)
    setCurrentGuess([])
    setTries(0)
    setProgress(0)
  }

  const loadGame = () => {
    reset()

    const rnd: number = Math.floor(Math.random() * topMovies.length)
    const movie = topMovies[rnd]

    setCurrentMovie(movie)

    console.log(movie)
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
      currentMovieTitle()
        ?.split('')
        .filter((e) => e === letter).length ?? 0
    setProgress(progress + correctGuesses)
  }

  useEffect(() => {
    loadGame()
  }, [])

  return (
    <div className='card p-6 relative'>
      <h2>Guess the movie!</h2>
      <div className='debug'>{currentMovieTitle()}</div>
      <div className='flex mt-2 text-lg'>
        <div className='rounded-sm p-2 bg-purple-100 text-purple-700 mr-2'>
          <i className='lni lni-calendar mr-1'></i>
          {new Date(currentMovie?.release_date || '').toLocaleDateString(
            'en-US',
            { month: 'short', year: 'numeric' }
          )}
        </div>
        <div className='rounded-sm p-2 bg-green-100 text-green-700'>
          <i className='lni lni-star-fill mr-1'></i>
          {currentMovie?.vote_average} stars
        </div>
      </div>

      {/* <div className='progress-circle'>
        <div className='pc-overlay'>{progressPercent}%</div>
        <div
          className='pc-background'
          style={{
            background: `conic-gradient(#ec826f ${degrees}deg, #ddd ${degrees}deg)`
          }}
        ></div>
      </div> */}

      <div className='text-teal-600 bg-teal-600/10 py-2 px-6 text-lg absolute top-[6px] right-[6px] rounded-full'>
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
                className='outline-0 border-0 border-b-2 w-[3vw] md:w-[40px] xl:w-[60px] h-[3vw] md:h-[40px] lg:h-[60px] mx-2 bg-transparent text-center text-xs md:text-lg text-sky-800'
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
        {alphabets.map((l) => (
          <button
            key={l}
            className={getLetterButtonClass(l)}
            title={
              currentGuess.includes(l) ? `${l} already picked` : `Pick ${l}`
            }
            style={{ cursor: currentGuess.includes(l) ? 'default' : 'pointer' }}
            onClick={() => makeGuess(l)}
          >
            {l}
          </button>
        ))}
      </div>
      {puzzleSolved() && (
        <div className='my-4 text-center'>
          Congratulations! You guessed the movie{' '}
          <code className='text-bold'>{currentMovieTitle()}</code> in {tries}{' '}
          {triesWord()}! Click on the button below to begin a new game.
        </div>
      )}
      <div className='my-4 flex justify-center items-center'>
        <button
          id='new_game'
          className={
            'my-4 py-3 px-8 border-0 rounded-sm shadow-lg cursor-pointer text-white text-md flex justify-center items-center'
          }
          style={{ background: 'var(--linkColor)' }}
          onClick={loadGame}
        >
          <i className='lni lni-game mr-4' style={{ fontSize: 32 }}></i>
          New Game
        </button>
      </div>
    </div>
  )
}

export default WordGame
