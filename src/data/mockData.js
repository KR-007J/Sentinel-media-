export const MOCK_THREATS = [
  { id: 't1', url: 'restream247.io/ipl-live-feed', similarity: 94, watermark: false, location: 'India', city: 'Mumbai', lat: 19.07, lng: 72.87, status: 'unauthorized', confidence: 94, risk: 'high', action: 'flag', timestamp: new Date(Date.now() - 2 * 60000).toISOString(), asset: 'IPL 2024 Highlight Reel', platform: 'Unknown Streaming', reason: 'High similarity match with official broadcast. Watermark digitally removed. Metadata stripped.', views: 18400, spread: 6 },
  { id: 't2', url: 'sportvids.xyz/match-clips', similarity: 88, watermark: false, location: 'Pakistan', city: 'Karachi', lat: 24.86, lng: 67.01, status: 'unauthorized', confidence: 88, risk: 'high', action: 'flag', timestamp: new Date(Date.now() - 7 * 60000).toISOString(), asset: 'Champions Trophy Match', platform: 'Piracy Site', reason: 'Match footage redistributed without license. Original resolution altered.', views: 9200, spread: 4 },
  { id: 't3', url: 'telegram.me/cricketzone99', similarity: 76, watermark: true, location: 'Bangladesh', city: 'Dhaka', lat: 23.81, lng: 90.41, status: 'suspicious', confidence: 76, risk: 'medium', action: 'review', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), asset: 'T20 World Cup Promo', platform: 'Telegram', reason: 'Partial match detected. Watermark present but context suggests unauthorized channel redistribution.', views: 5100, spread: 2 },
  { id: 't4', url: 'fbcdn.net/v/user/12345', similarity: 69, watermark: false, location: 'Sri Lanka', city: 'Colombo', lat: 6.93, lng: 79.85, status: 'suspicious', confidence: 69, risk: 'medium', action: 'review', timestamp: new Date(Date.now() - 22 * 60000).toISOString(), asset: 'IPL Opening Ceremony', platform: 'Facebook', reason: 'Compressed clip with modified aspect ratio. Possible fair use but flagged for manual review.', views: 3400, spread: 3 },
  { id: 't5', url: 'twitter.com/status/fan_post', similarity: 42, watermark: true, location: 'UK', city: 'London', lat: 51.51, lng: -0.13, status: 'safe', confidence: 42, risk: 'low', action: 'ignore', timestamp: new Date(Date.now() - 30 * 60000).toISOString(), asset: 'Team Logo Clip', platform: 'Twitter/X', reason: 'Low similarity. Watermark intact. Appears to be fan commentary with brief fair-use excerpt.', views: 1200, spread: 1 },
  { id: 't6', url: 'youtube.com/shorts/abc123', similarity: 38, watermark: true, location: 'Australia', city: 'Sydney', lat: -33.87, lng: 151.21, status: 'safe', confidence: 38, risk: 'low', action: 'ignore', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), asset: 'Match Highlights', platform: 'YouTube', reason: 'Official licensed clip. Within authorized distribution window.', views: 24000, spread: 0 },
  { id: 't7', url: 'dailymotion.com/video/x9yz', similarity: 91, watermark: false, location: 'UAE', city: 'Dubai', lat: 25.2, lng: 55.27, status: 'unauthorized', confidence: 91, risk: 'high', action: 'flag', timestamp: new Date(Date.now() - 55 * 60000).toISOString(), asset: 'PSL Final Broadcast', platform: 'Dailymotion', reason: 'Full broadcast rip detected. Original BCCI watermarks removed via content-aware inpainting.', views: 12800, spread: 5 },
  { id: 't8', url: 'vk.com/public/sports_clips', similarity: 83, watermark: false, location: 'Russia', city: 'Moscow', lat: 55.75, lng: 37.62, status: 'unauthorized', confidence: 83, risk: 'high', action: 'flag', timestamp: new Date(Date.now() - 70 * 60000).toISOString(), asset: 'IPL Brand Footage', platform: 'VKontakte', reason: 'High similarity match. Content redistributed on unauthorized social platform.', views: 7600, spread: 3 },
];

export const MOCK_ASSETS = [
  { id: 'a1', name: 'IPL 2024 Highlight Reel', type: 'video', size: '234 MB', fingerprint: 'fp_a1b2c3d4e5f6', status: 'monitored', threats: 3, uploadedAt: '2024-04-01', thumbnail: null },
  { id: 'a2', name: 'Champions Trophy Broadcast', type: 'video', size: '1.2 GB', fingerprint: 'fp_b2c3d4e5f6a7', status: 'monitored', threats: 1, uploadedAt: '2024-03-15', thumbnail: null },
  { id: 'a3', name: 'Official Team Logos Pack', type: 'image', size: '45 MB', fingerprint: 'fp_c3d4e5f6a7b8', status: 'monitored', threats: 0, uploadedAt: '2024-02-20', thumbnail: null },
  { id: 'a4', name: 'T20 WC Promo Video', type: 'video', size: '89 MB', fingerprint: 'fp_d4e5f6a7b8c9', status: 'monitored', threats: 2, uploadedAt: '2024-01-10', thumbnail: null },
];

export const ANALYTICS_DATA = {
  weekly: [
    { day: 'Mon', threats: 12, suspicious: 8, safe: 34 },
    { day: 'Tue', threats: 19, suspicious: 11, safe: 28 },
    { day: 'Wed', threats: 8, suspicious: 15, safe: 41 },
    { day: 'Thu', threats: 24, suspicious: 9, safe: 32 },
    { day: 'Fri', threats: 31, suspicious: 18, safe: 29 },
    { day: 'Sat', threats: 17, suspicious: 12, safe: 38 },
    { day: 'Sun', threats: 22, suspicious: 14, safe: 44 },
  ],
  monthly: [
    { month: 'Jan', threats: 145, takedowns: 132 },
    { month: 'Feb', threats: 189, takedowns: 171 },
    { month: 'Mar', threats: 234, takedowns: 208 },
    { month: 'Apr', threats: 198, takedowns: 189 },
    { month: 'May', threats: 312, takedowns: 290 },
    { month: 'Jun', threats: 267, takedowns: 241 },
  ],
  platforms: [
    { name: 'Telegram', value: 34, color: '#6366f1' },
    { name: 'Facebook', value: 22, color: '#8b5cf6' },
    { name: 'YouTube', value: 18, color: '#14b8a6' },
    { name: 'Twitter/X', value: 14, color: '#38bdf8' },
    { name: 'Others', value: 12, color: '#64748b' },
  ],
  regions: [
    { region: 'South Asia', threats: 48 },
    { region: 'SE Asia', threats: 32 },
    { region: 'Middle East', threats: 19 },
    { region: 'Europe', threats: 14 },
    { region: 'Others', threats: 11 },
  ],
};

export const STATS = {
  totalScans: 4829,
  threatsDetected: 312,
  takedownsSent: 287,
  assetsProtected: 48,
  avgResponseTime: '4.2s',
  accuracyRate: '97.3%',
};
