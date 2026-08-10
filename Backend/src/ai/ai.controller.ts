import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() body: { message: string; role?: string }) {
    if (!body.message?.trim()) {
      return { success: false, message: 'Message is required' };
    }

    const reply = await this.aiService.chat(
      body.message,
      body.role || 'student',
    );

    return {
      success: true,
      reply,
    };
  }
}