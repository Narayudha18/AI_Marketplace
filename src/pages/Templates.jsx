import templates from '../data/templates.json'
import CategoryPage from './CategoryPage'

export default function Templates() {
  return (
    <CategoryPage
      data={templates}
      nameKey="title"
      categoryKey="templates"
      label="Templates"
      heroTitle="Production-ready templates to ship faster"
      heroDesc="Jumpstart your next project with premium UI templates, dashboard kits, and full-page layouts built by top designers. Browse hundreds of production-ready designs — from admin panels and landing pages to e-commerce stores and portfolio sites — all crafted with modern frameworks and responsive layouts."
      heroSeed="templates-hero"
      subNav={['All Templates', 'Dashboards', 'Landing Pages', 'E-commerce', 'Portfolios', 'Blogs', 'Mobile Apps', 'UI Kits', 'Admin Panels']}
      filterCategories={['Dashboards', 'Landing Pages', 'E-commerce', 'Portfolios', 'Blogs', 'Mobile Apps', 'UI Kits']}
      footerLabel="Templates"
    />
  )
}
