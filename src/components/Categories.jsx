import { useState } from 'react'
import { Link } from 'react-router-dom'

const allCategories = [
  {
    icon: 'smart_toy',
    title: 'ChatGPT Agents',
    desc: 'GPT-4 powered autonomous agents',
    tags: ['GPT-4o', 'Fine-tuned', 'Custom', 'Support', 'Sales'],
  },
  {
    icon: 'robot',
    title: 'AI Agents',
    desc: 'Autonomous agents for code, support, research & ops',
    tags: ['Autonomous', 'Support', 'Research', 'DevOps', 'Marketing'],
  },
  {
    icon: 'text_snippet',
    title: 'AI Prompts',
    desc: 'Premium prompts for writing, coding & analysis',
    tags: ['Creative Writing', 'Coding', 'SEO', 'Data', 'Marketing'],
  },
  {
    icon: 'school',
    title: 'AI Skills',
    desc: 'Reusable skills & expertise for Claude, OpenAI & Gemini',
    tags: ['Claude', 'OpenAI', 'Gemini', 'Expertise', 'Reusable'],
  },
  {
    icon: 'token',
    title: 'AI Tokens',
    desc: 'Prepaid credits & quotas for GPT, Claude & Llama',
    tags: ['Credits', 'Quotas', 'GPT', 'Claude', 'Llama'],
  },
  {
    icon: 'account_tree',
    title: 'AI Workflows',
    desc: 'Orchestrated multi-step AI pipelines & automations',
    tags: ['Orchestration', 'Pipelines', 'Automation', 'Multi-step'],
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
  'AI Agents': '/ai-agents',
  'AI Prompts': '/ai-prompts',
  'AI Skills': '/ai-skills',
  'AI Tokens': '/ai-tokens',
  'AI Workflows': '/ai-workflows',
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
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? allCategories : allCategories.slice(0, INITIAL_COUNT)

  return (
    <section className="px-6 sm:px-10 py-20">
      <div className="flex items-end justify-between gap-4 border-b border-dashed border-[var(--color-border-light)] pb-6">
        <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-[var(--color-text-main)]">
          browse by category
        </h2>
        <span className="hidden text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--color-text-muted)] sm:block">
          Index — {allCategories.length}
        </span>
      </div>

      <div>
        {visible.map((cat, i) => (
          <Link
            key={cat.title}
            to={catLinks[cat.title]}
            className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-dashed border-[var(--color-border-light)] py-6 sm:gap-8"
          >
            <span className="w-8 text-xs tabular-nums text-[var(--color-text-muted)]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-[clamp(1.5rem,3.5vw,2.6rem)] font-medium lowercase leading-[0.92] tracking-[-0.04em] text-[var(--color-text-main)] transition-colors group-hover:text-[var(--color-primary)]">
                {cat.title}
              </h3>
              <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">{cat.desc}</p>
              <div className="mt-3 hidden flex-wrap gap-x-5 gap-y-1 text-[11px] font-medium text-[var(--color-text-muted)] sm:flex">
                {cat.tags.slice(0, 4).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <span
              className="material-symbols-outlined text-[var(--color-text-main)] transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[var(--color-primary)]"
              style={{ fontSize: 26 }}
            >
              arrow_forward
            </span>
          </Link>
        ))}
      </div>

      <div className="border-t border-b border-dashed border-[var(--color-border-light)]">
        <button
          onClick={() => {
            const y = window.scrollY
            setExpanded((e) => !e)
            setTimeout(() => window.scrollTo(0, y), 0)
          }}
          className="flex w-full items-center justify-between gap-4 py-5 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-main)] transition-colors hover:text-[var(--color-primary)]"
        >
          <span>{expanded ? 'Show less' : 'View more categories'}</span>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>
    </section>
  )
}