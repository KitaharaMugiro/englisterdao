
export default function SafeHydrate({ children }: any) {
    return (
        <div suppressHydrationWarning>
            {typeof document === 'undefined' ? null : children}
        </div>
    )
}