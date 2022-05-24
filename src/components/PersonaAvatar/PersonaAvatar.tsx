import styled from "@emotion/styled"
import { IPersonaProps, Persona, PersonaSize } from "@fluentui/react"
import { AvatarProps, Avatar } from "@fluentui/react-components"

export type PersonaAvatarProps = Omit<IPersonaProps, "size"> &
  Pick<AvatarProps, "size"> & {
    className?: string
  }

const PersonaAdapter: React.FunctionComponent<PersonaAvatarProps> = ({
  size = 48,
  className,
  ...props
}) => {
  return (
    <Persona
      {...props}
      className={className}
      size={PersonaSize.size48}
      onRenderPersonaCoin={(item) => (
        <Avatar
          name={item?.text}
          color={item?.text ? "colorful" : undefined}
          size={size}
        />
      )}
    />
  )
}

export const PersonaAvatar = styled(PersonaAdapter)`
  min-width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`
