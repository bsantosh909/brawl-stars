import { validateTag, fetchURL } from '../utils/utils';
import qs from 'querystring';

export class Client {

	private token: string;
	private baseUrl: string;
	private timeout: number;

	public constructor(options: ClientOptions) {
		this.token = options.token;
		this.baseUrl = options.baseUrl || 'https://api.brawlstars.com/v1';
		this.timeout = options.timeout || 0;
	}

	public player(playerTag: string): Promise<Player> {
		const tag = validateTag(playerTag);
		if (!tag) throw new Error('INALID_TAG');
		return this.fetch(`/players/${tag}`);
	}

	public playerBattles(playerTag: string): Promise<PlayerBattles> {
		const tag = validateTag(playerTag);
		if (!tag) throw new Error('INVALID_TAG');
		return this.fetch(`/players/${tag}/battlelog`);
	}

	public club(clubTag: string): Promise<Club> {
		const tag = validateTag(clubTag);
		if (!tag) throw new Error('INVALID_TAG');
		return this.fetch(`/clubs/${tag}`);
	}

	public clubMembers(clubTag: string): Promise<ClubMembers> {
		const tag = validateTag(clubTag);
		if (!tag) throw new Error('INVALID_TAG');
		return this.fetch(`/clubs/${tag}/members`);
	}

	public brawlers(): Promise<Brawlers> {
		return this.fetch('/brawlers');
	}

	public brawler(brawlerId: string | number): Promise<Brawler> {
		return this.fetch(`/brawlers/${brawlerId}`);
	}

	public clubRankings(countryCode = 'global', options?: SearchOptions): Promise<ClubRankings> {
		if (countryCode !== 'global' && countryCode.length !== 2) throw new Error('INCORRECT_COUNTRY_CODE');
		return this.fetch(`/ranking/${countryCode}/clubs`, options);
	}

	public playerRankings(countryCode = 'global', options?: SearchOptions): Promise<Rankings> {
		if (countryCode !== 'global' && countryCode.length !== 2) throw new Error('INCORRECT_COUNTRY_CODE');
		return this.fetch(`/rankings/${countryCode}/players`, options);
	}

	public brawlerRanking(brawlerId: string | number, countryCode = 'global', options?: SearchOptions): Promise<Rankings> {
		if (countryCode !== 'global' && countryCode.length !== 2) throw new Error('INCORRECT_COUNTRY_CODE');
		return this.fetch(`/rankings/${countryCode}/brawlers/${brawlerId}`, options);
	}

	public powerPlayRankings(seasonId: string, countryCode = 'global', options?: SearchOptions): Promise<Rankings> {
		if (countryCode !== 'global' && countryCode.length !== 2) throw new Error('INCORRECT_COUNTRY_CODE');
		return this.fetch(`/rankings/${countryCode}/powerplay/seasons/${seasonId}`, options);
	}

	public powerPlaySeasons(countryCode = 'global', options?: SearchOptions): Promise<Seasons> {
		if (countryCode !== 'global' && countryCode.length !== 2) throw new Error('INCORRECT_COUNTRY_CODE');
		return this.fetch(`/rankings/${countryCode}/powerplay/seasons`, options);
	}

	private fetch(path: string, options?: any) {
		return fetchURL(`${this.baseUrl}${path}?${this.query(options)}`, this.token, this.timeout);
	}

	private query(options: any) {
		return options ? qs.stringify(options) : '';
	}

}

interface ClientOptions {
	token: string;
	baseUrl?: string;
	timeout?: number;
}

interface SearchOptions {
	limit: number;
	before: string;
	after: string;
}

interface Player {
	icon: { id: number };
	tag: string;
	name: string;
	nameColor: string;
	trophies: number;
	expLevel: number;
	expPoints: number;
	highestTrophies: number;
	powerPlayPoints: number;
	highestPowerPlayPoints: number;
	soloVictories: number;
	duoVictories: number;
	'3vs3Victories': number;
	bestRoboRumbleTime: number;
	bestTimeAsBigBrawler: number;
	isQualifiedFromChampionshipChallenge: boolean;
	club?: {
		tag: string;
		name: string;
	};
	brawlers: [{
		id: number;
		rank: number;
		trophies: number;
		highestTrophies: number;
		power: number;
		name: string;
		starPowers: [{
			name: string;
			id: number;
		}] | [];
		gadgets: [{
			name: string;
			id: number;
		}] | [];
	}];
	response: {
		status: number;
		ok: boolean;
	};
}

interface BattlePlayer {
	tag: string;
	name: string;
	brawler: {
		id: number;
		name: string;
		power: number;
		trophies: number;
	};
}

interface PlayerBattle {
	battleTime: string;
	event: {
		id: number;
		mode: string;
		map: string;
	};
	battle: {
		mode: string;
		type: string;
		result: string;
		duration?: number;
		trophyChange?: number;
		starPlayer?: BattlePlayer;
		teams: [BattlePlayer[]] | BattlePlayer[];
	};
}

interface PlayerBattles {
	items: PlayerBattle[];
}

interface ClubMembers {
	items: ClubMember[];
}

interface ClubMember {
	icon: {
		id: number;
	};
	tag: string;
	name: string;
	trophies: number;
	role: string;
	nameColor: string;
}

interface Club {
	tag: string;
	name: string;
	description: string;
	trophies: number;
	requiredTrophies: number;
	type: string;
	badgeId: number;
	members: ClubMember[];
}

interface Brawlers {
	items: Brawler[];
}

interface Brawler {
	name: string;
	id: number;
	starPowers: [{
		id: number;
		name: string;
	}];
	gadgest: [{
		id: number;
		name: string;
	}];
}

interface Rankings {
	items: [{
		club?: { name: string };
		icons: { id: number };
		tag: string;
		name: string;
		rank: number;
		trophies: number;
		nameColor: string;
	}];
}

interface ClubRankings {
	items: [{
		tag: string;
		name: string;
		trophies: number;
		rank: number;
		memberCount: number;
		badgeId: number;
	}];
}

interface Seasons {
	items: [{
		id: string;
		startTime: string;
		endTime: string;
	}];
}
