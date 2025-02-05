# Hospital Finder

Hospital Finder is a React-based web application that allows users to log in via Google authentication, fetch their current location, and display nearby hospitals on an interactive map. The app uses Firebase for authentication, Google Maps API for mapping, and OpenStreetMap's Nominatim API for hospital data.

## Features

- **Google Authentication**: Secure login using Google Sign-In.
- **Live Location Fetching**: Automatically retrieves the user's current location.
- **Interactive Map**: Displays the user's location and nearby hospitals with custom markers.
- **Manual Search**: Allows users to search for specific locations or hospitals by name.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Professional UI**: Built with Material-UI for a polished user experience.

## Technologies Used

- **Frontend**: React, Material-UI, @react-google-maps/api
- **Backend**: Firebase (Authentication)
- **APIs**:
  - Google Maps JavaScript API
  - OpenStreetMap Nominatim API
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: CSS-in-JS with Material-UI, Custom Map Markers
- **Environment Variables**: Managed via `.env` file

## Installation

### Prerequisites

1. **Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed.
2. **Firebase Project**: Create a Firebase project and enable Google Authentication.
3. **Google Maps API Key**: Obtain a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/).
4. **OpenStreetMap API**: No additional setup required; the app uses the free Nominatim API.

### Steps to Set Up Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/HimKasera/hospital-finder.git
   cd hospital-finder
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following variables:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Start the Development Server**
   ```bash
   npm start
   ```

5. **Access the App**
   Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Login**: Click the "Sign in with Google" button to authenticate.
2. **Fetch Location**: Allow the app to access your location or manually enter a location.
3. **View Hospitals**: Nearby hospitals will be displayed on the map with markers.
4. **Search**: Use the search bar to find specific locations or hospitals by name.
   
   👉 Watch the demo [here](https://drive.google.com/file/d/1zwPItfjDl5OXIuYZMbuTReEZ3JVKFH8A/view?usp=sharing).

## Folder Structure

```
hospital-finder/
├── public/               # Public assets
├── src/
│   ├── components/       # Reusable components (e.g., Map, Login)
│   ├── services/         # Firebase and geolocation services
│   ├── App.js            # Main application logic
│   ├── index.js          # Entry point
│   └── theme.js          # Material-UI theme configuration
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── README.md             # This file
```

## Deployment

To deploy the app, you can use platforms like Firebase Hosting, Netlify, or Vercel:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting provider.

## Security Considerations

- **API Keys**: Never commit your `.env` file to version control. Add it to `.gitignore`.
- **Restrict API Keys**: In the Google Cloud Console, restrict your API keys to specific domains or IP addresses.
- **Firebase Rules**: Configure Firebase security rules to protect your data.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Firebase](https://firebase.google.com/)
- [Google Maps Platform](https://cloud.google.com/maps-platform/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Material-UI](https://mui.com/)

---

For any questions or issues, please open an issue in the GitHub repository.
