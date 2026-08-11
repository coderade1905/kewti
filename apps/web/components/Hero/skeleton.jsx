import { cn } from "@/lib/utils"

/**
 * @param {{ className?: string } & import('react').HTMLAttributes<HTMLElement>} props
 * @returns {import('react').JSX.Element}
 */
function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-white/5", className)}
            {...props}
        />
    )
}

export { Skeleton }