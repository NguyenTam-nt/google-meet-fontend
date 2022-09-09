import './App.css';
import {GoogleLogin, GoogleLogout} from "react-google-login"
import { gapi } from 'gapi-script';
import { useEffect, useState } from 'react';
import axios from 'axios';
function App() {
  const [data, setData] = useState({
    summary: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",


  })
  // auth/admin.directory.device.chromebrowsers
  useEffect(() => {
    function start() {
    gapi.client.init({
    clientId:"100521978989-2ajku032uil9fbbra9lncjdr1dbb8dia.apps.googleusercontent.com",
      
    scope: 'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/admin.directory.device.chromebrowsers   https://www.googleapis.com/auth/admin.reports.audit.readonly  https://www.googleapis.com/auth/activity ',
      });
       }
      gapi.load('client:auth2', start);
       }, []);
   
  const responeSuccess = (data) => {
    console.log(data);
    const {code} = data;
    axios.post("/create-tokens", {code}).then(data => {
        console.log(data.data);

    })
  }

  const responeFail = (error) => {
    console.log(error);
  }

  const logout = (d) => {
    console.log(d)
  }

  const handleChange = (event) => {
    const target = event.target;
    setData({
      ...data,
      [target.name]: target.value
    })
  }

  const handleSubmit = (event) => {
      event.preventDefault();
    axios.post("/create-event", {
      ...data,
      attendees: [
        { email: 'tamnt@aladintech.co' }
      ],
      conferenceData: {
        createRequest: {
          requestId: "primary",
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', 'minutes': 24 * 60 },
          { method: 'popup', 'minutes': 10 },
        ],
      }
    }).then((data) => {
       const {hangoutLink} = data.data.data;
       console.log(data.data.data)
       const a = document.createElement("a")
       a.href = hangoutLink;
       a.target = "blank"
       a.click()
    }).catch(error => {
      console.log(error)
    })
  }

  return (
    <div className="App">
      <p>GOOGLE CALENDER</p>
      <div>
        <GoogleLogin
        // clientId='100521978989-2ajku032uil9fbbra9lncjdr1dbb8dia.apps.googleusercontent.com'
        buttonText='Đăng nhập'
      onSuccess={responeSuccess}
      onFailure={responeFail}
      // cookiePolicy={'single_host_origin'}
      responseType="code"
      accessType='offline'
    prompt='consent'
  
      // scope='openid email profile https://www.googleapis.com/auth/calendar'
        // 
        
        />

      {/* <GoogleLogout
      clientId="100521978989-2ajku032uil9fbbra9lncjdr1dbb8dia.apps.googleusercontent.com"
      buttonText="Logout"
      onLogoutSuccess={logout}
    /> */}
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='summary'>Summary</label>
            <input onChange={handleChange} value={data.summary} name="summary" id="summary" />
          </div>

          <div>
            <label htmlFor='description'>description</label>
            <input onChange={handleChange} value={data.description} name="description" id="description" />
          </div>

          <div>
            <label htmlFor='location'>location</label>
            <input onChange={handleChange} value={data.location} name="location" id="location" />
          </div>

          <div>
            <label htmlFor='startDate'>startDate</label>
            <input onChange={handleChange} value={data.startDate} type="datetime-local" name="startDate" id="startDate" />
          </div>

          <div>
            <label htmlFor='endDate'>endDate</label>
            <input onChange={handleChange} value={data.endDate}  type="datetime-local" name="endDate" id="endDate" />
          </div>
          <div>
            <button type="submit">Thêm event</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
