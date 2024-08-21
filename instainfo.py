import instaloader
from dotenv import load_dotenv
import os


L = instaloader.Instaloader()


# Load environment variables from .env file
load_dotenv()

# Access environment variables
USER = os.getenv('USER')
PASSWORD = os.getenv('PASSWORD')
L.login(USER,PASSWORD)


def get_insta_followers(user_id):
    followers = set()
    followees = set()
    profile = instaloader.Profile.from_username(L.context, user_id)
    for follower_profile in profile.get_followers():
        followers.add(follower_profile.username)
    for followee_profile in profile.get_followees():
        followees.add(followee_profile.username)

    non_followees = followees - followers
    return list(non_followees)
