import Backend.api_routes as api_routes
import instainfo
from typing import Union
from fastapi import FastAPI

from Backend.api_routes import NON_FOLLOWEES

app=FastAPI()

@app.get(api_routes.NON_FOLLOWEES/"{user_id}")
def get_non_followees(user_id :str):
 non_followees=instainfo.get_insta_followers(user_id)
 return {"non_followees":non_followees}
