<script lang="ts">
    import { fhir, ehrbase } from "../fhir";
    import { onMount } from "svelte";
    import { store } from "./localStore";

    let data: any[] = [];
    let data2: any[] = [];
    let finalData: any[] = [];
    var coll;
    var i;
    let openehr, ehrscape, username, password, ehrId, patientName, dob;
    onMount(async () => {
        ({
            openehr = "",
            ehrscape = "",
            username = "",
            password = "",
            ehrId = "",
            patientName = "",
            dob = "",
        } = JSON.parse($store) ?? {});
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
                            newHTML = newHTML + '<div class="recPatient-text">';
                            finalArray.forEach((element) => {
                                let key = element.name.value;
                                console.log("key ---->", key);
                                if (key =="Doctor's Notes") {
                                    console.log(element);
                                    let val = element.items[0].value.value;
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
                                        element.items[0].value.value
                                    );
                                }
                                else if (
                                    (key! =
                                        "Course description" &&
                                        key != "Diagnostic certainty" &&
                                        key != "Date/time of onset" &&
                                        key != "Cause" &&
                                        key != "Severity" 
                                        // && key != "Doctor's Notes"
                                        )
                                ) {
                                    console.log(element);
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
