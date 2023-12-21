<script lang="ts">
  import { onMount } from "svelte";
  import { store } from "./localStore";
  let openehr, ehrscape, username, password, ehrId, patientName, dob, patientId;
  let loading = false;
  let dateVal;
  let json1, json2, json3, json4;
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
    } = JSON.parse($store) ?? {});
    console.log("JSON.parse($store)   ---> ", JSON.parse($store));
    console.log("patientName   --> ", patientName[0]);
  });
  async function createEncounter(e: any) {
    var json = e.detail;
    console.log(" JSON --->", json);
    var jsonObj = {
      request: {
        method: "POST",
        url: "Encounter",
      },
      resource: {
        resourceType: "Encounter",
      },
      subject: {
        reference: "Patient/" + ehrId,
      },
      diagnosis: [
        {
          condition: [
            {
              concept: {
                text: "subjective",
              },
            },
          ],
        },
      ],
    };
    console.log("Updated JSON -->", jsonObj);
    json1 = jsonObj;
  }

  async function createClinicalImpression(e: any) {
    var json = e.detail;
    console.log(" JSON --->", json);
    var jsonObj = {
      request: {
        method: "POST",
        url: "ClinicalImpression",
      },
      resource: {
        resourceType: "ClinicalImpression",
      },
      subject: {
        reference: "Patient/" + ehrId,
      },
      summary: "assessment",
    };
    console.log("Updated JSON -->", jsonObj);
    json2 = jsonObj;
  }

  async function createCondition(e: any) {
    var json = e.detail;
    console.log(" JSON --->", json);
    var jsonObj = {
      request: {
        method: "POST",
        url: "Condition",
      },
      resource: {
        resourceType: "RequestGroup",
      },
      subject: {
        reference: "Patient/" + ehrId,
      },
      code: {
        text: "assessment",
      },
    };
    console.log("Updated JSON -->", jsonObj);
    json3 = jsonObj;
  }

  async function createRequestOrchestration(e: any) {
    var json = e.detail;
    console.log(" JSON --->", json);
    var jsonObj = {
      request: {
        method: "POST",
        url: "RequestGroup",
      },
      resource: {
        resourceType: "RequestGroup",
      },
      contained: [
        {
          resourceType: "MedicationRequest",
          id: "medicationrequest-1",
          intent: "proposal",
          medicationCodeableConcept: {
            text: "" + "plan",
          },
          subject: {
            reference: "Patient/" + ehrId,
          },
        },
      ],
    };
    console.log("Updated JSON -->", jsonObj);
    json4 = jsonObj;
  }
  function create() {
    var json1 = {
      request: {
        method: "POST",
        url: "Encounter",
      },
      resource: {
        resourceType: "Encounter",
      },
      subject: {
        reference: "Patient/" + ehrId,
      },
      diagnosis: [
        {
          condition: [
            {
              concept: {
                text: "subjective",
              },
            },
          ],
        },
      ],
    };
    var json2 = {
      request: {
        method: "POST",
        url: "ClinicalImpression",
      },
      resource: {
        resourceType: "ClinicalImpression",
      },
      subject: {
        reference: "Patient/" + ehrId,
      },
      summary: "assessment",
    };
    var json3 = {
      request: {
        method: "POST",
        url: "Condition",
      },
      resource: {
        resourceType: "RequestGroup",
      },
      subject: {
        reference: "Patient/" + ehrId,
      },
      code: {
        text: "assessment",
      },
    };
    var json4 = {
      request: {
        method: "POST",
        url: "RequestGroup",
      },
      resource: {
        resourceType: "RequestGroup",
      },
      contained: [
        {
          resourceType: "MedicationRequest",
          id: "medicationrequest-1",
          intent: "proposal",
          medicationCodeableConcept: {
            text: "" + "plan",
          },
          subject: {
            reference: "Patient/" + ehrId,
          },
        },
      ],
    };
    var jsonObj = {
      resourceType: "Bundle",
      entry: [json1, json2, json3, json4],
    };
    console.log("Final jsonObj -->", jsonObj);
  }
</script>

