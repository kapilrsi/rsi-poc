<script lang="ts">
  import { fhir, ehrbase } from "../fhir";
  import { onMount } from "svelte";
  import { store } from "./localStore";
  let openehr, ehrscape, username, password, ehrId, patientName, dob, patientId, cusultationType;
  let loading = false;
  let dateVal;
  let ctype = "1";
  let axiosConfig = {
    headers: {
      prefer: "return=representation",
      "content-type": "application/json",
    },
  };
  onMount(async () => {
    ({
      openehr = "",
      ehrscape = "",
      username = "",
      password = "",
      ehrId = "",
      patientName = "",
      dob = "",
      patientId = "",
      cusultationType = "",
    } = JSON.parse($store) ?? {});
    console.log("JSON.parse($store)   ---> ", JSON.parse($store));
    console.log("patientName   --> ", patientName[0]);
    let date = new Date();
    var form = document.getElementById("form");
    form.import({
      "requestedPeriod.start": date,
    });
  });

  async function createPatient(e: any) {
    document.getElementById("errorDiv").style.display = "none";
    document.getElementById("loadingDiv").style.display = "block";
    document.getElementById("successDiv").style.display = "none";
    loading = true;
    console.log(e.detail);
    console.log("Varun ----> start");
    var json = e.detail;

    console.log("patientId ----> ", patientId);
    var jsonObj = {
      actor: {
        display: patientName,
        reference: "Patient/" + patientId,
      },
    };

    var specialityObjGeneral = {
      coding: [{
        system: "http://snomed.info/sct",
        code: 394802001,
        display: "General medicine",
      }]
    };

    var specialityObjOpthal = {
      coding: [{
        system: "http://snomed.info/sct",
        code: 394813003,
        display: "Medical ophthalmology",
      }]
    };
    ctype = json.type.code;
    console.log("ctype -->", ctype)
    if(ctype == "1"){
      cusultationType = "Ophthalmology";
      json = { ...json, specialty: [specialityObjOpthal] };
    } else if (ctype == "2"){
      cusultationType = "General";
      json = { ...json, specialty: [specialityObjGeneral] };
    }
    json = { ...json, participant: [jsonObj] };
    json = { ...json, minutesDuration: 30 };
    console.log(json);
    let timeSlot = json.timeSlot.code;
    let dateSlot = json.requestedPeriod.start;
   
    console.log("timeSlot -- ", timeSlot);
    console.log("dateSlot -- ", dateSlot);
    let startD = new Date(dateSlot);
    let endD = new Date(dateSlot);
    if (timeSlot == "9") {
      startD.setHours(9);
      startD.setMinutes(0);
      startD.setSeconds(0);
    } else if (timeSlot == "930") {
      startD.setHours(9);
      startD.setMinutes(30);
      startD.setSeconds(0);
    } else if (timeSlot == "10") {
      startD.setHours(10);
      startD.setMinutes(0);
      startD.setSeconds(0);
    } else if (timeSlot == "1030") {
      startD.setHours(10);
      startD.setMinutes(30);
      startD.setSeconds(0);
    } else if (timeSlot == "11") {
      startD.setHours(11);
      startD.setMinutes(0);
      startD.setSeconds(0);
    } else if (timeSlot == "1130") {
      startD.setHours(11);
      startD.setMinutes(30);
      startD.setSeconds(0);
    } else if (timeSlot == "4") {
      startD.setHours(16);
      startD.setMinutes(0);
      startD.setSeconds(0);
    } else if (timeSlot == "430") {
      startD.setHours(16);
      startD.setMinutes(30);
      startD.setSeconds(0);
    } else if (timeSlot == "5") {
      startD.setHours(17);
      startD.setMinutes(0);
      startD.setSeconds(0);
    } else if (timeSlot == "530") {
      startD.setHours(17);
      startD.setMinutes(30);
      startD.setSeconds(0);
    }

    endD.setHours(startD.getHours());
    endD.setMinutes(startD.getMinutes() + 30);
    endD.setSeconds(startD.getSeconds());
    console.log("start time --->", startD);
    console.log("end time --->", endD);
    delete json.timeSlot;
    delete json.requestedPeriod.start;
    var jsonObj2 = {
      start: startD,
      end: endD,
    };
    json = { ...json, requestedPeriod: jsonObj2 };
    json = { ...json, start: startD };
    json = { ...json, end: endD };
    console.log("Updated Json --->", json);
    const r = await fhir.post("/Appointment", json);
    loading = false;
    console.log("Result ---->", r);
    let str = r.data.id;
    console.log("str -- >", str);
    let appointmentId = str.slice(str.lastIndexOf("/") + 1);
    console.log("appointmentId -- >", appointmentId);

    store.setLocal(
      JSON.stringify({
        openehr,
        ehrscape,
        username,
        password,
        ehrId,
        patientName,
        dob,
        patientId,
        appointmentId,
        cusultationType,
      })
    );
    document.getElementById("replacePText").innerHTML =
      "<b>Appoimmtment created successfully.<br/>" +
      ehrId;
    document.getElementById("errorDiv").style.display = "none";
    document.getElementById("loadingDiv").style.display = "none";
    document.getElementById("successDiv").style.display = "block";
  }
  function next() {
    let a = document.createElement("a");
    a.target = "_blank";
    if(ctype == "2")
       a.href = "/Basic_Questions?ehrID=" + ehrId;
    else
       a.href = "/Opthal_Questions?ehrID=" + ehrId;
    //  store.setLocal(JSON.stringify({ openehr, ehrscape, username, password, ehrId, patientName, dob, patientId}))
    a.click();
    window.location.href = "/ScheduleAppointmentList";
  }
