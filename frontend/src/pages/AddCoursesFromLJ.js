import React,{useState,useEffect,useRef} from 'react'
import { useSearchParams } from "react-router-dom";
import Axios from 'axios'
import Header from '../components/Header'
import Collapsible from "react-collapsible"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


import "./AddCoursesFromLJ.css"
function AddCoursesFromLJ(props) {
    const [allSkills,setAllSkills] = useState([])


    const [requiredSkills , setRequiredSkills] = useState([])
    const [currentCoursesDoing, setCurrentCoursesDoing] = useState([])
    const searchParams = useSearchParams()
    const roleName = useSearchParams()
    const [isDetailButtonPressed , setIsDetailButtonPressed] = useState(false)
    const dataFetchedRef = useRef(false)
    const learningJourneyID = searchParams.get("journey_id")
    const learningJourneyName = roleName.get("role_name")

    const getCourseData = async (courseID) => {

        await Axios.get(`http://localhost:5005/api/getCourseSkill/${courseID}`).then((res) => console.log("To be done, this is getCourse"))
    }
    const getJourneyData = async (journeyID) => {
        const journey = await Axios.get(`http://localhost:5005/api/getJourneyCourses/${journeyID}`)
        const tempSkills = []
        const tempCourses = []
        console.log(journey.data)
        const groups = journey.data.reduce((groups, item) => {
            const group = (groups[item.role_skill_name] || []);
            group.push(item);
            groups[item.role_skill_name] = group;
            return groups;
          }, {});


        for(const [key,value] of Object.entries(groups)){
            value.map(item => tempCourses.includes(item.course_id) ? null : tempCourses.push(item.course_id))
            
            if (!tempSkills.includes(key)){
                tempSkills.push(key)
            }
        }

        return {
            "tempSkills" : tempSkills,
            "tempCourses" : tempCourses,
        }
    }
    const getData = async() => {

        const data = await Axios.get("http://localhost:5005/api/getGroupedSkillCourses")


        setAllSkills(data.data)
        const allCourseIDs = []
        data.data.map(skill => JSON.parse(skill.course_ids).map(IDs => allCourseIDs.includes(IDs) ? null : allCourseIDs.push(IDs)))

        allCourseIDs.map(IDs => getCourseData(IDs))
     //    for (let i = 0; i < data.data.length; i++) {
     //     console.log("I am being called")
     //     populateRelevantFields(data.data.role_id,data.data.journey_id)
         
     //    }
        const journeyData = await getJourneyData(learningJourneyID)

        journeyData.tempSkills.map(skill => setRequiredSkills(prevArray => [...prevArray,skill]))
        journeyData.tempCourses.map(course => course === null ? null : setCurrentCoursesDoing(courseArray => [...courseArray,course]) )

     }

     useEffect(() => {

        if(dataFetchedRef.current) return;
        dataFetchedRef.current = true
        getData().catch(console.error)
        // if(collapsableData.length === 0){
        //     setCollapsableData(actualLearningJourneyData)
        //    }
        // actualLearningJourneyData.map((m) => console.log(m))

    }, [])    
    const zip = (a1,a2) => a1.map((courseName ,courseSkill) => [courseName , a2[courseSkill]])
    // console.log(zip(JSON.parse(allSkills[0].course_names),JSON.parse(allSkills[0].course_ids)))

    const handleDetailButtonClick = (e) => {
        setIsDetailButtonPressed(current => !current)

    }

    const handleAddToLJ = (e) => {
        var updatedList = [...currentCoursesDoing];
        if (e.target.checked) {
            updatedList = [...currentCoursesDoing,e.target.value]
        } else {
            updatedList.splice(currentCoursesDoing.indexOf(e.target.value),1)
        } 
        setCurrentCoursesDoing(updatedList)

    }

   const submitCourses = async() => {
    const courses = currentCoursesDoing
    const journey_id = learningJourneyID
        await Axios.post("http://localhost:5005/api/createJourneyCourses", {journey_id,courses}).then((res) => console.log(res))
   }
  return (
    <>
    <Header />
    <h1> Add Courses to Learning Journey to {learningJourneyName}</h1>
        <div className="addCourseContainer">
        <div className="requiredSkills">
            <h3>Required Skills</h3>
            <ul>
            {requiredSkills.map((skill) => <><li>{skill}</li></>)}
            </ul>
        </div>

        <div className="selectedSkills">
        <button onClick={handleDetailButtonClick} className="defaultButton">Show Course Details</button>
            {allSkills.map((skills) => <>
            <div className="collapsibleMenu" key={skills.skills_id}>
                <Collapsible trigger={[skills.skill_name , <ArrowDropDownIcon />]}>
                    <div className="innerContent">
                    {zip(JSON.parse(skills.course_names),JSON.parse(skills.course_ids)).map(((x,index) => 
                    <>
                        <label>
                            <input type="checkbox" value={x[1]} checked={currentCoursesDoing.includes(x[1]) ? true : false} onChange={handleAddToLJ}/>{x[0]} 
                            {isDetailButtonPressed && <p>{JSON.parse(skills.course_desc)[index]}</p>}
                        </label>
                    </>
                    ))}
                    </div>
                </Collapsible>
                

                
            </div></>)}
        </div>
                    
        </div>
        <div className="createContainer">
            <button onClick={submitCourses} className="defaultButton">Create</button>
        </div>
    </>

    
  )
}

export default AddCoursesFromLJ