<title>Rsystems Application</title>

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
        <!-- main body section -->
        <section class="mainBody">
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <mb-fhir-form id="form" on:mb-submit={createEncounter}>
                  <mb-context path="resourceType" bind="Encounter" />
                  <mb-input
                    path="diagnosis[0].condition[0].concept.text"
                    label="Subjective: Problem/Diagnosis"
                    value="Test 1"
                  />
                  <mb-hidden
                    path="diagnosis[0].use[0].coding[0].system"
                    label="System"
                    value="http://terminology.hl7.org/CodeSystem/diagnosis-role"
                  />
                  <mb-hidden
                    path="diagnosis[0].use[0].coding[0].code"
                    label="Code"
                    value="cc"
                  />
                  <mb-hidden
                    path="diagnosis[0].use[0].coding[0].display"
                    label="display"
                    value="Chief complaint"
                  />
                  <mb-hidden
                    path="subject.reference"
                    label="Patient ID"
                    value="Patient/{ehrId}"
                  />
                  <mb-hidden
                    path="subject.display"
                    label="Patient ID"
                    value={patientName}
                  />
                  <mb-submit>
                    <button id="btn1" class="btn custome-btn"> Submit </button>
                    <!-- <sl-button {loading} type="info" size="large" class="w3-button w3-block w3-teal">Submit</sl-button> -->
                  </mb-submit>
                </mb-fhir-form>
                <mb-fhir-form id="form" on:mb-submit={createClinicalImpression}>
                  <mb-context
                    path="resourceType"
                    bind="ClinicalImpression"
                    value="Test 2"
                  />
                  <mb-input
                    path="description"
                    label="Objective: Clinical description"
                  />
                  <mb-hidden path="status" label="Status" value="completed" />
                  <mb-hidden
                    path="subject.reference"
                    label="Patient ID"
                    value="Patient/{ehrId}"
                  />
                  <mb-hidden
                    path="subject.display"
                    label="Patient ID"
                    value={patientName}
                  />
                  <mb-submit>
                    <button id="btn2" class="btn custome-btn"> Submit </button>
                    <!-- <sl-button {loading} type="info" size="large" class="w3-button w3-block w3-teal">Submit</sl-button> -->
                  </mb-submit>
                </mb-fhir-form>
                <mb-fhir-form id="form" on:mb-submit={createCondition}>
                  <mb-context
                    path="resourceType"
                    bind="Condition"
                    value="Test 3"
                  />
                  <mb-input path="code.text" label="Assessment: Comments" />
                  <mb-hidden
                    path="subject.reference"
                    label="Patient ID"
                    value="Patient/{ehrId}"
                  />
                  <mb-hidden
                    path="subject.display"
                    label="Patient ID"
                    value={patientName}
                  />
                  <mb-submit>
                    <button id="btn3" class="btn custome-btn"> Submit </button>
                    <!-- <sl-button {loading} type="info" size="large" class="w3-button w3-block w3-teal">Submit</sl-button> -->
                  </mb-submit>
                </mb-fhir-form>
                <mb-fhir-form
                  id="form"
                  on:mb-submit={createRequestOrchestration}
                >
                  <mb-context path="resourceType" bind="RequestOrchestration" />
                  <mb-input
                    path="contained[0].medication.concept.text"
                    label="Plan: Course Description"
                    value="Test 4"
                  />
                  <mb-hidden
                    path="contained[0].resourceType"
                    label="MedicationRequest"
                    value="MedicationRequest"
                  />
                  <mb-hidden
                    path="contained[0].id"
                    label="ID"
                    value="medicationrequest-1"
                  />
                  <mb-hidden
                    path="contained[0].intent"
                    label="Intent"
                    value="proposal"
                  />
                  <mb-hidden
                    path="subject.reference"
                    label="Patient ID"
                    value="Patient/{ehrId}"
                  />
                  <mb-hidden
                    path="subject.display"
                    label="Patient ID"
                    value={patientName}
                  />

                  <mb-submit>
                    <button id="btn4" class="btn custome-btn"> Submit </button>
                    <!-- <sl-button {loading} type="info" size="large" class="w3-button w3-block w3-teal">Submit</sl-button> -->
                  </mb-submit>
                </mb-fhir-form>
              </div>
            </div>
          </div>
          <button on:click={create} class="btn custome-btn"> create </button>
        </section>
      </div>
    </div>
  </div>
</div>
