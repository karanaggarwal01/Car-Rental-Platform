// Mapping of location names to Office IDs
// These IDs should match the Office documents in your MongoDB
export const OFFICE_LOCATIONS = {
    'Delhi': '6995edee658691962e04b0dc',
    'Kolkata': '6995edee658691962e04b0dd',
    'Bengaluru': '6995edee658691962e04b0de',
    'Mumbai': '6995edee658691962e04b0df',
    'Goa': '6995edee658691962e04b0e0',
};

// Helper function to get office ID from location name
export const getOfficeId = (locationName) => {
    return OFFICE_LOCATIONS[locationName] || null;
};

// Helper function to get all available locations
export const getAvailableLocations = () => {
    return Object.keys(OFFICE_LOCATIONS);
};

const officeUtils = {
    OFFICE_LOCATIONS,
    getOfficeId,
    getAvailableLocations
};

export default officeUtils;
