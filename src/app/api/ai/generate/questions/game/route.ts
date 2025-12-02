import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message,
  });
}

export async function POST(req: Request) {
  try {
    const { topic, length }: { topic: string; length: number } =
      await req.json();
    async function query(data: {
      messages: { role: string; content: string }[];
      model: string;
    }) {
      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result;
    }

    const aiPrompt = `Generate a quiz with ${length} multiple-choice questions on the subject "${topic}".
        Each question should have 6 options.
        Provide the correct answer for each question.
        OUTPUT ONLY JSON IN THIS FORMAT:
        [
          {
            "question": "Question text",
            "options": ["option1", "option2", "option3", "option4", "option5", "option6"],
            "answer": "correct option"
          }
        ]`;
      
    const aiResponse = await query({
      messages: [
        {
          role: "user",
          content: aiPrompt,
        },
      ],
      model: "deepseek-ai/DeepSeek-V3.2-Exp:novita",
    });

    return NextResponse.json({
      success: true,
      aiResponse
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
