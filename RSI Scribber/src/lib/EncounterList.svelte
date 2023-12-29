<script lang="ts">
    import { fhir, ehrbase, printPDFAPI } from "../fhir";
    import { onMount } from "svelte";
    import { store } from "./localStore";
    import { jsPDF } from "jspdf";
    let data: any[] = [];
    let data2: any[] = [];
    let finalData: any[] = [];
    var coll;
    var i;
    let openehr, ehrscape, username, password, ehrId, patientName, dob;
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
        } = JSON.parse($store) ?? {});
        async function generatePDF(id){
                const formData = new FormData();
                console.log(document.getElementById(id).innerHTML);
                formData.append("html", document.getElementById(id).innerHTML);
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
        console.log(JSON.parse($store));
        var q =
            "select c from EHR e CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.problem_list.v2] WHERE e/ehr_id/value='" +
            ehrId +
            "' order by c/context/start_time/value DESC";
        console.log(" q = ", q);
        var query = { q: q };
        const r = await ehrbase.post("/query/aql", JSON.stringify(query), {
            headers: {
                "Content-Type": "application/json",
            },
        });

        data = r.data?.rows[0];
        const myArray1 = Object.values(r.data);
        console.log("myArray1  --> ", myArray1);

        var newHTML = "";
        let heading;
        let count = 0;
        myArray1.forEach((ele1) => {
            const myArray2 = Object.values(ele1);
            myArray2.forEach((ele2: any) => {
                if (typeof ele2 == "object") {
                    if (ele2[0]) {
                        console.log("ele2[0]  --> ", ele2[0]);
                        if (ele2[0]._type == "COMPOSITION") {
                            count++;
                            let mapData = new Map();
                            let finalArray = ele2[0].content[0].data.items;
                            heading = ele2[0].context.start_time.value;
                            let date = new Date(heading);
                            const day = date.toLocaleString("default", {
                                day: "2-digit",
                            });
                            const month = date.toLocaleString("default", {
                                month: "2-digit",
                            });
                            const year = date.toLocaleString("default", {
                                year: "numeric",
                            });
                            const time = date.toLocaleTimeString();

                            heading =
                                year + "-" + month + "-" + day + " " + time;
                            if (count == 1) {
                                newHTML =
                                    newHTML +
                                    '<H2 class="collapsible active rounded-3"><span class="col-xs-4 text-left">' +
                                    heading +
                                    '</span><span style="float: right;"><i class="bi bi-file-minus"></i></span></H2><div class="content" style="display:block;">';
                            } else {
                                newHTML =
                                    newHTML +
                                    '<H2 class="collapsible rounded-3"><span class="col-xs-4 text-left">' +
                                    heading +
                                    '</span><span style="float: right;"><i class="bi bi-file-plus"></i></span></H2><div class="content" >';
                            }
                            var id1="divId"+count;
                            var id2="soapId"+count;
                            var id3="detailedId"+count;
                            var hidden="hidden"+count;
                            var htmlId1="htmlId"+count;
                            var htmlId2="htmlId"+count;
                            var htmlId3="htmlId"+count;
                            newHTML = newHTML + '<div> <a class="mt-4 btn custome-btn" data-bs-toggle="modal" data-bs-target="#'+id1+'" onclick=generatePDF("'+htmlId1+'")>Generate SOAP PDF</a><a class="mt-4 btn custome-btn" data-bs-toggle="modal" data-bs-target="#'+id2+'" onclick=generatePDF("'+htmlId2+'")>Generate Detailed Report</a><a class="mt-4 btn custome-btn" data-bs-toggle="modal" data-bs-target="#'+id3+'" onclick=generatePDF("'+htmlId3+'")>Generate Clinical Notes</a></div>';
                            newHTML = newHTML + '<div class="recPatient-text">';
                            finalArray.forEach((element) => {
                                let key = element.name.value;
                                console.log("key ---->", key);
                                if (key =="Doctor's Notes") {
                                    console.log(element);
                                    let val = element.items[0].value.value;
                                    var html1="<DIV>SOAP Notes not Available</DIV>";
                                    var html2="<DIV>Detailed Report not Available</DIV>";
                                    var html3="<DIV>Clinical Notes not Available</DIV>";
                                    if(val && val.indexOf("BREAKHTML")!= -1){
                                        let arr = val.split("BREAKHTML")
                                        if(arr[0])
                                            html1 = arr[0];
                                        if(arr[1])
                                            html2 = arr[1];
                                        if(arr[2])
                                            html3 = arr[2];
                                        else{
                                            html3 = arr[1];
                                            html2 = "<DIV>Detailed Report not Available</DIV>";
                                        }
                                       
                                    }
                                    newHTML = newHTML+ '<div class="modal fade custome-modal" id="'+id1+'" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-xl"><div class="modal-content"><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button><span id="'+htmlId1+'">'+html1+'</span></div></div></div>';
                                    newHTML = newHTML+ '<div class="modal fade custome-modal" id="'+id2+'" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-xl"><div class="modal-content"><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button><span id="'+htmlId2+'">'+html2+'</span></div></div></div>';
                                    newHTML = newHTML+ '<div class="modal fade custome-modal" id="'+id3+'" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-xl"><div class="modal-content"><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button><span id="'+htmlId3+'">'+html3+'</span></div></div></div>';
                                    
                                }
                                else 
                                if (
                                    (key! =
                                        "Course description" &&
                                        key != "Diagnostic certainty" &&
                                        key != "Date/time of onset" &&
                                        key != "Cause" &&
                                        key != "Severity" 
                                        //&& key != "Doctor's Notes"
                                        )
                                ) {
                                    console.log("element =====",element);
                                    let val = element.value.value;
                                    val = val.replaceAll("\n", "<li>");
                                    newHTML =
                                        newHTML +
                                        "<h3>" +
                                        element.name.value +
                                        "</h3>";
                                    newHTML =
                                        newHTML +
                                        "<div><p>" +
                                        val +
                                        "</p></div>";
                                    mapData.set(
                                        element.name.value,
                                        element.value.value
                                    );
                                }
                            });
                            newHTML = newHTML + "</div></div>";
                            finalData.push(mapData);
                        }
                    }
                }
            });
        });
        document.getElementById("replaceDiv").innerHTML = newHTML;
 
        coll = document.getElementsByClassName("collapsible");
        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var innerHtml = this.innerHTML;
                if (innerHtml.indexOf("plus") != -1) {
                    innerHtml = innerHtml.replace("plus", "minus");
                } else if (innerHtml.indexOf("minus") != -1) {
                    innerHtml = innerHtml.replace("minus", "plus");
                }
                this.innerHTML = innerHtml;
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }
    });
    function splitText(text){
        console.log(typeof(text))
        if(text){
            text = String(text);
            console.log("text = ", text);
            text = text.replaceAll(',-','<br/>')
            text = text.replaceAll('- ','')
            console.log("text after = ", text);
        }
        return text;
    }
    function splitTextForSOAP(text){
        console.log(typeof(text))
        if(text){
            text = String(text);
            console.log("text = ", text);
            text = text.replaceAll(',-','\n')
            text = text.replaceAll('- ','')
            console.log("text after = ", text);
        }
        return text;
    }
