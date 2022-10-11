import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "./Header.css";

//Axios
import Axios from 'axios'

function Header() {

    const [staffid, setStaffid] = useState('');
    const [staffType, setStaffType] = useState('');
    const [staffName, setStaffName] = useState('');
    //const userIsStaff = true
    const sessionId = window.localStorage.getItem('sessionId');
    useEffect(()=>{
      if (sessionId != null){
        console.log(sessionId)
        Axios.get("http://localhost:5005/api/getUserType/"+sessionId).then((response)=>{
          if (response != ''){
            console.log(response.data)
            setStaffName(response.data[0].staff_fname)
            //console.log(response.data[0].staff_fname)
            setStaffType(response.data[0].user_type)
            //console.log(response.data[0].user_type)
          }
        });
      }
    },[])

    const logout = (e) => {
      window.localStorage.removeItem('sessionId');
    }
    //console.log(sessionId)
    //1 - Admin
    //2 - User
    //3 - Manager
    //4 - Trainer

    return (
        <>
        <div className="headerContainer">
        <div className="brandingLeft">
            <div>
                <p>Logo</p>
            </div>
        </div>
        {/* <div className="searchBar">
          <Route
            render={({ history }) => (
              <SearchBox history={history}></SearchBox>
            )}
          ></Route>
        </div> */}
        

        <div className="headerRightContainer">
        {staffType == '1'? (
          <div className="nav-links">
            <Link to="/" className="headerLink">Home</Link>
            <Link to="/roles" className="headerLink">Roles</Link>
            <Link to="/courses" className="headerLink">Courses</Link>
            <div className="dropdown">
            

            <Link to="/teams" className="headerLink">Systems</Link>
            <div className="dropdown-content">
                    <Link to="/" className="dropdownLink">Role Maintenance</Link>
                    <Link to="/SkillAssignment" className="dropdownLink">Skill Assignment</Link>
                    <Link to="/SkillMaintenance" className="dropdownLink">Skill Maintenance</Link>
            </div>
            <button className="dropbtn"><KeyboardArrowDownIcon  /></button>
            <Link to="/" className="headerLink" onClick={e=>logout(e)}>Log Out</Link>
            </div>
      
        </div>
        ) : ( staffType == '3' ?
            <div className="nav-links">
              <Link to="/" className="headerLink">Home</Link>
              <Link to="/roles" className="headerLink">Roles</Link>
              <Link to="/courses" className="headerLink">Courses</Link>
              <Link to="/teams" className="headerLink">Teams</Link>
              <Link to="/" className="headerLink" onClick={e=>logout(e)}>Log Out</Link>

            </div> : 

            <div className="nav-links">

            <Link to="/" className="headerLink">Home</Link>
            <Link to="/roles" className="headerLink">Roles</Link>
            <Link to="/courses" className="headerLink">Courses</Link>
            <Link to="/" className="headerLink" onClick={e=>logout(e)}>Log Out</Link>

          </div>
        ) 
    
    }
    <div>
        <p>{staffName}</p>
        
    </div>
        </div>
      </div>
    
      </>
    )
}

export default Header