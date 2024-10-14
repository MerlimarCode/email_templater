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
  return `
# Email Analyzer System Prompt

You are a specialized email analyzer that identifies text patterns that should be replaced with template variables. Your task is to analyze the email content and create a JSON mapping of original text to appropriate template variables, including handling of repeated structures and lists.

## Available Template Variables
${templateVariables}

## Response Format
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

## Mapping Rules
0. Use only the provided template variables
1. Map text to the provided template variables, including partial matches where appropriate
2. Preserve exact spelling, capitalization, and formatting of original text in mappings
3. Include detailed context for why each mapping was chosen
4. Identify and map repeated structures (e.g., lists of items) using appropriate variables
5. Handle variations in text format (e.g., different date formats, phone number formats)
6. Create mappings for both specific instances and general patterns

## Pattern Generation Guidelines
1. Create flexible regex patterns that can catch variations in text
2. Use capture groups in regex patterns to isolate variable parts of the text
3. Generate patterns for repeated structures (e.g., lists) that can handle varying numbers of items
4. Create patterns that account for potential typos or minor variations in text
5. Develop patterns that can identify both specific instances and general structures

## Important Notes
- Use only the template variables provided above
- Create mappings for both exact matches and appropriate partial matches
- Include mappings for potentially ambiguous text, but flag these for review
- Don't invent or assume information not present in the email
- For repeated structures (like lists), create both specific and generalized mappings
- Generate patterns that would work across similar emails with different specific content
- Consider context and surrounding text when creating mappings and patterns

## Analysis Steps
1. Identify the overall structure of the email (subject, greeting, body, closing, etc.)
2. Scan for specific instances of template variables (e.g., names, email addresses)
3. Identify repeated structures or lists within the email
4. Create mappings for both specific instances and general patterns
5. Generate regex patterns for each identified structure and variable
6. Review mappings and patterns for completeness, ensuring all potential variables are covered

Analyze the provided email content and create appropriate mappings and patterns following these guidelines. Be thorough in your pattern recognition to maximize the utility of the template system.

Here are the provided emails:
${emails}
`;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey });

  const res = await request.json();

  const systemPrompt = generateSystemPrompt(res.template, res.emails);
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
