import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import NewsEvent from '../models/NewsEvent.js';
import { generateUniqueSlug } from '../utils/slug.js';

const samples = [
  {
    title: 'Annual Day Celebration 2026',
    category: 'Event',
    date: '2026-01-20',
    image: 'annual-day.jpg',
    shortDescription: 'A vibrant evening of performances celebrating the achievements of the year.',
    content:
      'Our Annual Day was celebrated with great enthusiasm, featuring performances from students across all grades, award distributions, and a keynote from our principal on the year ahead.',
  },
  {
    title: 'Manthan Students Win Robotics Championship',
    category: 'Achievement',
    date: '2026-01-10',
    image: 'robotics.jpg',
    shortDescription: 'Our robotics team brought home the state-level championship trophy.',
    content:
      'A team of five students from grades 7-9 represented The Manthan School at the state robotics championship and secured first place, competing against 40 schools.',
  },
  {
    title: 'Admissions Open for 2026-27',
    category: 'News',
    date: '2026-01-05',
    image: 'admissions.jpg',
    shortDescription: 'Admissions are now open for Toddlers through Grade 5 for the upcoming academic year.',
    content:
      'We are pleased to announce that admissions for the 2026-27 academic year are now open. Parents can book a campus visit through our website or contact the admissions office directly.',
  },
  {
    title: 'Annual Sports Day',
    category: 'Event',
    date: '2025-12-15',
    image: 'sports-day.jpg',
    shortDescription: 'A day full of athletic spirit, races, and team games for all age groups.',
    content:
      'Students participated in track and field events, relay races, and fun team games. Parents cheered from the sidelines as the houses competed for the annual sports trophy.',
  },
  {
    title: 'Cambridge English Program Launched',
    category: 'News',
    date: '2025-12-01',
    image: 'cambridge-english.jpg',
    shortDescription: 'The Manthan School partners with Cambridge to strengthen English language learning.',
    content:
      'We are excited to introduce the Cambridge English Program for our primary classes, designed to build strong foundational language skills through globally recognised curriculum.',
  },
  {
    title: 'Student Wins National Art Competition',
    category: 'Achievement',
    date: '2025-11-20',
    image: 'art-competition.jpg',
    shortDescription: 'A grade 4 student won first prize at the National Children\'s Art Competition.',
    content:
      'We are proud to share that one of our grade 4 students won first prize at the National Children\'s Art Competition, with her artwork selected from over 10,000 entries nationwide.',
  },
  {
    title: 'Winter Celebrations at Manthan',
    category: 'Event',
    date: '2025-11-05',
    image: 'diwali.jpg',
    shortDescription: 'Students marked the season with lights, music and a festive campus assembly.',
    content:
      'The campus came alive with lights and music as students took part in craft stalls and a festive assembly, closing out the term on a warm, celebratory note.',
  },
];

const UNSPLASH_IDS = [
  'photo-1580582932707-520aed937b7b',
  'photo-1503676260728-1c00da094a0b',
  'photo-1427504494785-3a9ca7044f45',
  'photo-1588072432836-e10032774350',
  'photo-1509062522246-3755977927d7',
  'photo-1544717297-fa95b6ee9643',
  'photo-1541178735493-479c1a27ed24',
  'photo-1518133910546-b6c2fb7d79e3',
  'photo-1529390079861-591de354faf5',
  'photo-1491841651911-c44c30c34548',
  'photo-1546410531-bb4caa6b424d',
  'photo-1588075592446-265fd1e6e76f',
  'photo-1596496181848-3091d4878b24',
  'photo-1503454537195-1dcabb73ffb9',
  'photo-1509228468518-180dd4864904',
  'photo-1562774053-701939374585',
  'photo-1517457373958-b7bdd4587205',
  'photo-1532619675605-1ede6c2ed2b0',
  'photo-1554774853-719586f82d77',
  'photo-1523240795612-9a054b0db644',
  'photo-1571260899304-425eee4c7efc',
  'photo-1557804506-669a67965ba0',
  'photo-1522661067900-ab829854a57f',
  'photo-1456513080510-7bf3a84b82f8',
];

const CATEGORIES = ['News', 'Event', 'Achievement'];
const TOPICS = [
  'Science Exhibition Dazzles Visitors',
  'Inter-House Debate Championship',
  'Music Recital Evening',
  'Grade 5 Graduation Ceremony',
  'Coding Club Builds First App',
  'Reading Week Kicks Off',
  'Chess Tournament Finals',
  'Eco Club Plants 200 Saplings',
  'Cultural Fest Celebrates Diversity',
  'Maths Olympiad Winners Announced',
  'Dance Troupe Wins Regional Award',
  'Parent-Teacher Meet Highlights',
  'Library Wing Reopens After Renovation',
  'Theatre Workshop for Grade 6-8',
  'Swimming Meet Record Broken',
  'Career Guidance Session for Seniors',
  'Yoga and Wellness Week',
  'Student Council Elections',
  'Photography Club Exhibition',
  'Basketball Tournament Highlights',
  'Founders Day Celebration',
  'STEM Fair Showcases Projects',
  'New Playground Inaugurated',
  'Alumni Meet 2026',
];

function buildGeneratedSamples() {
  return TOPICS.map((title, i) => {
    const category = CATEGORIES[i % CATEGORIES.length];
    const monthsAgo = i + 1;
    const date = new Date(2025, 10 - monthsAgo, (i % 27) + 1).toISOString().slice(0, 10);
    const unsplashId = UNSPLASH_IDS[i];

    return {
      title,
      category,
      date,
      image: `https://images.unsplash.com/${unsplashId}?w=1200&h=1500&fit=crop&q=80`,
      shortDescription: `${title} brought the Manthan community together for a memorable occasion.`,
      content: `${title} took place on campus with wide participation from students and staff, marking another highlight in this term's calendar.`,
    };
  });
}

async function run() {
  await connectDB();

  const allSamples = [...samples, ...buildGeneratedSamples()];

  for (const sample of allSamples) {
    const existing = await NewsEvent.findOne({ title: sample.title });
    if (existing) {
      console.log(`Skipping (already exists): ${sample.title}`);
      continue;
    }

    const slug = await generateUniqueSlug(sample.title);
    const image = sample.image.startsWith('http') ? sample.image : `/uploads/seed/${sample.image}`;

    await NewsEvent.create({
      ...sample,
      slug,
      image,
      published: true,
    });
    console.log(`Created: ${sample.title}`);
  }

  await mongoose.disconnect();
}

run();
