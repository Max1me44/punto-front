export interface Player {
    name: string;
}

export interface PlayerConfig {
    playerCount: number;
    players: Player[];
}

export const storage = {
    setDatabaseType(databaseType: string): void {
        localStorage.setItem('databaseType', databaseType);
    },

    getDatabaseType(): string | null {
        return localStorage.getItem('databaseType');
    },

    setPlayerConfig(playerConfig: PlayerConfig): void {
        localStorage.setItem('playerConfig', JSON.stringify(playerConfig));
    },

    getPlayerConfig(): PlayerConfig | null {
        const storedPlayerConfig = localStorage.getItem('playerConfig');
        return storedPlayerConfig ? JSON.parse(storedPlayerConfig) : null;
    },

    getPlayers(): Player[] | null {
        const playerConfig = this.getPlayerConfig();
        return playerConfig ? playerConfig.players : null;
    },

    getPlayersTable(): string[] | null {
        const playerConfig = this.getPlayers();
        return playerConfig ? playerConfig.map((player) => player.name) : [''];
    },

    getPlayerCount(): number | null {
        const playerConfig = this.getPlayerConfig();
        return playerConfig ? playerConfig.playerCount : null;
    },

    clear(): void {
        localStorage.clear();
    }
};
