import React, { useRef, useState } from "react";
import DefaultButton from "./ui/default-button";

export default function Timer({
  start,
  callBack,
}: {
  start: boolean;
  callBack: () => void;
}) {
  const [startTime, setStartTime] = useState(NaN)
  const [now, setNow] = useState(NaN)
  const intervalRef = useRef(0);

  function handleStart() {
    setStartTime(Date.now())
    setNow(Date.now())

    clearInterval(intervalRef.current)
    //@ts-ignore
    intervalRef.current = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    callBack()
  } 

  let timePassed = 0 

  if(!isNaN(startTime) && !isNaN(now)) {
    timePassed = (now - startTime) / 1000
  }

  return (
    <div className="flex flex-col gap-2. items-center">
      <span className="text-white">{timePassed.toFixed(0)}</span>
      <DefaultButton label={start ? "Restart" : "Start"} onClick={handleStart} />
    </div>
  );
}
