from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
# Schemas
from schemas.user import StudentCreationModel, FactultyCreationModel
from schemas.auth import TokenModel, UserAuth
# Utils
from utils import (
    hash_password, 
    create_access_token, 
    verify_password, 
    verify_token,
    decode_token
)
from database import get_database_instance, get_mongodb_instance

mongodb = get_mongodb_instance('projects')

# Router
router = APIRouter(
    tags=["user"]
)

# Variables
fake_db = {}

# Routes
# @router.get("/")
# def index():
#     return { "route": "User's Routes" }


@router.post("/student/register")
async def create_student_user(user: StudentCreationModel):
    # check if user already exists
    # query = """
    # MATCH (u:User {username: $username})
    # RETURN u
    # """
    db = get_database_instance()
    uid = user.email_id.split("@")[0]
    query = """
    MATCH (s:STUDENT {uid: $uid})
    RETURN s
    """
    result, meta = db.cypher_query(query, {"uid": uid})
    if result:
        db.close_connection()
        raise HTTPException(status_code=400, detail="User already exists")
    # hash password and create user
    user.password = hash_password(user.password)
    user.uid = uid
    query = """
    CREATE (s:STUDENT {student_name: $student_name, usn: $usn, uid: $uid, email_id: $email_id, department: $department, area_of_interest: $aoi, semester: $sem, skills: $skills, password: $password})
    """
    result, meta = db.cypher_query(query, user.model_dump())
    db.close_connection()
    return JSONResponse(status_code=200, content={"message": "User Created Successfully"})


@router.post("/faculty/register")
async def create_faculty_user(user: FactultyCreationModel):
    # check if user already exists
    db = get_database_instance()
    uid = user.email_id.split("@")[0]
    query = """
    MATCH (s:FACULTY {uid: $uid})
    RETURN s
    """
    print(uid)
    result, meta = db.cypher_query(query, {"uid": uid})
    print(result)
    if result:
        print("User already exists")
        db.close_connection()
        return HTTPException(status_code=400, detail="User already exists")
    # hash password and create user
    user.password = hash_password(user.password)
    user.uid = uid
    query = """
    CREATE (f:FACULTY {name: $name, email_id: $email_id, department: $department, area_of_interest: $aoi, designation: $designation, password: $password, uid: $uid})
    """
    result, meta = db.cypher_query(query, user.model_dump())
    db.close_connection()
    return JSONResponse(status_code=200, content={"message": "User Created Successfully"})


@router.post("/student/login")
def student_login(form_data: UserAuth):
    db = get_database_instance()
    query = "MATCH (s:STUDENT {uid: $uid}) RETURN s"
    result, meta = db.cypher_query(query, {"uid": form_data.email_id.split("@")[0]})
    if result == [] or not verify_password(form_data.password, result[0][0].get("password")):
        db.close_connection()
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    token_model = TokenModel(
        access_token=create_access_token({"sub": result[0][0].get("uid")}),
        token_type="bearer"
    )
    db.close_connection()
    # return JSONResponse(status_code=200, content={"message": "Login Successful"})
    return token_model 


@router.post("/faculty/login")
def faculty_login(form_data: UserAuth):
    db = get_database_instance()
    query = "MATCH (s:FACULTY {uid: $uid}) RETURN s"
    result, meta = db.cypher_query(query, {"uid": form_data.email_id.split("@")[0]})
    if result == [] or not verify_password(form_data.password, result[0][0].get("password")):
        db.close_connection()
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    token_model = TokenModel(
        access_token=create_access_token({"sub": result[0][0].get("uid")}),
        token_type="bearer"
    )
    db.close_connection()
    # return JSONResponse(status_code=200, content={"message": "Login Successful"})
    return token_model 


@router.get("/verify_token")
def token_verification(request: Request):
    authorization = request.headers.get("Authorization")
    if authorization is None:
        raise HTTPException(status_code=401, detail="Invalid Token")
    bearer, authorization_token = authorization.split(" ")
    verify_token(authorization_token)
    return { "message": "Token is Valid" }


@router.get("/get_user")
async def get_user(request: Request):
    token = request.headers.get("Authorization").split(" ")[1]
    user = decode_token(token)
    db = get_database_instance()
    query = "MATCH (s { uid: $uid} ) RETURN labels(s)"
    res, _ = db.cypher_query(query, { "uid": user.get("uid") })
    user['role'] = 'STUDENT' if 'STUDENT' in res[0][0] else 'FACULTY'
    db.close_connection()
    return JSONResponse(status_code=200, content=user)


@router.get("/get_user_projects")
async def get_user_projects(request: Request):
    token = request.headers.get("Authorization")
    if token is None:
        raise HTTPException(status_code=401, detail="Invalid Token")
    token = token.split(" ")[1]
    user = decode_token(token)
    db = get_database_instance()
    query = """
    MATCH (s:STUDENT {uid: $uid})
    RETURN s.projects
    """
    result, meta = db.cypher_query(query, { "uid": user.get("uid") })
    db.close_connection()
    projects = []
    for project in result[0][0]:
        project_details = mongodb[project].find_one({ "title": project }, { "_id": 0 })
        if project_details:
            projects.append(project_details)
    return JSONResponse(status_code=200, content={"projects": projects})


@router.put("/{user_name}/addProject")
async def update_user(request: Request, user_name: str, project: str):
    token = request.headers.get("Authorization").split(" ")[1]
    user = decode_token(token)
    db = get_database_instance()
    query = """
    MATCH (s:STUDENT {uid: $uid})
    SET s.projects = s.projects + $project
    RETURN s
    """
    if 'projects' not in user:
        query = """
            MATCH (s:STUDENT {uid: $uid})
            SET s.projects = [$project]
            RETURN s
        """
    result, meta = db.cypher_query(query, user)
    db.close_connection()
    return JSONResponse(status_code=200, content={"message": "Project Added Successfully"})
