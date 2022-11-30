import { TabList, Tab } from "@fluentui/react-components"
import styled from "@emotion/styled"

import { useTabs } from "$hooks"
import { ConnectionsManager } from "$components/ConnectionsManager"
import { FencersManager } from "$components/FencersManager"
import { ProfileForm } from "$components/Forms"
import { PaymentMethodsManager } from "$components/PaymentMethodsManager"
import { useTrackPisteMetric } from "$components/ApplicationInsightsProvider"
import { DefaultPageLayout } from "$components/AppShell/components"

const ProfileTabs = styled(TabList)`
  margin-bottom: 1rem;
`

export const ProfilePage: React.FunctionComponent = () => {
  const pageTitle = "Profile"
  useTrackPisteMetric({ componentName: "ProfilePage" })

  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const { onTabSelected, selectedTab } = useTabs(params.tab || "profile")

  return (
    <DefaultPageLayout title={pageTitle}>
      <ProfileTabs selectedValue={selectedTab} onTabSelect={onTabSelected}>
        <Tab value="profile">Profile</Tab>
        <Tab value="connections">Connections</Tab>
        {/* <Tab value="account">Account</Tab>
        <Tab value="notifications">Notifications</Tab> */}
        <Tab value="payment">Payment</Tab>
        <Tab value="fencers">Fencers</Tab>
      </ProfileTabs>

      {selectedTab === "profile" && <ProfileForm />}
      {selectedTab === "connections" && <ConnectionsManager />}
      {/* {selectedTab === "account" && <></>}
      {selectedTab === "notifications" && <></>} */}
      {selectedTab === "payment" && <PaymentMethodsManager />}
      {selectedTab === "fencers" && <FencersManager />}
    </DefaultPageLayout>
  )
}

export default ProfilePage
