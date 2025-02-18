const Leaderboard = (function () {
    const STORAGE_KEY = 'doodleJumpLeaderboard';
    const MAX_ENTRIES = 10;
    const PINNED_SCORE = { name: 'Maya', score: 68832 };

    function getLeaderboard() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    function saveLeaderboard(leaderboard) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboard));
    }

    function getOrdinalSuffix(i) {
        const j = i % 10,
              k = i % 100;
        if (j == 1 && k != 11) return "st";
        if (j == 2 && k != 12) return "nd";
        if (j == 3 && k != 13) return "rd";
        return "th";
    }

    return {
        addScore: function (name, score) {
            if (!name || !score) return false;
            let leaderboard = getLeaderboard();
            leaderboard.push({ name, score, date: new Date().toISOString() });
            leaderboard.sort((a, b) => b.score - a.score);
            leaderboard = leaderboard.slice(0, MAX_ENTRIES - 1);
            saveLeaderboard(leaderboard);
            return true;
        },

        renderLeaderboard: function (containerId) {
            const container = document.getElementById(containerId);
            const leaderboard = getLeaderboard();
            
            const html = `
                <h2>Leaderboard</h2>
                <ul class="leaderboard-list">
                    <li class="pinned-score">
                        <span class="name">${PINNED_SCORE.name}</span>
                        <span class="score">${PINNED_SCORE.score}</span>
                    </li>
                    ${leaderboard
                        .map(
                            (entry, index) => `
                        <li class="leaderboard-item">
                            <span class="rank">${index + 1}${getOrdinalSuffix(index + 1)}</span>
                            <span class="name">${entry.name}</span>
                            <span class="score">${entry.score}</span>
                        </li>
                    `
                        )
                        .join('')}
                </ul>
            `;
            container.innerHTML = html;
        },

        isHighScore: function (score) {
            const leaderboard = getLeaderboard();
            return leaderboard.length < MAX_ENTRIES - 1 || score > leaderboard[leaderboard.length - 1]?.score;
        },
    };
})();
