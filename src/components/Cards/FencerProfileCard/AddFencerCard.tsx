import { EditFencerDialog } from "$components/EditFencerDialog"
import { VerticalCard } from "$components/Cards/VerticalCard"
import { useDisclosure } from "$hooks/useDisclosure"
import styled from "@emotion/styled"
import { Stack } from "@fluentui/react"
import { Button } from "@fluentui/react-components"
import { EmbedDialog } from "./FencerProfileCard.styles"

const Card = styled(VerticalCard)`
  border: 4px dashed ${({ theme }) => theme.palette.neutralLight};
  box-shadow: none;
  min-height: 362px;
`

const VerticallyCentered = styled(Stack)`
  height: 100%;
`

export function AddFencerCard() {
  const {
    isOpen: isEditFencerDialogOpen,
    onClose: onCloseEditFencerDialog,
    onOpen: onOpenEditFencerDialog,
  } = useDisclosure(false)

  return (
    <>
      <Card actions={[]}>
        <VerticallyCentered horizontalAlign="center" verticalAlign="center">
          <Button appearance="outline" onClick={onOpenEditFencerDialog}>
            Add fencer
          </Button>
        </VerticallyCentered>
      </Card>
      <EmbedDialog>
        <EditFencerDialog
          isOpen={isEditFencerDialogOpen}
          onClose={onCloseEditFencerDialog}
          onSaved={onCloseEditFencerDialog}
        />
      </EmbedDialog>
    </>
  )
}
