import { Message } from 'eris';

import { IMClient } from '../../../../client';
import { Command, Context } from '../../../../framework/commands/Command';
import { CommandGroup, MusicCommand } from '../../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.resume,
			aliases: ['start'],
			group: CommandGroup.Music,
			guildOnly: true
		});
	}

	public async action(
		message: Message,
		args: any[],
		flags: {},
		{ t, guild }: Context
	): Promise<any> {
		const conn = await this.client.music.getMusicConnection(guild);
		if (!conn.isConnected()) {
			this.sendReply(message, 'I am currently not playing any music');
			return;
		}

		if (conn.isPaused()) {
			conn.resume();
		}
	}
}