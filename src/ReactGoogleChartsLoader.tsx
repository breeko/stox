import * as React from "react"
// @ts-ignore
import { default as Script } from "react-load-script"

interface Props {
  chartLanguage?: string
  mapsApiKey?: string
  onLoad: (g: typeof google) => void
  onError: () => void
}

export class GoogleChartLoader extends React.Component<Props> {
  public render() {
    const { onError } = this.props
    return (
      <Script
        url="https://www.gstatic.com/charts/loader.js"
        onError={onError}
        onLoad={() => {
          if (window && window.google) {
            this.handleGoogleChartsLoaderScriptLoaded(
              window.google,
            )
          }
        }}
      />
    )
  }
  private handleGoogleChartsLoaderScriptLoaded = (
    windowGoogleCharts: typeof google,
  ) => {
    const {
      chartLanguage: language,
      mapsApiKey,
      onLoad,
    } = this.props
    windowGoogleCharts.charts.load("current", {
      language: language || "en",
      mapsApiKey,
      packages: ["corechart", "controls"],
    })
    windowGoogleCharts.charts.setOnLoadCallback(() => {
      onLoad(windowGoogleCharts)
    })
  }
}
