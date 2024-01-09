<script lang="ts">
    import axios from "axios";
    let axiosConfig = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
        },
    };
    import { onMount } from "svelte";
    import { store } from "./localStore";
    import { printPDFAPI } from "../fhir";
    import BasicQuestionsAnswers from "./BasicQuestionsAnswers.svelte";
    let consent =
        "The patient has not provided consent to record the encounter.";
    let openehr,
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
        newassessment,
        appointments,
        chiefcomplaint,
        history,
        newplan,
        prescription,
        vitals,
        cusultationType,
        htmlDetailedReport,
        htmlClincalNotes,
        htmlPatientInstructions,
        currentOption;
    let media = [];
    let mediaRecorder = null;
    let soapTemplate;
    let newTemplate;
    onMount(async () => {
        fetch("Report.txt")
            .then((response) => response.text())
            .then((text) => (soapTemplate = text));
        fetch("ReportDetailed.txt")
            .then((response) => response.text())
            .then((text) => (newTemplate = text));
        ({
            openehr = "",
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
            newassessment = "",
            appointments = "",
            chiefcomplaint = "",
            history = "",
            newplan = "",
            prescription = "",
            vitals = "",
            cusultationType = "",
            htmlDetailedReport = "",
            htmlClincalNotes = "",
            htmlPatientInstructions = "",
            currentOption="",
        } = JSON.parse($store) ?? {});
        console.log(JSON.parse($store));
        let obj = rosText;
        if (objective != "") {
            consent =
                "The patient has provided consent to record the encounter.";
        }
        console.log(obj);
        document.getElementById("reviewofsystem").innerHTML = obj;
        jsonResponse  = JSON.stringify(jsonResponse);
        var v1 = "";
        form.import({
            "problem_list_v2/problem_diagnosis/assessment_comments": assessment,
            "problem_list_v2/problem_diagnosis/objective_clinical_description":
                consent + "\n"+ objective,
            "problem_list_v2/problem_diagnosis/review_of_system:0":obj,    
            "problem_list_v2/problem_diagnosis/subjective_problem_diagnosis":
                subjective,
            "problem_list_v2/problem_diagnosis/plan_course_description": plan,
            "problem_list_v2/problem_diagnosis/doctor_s_notes:0/doctor_s_notes:0": v1,
        });

        let timeout = setTimeout(loadSOAP, 2000);
    });

    function loadSOAP(){
        var form = document.getElementById("form");
        var v1 = getSOAPHTML()+"BREAKHTML"+getDetailedReportHTML()+"BREAKHTML"+getClinicalNotesHTML()+"BREAKHTML"+getPatientInstructionsHTML();
        let obj = rosText;
        if (objective != "" || plan != "" || subjective != "" || assessment != "") {
            consent =
                "The patient has provided consent to record the encounter.";
        }
        console.log(obj);
        document.getElementById("detailedContent").innerHTML = getDetailedReportHTML();
        document.getElementById("clinicalNotesContent").innerHTML = getClinicalNotesHTML();
        document.getElementById("patientInstructionsContent").innerHTML = getPatientInstructionsHTML();
        form.import({
            "problem_list_v2/problem_diagnosis/assessment_comments": assessment,
            "problem_list_v2/problem_diagnosis/objective_clinical_description":
                consent + "\n"+ objective,
            "problem_list_v2/problem_diagnosis/review_of_system:0":obj,    
            "problem_list_v2/problem_diagnosis/subjective_problem_diagnosis":
                subjective,
            "problem_list_v2/problem_diagnosis/plan_course_description": plan,
            "problem_list_v2/problem_diagnosis/doctor_s_notes:0/doctor_s_notes:0": v1,
        });
    }
    async function downloadFile() {
        let html = soapTemplate;
        var freeText = "";
        html = html.replace("replacepname", patientName);
        html = html.replace("replacedob", dob);
        html = html.replace("replacedoa", new Date().toDateString());
        html = html.replace("replacedname", "Dr. "+username);
        html = html.replace("sText", subjective);
        html = html.replace("pText", plan);
        html = html.replace("oText", objective);
        html = html.replace("rosText", rosText);
        html = html.replace("freeText", freeText);
        html = html.replace("aText", assessment);
        document.getElementById("newFormatText").innerHTML = "";
        document.getElementById("pdfText").innerHTML = html;
        const formData = new FormData();
        formData.append("html", html);
        const reply = await printPDFAPI.post("/generate",
            formData
        );
        const myArray = Object.values(reply.data);
        console.log(myArray[1]);
        let url = myArray[1];
        let a = document.createElement("a");
        a.target = "_blank";
        a.href = String(url);
        a.click();
    }

    function getSOAPHTML(){
        let html = soapTemplate;
        html = html.replace("replacepname", patientName);
        html = html.replace("replacedob", dob);
        html = html.replace("replacedoa", new Date().toDateString());
        html = html.replace("replacedname", "Dr. "+username);
        html = html.replace("sText", subjective);
        html = html.replace("pText", plan);
        html = html.replace("oText", objective);
        html = html.replace("rosText", rosText);
        html = html.replace("aText", assessment);
        return html;
    }
    function getClinicalNotesHTML(){
        let newTemplatehtml = newTemplate;
        newTemplatehtml = newTemplatehtml.replace("replacepname", patientName);
        newTemplatehtml = newTemplatehtml.replace("replacedob", dob);
        newTemplatehtml = newTemplatehtml.replace("replacedoa", new Date().toDateString());
        newTemplatehtml = newTemplatehtml.replace("replacedname", "Dr. "+username);
        newTemplatehtml = newTemplatehtml.replace("replaceHeading", "Clinical Notes");
        newTemplatehtml = newTemplatehtml.replace(
            "replaceBody",
            htmlClincalNotes,
        );
        return newTemplatehtml;
    }
    function getPatientInstructionsHTML(){
        let newTemplatehtml = newTemplate;
        newTemplatehtml = newTemplatehtml.replace("replacepname", patientName);
        newTemplatehtml = newTemplatehtml.replace("replacedob", dob);
        newTemplatehtml = newTemplatehtml.replace("replacedoa", new Date().toDateString());
        newTemplatehtml = newTemplatehtml.replace("replacedname", "Dr. "+username);
        newTemplatehtml = newTemplatehtml.replace("replaceHeading", "Patient Instructions");
        newTemplatehtml = newTemplatehtml.replace(
            "replaceBody",
            htmlPatientInstructions,
        );
        return newTemplatehtml;
    }
    function getDetailedReportHTML(){
        let newTemplatehtml = newTemplate;
        newTemplatehtml = newTemplatehtml.replace("replacepname", patientName);
        newTemplatehtml = newTemplatehtml.replace("replacedob", dob);
        newTemplatehtml = newTemplatehtml.replace("replacedoa", new Date().toDateString());
        newTemplatehtml = newTemplatehtml.replace("replacedname", "Dr. "+username);
        newTemplatehtml = newTemplatehtml.replace("replaceHeading", "Detailed Report");
        newTemplatehtml = newTemplatehtml.replace(
            "replaceBody",
            htmlDetailedReport,
        );
        return newTemplatehtml;
    }
    async function viewDetailedReport() {
        let newTemplatehtml = newTemplate;
        newTemplatehtml = newTemplatehtml.replace("replacepname", patientName);
        newTemplatehtml = newTemplatehtml.replace("replacedob", dob);
        newTemplatehtml = newTemplatehtml.replace("replacedoa", new Date().toDateString());
        newTemplatehtml = newTemplatehtml.replace("replacedname", "Dr. "+username);
        newTemplatehtml = newTemplatehtml.replace("replaceHeading", "Detailed Report");
        newTemplatehtml = newTemplatehtml.replace(
            "replaceBody",
            htmlDetailedReport,
        );     
        document.getElementById("pdfText").innerHTML = "";
        document.getElementById("newFormatText").innerHTML = newTemplatehtml;
        document.getElementById("detailedContent").innerHTML = newTemplatehtml;
       const formData = new FormData();
        formData.append("html", newTemplatehtml);
        const reply = await printPDFAPI.post("/generate",
            formData
        );
        const array = Object.values(reply.data);
        console.log(array[1]);
        let url = array[1];
        let a = document.createElement("a");
        a.target = "_blank";
        a.href = String(url);
        a.click();
    }


    async function viewClinicalNotes() {
        let newTemplatehtml = newTemplate;
        newTemplatehtml = newTemplatehtml.replace("replacepname", patientName);
        newTemplatehtml = newTemplatehtml.replace("replacedob", dob);
        newTemplatehtml = newTemplatehtml.replace("replacedoa", new Date().toDateString());
        newTemplatehtml = newTemplatehtml.replace("replacedname", "Dr. "+username);
        newTemplatehtml = newTemplatehtml.replace("replaceHeading", "Clinical Notes");
        newTemplatehtml = newTemplatehtml.replace("replaceBody",htmlClincalNotes,);
        
        document.getElementById("pdfText").innerHTML = "";
        document.getElementById("newFormatText").innerHTML = newTemplatehtml;
        document.getElementById("clinicalNotesContent").innerHTML = newTemplatehtml;
        
       const formData = new FormData();
        formData.append("html", newTemplatehtml);
        const reply = await printPDFAPI.post("/generate",
            formData
        );
        const array = Object.values(reply.data);
        console.log(array[1]);
        let url = array[1];
        let a = document.createElement("a");
        a.target = "_blank";
        a.href = String(url);
        a.click();
    }

    async function viewPatientInstruction() {
        let newTemplatehtml = newTemplate;
        newTemplatehtml = newTemplatehtml.replace("replacepname", patientName);
        newTemplatehtml = newTemplatehtml.replace("replacedob", dob);
        newTemplatehtml = newTemplatehtml.replace("replacedoa", new Date().toDateString());
        newTemplatehtml = newTemplatehtml.replace("replacedname", "Dr. "+username);
        newTemplatehtml = newTemplatehtml.replace("replaceHeading", "Patient Instructions");
        newTemplatehtml = newTemplatehtml.replace("replaceBody",htmlPatientInstructions);
        
        document.getElementById("pdfText").innerHTML = "";
        document.getElementById("newFormatText").innerHTML = newTemplatehtml;
        document.getElementById("patientInstructionsContent").innerHTML = newTemplatehtml;
        const formData = new FormData();
        formData.append("html", newTemplatehtml);
        const reply = await printPDFAPI.post("/generate",
            formData
        );
        const array = Object.values(reply.data);
        console.log(array[1]);
        let url = array[1];
        let a = document.createElement("a");
        a.target = "_blank";
        a.href = String(url);
        a.click();
    }
    function createFHIR() {
        console.log("createFHIR --> ");
        const a = document.getElementById("downloadBtn");
        const d = new Date();
        let time = d.getTime();
        var fileContent = JSON.stringify(jsonResponse);
        var fileName = patientName + "_" + time + ".txt";

        const blob = new Blob([fileContent], { type: "text/plain" });
        a.setAttribute("download", fileName);
        a.setAttribute("href", window.URL.createObjectURL(blob));
    }
