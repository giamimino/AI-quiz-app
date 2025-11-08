import React, { useEffect, useState } from 'react'
import Quiz from './Quiz'
import QuizOption from './QuizOption'
import QuizOptions from './QuizOptions'
import QuizWrapper from './QuizWrapper'
import QuizLoading from '../ui/loading/QuizLoading'

export default function QuizFetcher() {
  const [quizArray, setQuizArray] = useState<{ question: string, options: string[], answer: string }[]>([])
  const [line, setLine] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: "Random" })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLoading(false)
          
          const content =
            data.res?.choices?.[0]?.message?.content ||
            data.res?.result?.output_text ||
            "[]"
            
          const cleaned = content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()

          try {
            const parsed = JSON.parse(cleaned)
            setQuizArray(Array.isArray(parsed) ? parsed : [])
          } catch (err) {
            console.error("Failed to parse AI JSON:", err)
          }
        }
      })
  }, [])

  if(loading) return <QuizLoading />
  return (
    <QuizWrapper>
      <Quiz>
        {quizArray[line]?.question ?? ""}
      </Quiz>
      <QuizOptions>
        {quizArray[line]?.options.map((
          (q) => (
            <QuizOption
              key={q}
              option={q}
              selected={false}
              onClick={(option) => setLine(prev => option === quizArray[line].answer ? prev + 1 : prev)}
            />
          )
        ))}
      </QuizOptions>
    </QuizWrapper>
  )
}
