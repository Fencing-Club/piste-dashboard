import { Route, Routes } from "react-router-dom"
import loadable from "@loadable/component"
import { AppShell } from "$components/AppShell"
import { Body1 } from "@fluentui/react-components"

const OverviewPage = loadable(() => import("./pages/overview"))
const BillingPage = loadable(() => import("./pages/billing"))
const CalendarPage = loadable(() => import("./pages/calendar"))
const ClubsPage = loadable(() => import("./pages/clubs"))
const ProfilePage = loadable(() => import("./pages/profile"))
const AssessmentsPage = loadable(() => import("./pages/assessments"))
const ViewAssessmentPage = loadable(
  () => import("./pages/assessments/assessment")
)
const SubmitEvaluationPage = loadable(
  () => import("./pages/assessments/assessment/submit")
)
const EditEvaluationPage = loadable(
  () => import("./pages/assessments/assessment/edit")
)
const ChallengesPage = loadable(() => import("./pages/challenges"))

export const App: React.FunctionComponent = () => {
  return (
    <Routes>
      {/* Root route */}
      <Route path="/" element={<AppShell />}>
        <Route path="/" element={<OverviewPage />} />

        <Route path="calendar" element={<CalendarPage />} />
        <Route path="clubs" element={<ClubsPage />} />
        <Route path="billing" element={<BillingPage />} />

        {/* Assessments routes */}
        <Route path="assessments" element={<AssessmentsPage />} />
        <Route
          path="assessments/:assessmentId"
          element={<ViewAssessmentPage />}
        />
        <Route
          path="assessments/:assessmentId/submit"
          element={<SubmitEvaluationPage />}
        />
        <Route
          path="assessments/:assessmentId/:evaluationId"
          element={<EditEvaluationPage />}
        />

        <Route path="challenges" element={<ChallengesPage />} />

        <Route path="profile" element={<ProfilePage />} />

        <Route path="*" element={<Body1>Page not found.</Body1>} />
      </Route>
    </Routes>
  )
}
