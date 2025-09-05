import Wordmark from "../imports/Wordmark-1-440"

export function ZeroHWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center h-8 w-auto ${className}`}>
      <Wordmark />
    </div>
  )
}