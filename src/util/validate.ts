import type z from "zod"
import { fromZodError } from "zod-validation-error"

export default function validate<InputType extends z.ZodTypeAny>(
	validator: InputType
) {
	return <ResponseType>(
			callback: (input: z.infer<InputType>) => Promise<ResponseType>
		): ((input: z.infer<InputType>) => Promise<ResponseType>) =>
		async (input: z.infer<InputType>) => {
			const parsedInput = validator.safeParse(input)

			if (!parsedInput.success) {
				const validatedError = fromZodError(parsedInput.error)

				throw validatedError
			}

			return await callback(input)
		}
}
