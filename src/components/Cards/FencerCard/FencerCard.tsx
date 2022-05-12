import {
  Dialog,
  DialogFooter,
  DialogType,
  IButtonProps,
  Icon,
  Stack,
} from "@fluentui/react"
import {
  Avatar,
  Badge,
  Button,
  FluentProvider,
} from "@fluentui/react-components"
import dayjs from "dayjs"
import { useCallback, useMemo } from "react"

import { EditFencerDialog, VerticalCard } from "$components"
import { useDeleteFencerByIdMutation } from "$queries"
import { DetailsItem } from "./components"
import { useDisclosure } from "$hooks"
import {
  CardHeader,
  BadgeContainer,
  DetailsStack,
  EmbedDialog,
  SemiboldText,
  DialogSpinner,
} from "./FencerCard.styles"
import { AccountFencer } from "$types"
import { LinkAssociationPanel } from "$components/LinkAssociationPanel"
import { cacheEvicter } from "$lib"

// TODO: Break PistePanel into separate component
// TODO: On PistePanel save, update fencer
// TODO: Break payments into another panel

export interface IFencerCardProps {
  fencer: AccountFencer
  primaryFencerId?: string
}

export const FencerCard: React.FunctionComponent<IFencerCardProps> = ({
  fencer,
  primaryFencerId,
}) => {
  const {
    AssociationMemberId,
    Email,
    Birthdate,
    FirstName,
    LastName,
    Phone,
    AvatarUrl,
    StudentId,
    Oid,
  } = fencer

  const {
    isOpen: isAssociationPanelOpen,
    onOpen: onOpenAssociationPanel,
    onClose: onCloseAssociationPanel,
  } = useDisclosure(false)

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure(false)

  const {
    isOpen: isEditFencerDialogOpen,
    onClose: onCloseEditFencerDialog,
    onOpen: onOpenEditFencerDialog,
  } = useDisclosure(false)

  const [deleteFencer, { loading: isDeletingFencer }] =
    useDeleteFencerByIdMutation({
      update: cacheEvicter({
        typeName: "Students",
        idName: "StudentId",
        id: StudentId,
      }),
      onCompleted: onDeleteDialogClose,
    })

  const fullName = `${FirstName} ${LastName}`
  const formattedBirthDate = dayjs(Birthdate).format("MMM D, YYYY")
  const age = new Date().getFullYear() - dayjs(Birthdate).year()
  const formattedEmail = Email || "N/A"
  const formattedPhone = Phone ? formatPhoneNumber(Phone) : "N/A"
  const formattedAvatar = AvatarUrl ? { src: AvatarUrl } : undefined
  const isLinked = !!AssociationMemberId
  const isPrimaryFencer = StudentId === primaryFencerId
  const memberId = `#${AssociationMemberId}`

  const onDeleteFencerConfirmed = useCallback(() => {
    deleteFencer({
      variables: { fencerId: StudentId },
    })
  }, [deleteFencer, StudentId])

  const fencerActions = useMemo(
    () =>
      [
        // Don't allow the user to edit the primary fencer
        !isPrimaryFencer
          ? {
              iconProps: { iconName: "Edit" },
              onClick: onOpenEditFencerDialog,
            }
          : undefined,
        {
          iconProps: { iconName: "ContactLink" },
          onClick: onOpenAssociationPanel,
        },

        // Don't allow the user to delete the primary fencer
        !isPrimaryFencer
          ? {
              iconProps: { iconName: "Delete" },
              onClick: onDeleteDialogOpen,
            }
          : undefined,
      ].filter(Boolean) as IButtonProps[],
    [
      isPrimaryFencer,
      onOpenEditFencerDialog,
      onOpenAssociationPanel,
      onDeleteDialogOpen,
    ]
  )

  return (
    <>
      <VerticalCard actions={fencerActions}>
        <CardHeader>
          <BadgeContainer>
            {isPrimaryFencer === true && (
              <Badge
                color="brand"
                icon={<Icon iconName="Contact" />}
                size="large"
              >
                Primary
              </Badge>
            )}
          </BadgeContainer>

          <Stack horizontal horizontalAlign="center">
            <Avatar name={fullName} size={96} image={formattedAvatar} />
          </Stack>
        </CardHeader>

        <DetailsStack tokens={{ childrenGap: "0.75rem" }}>
          <DetailsItem
            iconName="ContactInfo"
            iconLabel="Full name"
            title={fullName}
          >
            {fullName}
          </DetailsItem>

          <DetailsItem
            iconName="BirthdayCake"
            iconLabel="Birthdate"
            title={formattedBirthDate}
          >
            {formattedBirthDate} ({age})
          </DetailsItem>

          {isLinked ? (
            <DetailsItem
              iconName="ContactLink"
              iconLabel="USA Fencing ID"
              title={memberId}
              badgeProps={{ status: "available" }}
            >
              {memberId}
            </DetailsItem>
          ) : (
            <DetailsItem
              iconName="ContactLink"
              iconLabel="USA Fencing ID"
              title="Not linked"
            >
              No membership
            </DetailsItem>
          )}

          <DetailsItem
            iconName="Phone"
            iconLabel="Phone number"
            title={formattedPhone}
          >
            {formattedPhone}
          </DetailsItem>

          <DetailsItem
            iconName="Mail"
            iconLabel="Email address"
            title={formattedEmail}
          >
            {formattedEmail}
          </DetailsItem>
        </DetailsStack>
      </VerticalCard>

      <EmbedDialog>
        {/* TODO: Migrate this into ConfirmFencerDeleteDialog component */}
        <Dialog
          hidden={!isDeleteDialogOpen}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: `Delete fencer?`,
            subText: (
              <span>
                Are you sure you want to permanently delete{" "}
                <SemiboldText>{`${FirstName} ${LastName}`}</SemiboldText>?
              </span>
            ) as unknown as string,
            closeButtonAriaLabel: "Close",
          }}
        >
          <FluentProvider>
            <DialogFooter>
              {isDeletingFencer && <DialogSpinner />}
              <Button
                appearance="primary"
                onClick={onDeleteFencerConfirmed}
                disabled={isDeletingFencer}
              >
                Delete
              </Button>
              <Button onClick={onDeleteDialogClose} disabled={isDeletingFencer}>
                Cancel
              </Button>
            </DialogFooter>
          </FluentProvider>
        </Dialog>
        <EditFencerDialog
          fencer={fencer}
          isOpen={isEditFencerDialogOpen}
          onClose={onCloseEditFencerDialog}
        />
        <LinkAssociationPanel
          isOpen={isAssociationPanelOpen}
          onClose={onCloseAssociationPanel}
          fencerId={StudentId}
          defaultFilter={fullName}
          associationId={AssociationMemberId || undefined}
        />
      </EmbedDialog>
    </>
  )
}

function formatPhoneNumber(phoneNumber: string) {
  var cleaned = phoneNumber.replace(/\D/g, "")
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    var intlCode = match[1] ? "+1 " : ""
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("")
  }
  return phoneNumber
}
