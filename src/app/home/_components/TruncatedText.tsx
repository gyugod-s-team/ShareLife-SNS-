// app/home/_components/TruncatedText.tsx
import React, { useState } from "react"

interface TruncatedTextProps {
  text: string
  maxLength: number
  maxLines?: number
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength,
  maxLines = 3,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const truncatedText = isExpanded ? text : text.slice(0, maxLength)

  return (
    <div className="relative">
      <div
        className={`${
          isExpanded ? "" : `line-clamp-${maxLines}`
        } whitespace-pre-wrap break-words`}
      >
        {truncatedText}
        {!isExpanded && text.length > maxLength && "..."}
      </div>
      {text.length > maxLength && (
        <button
          className="text-blue-400 hover:underline mt-1 text-sm"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="expandable-text"
        >
          {isExpanded ? "접기" : "더 보기"}
        </button>
      )}
    </div>
  )
}

export default TruncatedText
