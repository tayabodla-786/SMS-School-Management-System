import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async chat(message: string, role: string = 'student') {
    const systemPrompt = `You are a helpful AI assistant for a School Management System.
User role: ${role}.
Help with school topics like classes, teachers, students, attendance, and assignments.
Be clear, polite, and professional.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    return response.choices[0]?.message?.content || 'No response from AI.';
  }
}