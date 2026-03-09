const { execSync } = require('child_process');
const GIT = "C:\\Users\\digit\\AppData\\Local\\GitHubDesktop\\app-3.5.5\\resources\\app\\git\\cmd\\git.exe";

const commits = [
    "df81efa", "5edaf16", "25cc3f0", "ee7a057", "39cf193",
    "f2bb65b", "6d3d1b7", "b97709c", "17b3234", "da3a599",
    "3f51e64", "2cd19c3", "72f7b80", "4c7ad8b", "5f3cdf4",
    "5b275f6", "bf7f160"
];

commits.forEach((hash, i) => {
    console.log(`🚀 Pushing commit ${i + 1} / ${commits.length} (${hash})...`);
    try {
        execSync(`"${GIT}" push origin ${hash}:main`);
        console.log(`✅ Push successful.`);
    } catch (e) {
        console.error(`❌ Push failed for ${hash}: ${e.message}`);
    }
});
