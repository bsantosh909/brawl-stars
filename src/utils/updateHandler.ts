import { Events } from '../lib/Events';
import { parseSupercellTime } from './utils';
import { Player, Club, PlayerBattles } from '../lib/types';

export function handlePlayerUpdate(client: Events, player: Player) {
	const oldPlayer: Player = client.players.get(player.tag);

	if (!player.hasOwnProperty('tag')) return;
	client.players.set(player.tag, player);

	if (
		oldPlayer.name !== player.name
		|| oldPlayer.icon.id !== player.icon.id
		|| oldPlayer.nameColor !== player.nameColor
		|| oldPlayer.trophies !== player.trophies
		|| oldPlayer.expLevel !== player.expLevel
		|| oldPlayer.highestTrophies !== player.highestTrophies
		|| oldPlayer.powerPlayPoints !== player.powerPlayPoints
		|| oldPlayer.highestPowerPlayPoints !== player.highestPowerPlayPoints
		|| oldPlayer.soloVictories !== player.soloVictories
		|| oldPlayer.duoVictories !== player.duoVictories
		|| oldPlayer['3vs3Victories'] !== player['3vs3Victories']
		|| oldPlayer.bestRoboRumbleTime !== player.bestRoboRumbleTime
		|| oldPlayer.bestTimeAsBigBrawler !== player.bestTimeAsBigBrawler
		|| oldPlayer.isQualifiedFromChampionshipChallenge !== player.isQualifiedFromChampionshipChallenge
		|| oldPlayer.club?.tag !== player.club?.tag
	) client.emit('playerUpdate', oldPlayer, player);

	for (const brawler of player.brawlers) {
		const oldBrawler = oldPlayer.brawlers.find(br => br.id === brawler.id);
		if (
			!oldBrawler
			|| oldBrawler.gadgets.length !== brawler.gadgets.length
			|| oldBrawler.starPowers.length !== brawler.starPowers.length
			|| oldBrawler.rank !== brawler.rank
			|| oldBrawler.power !== brawler.power
		) client.emit('playerBrawlerUpdate', player, oldBrawler, brawler);
	}
}

export function handlePlayerBattlesUpdate(client: Events, tag: string, battles: PlayerBattles) {
	const lastPlayed = client.battles.get(tag);

	const times = [];
	for (const battle of battles.items) {
		const time = parseSupercellTime(battle.battleTime);
		if (time > lastPlayed) client.emit('playerBattle', tag, battle);
		times.push(time);
	}

	client.battles.set(tag, Math.max(...times));
}

export function handleClubUpdate(client: Events, club: Club) {
	const oldClub: Club = client.clubs.get(club.tag);

	if (!oldClub.hasOwnProperty('tag')) return;
	client.clubs.set(club.tag, club);

	if (
		oldClub.name !== club.name
		|| oldClub.badgeId !== club.badgeId
		|| oldClub.description !== club.description
		|| oldClub.requiredTrophies !== club.requiredTrophies
		|| oldClub.type !== club.type
	) client.emit('clubUpdate', oldClub, club);

	for (const oldMember of oldClub.members) {
		const member = club.members.find(mem => mem.tag === oldMember.tag);
		if (!member) client.emit('clubMemberRemove', club, oldMember);
	}
	for (const newMember of club.members) {
		const member = oldClub.members.find(mem => mem.tag === newMember.tag);
		if (!member) client.emit('clubMemberAdd', club, newMember);
	}
}
