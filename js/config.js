// 遊戲設定
export const CONFIG = {
  // 劇情模式「最快通關」線上排行榜：貼上 Google Apps Script 部署後的網址（https://script.google.com/macros/s/.../exec）
  // 留空 = 不用線上榜。設定方式見 leaderboard/設定步驟.md
  speedboardUrl: 'https://script.google.com/macros/s/AKfycbwcmLjQ3cMjtnWxSD4q1K2qMIJgVZWlmVWSS1CsurFWZ9gmYrLwQxTc4bz9NxUAuZeu5Q/exec',
  // 排行榜：'local'（只存在自己的瀏覽器）或 'firebase'（全球排行榜）
  leaderboard: 'local',
  // 申請好 Firebase 之後把這兩個值填進來，再把上面改成 'firebase'
  firebase: {
    apiKey: '',
    projectId: '',
  },
};
