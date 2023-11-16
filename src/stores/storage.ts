interface Player {
    name: string;
}

interface PlayerConfig {
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
};
