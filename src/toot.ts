export {Toot};

interface Toot {
    id: string;
    domain: string | null;
    created_at: string | null;
    in_reply_to_id: string | null;
    in_reply_to_account_id: string | null;
    sensitive: boolean;
    spoiler_text: string | null;
    visibility: string | null;
    language: string | null;
    uri: string | null;
    url: string | null;
    replies_count: number;
    reblogs_count: number;
    favourites_count: number;
    edited_at: string | null;
    content: string | null;
    reblog: null | any;
    account: {
        id: string | null;
        username: string | null;
        acct: string | null;
        display_name: string | null;
        locked: boolean;
        bot: boolean;
        discoverable: boolean;
        group: boolean;
        created_at: string | null;
        note: string | null;
        url: string | null;
        avatar: string | null;
        avatar_static: string | null;
        header: string | null;
        header_static: string | null;
        followers_count: number;
        following_count: number;
        statuses_count: number;
        last_status_at: string | null;
        emojis: any[];
        fields: {
            name: string | null;
            value: string | null;
            verified_at: string | null;
        }[];
    };
    media_attachments: {
        id: string | null;
        type: string | null;
        url: string | null;
        preview_url: string | null;
        remote_url: string | null;
        preview_remote_url: string | null;
        text_url: string | null;
        meta: any;
        description: string | null;
        blurhash: string | null;
    }[];
    mentions: any[];
    tags: any[];
    emojis: {
        shortcode: string | null;
        url: string | null;
        static_url: string | null;
        visible_in_picker: boolean;
    }[];
}