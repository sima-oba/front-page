export interface Job {
    id: string
    name: string
    args: string[]
    month: number | null
    day: number | null
    day_of_week: number | null
    hour: number[],
    next_run_time?: string
}