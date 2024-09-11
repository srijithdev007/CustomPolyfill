import { useMemo, useRef, useState } from 'react';
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

function useMemoCustom(cb, deps) {
  let prevDependency = useRef([]);
  if(deps && JSON.stringify(prevDependency.current) !== JSON.stringify(deps)) {
    prevDependency.current = deps ? deps: [];
    return cb();
  } else {
    return prevDependency.current;
  }
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
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(100);

  useEffectCustom(() => {
    console.log('rendered');
    return () => {
      console.log('cleaned');
    };
  }, []);

  const squareNum = () => {
    console.log('square triggered');
    return count1 * count1;
  }

 // use custom memo here for squarenum expensive func
 let memoizedValue = useMemoCustom(squareNum, [count1]);


  return (
    <>
      <div className="card">
        <button onClick={() => setCount1((count1) => count1 + 1)}>
          Increment {count1}
        </button>
        <button onClick={() => setCount2((count2) => count2 - 1)}>
          Decrement {count2}
        </button>
        <span>squared value is: {memoizedValue}</span>
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
