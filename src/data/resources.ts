export interface Resource {
  id: string;
  name: string;
  category: string;
  description: string;
  contact: string;
  url: string;
  tags: string[];
}

export const RESOURCES: Resource[] = [
  {
    id: '988',
    name: '988 Suicide & Crisis Lifeline',
    category: 'Crisis',
    description: 'Free, confidential, 24/7 support for people in distress, prevention and crisis resources.',
    contact: 'Call/Text 988',
    url: 'https://988lifeline.org',
    tags: ['suicide', 'crisis', 'depression', 'anxiety', 'emergency']
  },
  {
    id: 'crisis-text-line',
    name: 'Crisis Text Line',
    category: 'Crisis',
    description: 'Connect with a trained Crisis Counselor to receive free, 24/7 crisis support via text.',
    contact: 'Text HOME to 741741',
    url: 'https://www.crisistextline.org',
    tags: ['text', 'crisis', 'anxiety', 'depression', 'suicide']
  },
  {
    id: 'veterans-crisis-line',
    name: 'Veterans Crisis Line',
    category: 'Veterans',
    description: 'Confidential crisis support for Veterans and their loved ones.',
    contact: 'Dial 988 then Press 1, or Text 838255',
    url: 'https://www.veteranscrisisline.net',
    tags: ['veterans', 'military', 'ptsd', 'crisis']
  },
  {
    id: 'the-trevor-project',
    name: 'The Trevor Project',
    category: 'LGBTQ+',
    description: 'Crisis intervention and suicide prevention services to LGBTQ young people under 25.',
    contact: '1-866-488-7386 or Text START to 678-678',
    url: 'https://www.thetrevorproject.org',
    tags: ['lgbtq', 'youth', 'suicide', 'crisis']
  },
  {
    id: 'trans-lifeline',
    name: 'Trans Lifeline',
    category: 'LGBTQ+',
    description: 'Peer support service run by trans people for trans and questioning peers.',
    contact: '1-877-565-8860',
    url: 'https://translifeline.org',
    tags: ['trans', 'lgbtq', 'peer support']
  },
  {
    id: 'ndvh',
    name: 'National Domestic Violence Hotline',
    category: 'Domestic Violence',
    description: '24/7 confidential support for anyone experiencing domestic violence or questioning unhealthy aspects of their relationship.',
    contact: '1-800-799-SAFE (7233) or Text START to 88788',
    url: 'https://www.thehotline.org',
    tags: ['domestic violence', 'abuse', 'relationships', 'safety']
  },
  {
    id: 'rainn',
    name: 'RAINN (National Sexual Assault Hotline)',
    category: 'Sexual Assault',
    description: 'Confidential support from trained staff members for survivors of sexual assault.',
    contact: '1-800-656-HOPE (4673)',
    url: 'https://www.rainn.org',
    tags: ['sexual assault', 'rape', 'abuse', 'trauma']
  },
  {
    id: 'samhsa',
    name: 'SAMHSA National Helpline',
    category: 'Substance Use',
    description: 'Free, confidential, 24/7 treatment referral and information service for individuals and families facing mental and/or substance use disorders.',
    contact: '1-800-662-HELP (4357)',
    url: 'https://www.samhsa.gov/find-help/national-helpline',
    tags: ['substance use', 'addiction', 'mental health', 'treatment']
  },
  {
    id: 'nami',
    name: 'NAMI HelpLine',
    category: 'General Mental Health',
    description: 'Free, nationwide peer-support service providing information, resource referrals and support to people living with a mental health condition.',
    contact: '1-800-950-NAMI (6264) or Text "HelpLine" to 62640',
    url: 'https://www.nami.org/help',
    tags: ['mental health', 'support', 'education', 'advocacy']
  },
  {
    id: 'childhelp',
    name: 'Childhelp National Child Abuse Hotline',
    category: 'Youth',
    description: 'Professional crisis counselors available 24/7 to help with child abuse situations.',
    contact: '1-800-4-A-CHILD (1-800-422-4453)',
    url: 'https://www.childhelp.org/hotline',
    tags: ['child abuse', 'youth', 'safety', 'protection']
  },
  {
    id: 'teen-line',
    name: 'Teen Line',
    category: 'Youth',
    description: 'A non-profit, community-based organization helping troubled teenagers address their problems.',
    contact: '1-800-852-8336 or Text TEEN to 839863',
    url: 'https://www.teenline.org',
    tags: ['teens', 'youth', 'peer support']
  },
  {
    id: 'postpartum-support',
    name: 'Postpartum Support International',
    category: 'Maternal Health',
    description: 'Support for women and families suffering from perinatal mood and anxiety disorders.',
    contact: '1-800-944-4773 (Call or Text)',
    url: 'https://www.postpartum.net',
    tags: ['postpartum', 'pregnancy', 'maternal', 'depression', 'anxiety']
  },
  {
    id: 'physician-support',
    name: 'Physician Support Line',
    category: 'Professional',
    description: 'Free, confidential peer support line for physicians and medical students.',
    contact: '1-888-409-0141',
    url: 'https://www.physiciansupportline.com',
    tags: ['physicians', 'doctors', 'medical', 'stress', 'burnout']
  },
  {
    id: 'disaster-distress',
    name: 'Disaster Distress Helpline',
    category: 'Disaster',
    description: 'Immediate crisis counseling for people who are experiencing emotional distress related to any natural or human-caused disaster.',
    contact: '1-800-985-5990',
    url: 'https://www.samhsa.gov/find-help/disaster-distress-helpline',
    tags: ['disaster', 'trauma', 'emergency', 'stress']
  },
  {
    id: 'stronghearts',
    name: 'StrongHearts Native Helpline',
    category: 'Indigenous',
    description: 'Culturally-appropriate domestic violence and dating violence helpline for Native Americans and Alaska Natives.',
    contact: '1-844-762-8483',
    url: 'https://strongheartshelpline.org',
    tags: ['native american', 'indigenous', 'domestic violence', 'abuse']
  }
];

export function getAllResources(): Resource[] {
  return RESOURCES;
}

export function searchResources(query: string): Resource[] {
  if (!query) return RESOURCES;

  const lowerQuery = query.toLowerCase();

  return RESOURCES.filter(resource =>
    resource.name.toLowerCase().includes(lowerQuery) ||
    resource.description.toLowerCase().includes(lowerQuery) ||
    resource.category.toLowerCase().includes(lowerQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getResourcesByCategory(category: string): Resource[] {
  const lowerCategory = category.toLowerCase();
  return RESOURCES.filter(resource => resource.category.toLowerCase() === lowerCategory);
}

export function getCategories(): string[] {
  const categories = new Set(RESOURCES.map(r => r.category));
  return Array.from(categories).sort();
}
