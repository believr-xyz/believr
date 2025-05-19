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
 * Formats and renders post content with clickable @mentions and #hashtags
 */
export function FormatPostContent({ content }: { content: string }) {
  if (!content) return null;

  // Split content by mentions and hashtags
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  // Combined regex for mentions and hashtags
  const combinedRegex = /(@\w+|#\w+)/g;

  // Define match type explicitly for RegExpExecArray
  let match: RegExpExecArray | null = null;

  // Execute regex first time before loop
  match = combinedRegex.exec(content);

  // Loop while match is not null
  while (match !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    const tag = match[0];

    // Handle mentions
    if (tag.startsWith("@")) {
      const username = tag.substring(1);
      parts.push(
        <Link
          href={`/u/${username}`}
          key={`mention-${match.index}`}
          className="font-medium text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {tag}
        </Link>,
      );
    }
    // Handle hashtags
    else if (tag.startsWith("#")) {
      const hashtag = tag.substring(1);
      parts.push(
        <Link
          href={`/tag/${hashtag}`}
          key={`hashtag-${match.index}`}
          className="font-medium text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {tag}
        </Link>,
      );
    }

    lastIndex = match.index + match[0].length;

    // Get next match
    match = combinedRegex.exec(content);
  }

  // Add remaining text
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
