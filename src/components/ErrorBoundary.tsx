import { Component, type ReactNode } from "react"

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-[var(--color-text-muted)] p-8">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary-dim)] flex items-center justify-center">
            <span className="text-2xl">!</span>
          </div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">页面出现异常</h2>
          <p className="text-sm text-center max-w-md">{this.state.error?.message || "未知错误"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[var(--color-primary)] rounded-full text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors text-white">
            刷新页面
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
