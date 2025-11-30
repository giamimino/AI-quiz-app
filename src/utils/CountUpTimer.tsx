import React, { useState, useEffect } from 'react';

function CountUpTimer() {
  const [seconds, setSeconds] = useState(0);
  const isActive = true

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div>
      <h1 className='text-white'>starting - {seconds}s</h1>
    </div>
  );
}

export default CountUpTimer;