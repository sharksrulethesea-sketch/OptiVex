import {
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";

export default {
  customId: "ticket_dropdown",

  async execute(interaction, client) {

    const ticketType = interaction.values[0];

    const existingChannel = interaction.guild.channels.cache.find(
      c =>
        c.name === `${ticketType}-${interaction.user.username}`
    );

    if (existingChannel) {
      return interaction.reply({
        content: "You already have an open ticket.",
        ephemeral: true,
      });
    }

    const channel = await interaction.guild.channels.create({
      name: `${ticketType}-${interaction.user.username}`,
      type: ChannelType.GuildText,

      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
      ],
    });

    await channel.send({
      content:
        `🎫 Welcome ${interaction.user}\n` +
        `Category: **${ticketType}**\n\n` +
        `A staff member will assist you shortly.`,
    });

    await interaction.reply({
      content: `Your ticket has been created: ${channel}`,
      ephemeral: true,
    });
  },
};
