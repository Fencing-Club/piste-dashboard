import { AssociationMember } from "$types"
import { IPersonaProps } from "@fluentui/react"

export interface IAssociationMemberPersona
  extends Pick<
    IPersonaProps,
    "text" | "size" | "optionalText" | "secondaryText"
  > {
  member: AssociationMember
}
