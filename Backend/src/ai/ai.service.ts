import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private groq: Groq;

  constructor() {
    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY is not set');
    }
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async chat(message: string, role: string = 'student') {
    try {
      if (!process.env.GROQ_API_KEY) {
        throw new InternalServerErrorException('GROQ_API_KEY is not set');
      }

      const response = await this.groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant for a School Management System.
User role: ${role}.
Help with classes, teachers, students, attendance, and assignments.
Be clear, polite, and professional.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
      });

      return response.choices[0]?.message?.content || 'No response from AI.';
    } catch (error: any) {
      console.error('Groq Error:', error?.message || error);
      throw new InternalServerErrorException(
        error?.message || 'AI service failed',
      );
    }
  }
}