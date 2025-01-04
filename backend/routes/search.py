from fastapi import APIRouter
from database import get_database_instance

# Router
router = APIRouter(
    tags=["search"]
)
db = get_database_instance()


@router.get("/find_people")
async def find_people(people: str, area: str):
    query1 = "MATCH (n:" + people + ") WHERE '" + area + "' in n.area_of_interest RETURN n.name, n.student_name, n.department, n.designation, n.usn, n.email_id"
    query2 = "MATCH (n) WHERE '" + area + "' in n.area_of_interest RETURN n.name, n.student_name, n.department, n.designation, n.usn, n.email_id"

    # null results are also handled(only in this function)
    nodes = [[],[],[],[]]
    if(people=='ALL'):
        result, meta = db.cypher_query(query2)
    else:
        result, meta = db.cypher_query(query1)
    # print(result)
    # print(meta)
    # print(len(result))
    # result_as_dict = [dict(zip(meta, row)) for row in result]
    # print(result_as_dict)

    if people == 'FACULTY':
        for i in range(len(result)):
            nodes[0].append(result[i][0])
            nodes[1].append(result[i][2])
            nodes[2].append(result[i][3])
            nodes[3].append(result[i][5])
    elif people == 'STUDENT':
        for i in range(len(result)):
            nodes[0].append(result[i][1])
            nodes[1].append(result[i][2])
            nodes[2].append(result[i][4])
            nodes[3].append(result[i][5])
    else:
        for i in range(len(result)):
            # faculty details
            if(result[i][0] != None):
                nodes[0].append(result[i][0])
                nodes[1].append(result[i][2])
                nodes[2].append(result[i][3])
                nodes[3].append(result[i][5])
            # student details
            if(result[i][1] != None):
                nodes[0].append(result[i][1])
                nodes[1].append(result[i][2])
                nodes[2].append(result[i][4])
                nodes[3].append(result[i][5])

    if nodes[0] == [] :
        for i in range(len(nodes)):
            nodes[i].append('None')
    print(nodes)
    return nodes


@router.get("/find_projects")
async def find_projects(status: str, area: str):
    query1 = "MATCH (P:PROJECT) WHERE '"+ area +"' IN P.area_of_interest AND P.status= '" + status + "' RETURN P.title, P.area_of_interest, P.description, P.status "
    query2 = "MATCH (P:PROJECT) WHERE '"+ area +"' IN P.area_of_interest RETURN P.title, P.area_of_interest, P.description, P.status "
    # ???    
    if status =='All':
        result, meta = db.cypher_query(query2)
    else:
        result, meta = db.cypher_query(query1)
    print(result)
    return result


@router.get("/find_students")
async def find_students(areaOfInterest: str, skill: str):
    query = """
    MATCH (s:STUDENT)
    WHERE $areaOfInterest IN s.area_of_interest OR $skill IN s.skills
    RETURN s.student_name, s.department, s.area_of_interest, s.skills, s.email_id
    """
    parameters = {
        'areaOfInterest': areaOfInterest,
        'skill': skill
    }
    result, meta = db.cypher_query(query, params=parameters)
    # print(result)
    return result


@router.get("/all_areas")
async def all_area_of_interests():
    query = """
    MATCH (s:STUDENT) 
    UNWIND s.area_of_interest AS student_interest 
    WITH COLLECT(DISTINCT student_interest) AS student_interests

    MATCH (f:FACULTY) 
    UNWIND f.area_of_interest AS faculty_interest 
    WITH COLLECT(DISTINCT faculty_interest) AS faculty_interests, student_interests

    MATCH (p:PROJECT)
    UNWIND p.area_of_interest AS project_interest
    WITH COLLECT(DISTINCT project_interest) AS project_interests, faculty_interests, student_interests

    WITH student_interests + faculty_interests + project_interests AS all_interests
    UNWIND all_interests AS interest
    RETURN DISTINCT interest
    ORDER BY interest
    """
    qresult, meta = db.cypher_query(query)
    aoi = []
    for interests in qresult:
        aoi.append(*interests)
    # print(aoi)
    return aoi


@router.get("/all_skills")
async def all_skills():
    query = """
    MATCH(s:STUDENT)
    UNWIND s.skills AS sk
    RETURN DISTINCT sk
    ORDER BY sk
    """
    qresult, meta = db.cypher_query(query)
    # print(result)
    skills = []
    for skill in qresult:
        skills.append(*skill)
    print(skills)
    return skills


@router.get('/know-team')
def get_projects(status: str):
    query1 = """
    MATCH (p:PROJECT)
    OPTIONAL MATCH (p)<-[:WORKING_ON]-(s:STUDENT)
    OPTIONAL MATCH (p)<-[:WORKING_ON]-(f:FACULTY)
    OPTIONAL MATCH (f)-[:GUIDES]->(s)
    WITH p, COLLECT(DISTINCT s) AS Students, COLLECT(DISTINCT f) AS Faculties
    WHERE size(Students) > 0 AND size(Faculties) > 0 AND p.status= $status
    RETURN p.title AS ProjectTitle, 
           p.description AS ProjectDescription, 
           p.status AS ProjectStatus, 
           [s IN Students | s.student_name] AS Students,
           [f IN Faculties | f.name] AS Faculties
    ORDER BY ProjectTitle
    """
    query2 = """
    MATCH (p:PROJECT)
    OPTIONAL MATCH (p)<-[:WORKING_ON]-(s:STUDENT)
    OPTIONAL MATCH (p)<-[:WORKING_ON]-(f:FACULTY)
    OPTIONAL MATCH (f)-[:GUIDES]->(s)
    WITH p, COLLECT(DISTINCT s) AS Students, COLLECT(DISTINCT f) AS Faculties
    WHERE size(Students) > 0 AND size(Faculties) > 0 
    RETURN p.title AS ProjectTitle, 
           p.description AS ProjectDescription, 
           p.status AS ProjectStatus, 
           [s IN Students | s.student_name] AS Students,
           [f IN Faculties | f.name] AS Faculties
    ORDER BY ProjectTitle
    """
    parameters = {
        'status': status
    }
    # result, meta = db.cypher_query(query2, params=parameters)
    # print(result)
    if status =='All':
        result, meta = db.cypher_query(query2)
    else:
        result, meta = db.cypher_query(query1, params=parameters)
    # print(result)
    projects = []
    for record in result:
        project = {
            "ProjectTitle": record[0],
            "ProjectDescription": record[1],
            "ProjectStatus": record[2],
            "Students": record[3],
            "Faculties": record[4]
        }
        projects.append(project)
    # print(projects)
    return projects
