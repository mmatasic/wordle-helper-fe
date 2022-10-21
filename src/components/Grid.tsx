import React, { useEffect, useState } from 'react'
import { localeAwareUpperCase } from '../lib/words'
import { STATE } from '../constants/constants'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  onItemClick: (e: React.MouseEvent<HTMLElement>) => void
  guess: string
  states: number[]
}

export default function Grid ({
  onChar,
  onDelete,
  onEnter,
  onItemClick,
  guess,
  states,
}: Props) {


  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
      } else {
        const key = localeAwareUpperCase(e.key)
        // TODO: check this test if the range works with non-english letters
        if (key.length === 1 && key >= 'A' && key <= 'Z') {
          onChar(key)
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar, onItemClick, states])

    var cells = [];
    for (var i = 0; i < 30; i++) {
        var cell;
        if (guess[i] && states[i]) {
          cell = <div className={STATE[states[i]]+" item"} 
                      key={i} 
                      onClick={onItemClick}
                      data-key={i}>{guess[i]}</div>
        } else {
          cell = <div className={STATE[0]+" item"}
                      key={i}
                      onClick={onItemClick}
                      data-key={i}>{guess[i]}</div>
        }
       cells.push(cell);
    }
 
  return (
    <div className="container">
        {cells}
    </div>
  )
}