const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getData = async () => {
  try {
    const response = await fetch(API_BASE_URL + '/template-routes');
    if (!response.ok) {
      throw new Error('Gagal mengambil data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export const fetchMembers = async (perPage: number, page: number, sortBy?: string, order?: string, search?: string, filterBy?: string) => {
  try {
    const params = new URLSearchParams({
      limit: perPage.toString(),
      page: (page + 1).toString(), // Backend mulai dari 1
      sortBy: sortBy || 'created_at',
      order: order || 'asc',
    });

    if (search) params.append('search', search);
    if (filterBy) params.append('filterBy', filterBy);

    const fullURL = `${API_BASE_URL}/members?${params.toString()}`;
    console.log("Fetching data from:", fullURL); // 🔹 Debug URL

    const response = await fetch(fullURL, {credentials: 'include'}); 

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};
