import prompts from '../data/ai-prompts.json'
import CategoryPage from './CategoryPage'

export default function PromptsPage() {
  return (
    <CategoryPage
      data={prompts}
      nameKey="name"
      categoryKey="prompts"
      label="Prompts"
      heroTitle="Premium prompts for better AI output"
      heroDesc="Copy-paste ready prompts crafted by experts. Get better results from ChatGPT, Claude, Gemini, and more."
      heroSeed="prompts-hero"
      footerLabel="Prompts"
    />
  )
}
