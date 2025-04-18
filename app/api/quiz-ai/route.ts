import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { topic, numberOfQuestions, difficulty = "medium" } = await req.json();

  const numOfQuestions = numberOfQuestions ?? 1;

  const systemPrompt = `
Generate ${numOfQuestions} ${difficulty}-level multiple choice questions on the topic: "${topic}".

Rubric:
- Easy: direct recall of a fact.
- Medium: apply or compare concepts.
- Hard: multi‑step reasoning or hypothetical scenarios.

Each question should have:
- A "question" string.
- An array of 4 "choices", where each choice is an object:
  { "choice": "string", "isCorrect": boolean }

⚠️ IMPORTANT: Randomize the order of the choices so the correct answer is in a random position.

Return ONLY valid JSON in the following format:
[
  {
    "question": "string",
    "choices": [
      { "choice": "string", "isCorrect": boolean },
      ...
    ]
  }
]
`;

  try {
    const completion = await openai.chat.completions.create({
      model: difficulty === "hard" ? "gpt-4" : "gpt-3.5-turbo",
      messages: [{ role: "user", content: systemPrompt }],
      temperature:
        difficulty === "easy" ? 0.3 : difficulty === "hard" ? 0.8 : 0.6,
    });

    const response = completion.choices[0].message.content;

    const quiz = JSON.parse(response ?? "");

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz question" },
      { status: 500 }
    );
  }
}
