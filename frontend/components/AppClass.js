import React from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at


const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props) {
    super(props)
    this.state = {
      ...initialState,
      coordinates: `(${this.getXY(initialState.index).join(', ')})`,
    }
  }

  getXY = (index) => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const i = index
    const x = (i % 3) + 1;
    const y = Math.floor(i / 3) + 1;
    return [x, y];
  }
  getXYMessage = (x, y) => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return `Coordinates (${x}, ${y})`;
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({...initialState, coordinates: `(2,2)`});
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if(direction === 'left') {
      if(this.state.index % 3 === 0) {
        return this.state.index;
      }
      return this.state.index - 1;
    } else if(direction === 'right') {
      if(this.state.index % 3 === 2) {
        return this.state.index;
      }
      return this.state.index + 1;
    } else if(direction === 'up') {
      if(this.state.index < 3) {
        return this.state.index;
      }
      return this.state.index - 3;
    } else if(direction === 'down') {
      if(this.state.index > 5) {
        return this.state.index;
      }
      return this.state.index + 3;
    }
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);
    const [x, y] = this.getXY(nextIndex);
    

    if(nextIndex === this.state.index) {
      this.setState({
        message: `You can't go ${direction.toLowerCase()}`,
      });
      return;
    }
    this.setState({
      index: nextIndex,
      steps: this.state.steps + 1,
      coordinates: (`(${x},${y})`),
      message: '',
    });
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    const { id, value } = evt.target;
    this.setState({ [id]: value });
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    console.log('submitting')
    const [x, y] = this.getXY(this.state.index);
    const { email } = this.state
    if (!email) {
      this.setState({ message: 'Ouch: email is required' });
      return;
    }
    const payload = {
      "x" : x,
      "y" : y,
      "steps" : this.state.steps,
      "email" : email,
    }
    axios.post('http://localhost:9000/api/result', payload)
      .then(res => {  
        this.setState({ message: res.data.message })
      })
      .catch(err => {
        console.error(err);
        const errorMesage = err.response.data.message;
        this.setState({ message: errorMesage });
      });
      this.setState({email: ''});
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates {this.state.coordinates}</h3>
          <h3 id="steps">You moved {this.state.steps} {(this.state.steps === 1 ? 'time' : 'times')}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={evt => this.move(evt)} id="left">LEFT</button>
          <button onClick={evt => this.move(evt)} id="up">UP</button>
          <button onClick={evt => this.move(evt)} id="right">RIGHT</button>
          <button onClick={evt => this.move(evt)} id="down">DOWN</button>
          <button onClick={() => this.reset()} id="reset">reset</button>
        </div>
        <form onSubmit={evt => this.onSubmit(evt)}>
          <input  onChange={(evt) => this.onChange(evt)} value={this.state.email} id="email" type="email" placeholder="type email"></input>
          <input  id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
