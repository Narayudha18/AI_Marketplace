import tools from '../data/aitools.json'
import CategoryPage from './CategoryPage'

export default function AiTools() {
  return (
    <CategoryPage
      data={tools}
      nameKey="name"
      categoryKey="ai-tools"
      label="AI Tools"
      heroTitle="The largest catalog of AI tools & APIs"
      heroDesc="From GPT-4o to Stable Diffusion — find, compare, and connect to 1,000+ AI APIs and SDKs in one place. Compare pricing, latency, features, and rate limits across LLMs, image generation, audio, vector databases, and compute providers side by side."
      heroSeed="ai-tools-hero"
      subNav={['All Tools', 'LLM APIs', 'Image Gen', 'Audio/Speech', 'Vector DB', 'Compute', 'Frameworks', 'Monitoring', 'Analytics', 'Fine-tuning', 'Security']}
      footerLabel="Tools"
    />
  )
}
