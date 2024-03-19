// authUtils.js
const getUserData = async () => {
  try {
     // Record the start time before making the API call
     const startTime = new Date().getTime();
    // Get the path name from the URL
    const pathName = window.location.pathname;
    
    // Extract the userId from the path
    const userId = pathName.split('/').pop();

    // Make sure userId is available
    if (!userId) {
      throw new Error('User ID not found in URL');
    }

    // Fetch data using the userId
    const response = await fetch(`https://bjejzjksx9.execute-api.ap-south-1.amazonaws.com/DEV/get_token?id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    // Calculate the total time taken
    const endTime = new Date().getTime();
    const totalTime = endTime - startTime;
    console.log("Total time taken from GetAuth:", totalTime, "milliseconds");
    // console.log("from auth",userId)
    // console.log("from auth",data.Token)
    return { userId: userId, authToken: data.Token };
  } catch (error) {
    console.error('There was a problem fetching the data:', error);
    return { userId: null, authToken: null }; // Return null values in case of error
  }
};

export default getUserData;
