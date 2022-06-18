import { useTrackPisteMetric } from "$components/ApplicationInsightsProvider"
import { PageTitle } from "$components/PageTitle"
import { useTabs, useTitle } from "$hooks"
import { Button, Tab, TabList } from "@fluentui/react-components"
import { AddRegular } from "@fluentui/react-icons"

const ChallengesPage: React.FunctionComponent = () => {
  const pageTitle = "Challenges"
  useTitle(pageTitle)
  useTrackPisteMetric({ componentName: "ChallengesPage" })

  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const { onTabSelected, selectedTab } = useTabs(params.tab || "all")

  return (
    <>
      <PageTitle>{pageTitle}</PageTitle>

      <Button
        appearance="primary"
        icon={<AddRegular />}
        style={{ marginBottom: "2rem" }}
      >
        New challenge
      </Button>

      <TabList selectedValue={selectedTab} onTabSelect={onTabSelected}>
        <Tab value="all">All</Tab>
        <Tab value="results">My results</Tab>
        <Tab value="leaderboard">Leaderboard</Tab>
      </TabList>

      {selectedTab === "all" && <></>}
      {selectedTab === "results" && <></>}
      {selectedTab === "leaderboard" && <></>}
    </>
  )
}

export default ChallengesPage
