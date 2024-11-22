import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly app: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron('30 * * * * *')
  async handleCron() {
    const now = new Date();
    const nextMinute = new Date(now.getTime() + 60 * 1000);

    const messages = await this.prisma.scheduledMessage.findMany({
      where: {
        executeAt: {
          gte: now,
          lt: nextMinute,
        },
      },
    });

    for (const message of messages) {
      const delay = message.executeAt.getTime() - Date.now();
      setTimeout(() => {
        this.app.sendMessage(message.content, message.channelId);

        this.prisma.scheduledMessage.update({
          where: { id: message.id },
          data: {
            isDeleted: true,
          },
        });
      }, delay);
    }
  }
}
