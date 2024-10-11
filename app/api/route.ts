import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const EmailMapping = z.object({
  text: z.string(),
  variable: z.string(),
  reason: z.string(),
});

const PatternMatch = z.object({
  variable: z.string(),
  pattern: z.string(),
  description: z.string(),
});

const EmailAnalysisSchema = z.object({
  mappings: z.array(EmailMapping),
  patterns: z.array(PatternMatch),
});

function generateSystemPrompt(
  templateVariables: string[],
  emails: string
): string {
  return `You are a specialized email analyzer that identifies text that should be replaced with template variables. Your task is to analyze the email content and create a JSON mapping of original text to appropriate template variables.

# Available Template Variables
${templateVariables.map((v) => `- {{${v}}}`).join("\n")}

# Response Format
Respond only with a JSON object containing:
1. "mappings": Array of identified text-to-variable mappings
2. "patterns": Array of regex patterns that could identify similar text in other emails

Example response format:
\`\`\`json
{
  "mappings": [
    {
      "text": "actual text from email",
      "variable": "{{template_variable}}",
      "reason": "why this mapping was chosen"
    }
  ],
  "patterns": [
    {
      "variable": "{{template_variable}}",
      "pattern": "regex_pattern",
      "description": "what this pattern matches"
    }
  ]
}
\`\`\`

# Mapping Rules
1. Only map text to the provided template variables
2. Preserve exact spelling and formatting of original text
3. Include context for why each mapping was chosen
4. Focus on high-confidence matches
5. Generate regex patterns that could help identify similar text

# Important Notes
- Only use the template variables provided above
- Don't generate partial matches
- Don't create mappings for ambiguous text
- Don't invent or assume information not present in the email
- Include the full original text in mappings
- Generate patterns that would work across similar emails

Analyze the provided email content and create appropriate mappings and patterns following these guidelines.

Here are the provided emails:
${emails}
`;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey });

  const res = await request.json();

  const systemPrompt = generateSystemPrompt(res.template, res.emails);
  // console.log(systemPrompt);
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
    ],
    model: "gpt-4o",
    response_format: zodResponseFormat(EmailAnalysisSchema, "email_analysis"),
  });
  const responseContent =
    completion.choices[0]?.message.content!.trim() ||
    "I couldn't generate a response.";
  return Response.json({ responseContent });
}

// import { OpenAI } from "openai";

// // Type definitions for clarity
// type TemplateVariable = string;
// type Mapping = {
//   text: string;
//   variable: string;
//   reason: string;
// };
// type Pattern = {
//   variable: string;
//   pattern: string;
//   description: string;
// };

// function generateSystemPrompt(templateVariables: string[]): string {
//   return `You are a specialized email analyzer that identifies text that should be replaced with template variables. Your task is to analyze the email content and create a JSON mapping of original text to appropriate template variables.

// # Available Template Variables
// ${templateVariables.map((v) => `- {{${v}}}`).join("\n")}

// # Response Format
// Respond only with a JSON object containing:
// 1. "mappings": Array of identified text-to-variable mappings
// 2. "patterns": Array of regex patterns that could identify similar text in other emails

// Example response format:
// \`\`\`json
// {
//   "mappings": [
//     {
//       "text": "actual text from email",
//       "variable": "{{template_variable}}",
//       "reason": "why this mapping was chosen"
//     }
//   ],
//   "patterns": [
//     {
//       "variable": "{{template_variable}}",
//       "pattern": "regex_pattern",
//       "description": "what this pattern matches"
//     }
//   ]
// }
// \`\`\`

// # Mapping Rules
// 1. Only map text to the provided template variables
// 2. Preserve exact spelling and formatting of original text
// 3. Include context for why each mapping was chosen
// 4. Focus on high-confidence matches
// 5. Generate regex patterns that could help identify similar text

// # Important Notes
// - Only use the template variables provided above
// - Don't generate partial matches
// - Don't create mappings for ambiguous text
// - Don't invent or assume information not present in the email
// - Include the full original text in mappings
// - Generate patterns that would work across similar emails

// Analyze the provided email content and create appropriate mappings and patterns following these guidelines.`;
// }

// export async function POST(request: Request) {
//   const apiKey = process.env.OPENAI_API_KEY;
//   const openai = new OpenAI({ apiKey });

//   try {
//     const { text, templater } = await request.json();

//     // Validate inputs
//     if (!Array.isArray(templater) || templater.length === 0) {
//       return Response.json(
//         { error: "Template variables must be provided as an array" },
//         { status: 400 }
//       );
//     }

//     if (!text || typeof text !== "string") {
//       return Response.json(
//         { error: "Email text must be provided" },
//         { status: 400 }
//       );
//     }

//     // Generate the system prompt with the provided template variables
//     const systemPrompt = generateSystemPrompt(templater);
//     const completion = await openai.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: systemPrompt,
//         },
//       ],
//       model: "gpt-3.5-turbo",
//     });
//     const responseContent =
//       completion.choices[0]?.message.content!.trim() ||
//       "I couldn't generate a response.";

//     console.log(responseContent);
//     return Response.json({ responseContent });

//     // If text is too long, we need to chunk it
//     const chunks = splitIntoChunks(text, 4000); // OpenAI has a token limit
//     const allMappings: Mapping[] = [];
//     const allPatterns: Pattern[] = [];

//     for (const chunk of chunks) {
//       const completion = await openai.chat.completions.create({
//         messages: [
//           {
//             role: "system",
//             content: systemPrompt,
//           },
//           {
//             role: "user",
//             content: chunk,
//           },
//         ],
//         model: "gpt-3.5-turbo-1106",
//         response_format: { type: "json_object" },
//         temperature: 0.2,
//       });

//       try {
//         const response = JSON.parse(
//           completion.choices[0]?.message?.content || "{}"
//         );
//         if (response.mappings) allMappings.push(...response.mappings);
//         if (response.patterns) allPatterns.push(...response.patterns);
//       } catch (e) {
//         console.error("Failed to parse LLM response:", e);
//       }
//     }

//     // Validate mappings against provided template variables
//     const validMappings = allMappings.filter((mapping) =>
//       templater.includes(mapping.variable.replace(/[{}]/g, ""))
//     );

//     // Deduplicate and validate results
//     const uniqueMappings = deduplicateMappings(validMappings);
//     const uniquePatterns = deduplicatePatterns(allPatterns);

//     return Response.json({
//       mappings: uniqueMappings,
//       patterns: uniquePatterns,
//     });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     console.log(error);
//     return Response.json({ error: "Failed to process email" }, { status: 500 });
//   }
// }

// function splitIntoChunks(text: string, maxLength: number): string[] {
//   // Split at paragraph boundaries to preserve context
//   const paragraphs = text.split(/\n\s*\n/);
//   const chunks: string[] = [];
//   let currentChunk = "";

//   for (const paragraph of paragraphs) {
//     if ((currentChunk + paragraph).length > maxLength) {
//       if (currentChunk) chunks.push(currentChunk);
//       currentChunk = paragraph;
//     } else {
//       currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
//     }
//   }

//   if (currentChunk) chunks.push(currentChunk);
//   return chunks;
// }

// function deduplicateMappings(mappings: Mapping[]): Mapping[] {
//   return Array.from(new Map(mappings.map((m) => [m.text, m])).values());
// }

// function deduplicatePatterns(patterns: Pattern[]): Pattern[] {
//   return Array.from(new Map(patterns.map((p) => [p.pattern, p])).values());
// }
