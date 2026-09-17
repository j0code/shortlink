export const USERS = "/users"
export const USER = "/users/:id"
export const SHORTLINKS = "/shortlinks"
export const SHORTLINK = "/shortlinks/:id"
export const SHORTLINK_VISITS = "/shortlinks/:id/visits"

const routes = [USERS, USER, SHORTLINKS, SHORTLINK, SHORTLINK_VISITS] as const
export type Route = (typeof routes)[number]