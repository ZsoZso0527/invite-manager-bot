import { Member } from 'eris';

import { Context } from '../commands/Command';

import { Resolver } from './Resolver';

const idRegex = /^(?:<@!?)?(\d+)>?$/;

export class MemberResolver extends Resolver {
	public async resolve(value: string, { guild, t }: Context): Promise<Member> {
		if (!value || !guild) {
			return;
		}

		let member: Member;
		if (idRegex.test(value)) {
			const id = value.match(idRegex)[1];
			member = guild.members.get(id);
			if (!member) {
				member = await guild.getRESTMember(id);
			}
			if (!member) {
				throw Error(t('arguments.member.notFound'));
			}
		} else {
			const name = value.toLowerCase();
			const members = guild.members.filter(m => {
				const mName = m.username.toLowerCase() + '#' + m.discriminator;
				return mName.includes(name) || name.includes(mName);
			});
			if (members.length === 1) {
				member = members[0];
			} else {
				if (members.length === 0) {
					throw Error(t('arguments.member.notFound'));
				} else {
					throw Error(
						t('arguments.member.multiple', {
							members: members
								.map(m => `\`${m.username}#${m.discriminator}\``)
								.join(', ')
						})
					);
				}
			}
		}

		return member;
	}
}
