import tokens from '../data/ai-tokens.json'
import CategoryPage from './CategoryPage'

export default function TokensPage() {
  return (
    <CategoryPage
      data={tokens}
      nameKey="name"
      categoryKey="tokens"
      label="Tokens"
      heroTitle="AI tokens & API credits marketplace"
      heroDesc="Buy tokens from OpenAI, Anthropic, Google, and more. Pay-as-you-go access without the commitment."
      heroSeed="tokens-hero"
      footerLabel="Tokens"
    />
  )
}
