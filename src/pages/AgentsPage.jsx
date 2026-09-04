import agents from '../data/ai-agents.json'
import CategoryPage from './CategoryPage'

export default function AgentsPage() {
  return (
    <CategoryPage
      data={agents}
      nameKey="name"
      categoryKey="ai-agents"
      label="AI Agents"
      heroTitle="Autonomous agents for every team"
      heroDesc="Deploy AI agents that work alongside your team — code review, support, research, and more."
      heroSeed="agents-hero"
      filterCategories={['Developer Tools', 'Customer Service', 'Research', 'Data Science', 'Marketing', 'DevOps', 'Legal', 'HR', 'Finance', 'Content Creation']}
      showCapabilities={true}
      showPlatform={true}
      footerLabel="Agents"
    />
  )
}
