import React, { useState, useEffect } from 'react'
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);
  const [coordinates, setCoordinates] = useState(`(${getXY(index).join(',')})`);


  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const i = index
    const x = (i % 3) + 1;
    const y = Math.floor(i / 3) + 1;
    return [x, y];
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.

  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage('');
    setEmail('');
    setSteps(0);
    setIndex(4);
    setCoordinates('(2,2)');
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if(direction === 'left') {
      if(index % 3 === 0) {
        return index;
      }
      return index - 1;
    } else if(direction === 'right') {
      if(index % 3 === 2) {
        return index;
      }
      return index + 1;
    } else if(direction === 'up') {
      if(index < 3) {
        return index;
      }
      return index - 3;
    } else if(direction === 'down') {
      if(index > 5) {
        return index;
      }
      return index + 3;
    }

  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);
    const [x, y] = getXY(newIndex);
    
    if(newIndex === index) {
      setMessage(`You can't go ${direction.toLowerCase()}`);
      return;
    }
    setIndex(newIndex);
    setSteps(steps + 1);
    setMessage('');
  }
  useEffect(() => {
    setCoordinates(`(${getXY(index).join(',')})`);
  }, [index]);
  function onChange(evt) {
    // You will need this to update the value of the input.
    const { id, value } = evt.target;
    if(id === 'email') {
      setEmail(value);
    }
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    console.log('submitting');
    const [x, y] = getXY(index);
    if(!email) {
      setMessage('Ouch: email is required');
      return;
    }
    const payload = {
      "x" : x,
      "y" : y,
      "steps" : steps,
      "email" : email,
    }
    axios.post('http://localhost:9000/api/result', payload)
      .then(res => {
        setMessage(res.data.message);
    })
    .catch(err => {
      console.error(err);
      const errorMessage = err.response.data.message;
      setMessage(errorMessage);
    })
    setEmail('');
  }
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {coordinates}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={(evt) => move(evt)} id="left">LEFT</button>
        <button onClick={(evt) => move(evt)} id="up">UP</button>
        <button onClick={(evt) => move(evt)} id="right">RIGHT</button>
        <button onClick={(evt) => move(evt)} id="down">DOWN</button>
        <button onClick={() => reset()} id="reset">reset</button>
      </div>
      <form onSubmit={evt => onSubmit(evt)}>
        <input value={email} onChange={(evt) => onChange(evt)} id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
