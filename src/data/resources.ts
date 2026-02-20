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
  // Crisis & General
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
    id: 'befrienders-worldwide',
    name: 'Befrienders Worldwide',
    category: 'Crisis',
    description: 'Global network providing emotional support to prevent suicide.',
    contact: 'Find your local helpline on website',
    url: 'https://www.befrienders.org',
    tags: ['international', 'suicide', 'depression', 'support']
  },

  // Veterans & Military
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
    id: 'mission-22',
    name: 'Mission 22',
    category: 'Veterans',
    description: 'Dedicated to healing America’s veterans when they need it most — right now.',
    contact: '1-800-273-8255 Press 1',
    url: 'https://mission22.com',
    tags: ['veterans', 'treatment', 'community', 'ptsd']
  },
  {
    id: 'wounded-warrior',
    name: 'Wounded Warrior Project',
    category: 'Veterans',
    description: 'Programs and services for post-9/11 veterans and their families.',
    contact: '1-877-832-6997',
    url: 'https://www.woundedwarriorproject.org',
    tags: ['veterans', 'rehabilitation', 'counseling']
  },

  // LGBTQ+
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
    id: 'lgbthotline',
    name: 'LGBT National Hotline',
    category: 'LGBTQ+',
    description: 'Confidential peer support, information, and local resources.',
    contact: '1-888-843-4564',
    url: 'https://www.glbthotline.org',
    tags: ['lgbtq', 'peer support', 'community']
  },
  {
    id: 'sage-lgbt',
    name: 'SAGE National LGBT Elder Hotline',
    category: 'LGBTQ+',
    description: 'Support for older LGBTQ+ people.',
    contact: '1-877-360-LGBT (5428)',
    url: 'https://www.sageusa.org',
    tags: ['seniors', 'lgbtq', 'elderly', 'aging']
  },

  // Domestic Violence & Abuse
  {
    id: 'ndvh',
    name: 'National Domestic Violence Hotline',
    category: 'Domestic Violence',
    description: '24/7 confidential support for anyone experiencing domestic violence.',
    contact: '1-800-799-SAFE (7233) or Text START to 88788',
    url: 'https://www.thehotline.org',
    tags: ['domestic violence', 'abuse', 'relationships', 'safety']
  },
  {
    id: 'rainn',
    name: 'RAINN',
    category: 'Sexual Assault',
    description: 'National Sexual Assault Hotline. Confidential support for survivors.',
    contact: '1-800-656-HOPE (4673)',
    url: 'https://www.rainn.org',
    tags: ['sexual assault', 'rape', 'abuse', 'trauma']
  },
  {
    id: 'love-is-respect',
    name: 'Love Is Respect',
    category: 'Domestic Violence',
    description: 'Engaging, educating and empowering young people to prevent and end abusive relationships.',
    contact: '1-866-331-9474 or Text LOVEIS to 22522',
    url: 'https://www.loveisrespect.org',
    tags: ['dating violence', 'youth', 'relationships']
  },
  {
    id: 'stop-it-now',
    name: 'Stop It Now!',
    category: 'Abuse Prevention',
    description: 'Prevents the sexual abuse of children by mobilizing adults, families and communities.',
    contact: '1-888-PREVENT',
    url: 'https://www.stopitnow.org',
    tags: ['child abuse', 'prevention', 'family']
  },

  // Substance Use & Addiction
  {
    id: 'samhsa',
    name: 'SAMHSA National Helpline',
    category: 'Substance Use',
    description: 'Treatment referral and information service for mental and/or substance use disorders.',
    contact: '1-800-662-HELP (4357)',
    url: 'https://www.samhsa.gov/find-help/national-helpline',
    tags: ['substance use', 'addiction', 'mental health', 'treatment']
  },
  {
    id: 'aa',
    name: 'Alcoholics Anonymous',
    category: 'Addiction',
    description: 'Fellowship of people who share their experience, strength and hope to solve their common problem.',
    contact: 'Find local meeting online',
    url: 'https://www.aa.org',
    tags: ['alcohol', 'recovery', 'community']
  },
  {
    id: 'na',
    name: 'Narcotics Anonymous',
    category: 'Addiction',
    description: 'Nonprofit fellowship or society of men and women for whom drugs had become a major problem.',
    contact: 'Find local meeting online',
    url: 'https://www.na.org',
    tags: ['drugs', 'recovery', 'community']
  },
  {
    id: 'al-anon',
    name: 'Al-Anon Family Groups',
    category: 'Addiction',
    description: 'Support for families and friends of alcoholics.',
    contact: '1-888-4AL-ANON',
    url: 'https://al-anon.org',
    tags: ['family', 'support', 'alcohol']
  },
  {
    id: 'gamblers-anonymous',
    name: 'Gamblers Anonymous',
    category: 'Addiction',
    description: 'Fellowship of men and women who share their experience to solve their common problem.',
    contact: 'Find local meeting online',
    url: 'https://www.gamblersanonymous.org',
    tags: ['gambling', 'addiction', 'financial']
  },

  // Mental Health Conditions
  {
    id: 'nami',
    name: 'NAMI HelpLine',
    category: 'General Mental Health',
    description: 'Information, resource referrals and support to people living with a mental health condition.',
    contact: '1-800-950-NAMI (6264)',
    url: 'https://www.nami.org/help',
    tags: ['mental health', 'support', 'education', 'advocacy']
  },
  {
    id: 'adaa',
    name: 'Anxiety and Depression Association of America',
    category: 'Mental Health',
    description: 'International nonprofit organization dedicated to the prevention, treatment, and cure of anxiety, depression, OCD, PTSD, and co-occurring disorders.',
    contact: 'Visit website for therapist directory',
    url: 'https://adaa.org',
    tags: ['anxiety', 'depression', 'ocd', 'ptsd']
  },
  {
    id: 'dbsa',
    name: 'Depression and Bipolar Support Alliance',
    category: 'Mental Health',
    description: 'Provides hope, help, support, and education to improve the lives of people who have mood disorders.',
    contact: '1-800-826-3632',
    url: 'https://www.dbsalliance.org',
    tags: ['depression', 'bipolar', 'mood disorders']
  },
  {
    id: 'iocdf',
    name: 'International OCD Foundation',
    category: 'Mental Health',
    description: 'Help, healing, and hope for those affected by obsessive compulsive disorder.',
    contact: '617-973-5801',
    url: 'https://iocdf.org',
    tags: ['ocd', 'anxiety', 'compulsion']
  },
  {
    id: 'schizophrenia-alliance',
    name: 'Schizophrenia & Psychosis Action Alliance',
    category: 'Mental Health',
    description: 'Support for those affected by schizophrenia and related brain disorders.',
    contact: '1-800-493-2094',
    url: 'https://sczaction.org',
    tags: ['schizophrenia', 'psychosis', 'brain disorder']
  },

  // Youth & Teens
  {
    id: 'childhelp',
    name: 'Childhelp National Child Abuse Hotline',
    category: 'Youth',
    description: 'Professional crisis counselors available 24/7 to help with child abuse situations.',
    contact: '1-800-4-A-CHILD',
    url: 'https://www.childhelp.org',
    tags: ['child abuse', 'youth', 'safety']
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
    id: 'runaway-safeline',
    name: 'National Runaway Safeline',
    category: 'Youth',
    description: 'Keeps America’s runaway, homeless and at-risk youth safe and off the streets.',
    contact: '1-800-RUNAWAY',
    url: 'https://www.1800runaway.org',
    tags: ['runaway', 'homeless', 'youth']
  },
  {
    id: 'your-life-your-voice',
    name: 'Your Life Your Voice',
    category: 'Youth',
    description: 'Tips and tools for tough situations. Run by Boys Town.',
    contact: '1-800-448-3000',
    url: 'https://www.yourlifeyourvoice.org',
    tags: ['youth', 'teens', 'support']
  },

  // Eating Disorders
  {
    id: 'neda',
    name: 'National Eating Disorders Association',
    category: 'Eating Disorders',
    description: 'Support, resources, and treatment options for eating disorders.',
    contact: '1-800-931-2237',
    url: 'https://www.nationaleatingdisorders.org',
    tags: ['anorexia', 'bulimia', 'body image', 'eating disorder']
  },
  {
    id: 'anad',
    name: 'ANAD',
    category: 'Eating Disorders',
    description: 'National Association of Anorexia Nervosa and Associated Disorders.',
    contact: '1-888-375-7767',
    url: 'https://anad.org',
    tags: ['anorexia', 'support groups', 'recovery']
  },

  // Maternal & Women's Health
  {
    id: 'postpartum-support',
    name: 'Postpartum Support International',
    category: 'Maternal Health',
    description: 'Support for women and families suffering from perinatal mood and anxiety disorders.',
    contact: '1-800-944-4773',
    url: 'https://www.postpartum.net',
    tags: ['postpartum', 'pregnancy', 'maternal', 'depression']
  },
  {
    id: 'womens-health',
    name: 'Office on Women\'s Health',
    category: 'Womens Health',
    description: 'Federal government office dedicated to women\'s health issues.',
    contact: '1-800-994-9662',
    url: 'https://www.womenshealth.gov',
    tags: ['women', 'health', 'wellness']
  },

  // Men's Health
  {
    id: 'heads-up-guys',
    name: 'HeadsUpGuys',
    category: 'Mens Health',
    description: 'Resource for men in support of their recovery from depression.',
    contact: 'Online Resource',
    url: 'https://headsupguys.org',
    tags: ['men', 'depression', 'suicide prevention']
  },
  {
    id: 'man-therapy',
    name: 'Man Therapy',
    category: 'Mens Health',
    description: 'Using humor to cut through the stigma and tackle issues like depression and anxiety.',
    contact: 'Online Resource',
    url: 'https://mantherapy.org',
    tags: ['men', 'humor', 'mental health']
  },

  // Seniors & Aging
  {
    id: 'friendship-line',
    name: 'Institute on Aging Friendship Line',
    category: 'Seniors',
    description: 'Crisis line for people aged 60+ and adults living with disabilities.',
    contact: '1-800-971-0016',
    url: 'https://www.ioaging.org',
    tags: ['seniors', 'elderly', 'loneliness', 'crisis']
  },
  {
    id: 'alzheimers-assoc',
    name: 'Alzheimer\'s Association',
    category: 'Seniors',
    description: 'Care and support for those affected by Alzheimer\'s and other dementias.',
    contact: '1-800-272-3900',
    url: 'https://www.alz.org',
    tags: ['dementia', 'alzheimers', 'caregivers']
  },

  // Disabilities & Neurodivergence
  {
    id: 'autism-society',
    name: 'Autism Society',
    category: 'Disabilities',
    description: 'Improving the lives of all affected by autism.',
    contact: '1-800-328-8476',
    url: 'https://www.autism-society.org',
    tags: ['autism', 'neurodivergence', 'support']
  },
  {
    id: 'chadd',
    name: 'CHADD',
    category: 'Disabilities',
    description: 'Children and Adults with Attention-Deficit/Hyperactivity Disorder.',
    contact: '1-866-200-8098',
    url: 'https://chadd.org',
    tags: ['adhd', 'attention deficit', 'education']
  },
  {
    id: 'arc',
    name: 'The Arc',
    category: 'Disabilities',
    description: 'Promotes and protects the human rights of people with intellectual and developmental disabilities.',
    contact: '1-800-433-5255',
    url: 'https://thearc.org',
    tags: ['intellectual disability', 'developmental disability', 'rights']
  },

  // Specific Populations
  {
    id: 'stronghearts',
    name: 'StrongHearts Native Helpline',
    category: 'Indigenous',
    description: 'Culturally-appropriate domestic violence helpline for Native Americans.',
    contact: '1-844-762-8483',
    url: 'https://strongheartshelpline.org',
    tags: ['native american', 'indigenous', 'domestic violence']
  },
  {
    id: 'black-mental-health',
    name: 'Black Mental Health Alliance',
    category: 'BIPOC',
    description: 'Develops, promotes and sponsors trusted culturally-relevant educational forums, trainings and referral services.',
    contact: '410-338-2642',
    url: 'https://blackmentalhealth.com',
    tags: ['black', 'african american', 'mental health']
  },
  {
    id: 'asian-mental-health',
    name: 'Asian Mental Health Collective',
    category: 'BIPOC',
    description: 'Building a community for Asian mental health support.',
    contact: 'Online Resource',
    url: 'https://www.asianmhc.org',
    tags: ['asian', 'mental health', 'community']
  },
  {
    id: 'latinx-therapy',
    name: 'Latinx Therapy',
    category: 'BIPOC',
    description: 'Destigmatizing mental health in the Latinx community.',
    contact: 'Find a therapist online',
    url: 'https://latinxtherapy.com',
    tags: ['latinx', 'hispanic', 'mental health']
  },

  // Professional Support
  {
    id: 'physician-support',
    name: 'Physician Support Line',
    category: 'Professional',
    description: 'Free, confidential peer support line for physicians.',
    contact: '1-888-409-0141',
    url: 'https://www.physiciansupportline.com',
    tags: ['physicians', 'doctors', 'burnout']
  },
  {
    id: 'nurse-support',
    name: 'Nurse.org Mental Health Resources',
    category: 'Professional',
    description: 'Resources specifically for nurses dealing with stress and trauma.',
    contact: 'Online Resource',
    url: 'https://nurse.org/resources/mental-health',
    tags: ['nurses', 'healthcare', 'stress']
  },

  // Financial, Legal & Housing
  {
    id: '211',
    name: '211 Essential Community Services',
    category: 'General Support',
    description: 'Connects people to local community resource specialists (housing, food, etc).',
    contact: 'Call 211',
    url: 'https://www.211.org',
    tags: ['housing', 'food', 'utility', 'local']
  },
  {
    id: 'hud-housing',
    name: 'HUD Housing Counseling',
    category: 'Housing',
    description: 'Advice on buying a home, renting, defaults, foreclosures, and credit issues.',
    contact: '1-800-569-4287',
    url: 'https://www.hud.gov/counseling',
    tags: ['housing', 'homelessness', 'rent', 'mortgage']
  },
  {
    id: 'feeding-america',
    name: 'Feeding America',
    category: 'Food Security',
    description: 'Nationwide network of food banks.',
    contact: 'Find local food bank online',
    url: 'https://www.feedingamerica.org',
    tags: ['food', 'hunger', 'pantry']
  },
  {
    id: 'lawhelp',
    name: 'LawHelp.org',
    category: 'Legal',
    description: 'Guide to free legal aid programs and information.',
    contact: 'Online Resource',
    url: 'https://www.lawhelp.org',
    tags: ['legal', 'aid', 'lawyer', 'rights']
  },

  // Grief
  {
    id: 'grief-share',
    name: 'GriefShare',
    category: 'Grief',
    description: 'Seminars and support groups for people grieving the death of a family member or friend.',
    contact: 'Find a group online',
    url: 'https://www.griefshare.org',
    tags: ['grief', 'loss', 'death', 'bereavement']
  },
  {
    id: 'dougy-center',
    name: 'The Dougy Center',
    category: 'Grief',
    description: 'The National Grief Center for Children & Families.',
    contact: '1-866-775-5683',
    url: 'https://www.dougy.org',
    tags: ['children', 'grief', 'family']
  },

  // Disaster
  {
    id: 'disaster-distress',
    name: 'Disaster Distress Helpline',
    category: 'Disaster',
    description: 'Crisis counseling for distress related to any natural or human-caused disaster.',
    contact: '1-800-985-5990',
    url: 'https://www.samhsa.gov/find-help/disaster-distress-helpline',
    tags: ['disaster', 'trauma', 'emergency']
  }
];

export function getAllResources(): Resource[] {
  return RESOURCES;
}

export function searchResources(query: string): Resource[] {
  if (!query) return RESOURCES;

  const lowerQuery = query.toLowerCase();

  return RESOURCES.map(resource => {
    let score = 0;
    // Exact match bonus
    if (resource.name.toLowerCase() === lowerQuery) score += 20;

    // Title match
    if (resource.name.toLowerCase().includes(lowerQuery)) score += 10;

    // Category match
    if (resource.category.toLowerCase().includes(lowerQuery)) score += 5;

    // Tag match
    if (resource.tags.some(tag => tag.toLowerCase() === lowerQuery)) score += 5;
    else if (resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) score += 3;

    // Description match
    if (resource.description.toLowerCase().includes(lowerQuery)) score += 1;

    return { resource, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(item => item.resource);
}

export function getResourcesByCategory(category: string): Resource[] {
  const lowerCategory = category.toLowerCase();
  return RESOURCES.filter(resource => resource.category.toLowerCase() === lowerCategory);
}

export function getCategories(): string[] {
  const categories = new Set(RESOURCES.map(r => r.category));
  return Array.from(categories).sort();
}
