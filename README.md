# README

## Overview

This application provides a FastAPI-based API that allows users to find Instagram accounts they follow that do not follow them back. The API interacts with Instagram using the `instaloader` library.

## Files

- **main.py**: Contains the FastAPI application and the endpoint to retrieve non-followees.
- **instainfo.py**: Contains the logic to fetch followers and followees using the `instaloader` library.
- **requirements.txt**: Lists the dependencies required to run the application.

## Setup

### Prerequisites

- Python 3.x
- Instagram account credentials
- An `.env` file with your Instagram username and password, handle 2FA id activated.

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-repository-name.git
    cd your-repository-name
    ```

2. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3. **Create a `.env` file**:
    ```bash
    touch .env
    ```

4. **Add your Instagram credentials** to the `.env` file:
    ```
    USER=your_instagram_username
    PASSWORD=your_instagram_password
    ```

## Running the Application

1. **Start the FastAPI server**:
    ```bash
    uvicorn main:app --reload
    ```

2. **Access the API**:

    - **Endpoint**: `/non_followees/{user_id}`
    - **Method**: `GET`
    - **Description**: Returns a list of Instagram accounts that the user is following but are not following back.
    
    **Example**:
    ```bash
    curl http://127.0.0.1:8000/non_followees/your_instagram_username
    ```

## How It Works

1. **Login**: The application logs into Instagram using the credentials provided in the `.env` file.
2. **Fetch Data**: The `get_insta_followers` function retrieves the user's followers and followees.
3. **Process Data**: It calculates the difference between followees and followers to find accounts that the user follows but do not follow back.
4. **API Response**: The `/non_followees/{user_id}` endpoint returns the list of non-followees.

## Dependencies

- `instaloader`: Library to interact with Instagram.
- `fastapi`: Web framework for building APIs.
- `uvicorn`: ASGI server for serving the FastAPI application.
- `python-dotenv`: Library to manage environment variables.

## Notes

- Ensure that your Instagram account has two-factor authentication disabled, as `instaloader` may have issues handling it.
- Be cautious of Instagram's API rate limits to avoid being temporarily blocked from making requests.

## License

This project is licensed under the MIT License.
