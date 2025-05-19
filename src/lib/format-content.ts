/**
 * Format post content by highlighting @mentions and #hashtags with primary color
 * and making them clickable
 *
 * @param content The post content to format
 * @returns Formatted content with interactive links for mentions and hashtags
 */
export function formatPostContent(content: string): string | null {
  if (!content) return null;

  // Regular expressions for mentions and hashtags
  const mentionRegex = /@(\w+)/g;
  const hashtagRegex = /#(\w+)/g;

  // Replace mentions with clickable links
  const contentWithMentions = content.replace(
    mentionRegex,
    '<a href="/u/$1" class="text-primary font-medium hover:underline" onclick="event.stopPropagation()">$&</a>',
  );

  // Replace hashtags with clickable links
  const formattedContent = contentWithMentions.replace(
    hashtagRegex,
    '<a href="/tag/$1" class="text-primary font-medium hover:underline" onclick="event.stopPropagation()">$&</a>',
  );

  return formattedContent;
}
