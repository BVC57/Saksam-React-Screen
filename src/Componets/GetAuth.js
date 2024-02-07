// authUtils.js
const getUserData = async () => {
  try {
    // Get the path name from the URL
    const pathName = window.location.pathname;
    
    // Extract the userId from the path
    const userId = pathName.split('/').pop();

    console.log("User ID from URL:", userId); // Log the userId

    // Make sure userId is available
    if (!userId) {
      throw new Error('User ID not found in URL');
    }

    // Fetch data using the userId
    const response = await fetch(`https://huf6ubili4.execute-api.ap-south-1.amazonaws.com/DEV/get_token?id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return { userId: userId, authToken: data.Token };
  } catch (error) {
    console.error('There was a problem fetching the data:', error);
    return { userId: null, authToken: null }; // Return null values in case of error
  }
};

export default getUserData;
