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
    import { jsPDF } from "jspdf";
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
        htmlClincalNotes;
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
        } = JSON.parse($store) ?? {});
        console.log(JSON.parse($store));
        console.log("assessment --->", assessment);
        console.log("objective --->", objective);
        console.log("plan --->", plan);
        console.log("subjective --->", subjective);
        console.log("jsonResponse --->", jsonResponse);
        var form = document.getElementById("form");
        let obj = rosText;

        if (objective != "") {
            consent =
                "The patient has provided consent to record the encounter.";
        }
        // obj = obj.replaceAll("<li>", "\n");
        // obj = obj.replaceAll("<b>", "");
        // obj = obj.replaceAll("</b>", "");
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
        var v1 = getSOAPHTML()+"BREAKHTML"+getDetailedReportHTML()+"BREAKHTML"+getClinicalNotesHTML();
        let obj = rosText;

        if (objective != "") {
            consent =
                "The patient has provided consent to record the encounter.";
        }
        // obj = obj.replaceAll("<li>", "\n");
        // obj = obj.replaceAll("<b>", "");
        // obj = obj.replaceAll("</b>", "");
        console.log(obj);
        document.getElementById("detailedContent").innerHTML = getDetailedReportHTML();
        document.getElementById("clinicalNotesContent").innerHTML = getClinicalNotesHTML();
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
        //alert(soapTemplate);
        var freeText = "";
        // var form = document.getElementById("form");
        // const formInput = form.querySelectorAll("input");
        // console.log("element");
        // formInput.forEach(element => {
        //     console.log(element);
        // });
        // // form.import({
        // //     freeText = $0.value;
        // // });
        html = html.replace("replacepname", patientName);
        html = html.replace("replacedob", dob);
        html = html.replace("replacedoa", new Date().toDateString());
        html = html.replace("replacedname", "Dr. "+username);
        html = html.replace("sText", subjective);
        html = html.replace("pText", plan);
        html = html.replace("oText", objective);
        html = html.replace("rosText", rosText);
        html = html.replace("freeText", freeText);
        //html = html.replace("oText", objective+ "<br>"+rosText);
        html = html.replace("aText", assessment);
        //html = html.replace("rosText", rosText);
        document.getElementById("newFormatText").innerHTML = "";
        document.getElementById("pdfText").innerHTML = html;
        //alertFunc();
        //let timeout = setTimeout(alertFunc, 2000);
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
    //     //alertFunc();
    //    // let timeout = setTimeout(generateDetailedPDF, 2000);
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
        newTemplatehtml = newTemplatehtml.replace(
            "replaceBody",
            htmlClincalNotes,
        );
        
        document.getElementById("pdfText").innerHTML = "";
        document.getElementById("newFormatText").innerHTML = newTemplatehtml;
        document.getElementById("clinicalNotesContent").innerHTML = newTemplatehtml;
    //     //alertFunc();
    //    // let timeout = setTimeout(generateDetailedPDF, 2000);
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
    function addWaterMark(doc) {
        var totalPages = doc.internal.getNumberOfPages();

        for (var i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            //doc.addImage(imgData, 'PNG', 40, 40, 75, 75);
            doc.setTextColor(150);
            doc.text(
                doc.internal.pageSize.width - 150,
                20,
                "RSystems AutoScribe Tool",
            );
            // doc.text(50, doc.internal.pageSize.height - 30, 'RSystems AutoScribe Tool');
        }

        return doc;
    }
    function alertFunc() {
        //document.getElementById("pdfText").style.display="none";
        const d = new Date();
        let time = d.getTime();
        var fileContent = JSON.stringify(jsonResponse);
        var fileName = "SOAP_Notes"+patientName + "_" + time + ".pdf";
        var a4 = [595.28, 841.89]; // for a4 size paper width and height
        var pdf = new jsPDF({
            unit: "pt",
            format: "a4",
            orientation: "p",
        });
        // var pdf = new jsPDF("p", "pt", "letter");

        pdf.html(document.getElementById("pdfText").innerHTML, {
            callback: (pdf) => {
                // let c = pdf.canvas
                // var ctx = c.getContext('2d');
                // ctx.fillRect(0, 0, 1000, 700);
                pdf.deletePage(1);
                pdf = addWaterMark(pdf);
                pdf.save(fileName);
            },
            margin: [30, 5, 5, 5],
            autoPaging: "text",
            x: 0,
            y: 0,
            width: 595, //target width in the PDF document
            windowWidth: 595, //window width in CSS pixels
        });
    }

    function generateDetailedPDF() {
        //document.getElementById("pdfText").style.display="none";
        const d = new Date();
        let time = d.getTime();
        var fileContent = JSON.stringify(jsonResponse);
        var fileName = "Detailed_Report"+patientName + "_" + time + ".pdf";
        var a4 = [595.28, 841.89]; // for a4 size paper width and height
        var pdf = new jsPDF({
            unit: "pt",
            format: "a4",
            orientation: "p",
        });
        // var pdf = new jsPDF("p", "pt", "letter");

        pdf.html(document.getElementById("newFormatText").innerHTML, {
            callback: (pdf) => {
                // let c = pdf.canvas
                // var ctx = c.getContext('2d');
                // ctx.fillRect(0, 0, 1000, 700);
                // pdf.deletePage(1);
                // pdf.deletePage(2);
                pdf = addWaterMark(pdf);
                pdf.save(fileName);
            },
            margin: [5, 5, 5, 5],
            autoPaging: "text",
            x: 0,
            y: 0,
            width: 595, //target width in the PDF document
            windowWidth: 595, //window width in CSS pixels
        });
    }
    function createFHIR() {
        console.log("createFHIR --> ");
        const a = document.getElementById("downloadBtn");
        const d = new Date();
        let time = d.getTime();
        var fileContent = JSON.stringify(jsonResponse);
        var fileName = patientName + "_" + time + ".txt";

        const blob = new Blob([fileContent], { type: "text/plain" });
        //const a = document.createElement('a');
        a.setAttribute("download", fileName);
        a.setAttribute("href", window.URL.createObjectURL(blob));
        //a.click();
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
                        <p  style="vertical-align: top; float: right;">
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
                                  </ul>
   
                                  <div class="recPatient-text">
                                    <span style="float:right; margin-right:10px; margin-top:4px; color:black; font-weight: bold;">
                                    <a style="color:black; font-weight: bold;"
                                        id="downloadBtn"
                                        on:click={createFHIR}
                                        >Generate JSON <i class="bi bi-filetype-json"></i></a> &nbsp;&nbsp;&nbsp;&nbsp;
                                        <mb-submit style="color:black; font-weight: bold;">
                                            <button style="color:green; font-weight: bold;">Submit [EHR] <i class="bi bi-hospital"></i></button>
                                        </mb-submit>
                                    </span>
                                  <div class="tab-content pt-5" id="tab-content">
                                    
                                    <div class="tab-pane active" id="justified-tabpanel-0" role="tabpanel" aria-labelledby="justified-tab-0">
                                        
                                    <a style="vertical-align: top;float:right;color:red; font-weight: bold;"
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
                                    <!-- <mb-input
                                        textarea="true"
                                        style="height:auto;font-weight:bold;"
                                        id="freeText"
                                        label="Doctor Notes (Free Text)"
                                    /> -->

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
                                        <a style="vertical-align: top;float:right;color:red; font-weight: bold;"
                                            id="downloadBtn1"
                                            on:click={viewDetailedReport}
                                            >Generate PDF <i class="bi bi-file-pdf-fill"></i></a>
                                                
                                        <div id="detailedContent"></div>
                                      <br/><br/>

                                    </div>
                                    <div class="tab-pane" id="justified-tabpanel-2" role="tabpanel" aria-labelledby="justified-tab-2">
                                        <a style="vertical-align: top;float:right;color:red; font-weight: bold;"
                                        id="downloadBtn1"
                                        on:click={viewClinicalNotes}
                                        >Generate PDF <i class="bi bi-file-pdf-fill"></i></a>
                                        <!-- <h3>Clinical Notes <button id="downloadClinicalPDF" type="submit" class="downbtn" style="background-color: rgb(24 40 59);border: 0px;color: white;"><i class="fas fa-file-pdf"></i></button></h3> -->
                                        <div id="clinicalNotesContent"></div>
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
                              <!--   <a
                                    id="downloadBtnDR"
                                    on:click={viewDetailedReport}
                                    class="mt-4 btn custome-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#review-pdf"
                                    >View Detailed Report</a
                                >
                                <a
                                    id="downloadBtnDR"
                                    on:click={viewClinicalNotes}
                                    class="mt-4 btn custome-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#review-pdf"
                                    >View Clinical Notes</a
                                >

                            </div> -->
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
    .c {
        position: absolute;
        left: 85%;
        top: 2%;
    }
</style>