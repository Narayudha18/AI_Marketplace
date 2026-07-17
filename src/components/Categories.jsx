import { useState } from 'react'
import { Link } from 'react-router-dom'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const allCategories = [
  {
    icon: 'smart_toy',
    title: 'ChatGPT Agents',
    desc: 'GPT-4 powered autonomous agents',
    tags: ['Newest', 'Bestsellers', 'GPT-4o', 'Fine-tuned', 'Custom'],
  },
  {
    icon: 'record_voice_over',
    title: 'Voice AI',
    desc: 'Speech-to-text & voice assistants',
    tags: ['Newest', 'Bestsellers', 'STT', 'TTS', 'Cloning'],
  },
  {
    icon: 'image',
    title: 'Image Generation',
    desc: 'Stable Diffusion, DALL-E & more',
    tags: ['Newest', 'Bestsellers', 'SDXL', 'ControlNet', 'LoRA'],
  },
  {
    icon: 'integration_instructions',
    title: 'RAG Pipelines',
    desc: 'Retrieval-augmented generation systems',
    tags: ['Newest', 'Vector DB', 'Embeddings', 'Chunking', 'Hybrid'],
  },
  {
    icon: 'sync_alt',
    title: 'Workflow Automation',
    desc: 'Automate repetitive tasks with AI',
    tags: ['Newest', 'Zapier', 'n8n', 'Custom', 'Scheduling'],
  },
  {
    icon: 'analytics',
    title: 'Analytics',
    desc: 'AI-powered data analysis & insights',
    tags: ['Newest', 'Dashboards', 'Reports', 'Real-time', 'Predictive'],
  },
  {
    icon: 'tune',
    title: 'Fine-tuning',
    desc: 'Custom model training & optimization',
    tags: ['Newest', 'LoRA', 'QLoRA', 'RLHF', 'SFT'],
  },
  {
    icon: 'cloud_deploy',
    title: 'Deployment',
    desc: 'One-click deployment & scaling',
    tags: ['Newest', 'Docker', 'Serverless', 'Edge', 'K8s'],
  },
  {
    icon: 'monitoring',
    title: 'Monitoring',
    desc: 'Real-time AI observability & logging',
    tags: ['Newest', 'Latency', 'Tokens', 'Cost', 'Alerts'],
  },
  {
    icon: 'security',
    title: 'Security',
    desc: 'Guardrails, safety & compliance',
    tags: ['Newest', 'PII', 'Guardrails', 'Audit', 'RBAC'],
  },
]

const catLinks = {
  'ChatGPT Agents': '/chatbots',
  'Voice AI': '/ai-tools/c/audio-speech',
  'Image Generation': '/ai-tools/c/image-gen',
  'RAG Pipelines': '/integrations',
  'Workflow Automation': '/automation',
  'Analytics': '/templates',
  'Fine-tuning': '/ai-tools',
  'Deployment': '/templates',
  'Monitoring': '/integrations',
  'Security': '/templates',
}

const INITIAL_COUNT = 3

export default function Categories() {
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
        <button onClick={() => setExpanded(!expanded)}
          className="inline-block bg-surface border border-border-light text-text-main px-8 py-2.5 rounded text-xs font-semibold shadow-sm hover:bg-surface-container-low transition-colors cursor-pointer">
          {expanded ? 'Show less' : 'View more categories'}
        </button>
      </div>
    </section>
  );
}
