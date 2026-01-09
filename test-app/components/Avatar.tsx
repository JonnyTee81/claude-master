interface AvatarProps {
  src: string | null
  name: string | null
  email: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Avatar({
  src,
  name,
  email,
  size = 'md',
  className = ''
}: AvatarProps) {
  // Generate initials from name or email
  const getInitials = () => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return '?'
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-30 h-30 text-2xl sm:w-40 sm:h-40 sm:text-3xl', // 120px mobile, 160px desktop
    xl: 'w-32 h-32 text-4xl',
  }

  return (
    <div className={`relative rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || email || 'User avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          {getInitials()}
        </div>
      )}
    </div>
  )
}
