import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message
  })
}

export async function POST(req: Request) {
  try {
    const { subject }: { subject: string } = await req.json()
    async function query(data: { messages: { role: string; content: string }[]; model: string }) {
      const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    }

    const aiResponse = await query({
      messages: [{ role: "user", content: `Generate a random quiz with 4 multiple choice questions in the subject "${subject}". 
                    Output ONLY JSON in this format:
                    [
                      {
                        "question": "Question text",
                        "options": ["option1", "option2", "option3", "option4", "option5", "option6"],
                        "answer": "correct option"
                      }
                    ]` }],
      model: "deepseek-ai/DeepSeek-V3.2-Exp:novita",
    });

    return NextResponse.json({
      success: true,
      res: aiResponse
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.")
  }
}