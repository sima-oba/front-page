export type ProtocolType =
    'OTHER' |
    'PLANTING_ANTICIPATION'

export type ProtocolStatus =
    'PENDING' |
    'IN_PROGRESS' |
    'CANCELED' |
    'COMPLETED'

export type ProtocolPriority = 'MEDIUM'

export interface Attachment {
    filename: string
    mimetype: string
    href: string
}

export interface Protocol {
    _id?: string
    created_at?: string
    started_at?: string
    finished_at?: string
    protocol_type?: ProtocolType
    priority?: ProtocolPriority
    status?: ProtocolStatus
    requester?: string
    content: any
    attachments?: any
    response?: any
}

export interface ProtocolValues {
    content: object
    attachments?: object
}
