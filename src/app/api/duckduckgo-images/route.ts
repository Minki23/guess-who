// app/api/duckduckgo-images/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Brak zapytania' }, { status: 400 });
  }

  try {
    // Try Pixabay API first (free API with relevant search results)
    try {
      const pixabayResponse = await fetch(
        `https://pixabay.com/api/?key=9656065-a4094594c34f9ac4d343a1ad7&q=${encodeURIComponent(q)}&image_type=photo&per_page=20&safesearch=true`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }
      );

      if (pixabayResponse.ok) {
        const pixabayData = await pixabayResponse.json();
        if (pixabayData.hits && pixabayData.hits.length > 0) {
          const results = pixabayData.hits.slice(0, 12).map((hit: any) => ({
            image: hit.webformatURL || hit.previewURL,
            title: hit.tags || `${q} image`,
            url: hit.pageURL || '#',
          }));
          return NextResponse.json({ results });
        }
      }
    } catch (pixabayError) {
      console.log('Pixabay failed, trying alternative...');
    }

    // Fallback to themed images based on search query
    const results = generateSearchResults(q);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error details:', error);
    
    // Final fallback
    const mockResults = generateMockResults(q);
    return NextResponse.json({ results: mockResults });
  }
}

// Generate search-relevant results using themed image categories
function generateSearchResults(query: string) {
  const lowerQuery = query.toLowerCase();
  
  // Define image categories based on common search terms
  const imageCategories = {
    nature: [1018, 1025, 1036, 1044, 1080, 1081, 1082, 1083],
    animals: [1025, 169, 582, 583, 593, 659, 718, 783],
    food: [312, 326, 341, 362, 376, 428, 431, 488],
    people: [64, 65, 91, 103, 177, 338, 381, 494],
    city: [436, 442, 447, 448, 449, 450, 451, 452],
    technology: [180, 225, 247, 249, 250, 276, 279, 325],
    abstract: [1043, 1074, 1076, 1077, 1078, 1079, 1084, 1085],
    cars: [111, 112, 119, 120, 193, 241, 244, 252],
    flowers: [106, 158, 165, 167, 168, 174, 175, 181],
    architecture: [152, 164, 174, 182, 192, 209, 218, 274],
  };

  // Try to match query to a category
  let selectedIds = imageCategories.abstract; // default
  
  for (const [category, ids] of Object.entries(imageCategories)) {
    if (lowerQuery.includes(category) || 
        category.includes(lowerQuery) ||
        (category === 'animals' && (lowerQuery.includes('cat') || lowerQuery.includes('dog') || lowerQuery.includes('animal'))) ||
        (category === 'people' && (lowerQuery.includes('person') || lowerQuery.includes('human') || lowerQuery.includes('man') || lowerQuery.includes('woman'))) ||
        (category === 'cars' && (lowerQuery.includes('car') || lowerQuery.includes('vehicle') || lowerQuery.includes('auto'))) ||
        (category === 'flowers' && (lowerQuery.includes('flower') || lowerQuery.includes('plant') || lowerQuery.includes('garden'))) ||
        (category === 'city' && (lowerQuery.includes('building') || lowerQuery.includes('urban') || lowerQuery.includes('street'))) ||
        (category === 'technology' && (lowerQuery.includes('computer') || lowerQuery.includes('tech') || lowerQuery.includes('phone')))) {
      selectedIds = ids;
      break;
    }
  }

  return selectedIds.slice(0, 8).map((id, index) => ({
    image: `https://picsum.photos/id/${id}/300/200`,
    title: `${query} - Related image ${index + 1}`,
    url: `https://picsum.photos/id/${id}/info`,
  }));
}

// Generate realistic-looking images using Lorem Picsum (real photos)
function generateRealisticResults(query: string) {
  // Use query to generate a seed for consistent results per search term
  const seed = query.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const startId = (seed % 500) + 100; // Random starting point based on query
  
  const imageIds = Array.from({ length: 12 }, (_, i) => startId + i * 50);
  
  return imageIds.slice(0, 8).map((id, index) => ({
    image: `https://picsum.photos/id/${id}/300/200`,
    title: `${query} - Photo ${index + 1}`,
    url: `https://picsum.photos/id/${id}/info`,
  }));
}

// Mock data generator for development/fallback
function generateMockResults(query: string) {
  const mockImages = [
    'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=' + encodeURIComponent(query + ' 1'),
    'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=' + encodeURIComponent(query + ' 2'),
    'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=' + encodeURIComponent(query + ' 3'),
    'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=' + encodeURIComponent(query + ' 4'),
    'https://via.placeholder.com/300x200/FFEAA7/333333?text=' + encodeURIComponent(query + ' 5'),
    'https://via.placeholder.com/300x200/DDA0DD/FFFFFF?text=' + encodeURIComponent(query + ' 6'),
    'https://via.placeholder.com/300x200/98D8C8/FFFFFF?text=' + encodeURIComponent(query + ' 7'),
    'https://via.placeholder.com/300x200/F7DC6F/333333?text=' + encodeURIComponent(query + ' 8'),
  ];

  return mockImages.map((image, index) => ({
    image,
    title: `${query} - Image ${index + 1}`,
    url: '#',
  }));
}
