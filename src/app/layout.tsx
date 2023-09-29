/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Movie Hangman',
  description: 'A hangman game with movie names',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <link
          href='https://cdn.lineicons.com/4.0/lineicons.css'
          rel='stylesheet'
        />
      </head>
      <body className={inter.className}>
        {children}
        <div className='bg'></div>
      </body>
    </html>
  )
}
