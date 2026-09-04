import monitoring from '../data/monitoring.json'
import CategoryPage from './CategoryPage'

export default function Monitoring() {
  return (
    <CategoryPage
      data={monitoring}
      nameKey="title"
      categoryKey="monitoring"
      label="Monitoring"
      heroTitle="AI Monitoring & Observability"
      heroDesc="Track LLM performance, monitor costs, centralize logging, and set up intelligent alerting for your AI stack. Gain full observability into latency, token usage, error rates, and model behavior across all your providers and applications."
      heroSeed="monitoring-hero"
      subNav={['All Monitoring', 'LLM Monitoring', 'Cost Tracking', 'Logging', 'Alerting']}
      footerLabel="Monitoring"
    />
  )
}
