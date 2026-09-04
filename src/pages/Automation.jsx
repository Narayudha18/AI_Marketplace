import automations from '../data/automation.json'
import CategoryPage from './CategoryPage'

export default function Automation() {
  return (
    <CategoryPage
      data={automations}
      nameKey="name"
      categoryKey="automation"
      label="Automation"
      heroTitle="Automate your workflow with AI precision"
      heroDesc="From marketing sequences to DevOps pipelines — build, deploy, and monitor automation that works while you sleep. Trigger actions, sync data between apps, and orchestrate complex multi-step workflows without writing a single line of code."
      heroSeed="automation-hero"
      subNav={['All Automations', 'Workflow', 'Marketing', 'Sales', 'Data', 'Finance', 'DevOps', 'HR', 'Social Media']}
      footerLabel="Automations"
    />
  )
}
