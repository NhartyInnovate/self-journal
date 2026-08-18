export interface BookData {
  title: string;
  eyebrow: string;
  tagline: string;
  description: string;
  releaseDate: string;
  pageCount: number;
  isbn: string;
  publisher: string;
  genres: string[];
  formats: {
    id: string;
    name: string;
    price: string;
    inStock: boolean;
    description: string;
  }[];
  sampleExcerpt: {
    chapter: string;
    title: string;
    paragraphs: string[];
  };
}

export interface Testimonial {
  id: string;
  header?: string;
  rating: number;
  quote: string;
  author: string;
  source?: string;
  icon?: string;
}

export interface BonusItem {
  id: string;
  title: string;
  category: string;
  description: string;
  fileSize: string;
  iconName: string;
  isUnlockedByDefault?: boolean;
}

export interface CartItem {
  id: string;
  title: string;
  format: string;
  price: number;
  quantity: number;
  image?: string;
}
