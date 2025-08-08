import { Request, Response } from 'express';
import OpenAI from 'openai';

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function explainProblem(req: Request, res: Response) {
  const { statement } = req.body as { statement: string };
  if (!client) return res.json({ explanation: simpleExplain(statement) });
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful DSA tutor. Explain clearly and concisely.' },
        { role: 'user', content: `Explain this problem in simple terms and outline an approach:\n${statement}` }
      ]
    });
    const explanation = completion.choices[0]?.message?.content || simpleExplain(statement);
    res.json({ explanation });
  } catch (e) {
    res.json({ explanation: simpleExplain(statement) });
  }
}

export async function suggestSimilar(_req: Request, res: Response) {
  res.json({ suggestions: ['Two Sum', 'Three Sum', 'Subarray Sum Equals K'] });
}

function simpleExplain(statement: string) {
  return `Key idea: parse the problem, identify constraints, choose appropriate data structure. Problem: ${statement?.slice(0, 140)}...`;
}