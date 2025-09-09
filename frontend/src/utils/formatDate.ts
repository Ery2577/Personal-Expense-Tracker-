/**
 * Formate une date en string lisible
 * @param dateString - La date au format ISO string
 * @returns La date formatée
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    // Formatter en français avec jour/mois/année
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Formate une date en format court (DD/MM/YYYY)
 * @param dateString - La date au format ISO string
 * @returns La date formatée en format court
 */
export function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleDateString('en-GB'); // Format DD/MM/YYYY
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Formate une date relative (il y a X jours, etc.)
 * @param dateString - La date au format ISO string
 * @returns La date formatée en format relatif
 */
export function formatDateRelative(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  } catch (error) {
    return 'Invalid date';
  }
}