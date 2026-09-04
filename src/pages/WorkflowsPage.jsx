import workflows from '../data/ai-workflows.json'
import CategoryPage from './CategoryPage'

export default function WorkflowsPage() {
  return (
    <CategoryPage
      data={workflows}
      nameKey="name"
      categoryKey="workflows"
      label="Workflows"
      heroTitle="Automate anything with AI workflows"
      heroDesc="Pre-built automation sequences that connect your favourite tools. From data pipelines to customer onboarding."
      heroSeed="workflows-hero"
      footerLabel="Workflows"
    />
  )
}
