import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useRegisterMutation } from "../api/hooks/"
import { getErrorMessage } from "@/shared/utils/get-error-message"
import type { IRegisterBody } from "../types"

export const useRegister = () => {
	const { t } = useTranslation()
	const [register, { isLoading, isError, error, isSuccess }] = useRegisterMutation()
	const err = getErrorMessage(error)

	const handleRegister = async (formData: IRegisterBody) => {
		try {
			await register({ body: formData }).unwrap()
			toast.success(t("auth.registerSuccess"))
		} catch (err: any) {
			const message = err?.data?.message || err?.message || t("auth.registerError")
			toast.error(message)
		}
	}

	return { handleRegister, isLoading, isError, err, isSuccess }
}