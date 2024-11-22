import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AppService {
  constructor(private readonly client: Client) {}

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
    const totalSeconds = (seconds ? seconds : 0) + (minutes ? minutes * 60 : 0);

    // this sendMessage should be schedule in now plus 'totalSeconds' in the future
    this.sendMessage(`<@${userId}> BOOM! 💥💥💥 `, channelId);

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
