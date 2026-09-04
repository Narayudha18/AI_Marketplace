import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/20">
              <span className="material-symbols-outlined text-red-400" style={{ fontSize: 32 }}>error</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface mb-2">Something went wrong</h1>
            <p className="text-text-muted mb-6 text-sm">An unexpected error occurred. Please try refreshing the page.</p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              className="bg-blue-500 text-on-surface px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-400 transition-colors cursor-pointer"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
