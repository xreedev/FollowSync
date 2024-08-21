import instainfo
from typing import Union
from fastapi import FastAPI

app=FastAPI()

@app.get("/non_followees/{user_id}")
def get_non_followees(user_id :str):
 non_followees=instainfo.get_insta_followers(user_id)
 return {"non_followees":non_followees}
