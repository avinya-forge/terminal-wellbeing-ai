const ASCII_ART: Record<string, string> = {
  logo: `
 __      __   _ _ ____       _
 \\ \\    / /__| | |  _ \\ ___ (_)_ __   __ _
  \\ \\/\\/ / _ \\ | | |_) / _ \\| | '_ \\ / _\` |
   \\  /\\  /  __/ | |  _ <  __/ | | | | (_| |
    \\/  \\/ \\___|_|_|_| \\_\\___|_|_| |_|\\__, |
                                      |___/
  `,
  happy: `
     (^-^)
    /  |  \\
   (   |   )
    \\__|__/
  `,
  sad: `
     (._.)
    /  |  \\
   (   |   )
    \\__|__/
  `,
  zen: `
      _()_
    _(____)_
   (________)
  `,
  coffee: `
    ( (
     ) )
  .______.
  |      |]
  \\      /
   \`----'
  `,
  heart: `
   /\\  /\\
  (  \\/  )
   \\    /
    \\  /
     \\/
  `,
  cat: `
      |\\__/,|   (\`\\
    _.|o o  |_   ) )
  -(((---(((--------
  `,
  tree: `
       ###
      #o###
    #####o###
   #o#\\#|#/###
    ###\\|/#o#
     # }|{  #
       }|{
  `
};

export function getAsciiArt(keyword: string): string {
  const normalized = keyword.toLowerCase().trim();

  if (ASCII_ART[normalized]) {
    return ASCII_ART[normalized];
  }

  // Aliases
  if (normalized === 'smile' || normalized === 'joy') return ASCII_ART.happy;
  if (normalized === 'cry' || normalized === 'depressed') return ASCII_ART.sad;
  if (normalized === 'meditate' || normalized === 'calm' || normalized === 'mindfulness') return ASCII_ART.zen;
  if (normalized === 'break' || normalized === 'tea') return ASCII_ART.coffee;
  if (normalized === 'love' || normalized === 'care') return ASCII_ART.heart;
  if (normalized === 'nature' || normalized === 'forest') return ASCII_ART.tree;
  if (normalized === 'kitty') return ASCII_ART.cat;

  return `No art found for "${keyword}". Try: happy, sad, zen, coffee, heart, cat, tree.`;
}

export function listAsciiKeys(): string[] {
  return Object.keys(ASCII_ART);
}
