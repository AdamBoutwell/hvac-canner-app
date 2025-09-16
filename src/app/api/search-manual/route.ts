import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { manufacturer, model, serialNumber } = await request.json();

    if (!manufacturer || !model) {
      return NextResponse.json(
        { error: 'Manufacturer and model are required' },
        { status: 400 }
      );
    }

    console.log(`Searching for manual: ${manufacturer} ${model}`);

    // Construct search queries for different types of manuals
    const searchQueries = [
      `${manufacturer} ${model} installation manual`,
      `${manufacturer} ${model} service manual`,
      `${manufacturer} ${model} user manual`,
      `${manufacturer} ${model} technical manual`,
      `${manufacturer} ${model} maintenance manual`,
      `${manufacturer} ${model} parts manual`
    ];

    const manualLinks = [];

    // Search for each type of manual
    for (const query of searchQueries) {
      try {
        const searchResults = await searchForManual(query);
        if (searchResults.length > 0) {
          manualLinks.push(...searchResults);
        }
      } catch (error) {
        console.error(`Search failed for query: ${query}`, error);
      }
    }

    // Remove duplicates and prioritize official sources
    const uniqueLinks = manualLinks
      .filter((link, index, self) => 
        index === self.findIndex(l => l.url === link.url)
      )
      .sort((a, b) => {
        // Prioritize official manufacturer sites
        const aOfficial = a.url.includes(manufacturer.toLowerCase()) || 
                         a.url.includes('manual') || 
                         a.url.includes('service');
        const bOfficial = b.url.includes(manufacturer.toLowerCase()) || 
                         b.url.includes('manual') || 
                         b.url.includes('service');
        
        if (aOfficial && !bOfficial) return -1;
        if (!aOfficial && bOfficial) return 1;
        return 0;
      })
      .slice(0, 5); // Limit to top 5 results

    console.log(`Found ${uniqueLinks.length} manual links for ${manufacturer} ${model}`);

    return NextResponse.json({
      manufacturer,
      model,
      serialNumber,
      manualLinks: uniqueLinks,
      searchTimestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Manual search error:', error);
    return NextResponse.json(
      { error: 'Failed to search for manuals' },
      { status: 500 }
    );
  }
}

async function searchForManual(query: string) {
  // Generate real manual search URLs based on common HVAC manufacturer patterns
  const manualSources = [];
  
  // Extract manufacturer and model from query
  const parts = query.toLowerCase().split(' ');
  const manufacturer = parts[0];
  const model = parts.slice(1).join(' ');
  
  // Common HVAC manufacturer manual patterns
  const manufacturerPatterns = {
    'carrier': {
      baseUrl: 'https://www.carrier.com',
      manualPath: '/commercial/hvac-equipment',
      searchPath: '/support/manuals'
    },
    'trane': {
      baseUrl: 'https://www.trane.com',
      manualPath: '/commercial/hvac',
      searchPath: '/support/manuals'
    },
    'york': {
      baseUrl: 'https://www.johnsoncontrols.com',
      manualPath: '/hvac-equipment/york',
      searchPath: '/support/manuals'
    },
    'lennox': {
      baseUrl: 'https://www.lennox.com',
      manualPath: '/commercial',
      searchPath: '/support/manuals'
    },
    'rheem': {
      baseUrl: 'https://www.rheem.com',
      manualPath: '/commercial',
      searchPath: '/support/manuals'
    },
    'goodman': {
      baseUrl: 'https://www.goodmanmfg.com',
      manualPath: '/products',
      searchPath: '/support/manuals'
    },
    'daikin': {
      baseUrl: 'https://www.daikin.com',
      manualPath: '/commercial',
      searchPath: '/support/manuals'
    },
    'mitsubishi': {
      baseUrl: 'https://www.mitsubishicomfort.com',
      manualPath: '/commercial',
      searchPath: '/support/manuals'
    }
  };
  
  // Generate manufacturer-specific manual links
  if (manufacturer && manufacturerPatterns[manufacturer as keyof typeof manufacturerPatterns]) {
    const pattern = manufacturerPatterns[manufacturer as keyof typeof manufacturerPatterns];
    
    manualSources.push({
      title: `${manufacturer.toUpperCase()} ${model} - Official Manuals`,
      url: `${pattern.baseUrl}${pattern.searchPath}`,
      description: `Official ${manufacturer.toUpperCase()} manuals and documentation`,
      source: `${manufacturer.toUpperCase()} Official Website`
    });
    
    manualSources.push({
      title: `${manufacturer.toUpperCase()} ${model} - Product Support`,
      url: `${pattern.baseUrl}${pattern.manualPath}`,
      description: `Product information and support for ${manufacturer.toUpperCase()} equipment`,
      source: `${manufacturer.toUpperCase()} Product Support`
    });
  }
  
  // Add general HVAC manual databases
  manualSources.push({
    title: `${query} - ManualsLib`,
    url: `https://www.manualslib.com/search.php?q=${encodeURIComponent(query)}`,
    description: `Search for ${query} manuals on ManualsLib`,
    source: 'ManualsLib'
  });
  
  manualSources.push({
    title: `${query} - ManualsOnline`,
    url: `https://www.manualsonline.com/search.html?q=${encodeURIComponent(query)}`,
    description: `Search for ${query} manuals on ManualsOnline`,
    source: 'ManualsOnline'
  });
  
  manualSources.push({
    title: `${query} - HVAC Manuals`,
    url: `https://www.hvacmanuals.com/search?q=${encodeURIComponent(query)}`,
    description: `Search for ${query} manuals on HVAC Manuals`,
    source: 'HVAC Manuals'
  });
  
  // Add Google search for the specific equipment
  manualSources.push({
    title: `${query} - Google Search`,
    url: `https://www.google.com/search?q=${encodeURIComponent(query + ' manual pdf')}`,
    description: `Google search for ${query} manual PDF`,
    source: 'Google Search'
  });
  
  // Simulate search delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return manualSources;
}

// Alternative implementation using real web search (requires API key)
// async function searchForManualWithAPI(query: string) {
//   // This would use a real search API like Google Custom Search, Bing, or SerpAPI
//   // For now, we'll use the simulated version above
//   
//   // Example implementation with Google Custom Search:
//   /*
//   const response = await fetch(
//     `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&fileType=pdf`
//   );
//   
//   const data = await response.json();
//   
//   return data.items?.map(item => ({
//     title: item.title,
//     url: item.link,
//     description: item.snippet,
//     source: 'Google Search'
//   })) || [];
//   */
//   
//   return [];
// }
