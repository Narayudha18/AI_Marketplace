export default function Navbar() {
  return (
    <>
      <div className="bg-primary-container text-on-primary-container py-2 px-6 text-center text-xs font-semibold flex justify-center items-center gap-4">
        <span>All-in-one AI agent marketplace. Deploy, integrate & scale intelligent automation.</span>
        <button className="bg-text-main text-surface px-4 py-1 rounded text-[11px] font-bold">Explore Now</button>
      </div>

      <header className="bg-text-main flex flex-col w-full border-b border-outline-variant">
        <div className="px-6 h-16 flex items-center justify-between">
          <a href="#" className="text-xl font-bold text-surface tracking-tight">AIAgents</a>
          <div className="flex items-center gap-6">
            <button className="text-surface-variant hover:text-surface transition-colors text-xs font-semibold">Start Selling</button>
            <div className="flex items-center gap-2 text-surface-variant hover:text-surface transition-colors text-xs font-semibold cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>apps</span>
              <span>Our Products</span>
            </div>
            <div className="flex items-center gap-4 pl-4 border-l border-outline">
              <span className="material-symbols-outlined text-surface-variant hover:text-surface cursor-pointer" style={{ fontSize: 20 }}>shopping_cart</span>
              <button className="text-surface text-xs font-semibold border border-surface px-4 py-1.5 rounded hover:bg-surface hover:text-text-main transition-colors">Sign In</button>
            </div>
          </div>
        </div>

        <div className="px-6 h-12 flex items-center justify-between border-t border-outline">
          <nav className="flex h-full">
            {['AI Agents', 'Templates', 'Integrations', 'Chatbots', 'Automation', 'AI Tools & APIs'].map((item, i) => (
              <a key={item} href="#"
                className={`text-surface-variant hover:text-surface transition-colors text-xs font-semibold flex items-center px-4 ${i === 1 ? 'text-primary border-b-2 border-primary' : ''}`}>
                {item}
              </a>
            ))}
          </nav>
          <div className="bg-surface-variant text-text-main px-4 py-1.5 rounded-t text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>smart_toy</span>
            aiagents.market
          </div>
        </div>
      </header>

      <div className="bg-surface border-b border-border-light hidden md:flex px-6 h-12 items-center gap-6 overflow-x-auto">
        {['All Items', 'GPT Agents', 'Voice AI', 'Image Gen', 'RAG Pipelines', 'Workflow', 'Analytics', 'Fine-tuning', 'Deployment', 'Monitoring', 'Security'].map(item => (
          <a key={item} href="#"
            className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold whitespace-nowrap">
            {item}
          </a>
        ))}
      </div>
    </>
  );
}
