import { useRef, useState } from 'react';
import './App.css';

function useEffectCustom(_cb: () => void, deps) {
  let isFirstTimeRender = useRef(true);
  let prevDependency = useRef<number[]>([]);
  // without dependency
  if (isFirstTimeRender.current) {
    let d = _cb();
    d();
    isFirstTimeRender.current = false;
    return;
  }
  let isDepChanged = deps
    ? JSON.stringify(deps) !== JSON.stringify(prevDependency.current)
    : true;
  if (isDepChanged) {
    let d = _cb();
    d();
  }
  prevDependency.current = deps || [];
  //with dependency
}

let deb = myDebounce((val) => {
  console.log(val, 'clicked');
}, 5000);
let throtle = myThrottle((val) => {
  console.log(val, 'clicked');
}, 5000);

function myDebounce(cb, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      return cb(...args);
    }, delay);
    console.log(timer, 'timer');
  };
}

function myThrottle(cb, delay) {
  let timer: number | null = null;
  return function (...args) {
    if (timer === null) {
      cb(...args);
    }
    timer = setTimeout(() => {
      timer = null;
    }, delay);
    console.log(timer, 'timer');
  };
}

function App() {
  const [count, setCount] = useState(0);

  useEffectCustom(() => {
    console.log('rendered');
    return () => {
      console.log('cleaned');
    };
  }, []);

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <input type="button" onClick={() => deb('debounce')} value="debounce" />
      <input
        type="button"
        onClick={() => throtle('throtle')}
        value="throttle"
      />
    </>
  );
}

export default App;
