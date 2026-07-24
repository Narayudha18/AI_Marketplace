import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/context'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const allCategories = [
  {
    icon: 'smart_toy',
    title: 'ChatGPT Agents',
    desc: 'GPT-4 powered autonomous agents',
    tags: ['GPT-4o', 'Fine-tuned', 'Custom', 'Support', 'Sales'],
  },
  {
    icon: 'dashboard',
    title: 'Templates & Dashboards',
    desc: 'Premium UI, admin panels & landing pages',
    tags: ['Dashboards', 'Landing Pages', 'E-commerce', 'Blogs', 'Portfolios'],
  },
  {
    icon: 'integration_instructions',
    title: 'LLM Integrations',
    desc: 'OpenAI, Anthropic, Mistral & 300+ APIs',
    tags: ['LLM Providers', 'Vector DB', 'Frameworks', 'Hosting', 'Compute'],
  },
  {
    icon: 'record_voice_over',
    title: 'Voice AI',
    desc: 'Speech-to-text, TTS & voice cloning',
    tags: ['STT', 'TTS', 'Voice Cloning', 'Audio Processing'],
  },
  {
    icon: 'image',
    title: 'Image Generation',
    desc: 'Stable Diffusion, Midjourney, DALL-E',
    tags: ['Text-to-Image', 'Image Editing', 'Video Gen', '3D Models'],
  },
  {
    icon: 'sync_alt',
    title: 'Workflow Automation',
    desc: 'Automate tasks with AI-powered workflows',
    tags: ['Workflow', 'Marketing', 'Data', 'Finance', 'DevOps'],
  },
  {
    icon: 'chat',
    title: 'Chatbots & Assistants',
    desc: 'Deploy AI chatbots for any channel',
    tags: ['Support', 'Sales', 'HR', 'Education', 'Healthcare'],
  },
  {
    icon: 'analytics',
    title: 'Analytics & BI',
    desc: 'Dashboards, data viz & reporting APIs',
    tags: ['Dashboards', 'Data Viz', 'BI Tools', 'Reporting', 'Predictive'],
  },
  {
    icon: 'tune',
    title: 'Fine-tuning & RLHF',
    desc: 'Custom LLM tuning, embeddings & distillation',
    tags: ['LLM Tuning', 'LoRA', 'Embeddings', 'RLHF', 'Distillation'],
  },
  {
    icon: 'rocket_launch',
    title: 'Deployment & Hosting',
    desc: 'GPU compute, serverless & edge hosting',
    tags: ['Model Hosting', 'Serverless', 'Docker', 'K8s', 'Edge'],
  },
  {
    icon: 'monitoring',
    title: 'Monitoring & Observability',
    desc: 'LLM tracing, cost tracking & alerting',
    tags: ['LLM Monitoring', 'Cost Tracking', 'Logging', 'Alerting'],
  },
  {
    icon: 'security',
    title: 'Security & Guardrails',
    desc: 'Prompt protection, compliance & auditing',
    tags: ['Guardrails', 'PII Detection', 'Red Teaming', 'Compliance'],
  },
  {
    icon: 'developer_board',
    title: 'Compute & Infrastructure',
    desc: 'GPUs, vector DBs & inference engines',
    tags: ['GPU', 'Vector DB', 'Inference', 'Serverless', 'Cloud'],
  },
  {
    icon: 'code',
    title: 'Developer Tools & SDKs',
    desc: 'LangChain, LlamaIndex, Vercel AI SDK',
    tags: ['LangChain', 'LlamaIndex', 'SDK', 'Frameworks', 'APIs'],
  },
  {
    icon: 'language',
    title: 'Speech Recognition',
    desc: '100+ languages, real-time & async',
    tags: ['Speech-to-Text', 'Real-time', '100+ Languages', 'Summarization'],
  },
]

const catLinks = {
  'ChatGPT Agents': '/chatbots',
  'Templates & Dashboards': '/templates',
  'LLM Integrations': '/integrations',
  'Voice AI': '/voice-ai',
  'Image Generation': '/image-gen',
  'Workflow Automation': '/automation',
  'Chatbots & Assistants': '/chatbots',
  'Analytics & BI': '/analytics',
  'Fine-tuning & RLHF': '/fine-tuning',
  'Deployment & Hosting': '/ai-tools',
  'Monitoring & Observability': '/monitoring',
  'Security & Guardrails': '/security',
  'Compute & Infrastructure': '/integrations',
  'Developer Tools & SDKs': '/ai-tools',
  'Speech Recognition': '/voice-ai',
}

const INITIAL_COUNT = 6

export default function Categories() {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? allCategories : allCategories.slice(0, INITIAL_COUNT)

  return (
    <section className="px-6 py-10 bg-surface-container-low rounded-3xl mx-6 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((cat) => (
          <Link key={cat.title} to={catLinks[cat.title]}
            className="bg-surface rounded-xl shadow-sm border border-border-light p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-low opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <span className="material-symbols-outlined text-primary text-4xl mb-4">{cat.icon}</span>
            <h3 className="text-[24px] font-semibold text-text-main mb-2">{cat.title}</h3>
            <p className="text-xs font-semibold text-text-muted mb-4">{cat.desc}</p>
            <div className="flex gap-4 text-[11px] font-medium text-primary flex-wrap justify-center">
              {cat.tags.map((tag) => (
                <span key={tag} className="hover:underline cursor-pointer">{tag}</span>
              ))}
            </div>
            <img
              src={`https://picsum.photos/seed/${cat.icon}/400/120`}
              alt={cat.title}
              className="mt-6 w-full h-32 object-cover rounded-lg border border-border-light"
            />
          </Link>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button onClick={() => { const y = window.scrollY; setExpanded(e => !e); setTimeout(() => window.scrollTo(0, y), 0) }}
          className="inline-block bg-surface border border-border-light text-text-main px-8 py-2.5 rounded text-xs font-semibold shadow-sm hover:bg-surface-container-low transition-colors cursor-pointer">
          {expanded ? t('categories.showLess') : t('categories.showMore')}
        </button>
      </div>
    </section>
  );
}
