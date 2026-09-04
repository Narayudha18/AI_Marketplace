import skills from '../data/ai-skills.json'
import CategoryPage from './CategoryPage'

export default function SkillsPage() {
  return (
    <CategoryPage
      data={skills}
      nameKey="name"
      categoryKey="skills"
      label="Skills"
      heroTitle="AI skill packs for every use case"
      heroDesc="Equip your AI agent with specialised skills — from data analysis to DevOps. One file, one new ability."
      heroSeed="skills-hero"
      footerLabel="Skills"
    />
  )
}
