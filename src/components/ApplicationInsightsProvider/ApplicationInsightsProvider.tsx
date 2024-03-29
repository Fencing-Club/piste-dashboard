import {
  ReactPlugin,
  AppInsightsContext,
  AppInsightsErrorBoundary,
} from "@microsoft/applicationinsights-react-js"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"
import { PropsWithChildren } from "react"

export const reactPlugin = new ReactPlugin()
export const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: import.meta.env.VITE_APPLICATION_INSIGHTS_KEY,
    connectionString: import.meta.env
      .VITE_APPLICATION_INSIGHTS_CONNECTION_STRING,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    enableAutoRouteTracking: true,
    disableFetchTracking: false,
    maxBatchInterval: 250,
    correlationHeaderExcludedDomains: [
      import.meta.env.VITE_AUTH0_DOMAIN,
      import.meta.env.VITE_APP_CONFIGURATION_DOMAIN,
    ],
    extensions: [reactPlugin],
    enableAjaxPerfTracking: true,
    enableDebug: import.meta.env.DEV,
  },
})

appInsights.loadAppInsights()

export function ApplicationInsightsProvider({
  children,
}: PropsWithChildren<{}>) {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      {/* @ts-ignore  */}
      <AppInsightsErrorBoundary
        onError={() => <>The app encountered an unexpected error.</>}
        appInsights={reactPlugin}
      >
        <>{children}</>
      </AppInsightsErrorBoundary>
    </AppInsightsContext.Provider>
  )
}
