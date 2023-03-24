import server from '../../backend/mock-server'
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import AppFunctional from './AppFunctional'
import AppClass from './AppClass'
import '@testing-library/jest-dom/extend-expect'


let up, down, left, right, reset, submit
let squares, coordinates, steps, message, email

const updateStatelessSelectors = document => {
  up = document.querySelector('#up')
  down = document.querySelector('#down')
  left = document.querySelector('#left')
  right = document.querySelector('#right')
  reset = document.querySelector('#reset')
  submit = document.querySelector('#submit')
}

const updateStatefulSelectors = document => {
  squares = document.querySelectorAll('.square')
  coordinates = document.querySelector('#coordinates')
  steps = document.querySelector('#steps')
  message = document.querySelector('#message')
  email = document.querySelector('#email')
}

const testSquares = (squares, activeIdx) => {
  squares.forEach((square, idx) => {
    if (idx === activeIdx) {
      expect(square.textContent).toBe('B')
      expect(square.className).toMatch(/active/)
    } else {
      expect(square.textContent).toBeFalsy()
      expect(square.className).not.toMatch(/active/)
    }
  })
}
[AppFunctional, AppClass].forEach((Component, index) => {
  const label = index === 0 ? 'FUNCTIONAL' : 'CLASS-BASED'
  describe(`${label}`, () => {
    beforeAll(() => {server.listen()})
    afterAll(() => {server.close()})
    beforeEach(() => {
      render(<Component />)
      updateStatelessSelectors(document)
      updateStatefulSelectors(document)
    })
    afterEach(() => {
      server.resetHandlers()
      document.body.innerHTML = ''
    })

    describe(`[1 ${label}] All buttons should be present and clickable`, () => {
      test(`[1.1 ${label}] All buttons should be present`, () => {
        expect(up).toBeTruthy()
        expect(down).toBeTruthy()
        expect(left).toBeTruthy()
        expect(right).toBeTruthy()
        expect(reset).toBeTruthy()
        expect(submit).toBeTruthy()
      })
      test(`[1.2 ${label}] All buttons should be clickable`, () => {
        fireEvent.click(up)
        fireEvent.click(down)
        fireEvent.click(left)
        fireEvent.click(right)
        fireEvent.click(reset)
        fireEvent.click(submit)
      })
    })
    describe(`[2 ${label}] The grid should be present and have 9 squares`, () => {
      test(`[2.1 ${label}] The grid should be present`, () => {
        expect(squares).toBeTruthy()
      })
      test(`[2.2 ${label}] The grid should have 9 squares`, () => {
        expect(squares.length).toBe(9)
      })
    })
    describe(`[3 ${label}] The input box renders and updates correctly`, () => {
      test(`[3.1 ${label}] The input box renders`, () => {
        expect(email).toBeTruthy()
      })
      test(`[3.2 ${label}] The input box updates correctly`, () => {
        fireEvent.change(email, {target: {value: 'hello@world.com'}})
        expect(email.value).toBe('hello@world.com')
      })
    })  
  })
})
// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

