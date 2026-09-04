import integrations from '../data/integrations.json'
import CategoryPage from './CategoryPage'

export default function Integrations() {
  return (
    <CategoryPage
      data={integrations}
      nameKey="name"
      categoryKey="integrations"
      label="Integrations"
      heroTitle="Connect your AI stack with 300+ integrations"
      heroDesc="Plug in LLMs, vector databases, voice APIs, and productivity tools. One API to connect them all. Integrate seamlessly with OpenAI, Anthropic, Pinecone, LangChain, and 300+ AI services through standardized SDKs and REST endpoints — all from a single marketplace."
      heroSeed="integrations-hero"
      subNav={['All Integrations', 'LLM Providers', 'Vector DB', 'Voice AI', 'Image Gen', 'RAG Pipelines', 'Frameworks', 'Model Hosting', 'Compute', 'Monitoring']}
      footerLabel="Integrations"
    />
  )
}
