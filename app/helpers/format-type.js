import { helper } from '@ember/component/helper';

const labelMatch = {
  pin: 'Pinterest',
  instagram_media: 'Instagram',
  youtube_video: 'YouTube',
  article: 'Article',
  tweet: 'X',
  facebook_status: 'Facebook',
  tiktok_video: 'TikTok',
  twitch_stream: 'Twitch',
};

function capitalizeFirstLetter(string) {
  return string?.charAt(0).toUpperCase() + string.slice(1);
}

export default helper(function formatType([type]) {
  return labelMatch[type] || capitalizeFirstLetter(type) || '' ;
});
