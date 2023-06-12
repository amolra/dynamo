# from fastapi import FastAPI
# from typing import ItemsView, Union

# app = FastAPI()

# @app.get("/")
# async def read_root():
#     return {"Hello": "World"}

# @app.get("/items/{item_id}")
# async def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}

# @app.put("/items/{item_id}")
# def update_item(item_id: int, item: ItemsView):
#     return {"item_name": item.name, "item_id": item_id}

# from fastapi import FastAPI
# import utils
# from typing import ItemsView, Union

# app = FastAPI()

# @app.get("/")
# async def read_root():
#     return {"Hello": "World"}

# @app.get("/items/{item_id}")
# async def read_item(item_id: int):
#     return {"item_id": item_id}

# @app.get("/items/{item_id}")
# async def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}

import mariadb
from typing import Optional

from fastapi import FastAPI
from fastapi import routing
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder


# class Item(BaseModel):
#     name: str
#     description: Optional[str] = None
#     price: float
#     tax: Optional[float] = None

class Item(BaseModel):
    personID: int
    FirstName: Optional[str] = None
    LastName: Optional[str] = None
    Address: Optional[str] = None
    City: Optional[str] = None


app = FastAPI()


def db_connect():
    conn = mariadb.connect(
        user="root",
        password="admin",
        host="localhost",
        port=3306,
        database="python")
    cur = conn.cursor()
    return cur

# @app.get('/test')
# def test():
#     cur = db_connect()
#     cur.execute('SELECT * FROM python.users where City=pune')
#     return cur


@app.get('/test')
def test():
    cur = db_connect()
    cur.execute("SELECT * FROM python.users WHERE City='pune'")
    rows = cur.fetchall()
    return rows

# @app.post('/test_post')
# def test_post(var):
#     cur = db_connect()
#     cur.execute(f'insert into python.users values({var})')
#     return True


@app.post('/test_post')
def test_post(item: Item):
    item_dict = item.dict()
    print(f"Item:{item_dict}")
    conn = mariadb.connect(
        user="root",
        password="admin",
        host="localhost",
        port=3306,
        database="python")
    cur = conn.cursor()
    cur.execute(f"INSERT INTO users VALUES ({item.personID},'amol','raj','pune','pune')")
    conn.commit()
    return True


@app.post("/items/")
async def create_item(item: Item):
    item_dict = item.dict()
    if item.tax:
        price_with_tax = item.price + item.tax

    cur.execute("SELECT * FROM users")
    for FirstName in cur:
        print(f"First name: {FirstName}")
    item_dict.update({"price_with_tax": price_with_tax})
    return item_dict

# @app.get("/items/{name}")
# async def get_item(name: str):
#     # Logic to fetch the item with the given name from the database
#     conn = mariadb.connect(
#         user="root",
#         password="admin",
#         host="localhost",
#         port=3306,
#         database="python")
#     cur = conn.cursor()
#     cur.execute("SELECT * FROM users WHERE name=?", (name,))
#     item = cur.fetchone()

#     if item is None:
#         return {"error": "Item not found"}

#     item_dict = {
#         "name": item[0],
#         "description": item[1],
#         "price": item[2],
#         "tax": item[3]
#     }
#     return item_dict
# @app.get("/items/name")
# async def get_item(name):
#     item_dict = item.dict()
#     if item.tax:
#         price_with_tax = item.price + item.tax
#     # Logic to fetch the item with the given item_id/name from the database
#     conn = mariadb.connect(
#         user="root",
#         password="admin",
#         host="localhost",
#         port=3306,
#         database="python")
#     cur = conn.cursor()
#     cur.execute("SELECT * FROM users WHERE name=?",(FirstName))
#     for FirstName in cur:
#         print(f"First name: {FirstName}")
#     item = cur.fetchone()

#     if item is None:
#         return {"error": "Item not found"}
#     item_dict.update({"price_with_tax": price_with_tax})
#     return item_dict
    # item_dict = {
    #     "id": id,
    #     "name": book,
    #     "description": artist,
    #     "price": 3000,
    #     "tax": 100
    # }
    # return item_dict
