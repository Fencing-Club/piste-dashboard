import { useTrackPisteMetric } from "$components/ApplicationInsightsProvider"
import { PageTitle } from "$components/PageTitle"
import { useTitle } from "$hooks"

const ChallengesPage: React.FunctionComponent = () => {
  const pageTitle = "Challenges"
  useTitle(pageTitle)
  useTrackPisteMetric({ componentName: "ChallengesPage" })

  return (
    <>
      <PageTitle>{pageTitle}</PageTitle>
    </>
  )
}

export default ChallengesPage
