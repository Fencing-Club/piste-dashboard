import { IButtonProps, Icon, Stack } from "@fluentui/react"
import { Avatar, Badge } from "@fluentui/react-components"
import dayjs from "dayjs"
import { PropsWithChildren, useCallback, useMemo } from "react"

import { useDeleteFencerByIdMutation } from "$queries"
import { DetailsItem } from "./components"
import { useDisclosure } from "$hooks/useDisclosure"
import {
  CardHeader,
  BadgeContainer,
  DetailsStack,
  EmbedDialog,
  SemiboldText,
} from "./FencerProfileCard.styles"
import { AccountFencer } from "$types"
import { LinkAssociationPanel } from "$components/LinkAssociationPanel"
import { ConfirmDialog } from "$components/ConfirmDialog"
import { EditFencerDialog } from "$components/EditFencerDialog"
import { VerticalCard } from "../VerticalCard"
import { cacheEvicter } from "$lib/apolloClient"
import { formatFullName } from "$lib/formatFullName"
import { formatPhoneNumber } from "$lib/formatPhoneNumber"

export type FencerCardProps = PropsWithChildren<{
  fencer: AccountFencer
  primaryFencerId?: string
}>

export function FencerProfileCard({
  fencer,
  primaryFencerId,
}: FencerCardProps) {
  const {
    AssociationMemberId,
    Email,
    Birthdate,
    FirstName,
    LastName,
    Nickname,
    Phone,
    AvatarUrl,
    StudentId,
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

  const fullName = formatFullName({
    firstName: FirstName,
    lastName: LastName,
    nickname: Nickname,
  })
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
          <DetailsItem iconName="ContactInfo" iconLabel="Name" title={fullName}>
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
        <ConfirmDialog
          hidden={!isDeleteDialogOpen}
          isProcessing={isDeletingFencer}
          onClose={onDeleteDialogClose}
          onConfirmed={onDeleteFencerConfirmed}
          confirmLabel="Delete"
          title="Delete fencer?"
        >
          <>
            Are you sure you want to permanently delete{" "}
            <SemiboldText>{fullName}</SemiboldText>?
          </>
        </ConfirmDialog>

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
