import { BookData, Testimonial, BonusItem } from '../types';

export const CURRENT_BOOK: BookData = {
  eyebrow: 'THE SELF JOURNAL',
  title: 'Ramblings & Epiphanies',
  tagline: 'A candid journey through unfiltered reflections, mental clarity, and the quiet epiphanies that reshape how we live.',
  description:
    'Ramblings & Epiphanies: The Self Journal is an intimate exploration of personal growth, authentic self-inquiry, and inner alignment. Blending introspective reflections with structured self-journaling architecture, this work invites you to slow down, interrogate your assumptions, and discover clarity in the midst of everyday chaos.',
  releaseDate: 'Available Now',
  pageCount: 260,
  isbn: '978-0-998-41201-9',
  publisher: 'Mimshach Obioha Publishing',
  genres: ['Self-Discovery', 'Personal Development', 'Journaling & Reflections', 'Philosophy'],
  formats: [
    {
      id: 'hardcover',
      name: 'Hardcover Self-Journal Edition',
      price: '$28.00',
      inStock: true,
      description: 'Cloth-bound linen cover with ribbon marker, guided reflection sections, and archival writing paper.',
    },
    {
      id: 'signed',
      name: 'Collector’s First Edition (Limited Run)',
      price: '$40.00',
      inStock: true,
      description: 'Hand-numbered edition with custom embossing and author dedication page.',
    },
    {
      id: 'kindle',
      name: 'Digital Journal / E-Book Edition',
      price: '$14.99',
      inStock: true,
      description: 'Interactive digital edition with fillable reflection prompts for tablets and e-readers.',
    },
    {
      id: 'audiobook',
      name: 'Audio Companion & Commentary',
      price: '$22.95',
      inStock: true,
      description: 'Unabridged reflections and conversational commentary narrated by Mimshach Obioha.',
    },
  ],
  sampleExcerpt: {
    chapter: 'PART I: ARCHITECTURE OF INQUIRY',
    title: 'The Quiet Spaces Between Thoughts',
    paragraphs: [
      'We spend so much of our lives reacting to the noise around us that we rarely stop to listen to the cadence of our own inner dialogue. Most epiphanies do not arrive with the crash of thunder; they arrive in the stillness, in the quiet pauses we allow ourselves between one obligation and the next.',
      'To journal is not merely to record what happened today. It is to hold up a mirror without judgment, to ask the difficult questions we habitually avoid, and to untangle the knotted expectations we carry from the world.',
      'When you begin to write with radical honesty, the ramblings slowly distill into clarity. You realize that you already possessed the answers—you simply needed a dedicated space to hear them.',
      'This journal is built on conversational cadence: meeting yourself exactly where you are, peeling back the layers of pretense, and giving yourself permission to wonder, doubt, and grow.',
    ],
  },
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    header: 'Clarity & Introspection',
    rating: 5,
    quote:
      'A remarkably honest, grounding book. It does not lecture—it invites you into a gentle, transformative conversation with yourself.',
    author: 'Reader Reflection',
    source: 'The Self-Inquiry Review',
    icon: 'square',
  },
  {
    id: '2',
    header: 'Vulnerability & Depth',
    rating: 5,
    quote:
      'The architecture of these reflections strikes the perfect balance between raw vulnerability and practical mental clarity.',
    author: 'Editorial Review',
    source: 'Mindful Living',
    icon: 'settings',
  },
  {
    id: '3',
    header: 'Essential Companion',
    rating: 5,
    quote:
      'An essential companion for anyone seeking clarity, intentionality, and a deeper connection to their own journey.',
    author: 'Contemporary Reads',
    source: 'Book of the Month',
    icon: 'square',
  },
];

export const AUTHOR_BIO = {
  name: 'Mimshach Obioha',
  role: 'Author & Creator of The Self Journal',
  shortBio:
    'Mimshach Obioha is an author and thinker dedicated to exploring self-inquiry, personal transformation, and mindful reflection through intentional literature and structured journaling.',
  extendedBio:
    'Through "Ramblings & Epiphanies: The Self Journal", Mimshach Obioha creates a sanctuary for honest dialogue, mental clarity, and deep introspection. His work bridges candid personal reflections with practical self-inquiry architectures designed to help readers navigate their inner landscapes with intentionality and grace.',
  notableWorks: [
    { title: 'Ramblings & Epiphanies: The Self Journal', year: '2026', type: 'Hardcover & Digital Edition' },
  ],
};

export const BONUSES_LIST: BonusItem[] = [
  {
    id: 'bonus-1',
    title: 'Guided Reflection Prompts & Framework',
    category: 'Companion Guide',
    description:
      '30 deep-dive self-journaling exercises and reflection frameworks to accompany each section of the book.',
    fileSize: '1.8 MB PDF',
    iconName: 'FileText',
    isUnlockedByDefault: true,
  },
  {
    id: 'bonus-2',
    title: 'The Epiphany Habit Tracker & Daily Template',
    category: 'Printable Template',
    description:
      'Printable minimal daily reflection sheets and clarity tracker designed for mindful morning routines.',
    fileSize: '2.4 MB PDF',
    iconName: 'Map',
    isUnlockedByDefault: true,
  },
  {
    id: 'bonus-3',
    title: 'Author Audio Commentary & Guided Intro',
    category: 'Audio Experience',
    description:
      'Mimshach Obioha introduces the philosophy and conversational cadence behind the self-journal.',
    fileSize: '28 mins Audio MP3',
    iconName: 'Headphones',
    isUnlockedByDefault: true,
  },
  {
    id: 'bonus-4',
    title: 'Discussion & Group Journaling Guide',
    category: 'Reader Companion',
    description:
      'Curated reflection questions for reading groups, mentors, and self-inquiry circles.',
    fileSize: '1.1 MB PDF',
    iconName: 'BookOpen',
    isUnlockedByDefault: true,
  },
];
