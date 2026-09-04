import security from '../data/security.json'
import CategoryPage from './CategoryPage'

export default function Security() {
  return (
    <CategoryPage
      data={security}
      nameKey="title"
      categoryKey="security"
      label="Security"
      heroTitle="AI Security & Compliance"
      heroDesc="Protect your AI applications with guardrails, red teaming, compliance frameworks, and data privacy tools. Prevent prompt injection, detect PII leaks, enforce content policies, and maintain SOC 2 compliance across your entire AI pipeline."
      heroSeed="security-hero"
      subNav={['All Security', 'Guardrails', 'Red Teaming', 'Compliance', 'Data Privacy']}
      footerLabel="Security"
    />
  )
}
