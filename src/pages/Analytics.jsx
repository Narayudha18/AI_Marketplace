import analytics from '../data/analytics.json'
import CategoryPage from './CategoryPage'

export default function Analytics() {
  return (
    <CategoryPage
      data={analytics}
      nameKey="title"
      categoryKey="analytics"
      label="Analytics"
      heroTitle="AI-Powered Analytics Tools"
      heroDesc="Uncover insights with intelligent dashboards, data visualization, BI tools, and automated reporting APIs. Transform raw data into actionable intelligence with AI-powered analytics pipelines and real-time dashboards that everyone on your team can understand."
      heroSeed="analytics-hero"
      subNav={['All Analytics', 'Dashboards', 'Data Viz', 'BI Tools', 'Reporting']}
      footerLabel="Analytics"
    />
  )
}
