import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useCreateWorkspaceMutation } from "../api/hooks/"
import { Button } from "@/shared/ui/shadcn/button"
import { Input } from "@/shared/ui/shadcn/input"
import { Label } from "@/shared/ui/shadcn/label"
import { Spinner } from "@/shared/ui/shadcn/spinner"

export const CreateWorkspace = ({ close }: { close: () => void }) => {
	const { t } = useTranslation()

	const [create, { isLoading }] = useCreateWorkspaceMutation()

	const [workspaceName, setWorkspaceName] = useState<string>('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (isLoading) return

		try {
			await create({
				body: { name: workspaceName }
			}).unwrap()

			toast.success(t("workspace.createSuccess"))
		} catch (error) {
			toast.error(t("workspace.createError"))
		}

		close()
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="grid gap-4">
				<div className="grid gap-3">
					<Label htmlFor="name-1">{t("workspace.nameLabel")}</Label>
					<Input required id="name-1" name="Workspace name" value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} />
				</div>
				<Button disabled={isLoading} type="submit">
					{
						!isLoading ? (
							t("common.create")
						) : (
							<Spinner />
						)
					}
				</Button>
			</div>
		</form>
	)
}
