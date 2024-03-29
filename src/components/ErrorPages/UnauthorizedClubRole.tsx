import { DefaultPageLayout } from "$components/AppShell/components"
import { BigMessage } from "$components/BigMessage"

export function UnauthorizedClubRole() {
  return (
    <DefaultPageLayout title="Error" skipTitleHeading>
      <BigMessage heading="You are not authorized">
        Your club admin can help you gain access to this page.
      </BigMessage>
    </DefaultPageLayout>
  )
}
