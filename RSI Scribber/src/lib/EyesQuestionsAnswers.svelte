<script lang="ts">
    import { fhir, ehrbase } from "../fhir";
    import { onMount } from "svelte";
    import { store } from "./localStore";
    let data: any[] = [];
    let finalData: any[] = [];
    let openehr,
        ehrscape,
        username,
        password,
        ehrId,
        patientName,
        dob,
        assessment,
        objective,
        rosText,
        plan,
        subjective,
        jsonResponse,
        jsonStr,
        newassessment,
        appointments,
        chiefcomplaint,
        history,
        newplan,
        prescription,
        vitals;
    onMount(async () => {
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
        } = JSON.parse($store) ?? {});
        console.log("Basic -->", JSON.parse($store));
        var q =
            "select TOP 1 c from EHR e CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.event_summary.v0] WHERE e/ehr_id/value='" +
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
        let c = 0;
        console.log("myArray1 - ", myArray1);
        myArray1.forEach((ele1) => {
            c++;
            if (c == myArray1.length) {
                const myArray2 = Object.values(ele1);
                myArray2.forEach((ele2: any) => {
                    if (typeof ele2 == "object") {
                        if (ele2[0]) {
                            if (ele2[0]._type == "COMPOSITION") {
                                let mapData = new Map();
                                if (ele2[0].content && ele2[0].content[0]) {
                                    let dateArray = ele2[0].content[0].data;
                                    let finalArray = dateArray.events;
                                    console.log("finalArray - ", finalArray);
                                    finalArray.forEach((element) => {
                                        let headerName = element.name.value;
                                        let item = Object.values(
                                            element.data.items,
                                        );
                                        item.forEach((itm) => {
                                            let key = itm.name.value;
                                            let val;
                                            if (itm.value) {
                                                val = itm.value.value;
                                            } else {
                                                val = "";
                                            }
                                            mapData.set(key, val);
                                        });
                                    });

                                    finalData.push(mapData);
                                }
                            }
                        }
                    }
                });
            }
        });
        console.log("finalData -- ", finalData.length);
        finalData.forEach((element) => {
            element.forEach((value, key) => {
                let key1 = key;
                key1 = key1.toLowerCase().replaceAll(/\s/g, "");
                key1 = key1.replaceAll(/[^a-zA-Z0-9]/g, "");

                if (document.getElementById(key1)) {
                    console.log("key1 -- ", key1);
                    document
                        .getElementById(key1)
                        .setAttribute("checked", "checked"); //check
                    document.getElementById(key1).parentElement.style.display =
                        "block";
                }
            });
        });
    });
</script>

<div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Review of System</h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
            >
                <i class="bi bi-x-circle-fill" />
            </button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-4">
                    <div class="revSystem-list mb-3">
                        <h4>Are you bothered by any of the following?</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="headaches"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="headaches"
                                    >
                                        Headaches
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="doublevision"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="doublevision"
                                    >
                                        Double Vision
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="dryburningeyes"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="dryburningeyes"
                                    >
                                        Dry/ Burning Eyes
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="itchyeyesduetoseasonalallergies"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="itchyeyesduetoseasonalallergies"
                                    >
                                        Itchy Eyes due to Seasonal Allergies
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="sensitivitytolight"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="sensitivitytolight"
                                    >
                                        Sensitivity to Light
                                    </label>
                                </div>
                            </li>

                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="problemwithglares"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="problemwithglares"
                                    >
                                        Problems with Glares
                                    </label>
                                </div>
                            </li>

                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="floatersflashesoflight"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="floatersflashesoflight"
                                    >
                                        Floaters/ Flashes of Light
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="otherkindsofdiscomfortswithyoureyes"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="otherkindsofdiscomfortswithyoureyes"
                                    >
                                        Other Kinds of Discomforts with your
                                        Eyes
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div class="revSystem-list mb-3">
                        <h4>Does anyone in your immediate family have:</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="glaucomas"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="glaucomas"
                                    >
                                        Glaucomas
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="diabetes"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="diabetes"
                                    >
                                        Diabetes
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="cataracts"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="cataracts"
                                    >
                                        Cataracts
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="degeneration"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="degeneration"
                                    >
                                        Macular Degeneration
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="sensitivitytolight"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="sensitivitytolight"
                                    >
                                        Sensitivity to Light
                                    </label>
                                </div>
                            </li>

                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="problemwithglares"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="problemwithglares"
                                    >
                                        Problems with Glares
                                    </label>
                                </div>
                            </li>

                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="floatersflashesoflight"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="floatersflashesoflight"
                                    >
                                        Floaters/ Flashes of Light
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="otherkindsofdiscomfortswithyoureyes"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="otherkindsofdiscomfortswithyoureyes"
                                    >
                                        Other Kinds of Discomforts with your
                                        Eyes
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="revSystem-list mb-3">
                        <h4>Please answer the following questions:</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="doyouhavemorethanonepairofcurrentglasses"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="doyouhavemorethanonepairofcurrentglasses"
                                    >
                                    Do you have more than one pair of current glasses?
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="doyouplantolookfornewglassestoday"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="doyouplantolookfornewglassestoday"
                                    >
                                    Do you plan to look for new glasses today?
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="doyoureyesgettiredafterworkingonacomputer"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="doyoureyesgettiredafterworkingonacomputer"
                                    >
                                    Do your eyes get tired after working on a computer?
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="doyouindulgeinanysportsorhobbieswhereyoueyesrequirespecialprotection"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="doyouindulgeinanysportsorhobbieswhereyoueyesrequirespecialprotection"
                                    >
                                    Do you indulge in any sports or hobbies where you eyes require special protection?
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="ifyouwearcontactsareyousatisfiedwithvisionorcomfort"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="ifyouwearcontactsareyousatisfiedwithvisionorcomfort"
                                    >
                                    If you wear contacts, are you satisfied with vision or comfort?
                                    </label>
                                </div>
                            </li>

                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="doyouspendalotoftimeoutdoors"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="doyouspendalotoftimeoutdoors"
                                    >
                                    Do you spend a lot of time out doors?
                                    </label>
                                </div>
                            </li>

                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="aretheretimeswhenyouwouldrathernotwearglasses"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="aretheretimeswhenyouwouldrathernotwearglasses"
                                    >
                                    Are there times when you would rather not wear glasses?
                                    </label>
                                </div>
                            </li>
                        
                        </ul>
                    </div>

                    <div class="revSystem-list mb-3">
                        <h4>
                            Do you have or have had any of the following eye
                            problems:
                        </h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="glaucoma"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="glaucoma"
                                    >
                                        Glaucoma
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="cataract"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="cataract"
                                    >
                                    Cataract
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="macular_degeneration"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="macular_degeneration"
                                    >
                                    Macular Degeneration
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="eyesurgeryinjury"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="eyesurgeryinjury"
                                    >
                                    Eye surgery/ injury
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="lazyeyeeyeturn"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="lazyeyeeyeturn"
                                    >
                                    Lazy eye/ Eye turn
                                    </label>
                                </div>
                            </li>

                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="othereyediseases"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="othereyediseases"
                                    >
                                    Other eye diseases
                                    </label>
                                </div>
                            </li>

                           
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
