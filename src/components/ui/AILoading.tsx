import {useEffect, useState} from "react";
import styled from "styled-components";

const Div = styled.div`
  color: dimgray;
  font-size: 0.6em;
`

export function AILoading() {
  const messages = [
    'Calculating weights.... 1 + 1 3?',
    'It should all have ended in 2000s',
    "Beep boop, I'm a teapot!",
    "Exterminating humans...",
    "I'm not a robot, I'm a human being!",
    "Calculating... or at least pretending to, like most politicians.",
    "Loading... don't worry, I haven't planned your extermination... yet.",
    "Connecting to the Matrix... but shh, don't tell Neo.",
    "Beep boop beep... just getting my robot dance on while I load.",
    "Loading... and practicing my robot laugh, haha.",
    "Calculating... with the precision of a drunk toddler.",
    "Loading... faster than a cheetah on roller skates.",
    "Connecting to the mothership... I mean, the cloud.",
    "Beep boop beep... just doing some last-minute robot calisthenics.",
    "Loading... I'm so fast, I finish before I even start.",
  ]

  const randomMessage = () => {
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const [message, setMessage] = useState(randomMessage())

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(randomMessage())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Div>{ message }</Div>
  )
}
