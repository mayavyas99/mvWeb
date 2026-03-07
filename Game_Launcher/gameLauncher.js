/**
 * Game Launcher — back button and leaderboard init.
 */
(function () {
    function init() {
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', function (e) {
                e.preventDefault();
                if (document.referrer) {
                    window.history.back();
                } else {
                    window.location.href = '../Evil_Lair/evilLair.html';
                }
            });
        }

        if (typeof Leaderboard !== 'undefined') {
            Leaderboard.renderLeaderboard('leaderboard-container');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
