export interface Player {
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
	response: Response;
}

export interface PlayerBattle {
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
		starPlayer?: {
			tag: string;
			name: string;
			brawler: {
				id: number;
				name: string;
				power: number;
				trophies: number;
			};
		};
		teams: any;
	};

}

export interface PlayerBattles {
	items: PlayerBattle[];
	response: Response;
}

export interface ClubMembers {
	items: [{
		icon: {
			id: number;
		};
		tag: string;
		name: string;
		trophies: number;
		role: string;
		nameColor: string;
	}];
	response: Response;
}

export interface Club {
	tag: string;
	name: string;
	description: string;
	trophies: number;
	requiredTrophies: number;
	type: string;
	badgeId: number;
	members: [{
		icon: {
			id: number;
		};
		tag: string;
		name: string;
		trophies: number;
		role: string;
		nameColor: string;
	}];
	response: Response;
}

export interface Brawlers {
	items: Brawler[];
	response: Response;
}

export interface Brawler {
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
	response: Response;
}

export interface Rankings {
	items: [{
		club?: { name: string };
		icons: { id: number };
		tag: string;
		name: string;
		rank: number;
		trophies: number;
		nameColor: string;
	}];
	response: Response;
}

export interface ClubRankings {
	items: [{
		tag: string;
		name: string;
		trophies: number;
		rank: number;
		memberCount: number;
		badgeId: number;
	}];
	response: Response;
}

export interface Seasons {
	items: [{
		id: string;
		startTime: string;
		endTime: string;
	}];
	response: Response;
}

interface Response {
	status: number;
	ok: boolean;
}
