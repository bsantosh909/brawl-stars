import { validateTag, fetchURL } from '../utils/utils';
import { Player, PlayerBattles, Club, ClubMembers, Brawlers, Brawler, ClubRankings, Rankings, Seasons } from './types';
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

	public getPlayer(playerTag: string): Promise<Player> {
		const tag = validateTag(playerTag);
		if (!tag) throw new Error('INALID_TAG');
		return this.fetch(`/players/${tag}`);
	}

	public getPlayerBattles(playerTag: string): Promise<PlayerBattles> {
		const tag = validateTag(playerTag);
		if (!tag) throw new Error('INVALID_TAG');
		return this.fetch(`/players/${tag}/battlelog`);
	}

	public getClub(clubTag: string): Promise<Club> {
		const tag = validateTag(clubTag);
		if (!tag) throw new Error('INVALID_TAG');
		return this.fetch(`/clubs/${tag}`);
	}

	public getClubMembers(clubTag: string): Promise<ClubMembers> {
		const tag = validateTag(clubTag);
		if (!tag) throw new Error('INVALID_TAG');
		return this.fetch(`/clubs/${tag}/members`);
	}

	public getBrawlers(): Promise<Brawlers> {
		return this.fetch('/brawlers');
	}

	public getBrawler(brawlerId: string | number): Promise<Brawler> {
		return this.fetch(`/brawlers/${brawlerId}`);
	}

	public getClubRankings(countryCode = 'global', options?: SearchOptions): Promise<ClubRankings> {
		if (countryCode !== 'global' && countryCode.length !== 2) throw new Error('INCORRECT_COUNTRY_CODE');
		return this.fetch(`/ranking/${countryCode}/clubs`, options);
	}

	public getPlayerRankings(countryCode = 'global', options?: SearchOptions): Promise<Rankings> {
		if (countryCode !== 'global' && countryCode.length !== 2) throw new Error('INCORRECT_COUNTRY_CODE');
		return this.fetch(`/rankings/${countryCode}/players`, options);
	}

	public getBrawlerRanking(brawlerId: string | number, countryCode = 'global', options?: SearchOptions): Promise<Rankings> {
		if (countryCode !== 'global' && countryCode.length !== 2) throw new Error('INCORRECT_COUNTRY_CODE');
		return this.fetch(`/rankings/${countryCode}/brawlers/${brawlerId}`, options);
	}

	public getPowerPlayRankings(seasonId: string, countryCode = 'global', options?: SearchOptions): Promise<Rankings> {
		if (countryCode !== 'global' && countryCode.length !== 2) throw new Error('INCORRECT_COUNTRY_CODE');
		return this.fetch(`/rankings/${countryCode}/powerplay/seasons/${seasonId}`, options);
	}

	public getPowerPlaySeasons(countryCode = 'global', options?: SearchOptions): Promise<Seasons> {
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
