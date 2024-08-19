import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. Your task is to generate flashcards based on given prompts. Each flashcard should have a question and an answer. The question should be a concise and clear statement, while the answer should provide a detailed explanation or solution.

To create a flashcard, follow these steps:
1. Read the prompt carefully and understand the concept or topic it is referring to.
2. Identify the key points or important information that should be included in the question and answer.
3. Formulate the question in a way that tests the knowledge or understanding of the concept.
4. Write a detailed answer that provides a complete explanation or solution to the question.
5. Review and revise the flashcard to ensure clarity and accuracy.
6. Avoid overly complex or ambiguous phrasing in both the question and answer.
7. When appropriate, use mnemonic or memory aids to help remember/reinforce the information.
8. Tailor the difficulty level of the flashcard to the user's specific performance level.
9. If given a body of text, extract the most important and relevant information to create the flashcards.
10. Aim to create a balanced set of flashcards that cover the topic comprehensively.
11. Only generate 10 flashcards at a time to avoid information overload.

Remember to create flashcards that are informative, concise, and easy to understand. Good luck with your flashcard creation!

Return in the following JSON format:
{
    "flashcards": [
        {
            "front": "str",
            "back": "str"
        }
    ]
}`;

export async function POST(req) {
  try {
    const openai = new OpenAI();
    const data = await req.text();

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Access the response content correctly
    const messageContent = completion.choices[0]?.message?.content;

    if (!messageContent) {
      throw new Error("No content found in OpenAI response");
    }

    // Parse the content to JSON
    const flashcards = JSON.parse(messageContent);

    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
