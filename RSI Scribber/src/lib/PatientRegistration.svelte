<script lang="ts">
  import { fhir, ehrbase } from "../fhir";
  let loading = false;
  let axiosConfig = {
    headers: {
      prefer: "return=representation",
      "content-type": "application/json",
    },
  };

  async function createPatient(e: any) {
    loading = true;
    console.log(e.detail);
    console.log("Varun ----> start");

    const ehrreq = await ehrbase.post("/ehr", "", axiosConfig);
    console.log("Varun ----> ", ehrreq);
    const myArray = Object.values(ehrreq);
    console.log("myArray ----> ", myArray);
    var ehr = Object.values(myArray[0]); //.ehr_id.value;
    var ehrId = Object.values(ehr[1])[1];
    console.log("ehr_ID ----> ", ehrId);
    var jsonObj = {
      type: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v2-0203",
            code: "MR",
          },
        ],
      },
      value: ehrId,
    };

    var json = e.detail;
    json = { ...json, identifier: jsonObj };
    json = { ...json, id: ehrId };
    console.log("Updated Json --->", json);
    const r = await fhir.post("/Patient", json);
    loading = false;
    console.log("Result ---->", r.data);
    window.location.href = "/List";
  }
</script>

<div class="rightSection">
  <div class="rightBodySection">
    <div class="row">
      <div class="col-12 padding-0">
        <section class="pageHeadSection">Add New Patient</section>

        <!-- main body section -->
        <section class="mainBody">
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <mb-fhir-form
                  on:mb-submit={createPatient}
                  class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border"
                >
                  <mb-context path="resourceType" bind="Patient" />
                  <mb-input path="name[0].given" label="Name" />
                  <mb-input
                    path="telecom[0].value"
                    system="phone"
                    label="Phone"
                  />
                  <mb-date path="birthDate" label="Date of Birth" />
                  <mb-buttons datatype="code" label="Gender" path="gender">
                    <mb-option value="male" label="Male" />
                    <mb-option value="female" label="Female" />
                    <mb-option value="other" label="Other" />
                  </mb-buttons>
                  <br />
                  <mb-submit>
                    <button class="btn custome-btn"> Submit </button>
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
