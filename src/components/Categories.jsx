const categories = [
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
];

import { Link } from 'react-router-dom'

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const catLinks = {
  'ChatGPT Agents': '/chatbots',
  'Voice AI': '/ai-tools/c/audio-speech',
  'Image Generation': '/ai-tools/c/image-gen',
}

export default function Categories() {
  return (
    <section className="px-6 py-10 bg-surface-container-low rounded-3xl mx-6 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
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
        <Link to="/templates"
          className="inline-block bg-surface border border-border-light text-text-main px-8 py-2.5 rounded text-xs font-semibold shadow-sm hover:bg-surface-container-low transition-colors">
          View more categories
        </Link>
      </div>
    </section>
  );
}
