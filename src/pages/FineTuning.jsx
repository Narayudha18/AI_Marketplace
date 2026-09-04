import fineTuning from '../data/fine-tuning.json'
import CategoryPage from './CategoryPage'

export default function FineTuning() {
  return (
    <CategoryPage
      data={fineTuning}
      nameKey="title"
      categoryKey="fine-tuning"
      label="Fine-tuning"
      heroTitle="Model Fine-Tuning Platforms"
      heroDesc="Customize LLMs, train embeddings, implement RLHF, and distill models for your specific use case. Fine-tune models like Llama, GPT, and Mistral on your own datasets with managed infrastructure and one-click deployment."
      heroSeed="fine-tuning-hero"
      subNav={['All Fine-tuning', 'LLM Tuning', 'Embeddings', 'RLHF', 'Model Distillation']}
      footerLabel="Fine-tuning"
    />
  )
}