</script>

<!-- Bootstrap CSS -->
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
<!-- Custome Class -->
<link rel="stylesheet" href="style.css" />

<div class="rightSection">
  <div class="rightBodySection">
    <div class="row">
      <div class="col-12 padding-0">
        <section class="pageHeadSection">Schedule Appointment</section>

        <!-- main body section -->
        <section class="mainBody">
          <div class="row">
            <div class="col-12 mb-3">
              <div class="encounters-info mb-2">
                <p>{patientName} (DOB {dob})</p>
                <p>EHR ID: {ehrId}</p>
              </div>
              <div id="replaceDiv" />
            </div>
            <div class="col-12">
              <div class="table-responsive">
                <mb-fhir-form
                  id="form"
                  on:mb-submit={createPatient}
                  class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border"
                >
                  <mb-context path="resourceType" bind="Appointment" />
                  <mb-date
                    path="requestedPeriod.start"
                    label="Date of Appointment"
                  />
                  <mb-select path="timeSlot" label="Select Time Slot">
                    <mb-option value="9" label="9 AM to 9:30 AM" />
                    <mb-option value="930" label="9:30 AM to 10 AM" />
                    <mb-option value="10" label="10 AM to 10:30 AM" />
                    <mb-option value="1030" label="10:30 AM to 11 AM" />
                    <mb-option value="11" label="11 AM to 11:30 AM" />
                    <mb-option value="1130" label="11:30 AM to 12 PM" />
                    <mb-option value="4" label="4 PM to 4:30 PM" />
                    <mb-option value="430" label="4:30 PM to 5 PM" />
                    <mb-option value="5" label="5 PM to 5:30 PM" />
                    <mb-option value="530" label="5:30 PM to 6 PM" />
                  </mb-select>
                  <mb-select path="type" label="Consultation Type" id="ctype">
                    <mb-option value="1" label="Ophthalmology" />
                    <mb-option value="2" label="General Consultation" selected/>
                  </mb-select>
                  <br />
                  <mb-submit>
                    <button
                      class="btn custome-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#mic-modal"
                    >
                      Submit
                    </button>
                    <!-- <sl-button {loading} type="info" size="large" class="w3-button w3-block w3-teal">Submit</sl-button> -->
                  </mb-submit>
                </mb-fhir-form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</div>

<!-- Modal -->
<div
  class="modal fade mic-modal"
  id="mic-modal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body" id="successDiv" style="display:none;">
        <div class="modal-success">
          <i class="bi bi-check-circle-fill" />
          Success
        </div>
        <p id="replacePText">
          Audio stream has been processed successfully using AI/ML. <br />
          Click on Next button to validate and submit the encounter.
        </p>
        <button id="btnNextPage" class="btn next-btn" on:click={next}>
          Next
        </button>
      </div>
      <div class="modal-body" id="errorDiv" style="display:none;">
        <div class="modal-success">
          <i class="bi bi-exclamation-triangle" />
          Warning
        </div>
        <p>
          The AI engine was not able to decipher the conversation.<br />
          Please Re-record.
        </p>
        <button id="btnDoNothing" class="btn next-btn">
          Re-record Coversation
        </button>
      </div>
      <div class="modal-body" id="loadingDiv">
        <div class="text-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <!-- <p>
                  Please w
              </p>
       -->
      </div>
    </div>
  </div>
</div>
