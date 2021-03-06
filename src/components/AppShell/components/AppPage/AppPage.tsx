import { IStyleableProps } from "$types"
import styled from "@emotion/styled"
import { DetailedHTMLProps, HTMLAttributes } from "react"

const PageContainer = styled.div`
  width: 100%;
  padding: 32px;
  background-color: ${({ theme }) => theme.palette.white};
`

const PageContent = styled.main`
  max-width: 1200px;
  width: 100%;
`

export interface IAppPageProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    IStyleableProps {}

export const AppPage: React.FunctionComponent<IAppPageProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <PageContainer className={className} {...props}>
      <PageContent>{children}</PageContent>
    </PageContainer>
  )
}
