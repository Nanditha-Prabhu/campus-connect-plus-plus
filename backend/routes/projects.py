from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from database import get_mongodb_instance
from schemas.projects import KanbanBoard, ProjectDetails, CalenderEvent


# Initialize variables
router = APIRouter()
db = get_mongodb_instance("projects")

# Define routes
#################### fantasy code ############################
################### Gen by copilot ############################
### Changed logic 
@router.get("/", tags=["projects"])
async def get_all_projects():
    try:
        projects_set = list()
        # Get all project collections
        project_collections = db.database.list_collection_names()
        # Get details from each project collection
        for project_name in project_collections:
            project_name = project_name.split('.')
            if len(project_name) > 1:
                name = project_name[1]
                if project_details := db[name].find_one({ 'title': name }, {'_id': False}):
                    if project_details in projects_set:
                        continue
                    projects_set.append(project_details)
        return JSONResponse(
            content={"projects": projects_set},
            status_code=200
        )
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )
######################### fantasy code ############################


######################### PROJECT CRUD ############################
@router.post("/{project_name}", tags=["Projects CRUD"])
async def create_project(project_name: str, project_details: ProjectDetails):
    existing_project = db.database.list_collection_names()
    if project_name in existing_project:
        return JSONResponse(content={"message": "Project already exists"}, status_code=400)
    db[project_name].insert_one(project_details.model_dump(mode='python'))
    return JSONResponse(content={"message": "Project created successfully"}, status_code=200)


@router.get("/{project_name}", tags=["Projects CRUD"])
async def get_project(project_name: str):
    print(list(db[project_name].find({})))
    project_details = db[project_name].find_one({ 'title': project_name }, {'_id': False})
    return JSONResponse(content=project_details, status_code=200)


@router.put("/{project_name}", tags=["Projects CRUD"])
async def update_project(project_name: str, project_details: ProjectDetails):
    db[project_name].update_one({}, project_details.model_dump_json())
    return JSONResponse(content={"message": "Project updated successfully"}, status_code=200)


@router.delete("/{project_name}", tags=["Projects CRUD"])
async def delete_project(project_name: str):
    db[project_name].drop()
    return JSONResponse(content={"message": "Project deleted successfully"}, status_code=200)


######################### PROJECT TEAM ############################
# @router.post("/{project_name}/team", tags=["Project Team"])
# async def add_team_member(project_name: str, member: str):
#     db[project_name]['team'].insert_one({'member

########################### KANBAN ########################################
# @router.get("/{project_name}/kanban", tags=["Project Kanban"])
# async def get_kanban(project_name: str):
#     project_kanban = db[project_name]["kanban"]
#     return JSONResponse(content=project_kanban, status_code=200)

################ Get all kanban data ####################
@router.get("/{project_name}/kanban", response_model=KanbanBoard, tags=["Project Kanban"])
async def get_all_kanban(project_name: str):
    todo = db[project_name]['kanban']['todo'].find({}, {'_id': False})
    inprogress = db[project_name]['kanban']["inProgress"].find({}, {'_id': False})
    done = db[project_name]['kanban']['done'].find({}, {'_id': False})
    return {"todo": todo, "inProgress": inprogress, "done": done}


######################### Add items ##################
@router.get("/{project_name}/kanban/{task}/add", tags=["Project Kanban"])
def add_item(project_name: str, task: str, item: str):
    db[project_name]['kanban'][task].insert_one({'item': item})
    return {"message": f"Success todo_add_item"}


################## Remove #############
@router.get("/{project_name}/kanban/{task}/remove", tags=["Project Kanban"])
def remove_item(project_name: str, task: str, item: str):
    db[project_name]['kanban'][task].delete_one({'item': item})
    return {"message": f"Success remove"}


################## Move ###################
@router.get("/{project_name}/kanban/{from_task}/to/{to_task}/move", tags=["Project Kanban"])
def move_item(project_name: str, from_task: str, to_task: str, item: str):
    db[project_name]['kanban'][from_task].delete_one({'item': item})
    db[project_name]['kanban'][to_task].insert_one({'item': item})
    return {"message": f"Success move"}


########################### Project Calendar ############################
@router.get("/{project_name}/calendar/getEvents", tags=["Project Calendar"])
async def get_calendar(project_name: str):
    meetings_list = list(db[project_name]['calendar']['meeting'].find({}, {'_id': False}))
    deadline_list = list(db[project_name]['calendar']['deadline'].find({}, {'_id': False}))
    data = {
        'meetings': meetings_list,
        'deadlines': deadline_list
    }
    return JSONResponse(content=data, status_code=200)


@router.put("/{project_name}/calendar/addEvent/{event}", tags=["Project Calendar"])
async def update_calender(project_name: str, event: str, event_details: CalenderEvent):
    print(project_name, event, event_details)
    db[project_name]['calendar'][event].insert_one(event_details.model_dump(mode='python'))
    return JSONResponse(content={'message': "updated successfully"}, status_code=200)


@router.delete("/{project_name}/calendar/deleteEvent/{event}", tags=["Project Calendar"])
async def delete_event(project_name: str, event: str, event_details: CalenderEvent):
    # Cation: Did not consider the duplicate event title
    print(project_name, event, event_details)
    db[project_name]['calendar'][event].delete_one(event_details.model_dump(mode='python'))
    return JSONResponse(content={'message': "deleted successfully"}, status_code=200)
