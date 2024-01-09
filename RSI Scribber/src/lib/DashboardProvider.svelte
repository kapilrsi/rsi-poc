
<script lang="ts">
      import { onMount } from "svelte";
      import { store } from "./localStore";
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
    newassessment,
    appointments,
    chiefcomplaint,
    history,
    newplan,
    prescription,
    vitals,
    patientId,
    currentOption;
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
        newassessment = "",
        appointments= "",
        chiefcomplaint= "",
        history= "",
        newplan= "",
        prescription= "",
        vitals= "",
        currentOption = "",
    } = JSON.parse($store) ?? {});
    console.log(JSON.parse($store) ?? {});
    console.log("currentOption1 -- ", currentOption);
    if(currentOption){
        console.log("currentOption 2-- ", currentOption);
        document.getElementById('1li').className = "";
        document.getElementById('2li').className = "";
        document.getElementById('3li').className = "";
        document.getElementById('4li').className = "";
        document.getElementById(currentOption).className = "active";
    }
    else{
        document.getElementById("1li").className = "active";
    }
    });
function setOption(id){
    console.log("ID..........", id);
    currentOption = id;
            store.setLocal(
                        JSON.stringify({
                            openehr,
                            ehrscape,
                            username,
                            password,
                            ehrId,
                            patientName,
                            dob,
                            assessment,
                            objective,
                            plan,
                            subjective,
                            jsonResponse,
                            rosText,
                            jsonStr,
                            logouturl,
                            patientId,
                            newassessment,
                            appointments,
                            chiefcomplaint,
                            history,
                            newplan,
                            prescription,
                            vitals,
                            currentOption,
                        })
                    );
                console.log(JSON.parse($store));
}

</script>

<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
<!-- Custome Class -->
<link rel="stylesheet" href="style.css" />

  <!-- header section -->
  <header class="container-fluid fixed-top">
    <div class="row">
        <div class="header-section">
            <div class="admin-logo">
                <a href="index.html">
                    <img src="logo.JPG" alt="">
                </a>                    
            </div>
            <div class="user-section">
                <ul class="admin-user">
                    <li class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle admin-flist" type="button"
                            id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-bell-fill"></i>
                            <b>99</b>
                        </a>
                        <div class="dropdown-menu animated flipInX" aria-labelledby="dropdownMenuButton2">
                            <h3>
                                To Do List
                            </h3>
                            <a class="dropdown-item" href="#">
                                <h6>Miller, James <b>(MRN: 00895654)</b></h6>
                                <small>Reading are available and pending for review</small>
                            </a>
                            <a class="dropdown-item" href="#">
                                <h6>Smith, David <b>(MRN: 00895654)</b></h6>
                                <small>Reading are available and pending for review</small>
                            </a>
                            <a class="dropdown-item" href="#">
                                <h6>Brooke, Kelly <b>(MRN: 00895654)</b></h6>
                                <small>Reading are available and pending for review</small>
                            </a>
                            <a class="dropdown-item" href="#">
                                <h6>Smith, Kane <b>(MRN: 00895654)</b></h6>
                                <small>Reading are available and pending for review</small>
                            </a>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle hide-drop-arrow" type="button" id="dropdownMenuButton1"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Dr. {username} <br />
                            <span>PMA Care Provider</span>
                        </a>
                        <span>
                            <img src="user.png" alt="user photo">
                        </span>
                        <div class="dropdown-menu widthOutSub" aria-labelledby="dropdownMenuButton1">
                            <a class="dropdown-item" href="#">Edit my profile</a>
                            <a class="dropdown-item" href="#">Help</a>
                            <a class="dropdown-item" href={logouturl}>Sign Out</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</header>

<!-- main section -->
<section class="container-fluid">
    <div class="row">
        <div class="sidebar">
            <ul class="list-sidebar">
                <li id="1li">
                    <a href="/AllAppointmentList" on:click={() => { setOption('1li')}}>
                        <i class="bi bi-speedometer"></i>
                        <span class="nav-label">Dashboard</span>
                    </a>
                </li>
                <li id="2li">
                    <a href="/ScheduleAppointmentList" on:click={() => { setOption('2li')}}>
                        <i class="bi bi-display"></i>
                        <span class="nav-label">Appointments</span>
                    </a>
                </li>
                <li id="3li">
                    <a href="/ViewEncounter" on:click={() => { setOption('3li')}}>
                        <i class="bi bi-person-fill"></i>
                        <span class="nav-label">Encounters</span>
                    </a>
                </li>
                <li id="4li">
                    <a href="/List" on:click={() => { setOption('4li')}}>
                        <i class="bi bi-person-fill"></i>
                        <span class="nav-label">Patients</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</section>


