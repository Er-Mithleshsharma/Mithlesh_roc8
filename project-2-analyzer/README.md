# Analyzer Assignment for Roc8

## Features Overview

This project is an Analyzer tool that enables users to visualize data using bar and line charts with customizable filters and time range selections. The app supports features such as pan, zoom, user authentication, cookie-based filter management, and responsive design.

### Features Implemented

1. **Bar Chart for Feature Representation**

   - Displays the total time spent on features (A, B, C...) on the x-axis, with the total time spent on the y-axis.
   - Users can select a date range to see how much time was spent on each feature during that period.

2. **Line Chart for Time Trend of a Category**

   - Clicking on a feature from the bar chart shows a line chart displaying the time trend for that specific category.
   - Supports pan, zoom-in, and zoom-out options to analyze the data over different time ranges.

3. **Filters**

   - Users can filter the chart data based on:
     - **Age**: Options for age ranges are 15-25 and above 25.
     - **Gender**: Male and Female filters.
   - The filters dynamically update the displayed charts.

4. **Date Range Selector**

   - A date range selector allows users to pick a specific time range for data visualization.
   - The charts are updated according to the selected time range and filters applied.

5. **Cookie Management System**

   - User preferences for filters and date range are saved in cookies.
   - On revisiting the page, previous settings are automatically applied from cookies.
   - An option is provided for users to reset or clear their preferences.

6. **Responsive Design**

   - The application is designed to work seamlessly on various devices including desktops, tablets, and mobile phones.
   - It adapts to different screen sizes and orientations, providing a consistent experience across devices.

7. **User Authentication**

   - Basic user authentication is implemented where users can:
     - **Sign Up**
     - **Log In**
     - **Log Out**
   - Authentication ensures that only authorized users can view or share chart data.

8. **URL Sharing**
   - Users can generate a shareable URL that includes the current chart view along with applied filters and date range.
   - The shared URL requires the recipient to log in to access the data as it is confidential.

### Setup Instructions

### Frontend Setup (Vite)

1. **Clone the frontend repository**:
   ```bash
   git clone https://github.com/abdulrcodes/Analyzer-Roc8-Assigment.git
   cd frontend
   ```

- **Install dependencies:**:
  ```bash
   npm install
  ```
- **Environment Variables Setup: Create a .env file in the root directory of the frontend and add the following**:

  ```bash
   VITE_BACKEND_URL=<YOUR_BACKEND_API_URL>   # Example: http://localhost:5000/api
  ```

- **Start the frontend server:**
  ```bash
   npm run dev
  ```

2. **Backend Setup (Express + MongoDB + JWT)**

   ```bash
    cd backend
   ```

   - **Install dependencies::**

   ```bash
   npm install
   ```

   - **Environment Variables Setup: Create a .env file in the root directory of the backend and add the following**:

   ```bash
   MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>  # Example: mongodb://localhost:27017/yourdbname

   JWT_SECRET=<YOUR_JWT_SECRET>                 # Example: supersecretkey

   ```

- **Start the frontend server:**
  ```bash
   npm run dev
  ```
