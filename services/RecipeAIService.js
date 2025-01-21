import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";

// Fetch recipe data
const recipeResult = await fetch(
  "https://www.lekkerensimpel.com/traybake-met-spruitjes-en-krieltjes/"
);
const markdown = await recipeResult.text();
// console.log(markdown);

const chatModel = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama3.2",
  temperature: 0,
});

const prompt =
  ChatPromptTemplate.fromTemplate(`You are an agent whose job is to extract recipes from sites provided to you in html format. The context is provided in markdown:

<context>
{context}
</context>

Question: {input}`);

const simpleChain = prompt.pipe(chatModel).pipe(new StringOutputParser());

const answer = await simpleChain.invoke({
  context: markdown,
  //language: "dutch",
  input: "Provide the following data about the recipe: name, ingredients",
});
console.log(answer);
