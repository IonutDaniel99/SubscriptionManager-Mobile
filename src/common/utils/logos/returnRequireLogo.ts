export const COMPANY_ICONS_PATHS: Record<string, { path: string; name: string; key: string }> = {
    noImage: { path: require('../../../assets/company_logos/noImage.png'), name: 'No Image', key: 'noImage' },
    amazon: { path: require('../../../assets/company_logos/amazon.png'), name: 'amazon', key: 'amazon' },
    apple: { path: require('../../../assets/company_logos/apple.png'), name: 'apple', key: 'apple' },
    discord: { path: require('../../../assets/company_logos/discord.png'), name: 'discord', key: 'discord' },
    dropbox: { path: require('../../../assets/company_logos/dropbox.png'), name: 'dropbox', key: 'dropbox' },
    facebook: { path: require('../../../assets/company_logos/facebook.png'), name: 'facebook', key: 'facebook' },
    google: { path: require('../../../assets/company_logos/google.png'), name: 'google', key: 'google' },
    'google-play': {
        path: require('../../../assets/company_logos/google-play.png'),
        name: 'google-play',
        key: 'google-play'
    },
    instagram: { path: require('../../../assets/company_logos/instagram.png'), name: 'instagram', key: 'instagram' },
    linkedin: { path: require('../../../assets/company_logos/linkedin.png'), name: 'linkedin', key: 'linkedin' },
    microsoft: { path: require('../../../assets/company_logos/microsoft.png'), name: 'microsoft', key: 'microsoft' },
    netflix: { path: require('../../../assets/company_logos/netflix.png'), name: 'netflix', key: 'netflix' },
    reddit: { path: require('../../../assets/company_logos/reddit.png'), name: 'reddit', key: 'reddit' },
    snapchat: { path: require('../../../assets/company_logos/snapchat.png'), name: 'snapchat', key: 'snapchat' },
    soundcloud: {
        path: require('../../../assets/company_logos/soundcloud.png'),
        name: 'soundcloud',
        key: 'soundcloud'
    },
    spotify: { path: require('../../../assets/company_logos/spotify.png'), name: 'spotify', key: 'spotify' },
    tiktok: { path: require('../../../assets/company_logos/tiktok.png'), name: 'tiktok', key: 'tiktok' },
    tinder: { path: require('../../../assets/company_logos/tinder.png'), name: 'tinder', key: 'tinder' },
    twitch: { path: require('../../../assets/company_logos/twitch.png'), name: 'twitch', key: 'twitch' },
    wechat: { path: require('../../../assets/company_logos/wechat.png'), name: 'wechat', key: 'wechat' },
    youtube: { path: require('../../../assets/company_logos/youtube.png'), name: 'youtube', key: 'youtube' }
}

export const ReturnRequireLogo = (name: string) => {
    const logo = COMPANY_ICONS_PATHS[name]
    if (!logo) return COMPANY_ICONS_PATHS.noImage.path as any
    return logo.path as any
}

