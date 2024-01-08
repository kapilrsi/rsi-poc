<script lang="ts">
    import { onMount } from "svelte";
    import { store } from "./localStore";
    const urlParams = new URLSearchParams(window.location.search);
    const ehrId = urlParams.get("ehrID");
    console.log("EHR ID = ", ehrId);
    let patientName,
        dob,
        assessment,
        objective,
        plan,
        subjective,
        appointmentId;
    onMount(async () => {
        ({
            patientName = "",
            dob = "",
            assessment = "",
            objective = "",
            plan = "",
            subjective = "",
            appointmentId = "",
        } = JSON.parse($store) ?? {});
        let i;
        let coll = document.getElementsByClassName("collapsible");

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                toggleDivisions(this);
            });
        }
    });
    function toggleDivisions(div) {
        let bool = div.classList.contains("active");
        console.log("calling");
        collapseAllOthers();
        console.log("called");
        console.log(div.classList);
        // console.log(this.classList.contains("active"))
        // if(!this.classList.contains("active"))
        //     this.classList.add("active");
        // else
        //     this.classList.remove("active");
        if (!bool) {
            div.classList.toggle("active");
            var innerHtml = div.innerHTML;
            if (innerHtml.indexOf("plus") != -1) {
                innerHtml = innerHtml.replace("plus", "minus");
            } else if (innerHtml.indexOf("minus") != -1) {
                innerHtml = innerHtml.replace("minus", "plus");
            }
            div.innerHTML = innerHtml;
            var content = div.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        }
    }

    function collapseAllOthers() {
        let i;
        let coll = document.getElementsByClassName("collapsible");
        for (i = 0; i < coll.length; i++) {
            console.log(coll[i].classList.contains("active"));
            //if(coll[i].classList.contains("active")){
            coll[i].classList.remove("active");
            coll[i].innerHTML = coll[i].innerHTML.replace("minus", "plus");
            console.log(coll[i].innerHTML);
            coll[i].nextElementSibling.style.display = "none";
            //break;
            // }
        }
    }
</script>

