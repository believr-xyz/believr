/**
 * Format post content by highlighting @mentions and #hashtags with primary color
 * and making them clickable using React components instead of raw HTML
 *
 * @param content The post content to format
 * @returns React JSX elements for formatted content
 */
import Link from "next/link";
import React, { ReactNode } from "react";

/**
 * Formats and renders post content with clickable @mentions, #hashtags, and URLs
 */
export function FormatPostContent({ content }: { content: string }) {
  if (!content) return null;

  // Regex for mentions, hashtags, and URLs
  // This will match @username, @lens/username, #hashtag, and URLs
  const combinedRegex = /(@[\w/]+|#\w+|https?:\/\/[^\s]+)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  match = combinedRegex.exec(content);
  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    const tag = match[0];
    if (tag.startsWith("@")) {
      // Remove any @lens/ or @hey/ or @something/ prefix, just use the last part
      const username = tag.replace(/^@([\w-]+\/)*/, "@").substring(1);
      parts.push(
        <Link
          href={`/u/${username}`}
          key={`mention-${match.index}`}
          style={{ color: "#00A8FF", fontWeight: 500 }}
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          @{username}
        </Link>,
      );
    } else if (tag.startsWith("#")) {
      const hashtag = tag.substring(1);
      parts.push(
        <Link
          href={`/tag/${hashtag}`}
          key={`hashtag-${match.index}`}
          style={{ color: "#00A8FF", fontWeight: 500 }}
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {tag}
        </Link>,
      );
    } else if (tag.startsWith("http")) {
      parts.push(
        <a
          href={tag}
          key={`url-${match.index}`}
          style={{ color: "#00A8FF", fontWeight: 500 }}
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {tag}
        </a>,
      );
    }
    lastIndex = match.index + match[0].length;
    match = combinedRegex.exec(content);
  }
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }
  return <>{parts}</>;
}

/**
 * Legacy HTML version for backward compatibility
 * @param content The post content to format
 * @returns Formatted content with interactive links for mentions and hashtags
 * @deprecated Use FormatPostContent React component instead
 */
export function formatPostContent(content: string): string | null {
  if (!content) return null;

  // Regular expressions for mentions and hashtags
  const mentionRegex = /@(\w+)/g;
  const hashtagRegex = /#(\w+)/g;

  // Replace mentions with clickable links
  const contentWithMentions = content.replace(
    mentionRegex,
    '<a href="/u/$1" class="text-primary font-medium hover:underline" data-mention="$1">$&</a>',
  );

  // Replace hashtags with clickable links
  const formattedContent = contentWithMentions.replace(
    hashtagRegex,
    '<a href="/tag/$1" class="text-primary font-medium hover:underline" data-hashtag="$1">$&</a>',
  );

  return formattedContent;
}
