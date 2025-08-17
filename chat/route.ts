import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  // Use only OpenAI model to fix type error
  const model = openai("gpt-4o");

  const stream = await streamText({
    model,
    system: "You are a helpful assistant.",
    messages,
  });
  return stream.toDataStreamResponse();
}