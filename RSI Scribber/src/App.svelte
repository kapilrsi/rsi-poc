
<script lang="ts">
  import "./index.css";
  import "medblocks-ui";
  import "medblocks-ui/dist/shoelace";
  import { store } from "./lib/localStore";
  import { Router, Route } from "svelte-routing";
  import Home from "./lib/Home.svelte";
  import { forms } from "./lib/FormList.svelte";
  import FormWrapper from "./lib/FormWrapper.svelte";
  import PatientRegistration from "./lib/PatientRegistration.svelte";
  import Recording from "./lib/Recording.svelte";
  import ViewEncounters from "./lib/ViewEncounters.svelte";
  import DashboardAdmin from "./lib/DashboardAdmin.svelte";
  import Login from "./lib/Login.svelte";
  import { onMount } from "svelte";
  import DashboardProvider from "./lib/DashboardProvider.svelte";
  import Logout from "./lib/Logout.svelte";
  import BasicQuestionsAnswers from "./lib/BasicQuestionsAnswers.svelte";
  import Schedule from "./lib/Schedule.svelte";
  import ScheduleAppointmentList from "./lib/ScheduleAppointmentList.svelte";
  import AppointmentList from "./lib/AppointmentList.svelte";
  import AllAppointmentList from "./lib/AllAppointmentList.svelte";
  import List from "./lib/List.svelte";
  import EncounterList from "./lib/EncounterList.svelte";
  import GenerateFhirhl7 from "./lib/GenerateFHIR&HL7.svelte";
  import Keycloak from "keycloak-js";
  import type { KeycloakInitOptions } from "keycloak-js";
  import { keycloakurl } from "./fhir";
  import LoadingSpinner from "./lib/LoadingSpinner.svelte";
  import EyesQuestionsAnswers from "./lib/EyesQuestionsAnswers.svelte";
  
  let isQuestionBasedForm,
    openehr,
    ehrscape,
    username,
    password,
    ehrId,
    patientName,
    dob,
    assessment,
    objective,
    jsonStr,
    rosText,
    plan,
    subjective,
    jsonResponse,
    logouturl,
    patientId,
    newassessment,
    appointments,
    chiefcomplaint,
    history,
    newplan,
    prescription,
    vitals,
    cusultationType;
  let instance = {
    url: keycloakurl,
    realm: "ehrbase",
    clientId: "ehrbase-client",
  };
 let authenticatedUser = false;
  //let openehr, ehrscape, username, password, ehrId, patientName, dob, isQuestionBasedForm;
  onMount(() => {
    ({
      openehr = "",
      logouturl = "",
      ehrscape = "",
      username = "",
      password = "",
      ehrId = "",
      patientName = "",
      dob = "",
      assessment = "",
      objective = "",
      plan = "",
      subjective = "",
      jsonResponse = "",
      rosText = "",
      jsonStr = "",
      logouturl = "",
      patientId = "",
      newassessment = "",
      appointments= "",
      chiefcomplaint= "",
      history= "",
      newplan= "",
      prescription= "",
      vitals= "",
      cusultationType = "",
    } = JSON.parse($store) ?? {});
    console.log(JSON.parse($store) ?? {});
    const urlParams = new URLSearchParams(window.location.search);
    isQuestionBasedForm = urlParams.has("ehrID");
    let isLogout = urlParams.has("logout");
    if(!isQuestionBasedForm){
      let keycloak = new Keycloak(instance);
      let initOptions: KeycloakInitOptions = { onLoad: "login-required" };
      var profileData;
      // keycloak
      //   .init(initOptions)
      //   .then(function (authenticated) {
      //     console.info("Authenticated");
      //     profileData = keycloak.loadUserProfile();
      //     profileData.then(function(userProfile){
      //     //profileData = JSON.stringify(userProfile);
      //     console.log(userProfile)
      //     username =userProfile.firstName+" "+userProfile.lastName;
      //    // username =profileData["firstName"]+" "+profileData["lastName"];
      //     console.log("username = "+username);
      //     logouturl = keycloak.createLogoutUrl();
      //   console.log("1 = ",keycloak.realm)
      //   console.log("2 = ",keycloak.clientId)
      //   console.log("3 = profileData = ",profileData)
      //   console.log("logouturl = ",logouturl)
      //   console.log("loginurl = ",keycloak.createLoginUrl)
      //   console.log("Logged in User = ",username)
      // //authenticatedUser = true;
      //   store.setLocal(
      //                   JSON.stringify({
      //                       openehr,
      //                       ehrscape,
      //                       username,
      //                       password,
      //                       ehrId,
      //                       patientName,
      //                       dob,
      //                       assessment,
      //                       objective,
      //                       plan,
      //                       subjective,
      //                       jsonResponse,
      //                       rosText,
      //                       jsonStr,
      //                       logouturl,
      //                       patientId,
      //                       newassessment,
      //                       appointments,
      //                       chiefcomplaint,
      //                       history,
      //                       newplan,
      //                       prescription,
      //                       vitals,
      //                   })
      //               );
      //           console.log(JSON.parse($store));
      //   });
      //     authenticatedUser = true;
      //   })
      //   .catch(function () {
      //     alert("failed to initialize");
      //     authenticatedUser = false;
      //   });
       
      authenticatedUser = true;
    }

    

  });
  console.log("Username 123 = ", username);
</script> 
{#if !isQuestionBasedForm && !authenticatedUser}
<LoadingSpinner />
{/if}

{#if isQuestionBasedForm}
  <div class="row">
    <main>
      <Router>
        <Route path="/"><Home /></Route>
        {#each forms as form}
          <Route path={form.name.replaceAll(" ", "_")}>
            <FormWrapper
              id={form.id}
              component={form.component}
              name={form.name}
            />
          </Route>
        {/each}
      </Router>
    </main>
  </div>
{/if}
{#if authenticatedUser && !isQuestionBasedForm}
    <DashboardProvider />
  <Router>
      <Route path="/"><AllAppointmentList /></Route>
    {#each forms as form}
      <Route path={form.name.replaceAll(" ", "_")}>
        {#if (form.id =="problem_listV1")}
          {form.id ="problem_listV2"}
        {/if}
        <FormWrapper id={form.id} component={form.component} name={form.name} />
      </Route>
    {/each}
  </Router>
  <Router>
    <Route path="/Patient_Registration" component={PatientRegistration} />
    <Route path="/Dashboard" component={DashboardAdmin} />
    <Route path="/Recording" component={Recording} />
    <Route path="/ViewEncounter" component={ViewEncounters} />
    <Route path="/Login" component={Login} />
    <Route path="/Logout" component={Logout} /> 
    <Route path="/Answers" component={BasicQuestionsAnswers} />
    <Route path="/OpthalAnswers" component={EyesQuestionsAnswers} />
    <Route path="/Schedule" component={Schedule} />
    
    <Route
      path="/ScheduleAppointmentList"
      component={ScheduleAppointmentList}
    />
    <Route path="/AppointmentList" component={AppointmentList} />
    <Route path="/AllAppointmentList" component={AllAppointmentList} />
    <Route path="/List" component={List} />
    <Route path="/Encounter_List" component={EncounterList} />
    <Route path="/GenerateFhirhl7" component={GenerateFhirhl7} />
  </Router>
{/if}
