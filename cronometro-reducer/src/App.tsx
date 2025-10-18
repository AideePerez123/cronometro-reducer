import { useEffect, useReducer } from 'react';
import './App.css';

type State = {
  segundos: number;
  minutos: number;
  horas: number;
  laps: string[];
  corriendo: boolean;
};

type Action = { type: 'TIC' } | { type: 'VUELTA' } | { type: 'DETENER' } | { type: 'REINICIAR' };

function reducer(state: State, action: Action): State {
  console.log(action.type);
  switch (action.type) {
    case 'TIC':
      if (!state.corriendo) return state;
      let nuevoSegundo = state.segundos + 1;
      let nuevosMinutos = state.minutos;
      let nuevasHoras = state.horas;
      if (nuevoSegundo >= 60) {
        nuevoSegundo = 0;
        nuevosMinutos++;
        if (nuevosMinutos >= 60) {
          nuevosMinutos = 0;
          nuevasHoras++;
        }
      }
      return { ...state, horas: nuevasHoras, minutos: nuevosMinutos, segundos: nuevoSegundo };

    case 'VUELTA':
      if (!state.corriendo) return state;
      const tiempoVuelta = `${state.horas.toString().padStart(2, '0')}:${state.minutos.toString().padStart(2, '0')}:${state.segundos.toString().padStart(2, '0')}`;
      return { ...state, minutos: 0, segundos: 0, laps: [tiempoVuelta, ...state.laps] };

    case 'DETENER':
      return { ...state, corriendo: false };

    case 'REINICIAR':
      return { horas: 0, minutos: 0, segundos: 0, corriendo: true, laps: [] };

    default:
      return state;
  }
}

function App() {
  const initialState: State = {
    segundos: 0,
    minutos: 0,
    horas: 0,
    laps: [],
    corriendo: true,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.corriendo) {
      const intervalo = setInterval(() => {
        dispatch({ type: 'TIC' });
      }, 1000);
      return () => clearInterval(intervalo);
    }
  }, [state.corriendo]);

  return (
    <>
      
        <div className="flex flex-row gap-4">
          <div className="text-6xl font-mono mb-4">
            {String(state.horas).padStart(2, '0')}:{String(state.minutos).padStart(2, '0')}:{String(state.segundos).padStart(2, '0')}
          </div>

          <div className="flex gap-4">
            <button className="btn btn-accent" onClick={() => dispatch({ type: 'VUELTA' })}>
              OTRA VUELTA
            </button>
            <button className="btn btn-error" onClick={() => dispatch({ type: 'DETENER' })}>
              DETENER
            </button>
            <button className="btn btn-primary" onClick={() => dispatch({ type: 'REINICIAR' })}>
              REINICIAR
            </button>
          </div>
        </div>

        <div className="mt-6 w-64">
          <h2 className="text-xl font-semibold mb-2">Laps</h2>
          <ul className="list-decimal">
            {state.laps.map((lap, i) => (
              <li key={i}>{lap}</li>
            ))}
          </ul>
        </div>
      </>
  );
}

export default App;