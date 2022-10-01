const apiPrefix = "https://discord.com/api/v9";

var delay = (ms) => new Promise((res) => setTimeout(res, ms));
var qs = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

const apiCall = (apiPath, body, method = "GET") => {
  if (!authHeader)
    throw new Error(
      "The authorization token is missing. Did you forget set it? `authHeader = 'your_token'`"
    );
  return fetch(`${apiPrefix}${apiPath}`, {
    body: body ? JSON.stringify(body) : undefined,
    method,
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US",
      Authorization: authHeader,
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9002 Chrome/83.0.4103.122 Electron/9.3.5 Safari/537.36",
    },
  })
    .then((res) => res.json().catch(() => {}))
    .catch(console.error);
};

var api = {
  getMessages: (channelId, params = {}) =>
    apiCall(`/channels/${channelId}/messages?limit=100&${qs(params)}`),
  sendMessage: (channelId, message, tts, body = {}) =>
    apiCall(
      `/channels/${channelId}/messages`,
      { content: message, tts: !!tts, ...body },
      "POST"
    ),
  editMessage: (channelId, messageId, newMessage, body = {}) =>
    apiCall(
      `/channels/${channelId}/messages/${messageId}`,
      { content: newMessage, ...body },
      "PATCH"
    ),
  deleteMessage: (channelId, messageId) =>
    apiCall(`/channels/${channelId}/messages/${messageId}`, null, "DELETE"),

  sendEmbed: (channelId, title, description, color) =>
    apiCall(
      `/channels/${channelId}/messages`,
      { tts: false, embed: { title, description, color } },
      "POST"
    ),

  auditLog: (guildId) => apiCall(`/guilds/${guildId}/audit-logs`),

  getRoles: (guildId) => apiCall(`/guilds/${guildId}/roles`),
  createRole: (guildId, name) =>
    apiCall(`/guilds/${guildId}/roles`, { name }, "POST"),
  deleteRole: (guildId, roleId) =>
    apiCall(`/guilds/${guildId}/roles/${roleId}`, null, "DELETE"),

  getBans: (guildId) => apiCall(`/guilds/${guildId}/bans`),
  banUser: (guildId, userId, reason) =>
    apiCall(
      `/guilds/${guildId}/bans/${userId}`,
      { delete_message_days: "7", reason },
      "PUT"
    ),
  unbanUser: (guildId, userId) =>
    apiCall(`/guilds/${guildId}/bans/${userId}`, null, "DELETE"),
  kickUser: (guildId, userId) =>
    apiCall(`/guilds/${guildId}/members/${userId}`, null, "DELETE"),

  addRole: (guildId, userId, roleId) =>
    apiCall(
      `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      null,
      "PUT"
    ),
  removeRole: (guildId, userId, roleId) =>
    apiCall(
      `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      null,
      "DELETE"
    ),

  getChannels: (guildId) => apiCall(`/guilds/${guildId}/channels`),
  createChannel: (guildId, name, type) =>
    apiCall(`/guilds/${guildId}/channels`, { name, type }, "POST"),

  pinnedMessages: (channelId) => apiCall(`/channels/${channelId}/pins`),
  addPin: (channelId, messageId) =>
    apiCall(`/channels/${channelId}/pins/${messageId}`, null, "PUT"),
  deletePin: (channelId, messageId) =>
    apiCall(`/channels/${channelId}/pins/${messageId}`, null, "DELETE"),

  listEmojis: (guildId) => apiCall(`/guilds/${guildId}/emojis`),
  getEmoji: (guildId, emojiId) =>
    apiCall(`/guilds/${guildId}/emojis/${emojiId}`),
  createEmoji: (guildId, name, image, roles) =>
    apiCall(`/guilds/${guildId}`, { name, image, roles }, "POST"),
  editEmoji: (guildId, emojiId, name, roles) =>
    apiCall(`/guilds/${guildId}/${emojiId}`, { name, roles }, "PATCH"),
  deleteEmoji: (guildId, emojiId) =>
    apiCall(`/guilds/${guildId}/${emojiId}`, null, "DELETE"),

  changeNick: (guildId, nick) =>
    apiCall(`/guilds/${guildId}/members/@me/nick`, { nick }, "PATCH"),
  leaveServer: (guildId) =>
    apiCall(`/users/@me/guilds/${guildId}`, null, "DELETE"),

  getDMs: () => apiCall(`/users/@me/channels`),
  getUser: (userId) => apiCall(`/users/${userId}`),

  getCurrentUser: () => apiCall("/users/@me"),
  editCurrentUser: (username, avatar) =>
    apiCall("/users/@me", { username, avatar }, "PATCH"),
  listCurrentUserGuilds: () => apiCall("/users/@me/guilds"),

  listReactions: (channelId, messageId, emojiUrl) =>
    apiCall(
      `/channels/${channelId}/messages/${messageId}/reactions/${emojiUrl}/@me`
    ),
  addReaction: (channelId, messageId, emojiUrl) =>
    apiCall(
      `/channels/${channelId}/messages/${messageId}/reactions/${emojiUrl}/@me`,
      null,
      "PUT"
    ),
  deleteReaction: (channelId, messageId, emojiUrl) =>
    apiCall(
      `/channels/${channelId}/messages/${messageId}/reactions/${emojiUrl}/@me`,
      null,
      "DELETE"
    ),

  typing: (channelId) => apiCall(`/channels/${channelId}/typing`, null, "POST"),

  delay,
  apiCall,
};