</script>
<!-- Bootstrap CSS -->
<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
/>
<!-- Custome Class -->
<link rel="stylesheet" href="style.css" />
<mb-form id="form">
    <mb-context path="problem_list_v2/category" />
    <mb-context path="problem_list_v2/context/start_time" />
    <mb-context path="problem_list_v2/context/setting" />
    <div class="rightSection">
        <div class="rightBodySection">
            <div class="row">
                <div class="col-12 padding-0">
                    <section class="pageHeadSection">
                        Validate & Save Encounter
                        <p style="float:right; vertical-align: top;">
                            View Review of System<a
                                href="# "
                                data-bs-toggle="modal"
                                data-bs-target="#review-edit"
                            >
                                <i class="bi bi-pencil-square" /></a
                            >
                        </p>
                    </section>
                    <!-- main body section -->
                    <section class="mainBody">
                        <div class="row">
                            <div class="col-12 mb-3">
                                <div class="encounters-info mb-2">
                                    <p>{patientName} (DOB {dob})</p>
                                    {#if consent.includes("not")}
                                        <p style="color:red;">
                                            <i class="bi bi-x-square-fill"></i>
                                            &nbsp;{consent}
                                        </p>
                                    {/if}
                                    {#if !consent.includes("not")}
                                        <p style="color:green;">
                                            <i class="bi bi-check-square-fill"
                                            ></i>
                                            &nbsp;{consent}
                                        </p>
                                    {/if}
                                    <p>EHR ID: {ehrId}</p>
                                </div>
                            
                                <ul class="nav nav-pills nav-justified" role="tablist">
                                    <li class="nav-item" role="presentation">
                                      <a class="nav-link active" id="justified-tab-0" data-bs-toggle="tab" href="#justified-tabpanel-0" role="tab" aria-controls="justified-tabpanel-0" aria-selected="true"> SOAP Notes </a>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                      <a class="nav-link" id="justified-tab-1" data-bs-toggle="tab" href="#justified-tabpanel-1" role="tab" aria-controls="justified-tabpanel-1" aria-selected="false"> Detailed Report </a>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                      <a class="nav-link" id="justified-tab-2" data-bs-toggle="tab" href="#justified-tabpanel-2" role="tab" aria-controls="justified-tabpanel-2" aria-selected="false"> Clinical Notes </a>
                                    </li>
                                    <!-- <li class="nav-item" role="presentation">
                                        <a class="nav-link" id="justified-tab-3" data-bs-toggle="tab" href="#justified-tabpanel-3" role="tab" aria-controls="justified-tabpanel-3" aria-selected="false"> Patient Instructions </a>
                                      </li> -->
                                  </ul>
   
                                  <div class="recPatient-text">
                                    <span style="float:right; margin-right:10px; margin-top:4px; color:black; font-weight: bold;">
                                    <a style="color:black; font-weight: bold;  cursor: pointer;"
                                        id="downloadBtn"
                                        on:click={createFHIR}
                                        >Generate JSON <i class="bi bi-filetype-json"></i></a> &nbsp;&nbsp;&nbsp;&nbsp;
                                    <mb-submit style="color:black; font-weight: bold;">
                                            <button style="color:green; font-weight: bold; cursor: pointer;">Submit [EHR] <i class="bi bi-hospital"></i></button>
                                        </mb-submit>
                                    </span>
                                  <div class="tab-content pt-5" id="tab-content">
                                    
                                    <div class="tab-pane active" id="justified-tabpanel-0" role="tabpanel" aria-labelledby="justified-tab-0">
                                        
                                    <a style="vertical-align: top;float:right;color:red; font-weight: bold;  cursor: pointer;"
                                    id="downloadBtn1"
                                    on:click={downloadFile}>Generate PDF <i class="bi bi-file-pdf-fill"></i></a>
                                        <mb-input
                                        textarea="true"
                                        style="height:auto;font-weight:bold;"
                                        path="problem_list_v2/problem_diagnosis/subjective_problem_diagnosis"
                                        label="Subjective: Problem/Diagnosis"
                                    />
                                    <mb-input
                                        textarea="true"
                                        style="height:auto;font-weight:bold;"
                                        path="problem_list_v2/problem_diagnosis/objective_clinical_description"
                                        label="Objective: Clinical Description"
                                    />

                                    <mb-input
                                        textarea="true"
                                        style="height:auto;font-weight:bold;"
                                        path="problem_list_v2/problem_diagnosis/assessment_comments"
                                        label="Assessment: Comments"
                                    />
                                    <mb-input
                                        textarea="true"
                                        style="height:auto;font-weight:bold;"
                                        path="problem_list_v2/problem_diagnosis/plan_course_description"
                                        label="Plan: Course Description"
                                    />
                                    <mb-input
                                        textarea="true"
                                        style="height:auto;font-weight:bold; display:none;"
                                        path="problem_list_v2/problem_diagnosis/review_of_system:0"
                                        label="Review of System"
                                    ></mb-input>
                                    <br/>
                                    <b>Review of System</b>
                                    <div id="reviewofsystem">

                                    </div>

                                    <mb-input
                                        textarea="true"
                                        style="height:auto;font-weight:bold;display:none;"
                                        path="problem_list_v2/problem_diagnosis/doctor_s_notes:0/doctor_s_notes:0"
                                        label="Doctor's Notes [Free Text]"
                                    ></mb-input>

                                    </div>
                                    <div class="tab-pane" id="justified-tabpanel-1" role="tabpanel" aria-labelledby="justified-tab-1">
                                        <!-- <h3>Detailed Report <button id="downloadDetailedPDF" type="submit" class="downbtn" style="background-color: rgb(24 40 59);border: 0px;color: white;"><i class="fas fa-file-pdf"></i></button></h3> -->
                                        <a style="vertical-align: top;float:right;color:red; font-weight: bold; cursor: pointer;"
                                            id="downloadBtn1"
                                            on:click={viewDetailedReport}
                                            >Generate PDF <i class="bi bi-file-pdf-fill"></i></a>
                                                
                                        <div id="detailedContent"></div>
                                      <br/><br/>

                                    </div>
                                    <div class="tab-pane" id="justified-tabpanel-2" role="tabpanel" aria-labelledby="justified-tab-2">
                                        <a style="vertical-align: top;float:right;color:red; font-weight: bold; cursor: pointer;"
                                        id="downloadBtn1"
                                        on:click={viewClinicalNotes}
                                        >Generate PDF <i class="bi bi-file-pdf-fill"></i></a>
                                        <!-- <h3>Clinical Notes <button id="downloadClinicalPDF" type="submit" class="downbtn" style="background-color: rgb(24 40 59);border: 0px;color: white;"><i class="fas fa-file-pdf"></i></button></h3> -->
                                        <div id="clinicalNotesContent"></div>
                                        <br/><br/>
                                    </div>
                                    <div class="tab-pane" id="justified-tabpanel-3" role="tabpanel" aria-labelledby="justified-tab-2">
                                        <a style="vertical-align: top;float:right;color:red; font-weight: bold; cursor: pointer;"
                                        id="downloadBtn1"
                                        on:click={viewPatientInstruction}
                                        >Generate PDF <i class="bi bi-file-pdf-fill"></i></a>
                                        <!-- <h3>Clinical Notes <button id="downloadClinicalPDF" type="submit" class="downbtn" style="background-color: rgb(24 40 59);border: 0px;color: white;"><i class="fas fa-file-pdf"></i></button></h3> -->
                                        <div id="patientInstructionsContent"></div>
                                        <br/><br/>
                                    </div>
                                  </div>


                                  <mb-submit class="mt-4">
                                    <button
                                        class="btn custome-btn"
                                        data-bs-toggle="modal"
                                        data-bs-target="#validate-modal"
                                        >Validate and Submit to EHR</button
                                    >
                                </mb-submit>

                                    
                                    </div>
                    
                            </div>
                            <div class="col-12 mb-3 d-flex justify-content-end">
                                </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
    <mb-context path="problem_list_v2/problem_diagnosis/subject" />
    <mb-context path="problem_list_v2/problem_diagnosis/language" />
    <mb-context path="problem_list_v2/problem_diagnosis/encoding" />
    <mb-context path="problem_list_v2/composer" />
    <mb-context path="problem_list_v2/language" />
    <mb-context path="problem_list_v2/territory" />
</mb-form>

<div
    class="modal fade custome-modal"
    id="review-edit"
    tabindex="-1"
    aria-hidden="true"
>
    <BasicQuestionsAnswers />
</div>
<div
    class="modal fade custome-modal"
    id="review-pdf"
    tabindex="-1"
    aria-hidden="true"
>
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <!-- <div class="modal-header modal-xl"> -->
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
            >
                <!-- <i class="bi bi-x-circle" /> -->
            </button>
            <!-- </div> -->
            <span id="pdfText" />
            <span id="newFormatText" />
        </div>
    </div>
</div>

<style>
.nav-pills .nav-link.active {
    background-color: #00539f !important;
}
</style>