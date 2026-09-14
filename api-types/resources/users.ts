import * as v from "@valibot/valibot"

export const usersPostRequestSchema = v.object({
	key: v.pipe(
		v.string(),
		v.length(64, "Key must be a sha-256 hash"),
	)
})

export const usersPostResponseSchema = v.object({
	id: v.string(),
})

export type UsersPostRequest = v.InferOutput<typeof usersPostRequestSchema>
export type UsersPostResponse = v.InferOutput<typeof usersPostResponseSchema>