function showSOAP(count){
    count =  count.trim();
    alert(count);
    alert(document.getElementById("hidden"+count).innerText);
}

function showDetailed(count){
    count =  count.trim();
    alert(document.getElementById("hidden"+count).innerText);
}
function downloadFile(subjective, plan, objective, rosText, assessment) {
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
        //html = html.replace("oText", objective+ "<br>"+rosText);
        html = html.replace("aText", assessment);
        //html = html.replace("rosText", rosText);
        // document.getElementById("newFormatText").innerHTML = "";
        // document.getElementById("pdfText").innerHTML = html;
        //alertFunc();
        //let timeout = setTimeout(alertFunc, 2000);
    }
    function viewDetailedReport(appointments, newassessment, chiefcomplaint, newplan, prescription, vitals) {
        let newTemplatehtml = newTemplate;
        newTemplatehtml = newTemplatehtml.replace("replacepname", patientName);
        newTemplatehtml = newTemplatehtml.replace("replacedob", dob);
        newTemplatehtml = newTemplatehtml.replace("replacedoa", new Date().toDateString());
        newTemplatehtml = newTemplatehtml.replace("replacedname", "Dr. "+username);
        newTemplatehtml = newTemplatehtml.replace(
            "appointmentsTxt",
            appointments,
        );
        newTemplatehtml = newTemplatehtml.replace(
            "assessmentTxt",
            newassessment,
        );
        newTemplatehtml = newTemplatehtml.replace(
            "chiefcomplaintTxt",
            chiefcomplaint,
        );
        newTemplatehtml = newTemplatehtml.replace("historyTxt", history);
        const myArray = newplan.split("::::");
        newTemplatehtml = newTemplatehtml.replace("planTxt", myArray[0]);
        newTemplatehtml = newTemplatehtml.replace("icdCodesTxt", myArray[1]);
        newTemplatehtml = newTemplatehtml.replace(
            "prescriptionTxt",
            prescription,
        );
        newTemplatehtml = newTemplatehtml.replace("vitalsTxt", vitals);
        // alert(newTemplatehtml);
        //html = html.replace("rosText", rosText);
        document.getElementById("pdfText").innerHTML = "";
        document.getElementById("newFormatText").innerHTML = newTemplatehtml;
        //alertFunc();
        //let timeout = setTimeout(generateDetailedPDF, 2000);
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
        const d = new Date();
        let time = d.getTime();
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
                <section class="pageHeadSection">Encounter List</section>

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
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>
