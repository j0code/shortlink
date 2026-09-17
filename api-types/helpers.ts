import type * as v from "@valibot/valibot"

export type ObjectSchema<
	TEntries extends v.ObjectEntries = v.ObjectEntries,
	TMessage extends v.ErrorMessage<v.ObjectIssue> | undefined = v.ErrorMessage<v.ObjectIssue> | undefined
> = v.ObjectSchema<TEntries, TMessage>

export type ArraySchema<
	TItem extends ObjectSchema | IntersectSchema = ObjectSchema | IntersectSchema,
	TMessage extends v.ErrorMessage<v.ArrayIssue> | undefined = v.ErrorMessage<v.ArrayIssue> | undefined
> = v.ArraySchema<TItem, TMessage>

export type IntersectSchema<
	TOptions extends v.IntersectOptions = v.IntersectOptions,
	TMessage extends v.ErrorMessage<v.IntersectIssue> | undefined = v.ErrorMessage<v.IntersectIssue> | undefined
> = v.IntersectSchema<TOptions, TMessage>