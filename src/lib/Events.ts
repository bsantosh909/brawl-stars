import { EventEmitter } from 'events';
import { Store } from './Store';
import { Throttler } from '../utils/Throttler';
import { handleClubUpdate, handlePlayerUpdate, handlePlayerBattlesUpdate } from '../utils/updateHandler';
import { validateTag, fetchURL } from '../utils/utils';
import { AsyncQueue } from '../utils/AsyncQueue';

export class Events extends EventEmitter {

	public clubs: Store = new Store();
	public players: Store = new Store();
	public battles: Store = new Store();

	private rateLimit: number;
	private refreshRate: number;

	private tokens: string[];
	private activeToken = 0;

	private baseUrl: string;
	private timeout: number;

	private throttler: Throttler;
	private queue: AsyncQueue = new AsyncQueue();

	private loopBreak = {
		player: false,
		club: false,
		battles: false
	};

	private isInMaintenance = false;

	public constructor(options: EventsOption) {
		super();

		this.baseUrl = options.baseUrl || 'https://api.brawlstars.com/v1';
		this.timeout = options.timeout || 0;
		this.tokens = options.tokens;
		this.rateLimit = options.rateLimit || 10;
		this.refreshRate = options.refreshRate || 2 * 60 * 1000;
		this.throttler = new Throttler(this.rateLimit * this.tokens.length);
	}

	public addPlayers(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && !this.players.has(tag)) this.players.set(tag, {});
		});
	}

	public removePlayers(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && this.players.has(tag)) this.players.delete(tag);
		});
	}

	public clearPlayers() {
		this.loopBreak.player = true;
		this.players.clear();
	}

	public addClubs(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && !this.clubs.has(tag)) this.clubs.set(tag, {});
		});
	}

	public removeClubs(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && this.clubs.has(tag)) this.clubs.delete(tag);
		});
	}

	public clearClubs() {
		this.loopBreak.club = true;
		this.clubs.clear();
	}

	public addBattles(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && !this.battles.has(tag)) this.battles.set(tag, Date.now());
		});
	}

	public removeBattles(tags: string | string[]) {
		const list = Array.isArray(tags) ? tags : [tags];
		list.forEach(_tag => {
			const tag = validateTag(_tag);
			if (tag && this.battles.has(tag)) this.battles.delete(tag);
		});
	}

	public clearBattles() {
		this.loopBreak.battles = true;
		this.battles.clear();
	}

	public start() {
		return Promise.allSettled([
			this.checkMaintenace(),
			this.initPlayerEvents(),
			this.initPlayerBattleEvents(),
			this.initClubEvents()
		]);
	}

	/* ----------------------------------------------------------------------------- */
	/* ------------------------------ PRIVATE METHODS ------------------------------ */
	/* ----------------------------------------------------------------------------- */

	private async initClubEvents() {
		if (this.isInMaintenance) return;
		const startTime = Date.now();
		for (const tag of this.clubs.keys()) {
			if (this.loopBreak.club) break;
			const data = await this.fetch(`/clubs/${encodeURIComponent(tag)}`);
			handleClubUpdate(this, data);
		}
		const timeTaken = Date.now() - startTime;
		const waitFor = (timeTaken >= this.refreshRate ? 0 : this.refreshRate - timeTaken);
		if (this.loopBreak.club) {
			this.clubs.clear();
			this.loopBreak.club = false;
		}
		setTimeout(this.initClubEvents.bind(this), waitFor);
	}

	private async initPlayerEvents() {
		if (this.isInMaintenance) return;
		const startTime = Date.now();
		for (const tag of this.players.keys()) {
			if (this.loopBreak.player) break;
			const data = await this.fetch(`/players/${encodeURIComponent(tag)}`);
			handlePlayerUpdate(this, data);
		}
		if (this.loopBreak.player) {
			this.players.clear();
			this.loopBreak.player = false;
		}
		const timeTaken = Date.now() - startTime;
		const waitFor = (timeTaken >= this.refreshRate ? 0 : this.refreshRate - timeTaken);
		setTimeout(this.initPlayerEvents.bind(this), waitFor);
	}

	private async initPlayerBattleEvents() {
		if (this.isInMaintenance) return;
		const startTime = Date.now();
		for (const tag of this.battles.keys()) {
			if (this.loopBreak.battles) break;
			const data = await this.fetch(`/players/${encodeURIComponent(tag)}/battlelog`);
			handlePlayerBattlesUpdate(this, tag, data);
		}
		if (this.loopBreak.battles) {
			this.battles.clear();
			this.loopBreak.battles = false;
		}
		const timeTaken = Date.now() - startTime;
		const waitFor = (timeTaken >= this.refreshRate ? 0 : this.refreshRate - timeTaken);
		setTimeout(this.initPlayerBattleEvents.bind(this), waitFor);
	}

	private async checkMaintenace() {
		const data = await this.fetch(`/players/${encodeURIComponent('#YJ0LVRQQ')}`);
		if (data.status === 503 && !this.isInMaintenance) {
			this.isInMaintenance = true;
			this.emit('maintenanceStart');
		} else if (data.status === 200 && this.isInMaintenance) {
			this.isInMaintenance = false;
			this.emit('maintenanceEnd');
		}
		setTimeout(this.checkMaintenace.bind(this), 0.5 * 60 * 1000);
	}

	private get token() {
		const token = this.tokens[this.activeToken];
		this.activeToken = (this.activeToken + 1) >= this.tokens.length ? 0 : (this.activeToken + 1);
		return token;
	}

	private async fetch(path: string) {
		await this.queue.wait();
		try {
			return await fetchURL(`${this.baseUrl}${path}`, this.token, this.timeout);
		} finally {
			await this.throttler.throttle();
			this.queue.shift();
		}
	}

}

interface EventsOption {
	tokens: string[];
	baseUrl?: string;
	timeout?: number;
	rateLimit?: number;
	refreshRate?: number;
}
