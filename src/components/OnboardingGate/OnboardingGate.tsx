import { useAccountProfile } from "$hooks"
import styled from "@emotion/styled"
import { AnimationStyles, Spinner, SpinnerSize, Stack } from "@fluentui/react"

const AnimatedStack = styled(Stack)`
  ${AnimationStyles.slideUpIn20 as unknown as string}
  height: 85vh;
  width: 100vw;
`

export const OnboardingGate: React.FunctionComponent = ({ children }) => {
  const { loading, account } = useAccountProfile()

  if (loading) {
    return (
      <AnimatedStack verticalAlign={"center"} horizontalAlign={"center"}>
        <Spinner size={SpinnerSize.large} />
      </AnimatedStack>
    )
  } else {
    // If profile already exists
    if (account.UserId) {
      return <>{children}</>
    } else {
      // If profile does not exist, guide user to create it
      return <>Profile does not exist.</>
    }
  }
}
