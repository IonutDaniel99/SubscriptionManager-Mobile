interface INotificationSettings {
    isEnabled: boolean
    notificationId: string | null
}

export interface INotificationsInitObject {
    reminder3Days: INotificationSettings
    dailyUsage: INotificationSettings
    weeklyUsage: INotificationSettings
    otherNotifications: INotificationSettings
}
