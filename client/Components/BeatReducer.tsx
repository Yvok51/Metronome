import Beat from '../data/Beat';

interface NewTotalBeatAction {
  type: 'new-total';
  newTotal: number;
}

interface IncreaseBeatAction {
  type: 'increase';
  id: number;
}

type BeatAction = NewTotalBeatAction | IncreaseBeatAction;

function beatReducer(state: Beat[], action: BeatAction) {
  switch (action.type) {
    case 'new-total':
      if (state.length === action.newTotal) {
        return state;
      }
      if (state.length > action.newTotal) {
        return state.slice(0, action.newTotal);
      }
      const newBeats = Array.from(Array(action.newTotal - state.length).keys()).map(i =>
        Beat.newBeat(state.length + i),
      );
      return state.concat(newBeats);
    case 'increase':
      return state.map(beat => (beat.id === action.id ? beat.increase() : beat));
    default:
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
}

export { beatReducer, BeatAction };
