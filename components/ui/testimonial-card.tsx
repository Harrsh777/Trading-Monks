import { cn } from "@/lib/utils"

export interface TestimonialAuthor {
  name: string
  handle?: string
  avatar?: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({
  author,
  text,
  href,
  className,
}: TestimonialCardProps) {
  const CardContent = (
    <div
      className={cn(
        "flex w-[320px] sm:w-[380px] shrink-0 flex-col justify-between rounded-2xl",
        "border border-white/10 bg-[#0d0f14]/85 p-6 text-left backdrop-blur-md",
        "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-300",
        "hover:border-[#88e7d2]/40 hover:bg-[#12151d] hover:shadow-[0_12px_36px_-10px_rgba(136,231,210,0.15)]",
        "select-none",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="h-10 w-10 rounded-full object-cover border border-white/15"
                loading="lazy"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#88e7d2]/20 to-[#d6b574]/20 border border-white/10 text-xs font-semibold text-[#88e7d2]">
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div className="flex flex-col text-left">
              <span className="text-[14.5px] font-semibold text-white tracking-tight">
                {author.name}
              </span>
              {author.handle && (
                <span className="text-xs text-white/50 font-mono">
                  {author.handle}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-0.5 text-[#d6b574] text-xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className="h-3.5 w-3.5 fill-current text-[#d6b574]"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        <p className="mt-4 text-[13.5px] sm:text-sm leading-relaxed text-white/75 font-normal">
          &ldquo;{text}&rdquo;
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-3 text-[11px] font-mono text-[#88e7d2]/70 uppercase tracking-wider">
        <span className="h-1.5 w-1.5 rounded-full bg-[#88e7d2]" />
        <span>Verified Market Participant</span>
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#88e7d2]"
      >
        {CardContent}
      </a>
    )
  }

  return CardContent
}
