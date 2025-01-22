export interface SubscriptionData {
    name: string
    price: number | string // price can be a number or a string
    logo: string | 'noImage'
    category: SubscriptionCategory
}

export interface Subscription {
    rrule: string
    subscriptionID: string
    subscriptionData: SubscriptionData
}

export interface SubscriptionsRecord {
    [key: string]: Subscription
}

export type SubscriptionCategory =
    | 'othercategory'
    | 'entertainment'
    | 'health'
    | 'transportation'
    | 'utilities'
    | 'software'
    | 'food'
    | 'financial'
    | 'education'
    | 'shopping'
    | 'communication'
