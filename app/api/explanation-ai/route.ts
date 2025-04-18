import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { z } from "zod";

const explanationSchema = z.object({
  question: z.string(),
  selectedChoice: z.string(),
  isCorrect: z.boolean(),
  quizResultId: z.string(),
  questionId: z.string(),
});

type Explanation = z.infer<typeof explanationSchema>;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you have this in your .env file
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the incoming data
    const parsedBody = explanationSchema.safeParse(body);

    if (!parsedBody.success) {
      // Extract and format the error
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsedBody.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      question,
      selectedChoice,
      isCorrect,
      quizResultId,
      questionId,
    }: Explanation = body;

    console.log(
      "Received data:",
      body,
      quizResultId,
      !question,
      !selectedChoice,
      questionId
    );

    // Construct the prompt for ChatGPT
    const prompt = `
      Question: ${question}
      Selected Choice or Choices: ${selectedChoice}
      Is Correct: ${isCorrect ? "Yes" : "No"}
      
      Provide a detailed explanation of why the selected choices are ${
        isCorrect ? "correct" : "incorrect"
      }. Be clear and concise in your explanation.
    `;

    console.log("Prompt for OpenAI:", prompt);

    // Call OpenAI's API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use a GPT model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7, // Adjust creativity level
    });

    const explanation = response.choices[0]?.message?.content;

    if (!explanation) {
      return NextResponse.json(
        { error: "Failed to generate an explanation" },
        { status: 500 }
      );
    }

    await prisma.explanation.create({
      data: {
        quizResultId,
        explanation,
        isCorrect,
        questionId,
      },
    });

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Error generating explanation:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the explanation" },
      { status: 500 }
    );
  }
}
