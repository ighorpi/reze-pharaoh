import { Injectable, Logger } from '@nestjs/common';
import {
  Context,
  MessageCommand,
  MessageCommandContext,
  Options,
  SlashCommand,
  SlashCommandContext,
  TargetMessage,
} from 'necord';
import { TimerInput } from './dto/timerInput.dto';
import { Client, EmbedBuilder, Message, TextChannel } from 'discord.js';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly client: Client,
    private readonly prisma: PrismaService,
  ) {}

  @SlashCommand({
    name: 'tick',
    description: 'tick...',
  })
  async onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: 'Tack!' });
  }

  @SlashCommand({
    name: 'temporizador',
    description: 'Temporizador boom! boom!',
  })
  async bombTimer(
    @Context() [interaction]: SlashCommandContext,
    @Options() { minutes, seconds }: TimerInput,
  ) {
    if (!(minutes || seconds)) {
      return interaction.reply({
        content: `Boom!`,
      });
    }

    await interaction.deferReply({ ephemeral: true });
    const userId = interaction.user.id;
    const channelId = interaction.channel.id;
    const totalSeconds = (seconds || 0) + (minutes ? minutes * 60 : 0);

    const executeAt = new Date(Date.now() + totalSeconds * 1000);
    const content = `<@${userId}> BOOM! 💥💥💥`;

    await this.prisma.scheduledMessage.create({
      data: {
        channelId,
        content,
        executeAt,
      },
    });

    return interaction.editReply({
      content: `Tick-tack... São ${totalSeconds} segundos para boom! 💣💣💣`,
    });
  }

  @MessageCommand({
    name: 'You Make My Heart Go BOOM!',
  })
  async youMakeMyHeartGoBOOM(
    @Context() [interaction]: MessageCommandContext,
    @TargetMessage() message: Message,
  ) {
    await interaction.reply({
      ephemeral: true,
      content: '💣',
    });
    const embed = new EmbedBuilder()
      .setTitle(`You Make My Heart Go BOOM! 💣💣💣`)
      .setImage(
        'https://media1.tenor.com/m/7LoGbsCPObgAAAAd/reze-bomb-devil.gif',
      );
    await message.reply({
      embeds: [embed],
    });
  }

  async sendMessage(content: string, channelId: string) {
    (this.client.channels.cache.get(channelId) as TextChannel).send(content);
  }
}
