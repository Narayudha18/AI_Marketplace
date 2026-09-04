import chatbots from '../data/chatbots.json'
import CategoryPage from './CategoryPage'

export default function Chatbots() {
  return (
    <CategoryPage
      data={chatbots}
      nameKey="name"
      categoryKey="chatbots"
      label="Chatbots"
      heroTitle="AI chatbots that actually understand your business"
      heroDesc="Deploy GPT-powered chatbots for support, sales, HR, and more. Trained on your data, live in minutes. Customize personalities, connect to your knowledge base, and deploy across web, Slack, WhatsApp, and API channels with zero coding required."
      heroSeed="chatbots-hero"
      subNav={['All Chatbots', 'Customer Support', 'Sales', 'HR', 'Education', 'Healthcare', 'Finance', 'Developer Tools', 'Productivity']}
      footerLabel="Chatbots"
    />
  )
}
