const { execSync } = require('child_process');
const GIT = "C:/Users/digit/AppData/Local/GitHubDesktop/app-3.5.5/resources/app/git/cmd/git.exe";

const commits = [
    "df81efa", "5edaf16", "25cc3f0", "ee7a057", "39cf193",
    "f2bb65b", "6d3d1b7", "b97709c", "17b3234", "da3a599",
    "3f51e64", "2cd19c3", "72f7b80", "4c7ad8b", "5f3cdf4",
    "5b275f6", "bf7f160", "351e266"
];

function pushWithRetry(hash, retries = 5) {
    for (let i = 0; i < retries; i++) {
        console.log(`🚀 Pushing commit ${hash} (Attempt ${i + 1}/${retries})...`);
        try {
            execSync(`"${GIT}" push origin ${hash}:main`, { timeout: 300000 });
            console.log(`✅ Push successful for ${hash}.`);
            return true;
        } catch (e) {
            console.warn(`⚠️ Attempt ${i + 1} failed: ${e.message}`);
            if (i === retries - 1) return false;
            execSync('powershell -Command "Start-Sleep -Seconds 20"');
        }
    }
}

commits.forEach((hash, i) => {
    try {
        const remoteLog = execSync(`"${GIT}" log origin/main --oneline -n 100`).toString();
        if (remoteLog.includes(hash)) {
            console.log(`⏩ Commit ${hash} already on remote. Skipping.`);
            return;
        }
    } catch (e) { }

    const success = pushWithRetry(hash);
    if (!success) {
        console.error(`❌ Permanent failure for commit ${hash}.`);
    }
});

console.log(`✨ All push attempts completed.`);