<!-- Bootstrap CSS -->
<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
/>
<!-- Custome Class -->
<link rel="stylesheet" href="style.css" />
<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
<mb-form>
    <div>
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <section class="pageHeadSection">
                    <h3>Review of System</h3>
                </section>
                <section class="pageHeadSection">
                    <p style="float:left;"><b>{patientName} (DOB {dob})</b></p>
                    <p style="float:right;"><b>EHR ID: {ehrId}</b></p>
                </section>

                <mb-context path="basicquestionnaire/category" />
                <mb-context path="basicquestionnaire/context/start_time" />
                <mb-context path="basicquestionnaire/context/setting" />
                <div class="modal-body">
                    <div class="row">
                        <!-- <div class="accordion mt-5" id="accordionExample"> -->

                        <div class="col-md-4">
                            <h2 class="collapsible active rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left">HEAD</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-minus" /></span
                                >
                            </h2>
                            <div class="content" style="display:block;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/head:0/headaches:0"
                                                label="Headaches"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/head:0/head_injury:0"
                                                label="Head Injury"
                                            />
                                        </div>
                                    </li>
                                </ul>
                                <mb-context
                                    path="basicquestionnaire/symptom_sign_screening_questionnaire/head:0/time"
                                />
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left">EYE</span><span
                                    style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/eyes:0/glasses_or_contacts:0"
                                                label="Glasses or Contacts"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/eyes:0/change_in_vision:0"
                                                label="Change in Vision"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/eyes:0/eye_pain:0"
                                                label="Eye Pain"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/eyes:0/double_vision:0"
                                                label="Double Vision"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/eyes:0/flashing_lights:0"
                                                label="Flashing Lights"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/eyes:0/glaucoma_or_cataract:0"
                                                label="Glaucoma or Cataract"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/eyes:0/last_eye_exam:0"
                                                label="Last Eye Exam"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/eyes:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >MOUTH/THROAT</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/mouth_throat:0/bleeding_gums:0"
                                                label="Bleeding gums"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/mouth_throat:0/sore_tongue:0"
                                                label="Sore tongue"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/mouth_throat:0/sore_throat:0"
                                                label="Sore throat"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/mouth_throat:0/hoarseness:0"
                                                label="Hoarseness"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/mouth_throat:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left">EARS</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/ears:0/ear_pain:0"
                                                label="Ear pain"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/ears:0/ear_discharge:0"
                                                label="Ear discharge"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/ears:0/ringing:0"
                                                label="Ringing"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/ears:0/dizziness:0"
                                                label="Dizziness"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/ears:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >NOSE/SINUSES</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/nose_sinuses:0/nose_bleeds:0"
                                                label="Nose bleeds"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/nose_sinuses:0/nasal_stuffiness:0"
                                                label="Nasal stuffiness"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/nose_sinuses:0/frequent_colds:0"
                                                label="Frequent colds"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/nose_sinuses:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left">NECK</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neck:0/neck_lumps:0"
                                                label="Neck Lumps"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neck:0/swollen_glands:0"
                                                label="Swollen glands"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neck:0/goiter:0"
                                                label="Goiter"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neck:0/stiffness:0"
                                                label="Stiffness"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neck:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left">ALLERGIES</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/allergies:0/hives:0"
                                                label="Hives"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/allergies:0/swelling_of_lips_or_tongue:0"
                                                label="Swelling of lips or tongue"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/allergies:0/hay_fever:0"
                                                label="Hay fever"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/allergies:0/asthma:0"
                                                label="Asthma"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/allergies:0/eczema_sensitive:0"
                                                label="Eczema/Sensitive"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/allergies:0/sensitivity_to_drugs_food_pollens_or_dander:0"
                                                label="Sensitivity to drugs, food, pollens, or dander"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/allergies:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h2
                                class="collapsible rounded-3 shadow-lg col-xs-4"
                            >
                                <span class="col-xs-4 text-left">SKIN</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/skin:0/rashes:0"
                                                label="Rashes"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/skin:0/itching:0"
                                                label="Itching"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/skin:0/change_in_hair_or_nails:0"
                                                label="Change in Hair or Nails"
                                            />
                                        </div>
                                    </li>
                                </ul>
                                <mb-context
                                    path="basicquestionnaire/symptom_sign_screening_questionnaire/skin:0/time"
                                />
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left">ENDOCRINE</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/endocrine:0/abnormal_growth:0"
                                                label="Abnormal growth"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/endocrine:0/increased_appetite:0"
                                                label="Increased appetite"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/endocrine:0/increased_thirst:0"
                                                label="Increased thirst"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/endocrine:0/increased_urine_production:0"
                                                label="Increased urine production"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/endocrine:0/thyroid_trouble:0"
                                                label="Thyroid trouble"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/endocrine:0/heat_cold_intolerance:0"
                                                label="Heat/cold intolerance"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/endocrine:0/excessive_sweating:0"
                                                label="Excessive sweating"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/endocrine:0/diabetes:0"
                                                label="Diabetes"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/endocrine:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >GASROINTESTINAL</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/change_of_appetite_or_weight:0"
                                                label="Change of appetite or Weight"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/problem_swallowing:0"
                                                label="Problem swallowing"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/nausea:0"
                                                label="Nausea"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/heartburn:0"
                                                label="Heartburn"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/vomiting:0"
                                                label="Vomiting"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/vomiting_blood:0"
                                                label="Vomiting blood"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/constipation:0"
                                                label="Constipation"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/diarrhea:0"
                                                label="Diarrhea"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/change_in_bowel_habits:0"
                                                label="Change in bowel habits"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/abdominal_pain:0"
                                                label="Abdominal pain"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/excessive_belching:0"
                                                label="Excessive belching"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/excessive_flatus:0"
                                                label="Excessive flatus"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/yellow_color_of_skin_jaundice_hepatitis:0"
                                                label="Yellow color of skin (jaundice/hepatitis)"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/food_intolerance:0"
                                                label="Food intolerance"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/rectal_bleeding_hemorrhoids:0"
                                                label="Rectal bleeding/ Hemorrhoids"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/gasrointestinal:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >RESPIRATORY/CARDIAC</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/shortness_of_breath:0"
                                                label="Shortness of breath"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/cough:0"
                                                label="Cough"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/production_of_phlegm_color:0"
                                                label="Production of phlegm, color"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/wheezing:0"
                                                label="Wheezing"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/coughing_up_blood:0"
                                                label="Coughing up blood"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/chest_pain:0"
                                                label="Chest Pain"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/fever:0"
                                                label="Fever"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/night_sweats:0"
                                                label="Night sweats"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/swelling_in_hands_feet:0"
                                                label="Swelling in hands/feet"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/blue_fingers_toes:0"
                                                label="Blue fingers/toes"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/high_blood_pressure:0"
                                                label="High blood pressure"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/heart_murmur:0"
                                                label="Heart murmur"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/hx_of_heart_medication:0"
                                                label="HX of heart Medication"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/bronchitis_emphysema:0"
                                                label="Bronchitis/emphysema"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/rheumatic_heart_disease:0"
                                                label="Rheumatic heart disease"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/respiratory_cardiac:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >MUSCULOSKELETAL</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/musculoskeletal:0/pain:0"
                                                label="Pain"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/musculoskeletal:0/swelling:0"
                                                label="Swelling"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/musculoskeletal:0/stiffness:0"
                                                label="Stiffness"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/musculoskeletal:0/decreased_joint_motion:0"
                                                label="Decreased joint motion"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/musculoskeletal:0/broken_bone:0"
                                                label="Broken bone"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/musculoskeletal:0/serious_sprains:0"
                                                label="Serious sprains"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/musculoskeletal:0/arthritis:0"
                                                label="Arthritis"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/musculoskeletal:0/gout:0"
                                                label="Gout"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/musculoskeletal:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left">BREAST</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/breast:0/lumps:0"
                                                label="Lumps"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/breast:0/breast_pain:0"
                                                label="Breast Pain"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/breast:0/nipple_discharge:0"
                                                label="Nipple discharge"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/breast:0/bse:0"
                                                label="BSE"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/breast:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >PERIPHERAL VASCULAR</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/peripheral_vascular:0/leg_cramps:0"
                                                label="Leg cramps"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/peripheral_vascular:0/varicose_veins:0"
                                                label="Varicose veins"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/peripheral_vascular:0/clots_in_veins:0"
                                                label="Clots in veins"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/peripheral_vascular:0/decreased_urine_stream:0"
                                                label="Decreased urine stream"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/peripheral_vascular:0/blood_in_urine_uti_stones_prostate_infection:0"
                                                label="Blood in urine UTI/stones/prostate infection"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/peripheral_vascular:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >HEMATOLOGIC</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/hematologic:0/anemia:0"
                                                label="Anemia"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/hematologic:0/easy_bruising_bleeding:0"
                                                label="Easy bruising/bleeding"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/hematologic:0/past_transfusions:0"
                                                label="Past Transfusions"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/hematologic:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left">URINARY</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/urinary:0/difficulty_in_urination:0"
                                                label="Difficulty in urination"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/urinary:0/pain_or_burning_on_urination:0"
                                                label="Pain or burning on urination"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/urinary:0/frequent_urination_at_night:0"
                                                label="Frequent urination at night"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/urinary:0/urgent_need_to_urinate:0"
                                                label="Urgent need to urinate"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/urinary:0/incontinence_of_urine:0"
                                                label="Incontinence of urine"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/urinary:0/dribbling:0"
                                                label="Dribbling"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/urinary:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >NEUROLOGIC</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/headaches:0"
                                                label="Headaches"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/seizures:0"
                                                label="Seizures"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/loss_of_consciousness_fainting:0"
                                                label="Loss of Consciousness/Fainting"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/paralysis:0"
                                                label="Paralysis"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/weakness:0"
                                                label="Weakness"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/loss_of_muscle_size:0"
                                                label="Loss of muscle size"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/muscle_spasm:0"
                                                label="Muscle spasm"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/tremor:0"
                                                label="Tremor"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/involuntary_movement:0"
                                                label="Involuntary movement"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/incoordination:0"
                                                label="Incoordination"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/numbness:0"
                                                label="Numbness"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/feeling_of_pins_and_needles_tingles:0"
                                                label="Feeling of “pins and needles/tingles”"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/neurologic:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >PSYCHIATRIC</span
                                ><span style="float: right;"
                                    ><i class="bi bi-file-plus" /></span
                                >
                            </h2>
                            <div class="content" style="display:none;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/psychiatric:0/tension_anxiety:0"
                                                label="Tension/Anxiety"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/psychiatric:0/depression_suicide_ideation:0"
                                                label="Depression/suicide ideation"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/psychiatric:0/memory_problems:0"
                                                label="Memory problems"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/psychiatric:0/unusual_problems:0"
                                                label="Unusual problems"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/psychiatric:0/sleep_problems:0"
                                                label="Sleep problems"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/psychiatric:0/past_treatment_with_psychiatrist:0"
                                                label="Past treatment with Psychiatrist"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/psychiatric:0/change_in_mood_change_in_attitude_towards_family_friends:0"
                                                label="Change in mood/change in attitude towards family/friends"
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-context
                                                path="basicquestionnaire/symptom_sign_screening_questionnaire/psychiatric:0/time"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- </div> -->
                    </div>
                </div>

                <mb-context
                    path="basicquestionnaire/symptom_sign_screening_questionnaire/subject"
                />
                <mb-context
                    path="basicquestionnaire/symptom_sign_screening_questionnaire/language"
                />
                <mb-context
                    path="basicquestionnaire/symptom_sign_screening_questionnaire/encoding"
                />
                <mb-context path="basicquestionnaire/composer" />
                <mb-context path="basicquestionnaire/language" />
                <mb-context path="basicquestionnaire/territory" />
                <!-- <div class="form-check" >
                    <mb-checkbox style="color: red;"
                        path="basicquestionnaire/symptom_sign_screening_questionnaire/psychiatric:0/change_in_mood_change_in_attitude_towards_family_friends:0"
                        label="For better and faster diagnosis and care, your encounter with the Doctor need to be recored. By selecting this, you are concenting to be recorded."
                    />
                </div> -->
                <mb-submit>
                    <button class="btn custome-btn"> Submit </button>
                </mb-submit>
            </div>
        </div>
    </div>
</mb-form>
<style>
    ul li {
        margin-bottom:3px;
        margin-top:3px;
        font-size:7px;
    }
    li:nth-child(odd) { 
        background-color: rgb(224, 232, 235); 
    } 
    li:nth-child(even) { 
        background-color: rgb(200, 233, 243); 
    } 
</style>
