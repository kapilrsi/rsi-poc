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
                    <h3>Ophthalmologic Evaluation</h3>
                </section>
                <section class="pageHeadSection">
                    <p style="float:left;"><b>{patientName} (DOB {dob})</b></p>
                    <p style="float:right;"><b>EHR ID: {ehrId}</b></p>
                </section>
                <div class="modal-body">
                    <mb-context path="ophthalmology_questionnaire/category"
                    ></mb-context>
                    <mb-context
                        path="ophthalmology_questionnaire/context/start_time"
                    ></mb-context>
                    <mb-context
                        path="ophthalmology_questionnaire/context/setting"
                    ></mb-context>
                    <div class="row">
                        <!-- <div class="accordion mt-5" id="accordionExample"> -->

                        <div class="col-md-4" style="width:24%;">
                            <h2 class="collapsible active rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >Are you bothered by any of the following?</span
                                >
                            </h2>
                            <div class="content" style="display:block;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/are_you_bothered_by_any_of_the_following_conditions:0/headaches:0"
                                                label="Headaches"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/are_you_bothered_by_any_of_the_following_conditions:0/double_vision:0"
                                                label="Double Vision"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/are_you_bothered_by_any_of_the_following_conditions:0/dry_burning_eyes:0"
                                                label="Dry/ Burning Eyes"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/are_you_bothered_by_any_of_the_following_conditions:0/itchy_eyes_due_to_seasonal_allergies:0"
                                                label="Itchy Eyes due to Seasonal Allergies"
                                            ></mb-checkbox>
                                        </div>
                                    </li>

                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/are_you_bothered_by_any_of_the_following_conditions:0/sensitivity_to_light:0"
                                                label="Sensitivity to Light"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/are_you_bothered_by_any_of_the_following_conditions:0/problems_with_glares:0"
                                                label="Problems with Glares"
                                            ></mb-checkbox>
                                        </div>
                                    </li>

                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/are_you_bothered_by_any_of_the_following_conditions:0/floaters_flashes_of_light:0"
                                                label="Floaters/ Flashes of Light"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/are_you_bothered_by_any_of_the_following_conditions:0/other_kinds_of_discomforts_with_your_eyes:0"
                                                label="Other Kinds of Discomforts with your Eyes"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                </ul>
                                <mb-context
                                    path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/are_you_bothered_by_any_of_the_following_conditions:0/time"
                                ></mb-context>
                            </div>
                        </div>

                        <div class="col-md-4" style="width:24%;">
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >Does anyone in your immediate family have:</span
                                >
                            </h2>
                            <div class="content" style="display:block;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/does_any_one_in_your_immediate_family_have:0/glaucomas:0"
                                                label="Glaucomas"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/does_any_one_in_your_immediate_family_have:0/diabetes:0"
                                                label="Diabetes"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/does_any_one_in_your_immediate_family_have:0/cataracts:0"
                                                label="Cataracts"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/does_any_one_in_your_immediate_family_have:0/degeneration:0"
                                                label="Macular Degeneration"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                </ul>
                                <mb-context
                                    path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/does_any_one_in_your_immediate_family_have:0/time"
                                ></mb-context>
                            </div>
                        </div>

                        <div class="col-md-4" style="width:24%;">
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >Please answer the following questions:</span
                                >
                            </h2>
                            <div class="content" style="display:block;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/please_answer_the_following_questions:0/do_you_have_more_than_one_pair_of_current_glasses:0"
                                                label="Do you have more than one pair of current glasses?"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/please_answer_the_following_questions:0/do_you_plan_to_look_for_new_glasses_today:0"
                                                label="Do you plan to look for new glasses today?"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/please_answer_the_following_questions:0/do_your_eyes_get_tired_after_working_on_a_computer:0"
                                                label="Do your eyes get tired after working on a computer?"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/please_answer_the_following_questions:0/do_you_indulge_in_any_sports_or_hobbies_where_you_eyes_require_special_protection:0"
                                                label="Do you indulge in any sports or hobbies where you eyes require special protection?"
                                            ></mb-checkbox>
                                        </div>
                                    </li>

                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/please_answer_the_following_questions:0/if_you_wear_contacts_are_you_satisfied_with_vision_or_comfort:0"
                                                label="If you wear contacts, are you satisfied with vision or comfort?"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/please_answer_the_following_questions:0/do_you_spend_a_lot_of_time_out_doors:0"
                                                label="Do you spend a lot of time out doors?"
                                            ></mb-checkbox>
                                        </div>
                                    </li>

                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/please_answer_the_following_questions:0/are_there_times_when_you_would_rather_not_wear_glasses:0"
                                                label="Are there times when you would rather not wear glasses?"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                </ul>
                                <mb-context
                                    path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/please_answer_the_following_questions:0/time"
                                ></mb-context>
                            </div>
                        </div>

                        <div class="col-md-4" style="width:24%;">
                            <h2 class="collapsible rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >Do you have or have had any of the
                                    following eye problems:</span
                                >
                            </h2>
                            <div class="content" style="display:block;">
                                <ul>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/do_you_have_or_have_you_had_any_of_the_following_eye_problems:0/glaucoma:0"
                                                label="Glaucoma"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/do_you_have_or_have_you_had_any_of_the_following_eye_problems:0/cataract:0"
                                                label="Cataract"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/do_you_have_or_have_you_had_any_of_the_following_eye_problems:0/macular_degeneration:0"
                                                label="Macular Degeneration"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/do_you_have_or_have_you_had_any_of_the_following_eye_problems:0/eye_surgery_injury:0"
                                                label="Eye surgery/ injury"
                                            ></mb-checkbox>
                                        </div>
                                    </li>

                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/do_you_have_or_have_you_had_any_of_the_following_eye_problems:0/lazy_eye_eye_turn:0"
                                                label="Lazy eye/ Eye turn"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                            <mb-checkbox
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/do_you_have_or_have_you_had_any_of_the_following_eye_problems:0/other_eye_diseases:0"
                                                label="Other eye diseases"
                                            ></mb-checkbox>
                                        </div>
                                    </li>
                                </ul>
                                <mb-context
                                    path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/do_you_have_or_have_you_had_any_of_the_following_eye_problems:0/time"
                                ></mb-context>
                            </div>
                        </div>

                        <mb-context
                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/subject"
                        ></mb-context>
                        <mb-context
                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/language"
                        ></mb-context>
                        <mb-context
                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/encoding"
                        ></mb-context>
                        <mb-context path="ophthalmology_questionnaire/composer"
                        ></mb-context>
                        <mb-context path="ophthalmology_questionnaire/language"
                        ></mb-context>
                        <mb-context path="ophthalmology_questionnaire/territory"
                        ></mb-context>
                    </div>
                    <br />
                    <div class="row">
                        <div class="col-md-4" style="width:48%;">
                            <h2 class="collapsible active rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >Ocular Exam</span
                                >
                            </h2>
                            <div class="row mb-4">
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/ocular_exam:0/visual_acuity_od:0"
                                            label="Visual Acuity(OD)"
                                        ></mb-input>
                                    </div>
                                </div>
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/ocular_exam:0/visual_acuity_os:0"
                                            label="Visual Acuity(OS)"
                                        ></mb-input>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-4">
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/ocular_exam:0/iop_tonoapplantation_od:0"
                                            label="IOP (OD) [mmHg]"
                                        ></mb-input>
                                    </div>
                                </div>
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/ocular_exam:0/iop_tonoapplantation_os:0"
                                            label="IOP (OS) [mmHg]"
                                        ></mb-input>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/ocular_exam:0/pupils:0"
                                            label="Pupils"
                                        ></mb-input>
                                    </div>
                                </div>
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/ocular_exam:0/extraocular_movements:0"
                                            label="Extraocular Movements"
                                        ></mb-input>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/ocular_exam:0/confrontational_visual_fields:0"
                                            label="Confrontational Visual Fields"
                                        ></mb-input>
                                    </div>
                                </div>
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/ocular_exam:0/external:0"
                                            label="External"
                                        ></mb-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <mb-context
                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/ocular_exam:0/time"
                        ></mb-context>
                        <div class="col-md-4" style="width:48%;">
                            <h2 class="collapsible active rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left">Slit Lamp</span
                                >
                            </h2>
                            <div class="row mb-4">
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/slit_lamp:0/lids_and_lashes:0"
                                            label="Lids and Lashes"
                                        ></mb-input>
                                    </div>
                                </div>
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/slit_lamp:0/conjunctiva_sclera:0"
                                            label="Conjunctiva/Sclera"
                                        ></mb-input>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/slit_lamp:0/cornea:0"
                                            label="Cornea"
                                        ></mb-input>
                                    </div>
                                </div>
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/slit_lamp:0/anterior_chamber:0"
                                            label="Anterior Chamber"
                                        ></mb-input>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/slit_lamp:0/iris:0"
                                            label="Iris"
                                        ></mb-input>
                                    </div>
                                </div>
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/slit_lamp:0/lens:0"
                                            label="Lens"
                                        ></mb-input>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/slit_lamp:0/anterior_vitreous:0"
                                            label="Anterior Vitreous"
                                        ></mb-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <mb-context
                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/slit_lamp:0/time"
                        ></mb-context>
                    </div>
                    <div class="row">
                        <div class="col-md-4" style="width:48%;">
                            <h2 class="collapsible active rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left"
                                    >Dilated Fundus Examination</span
                                >
                            </h2>

                            <div class="row mb-4">
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/dilated_fundus_examination:0/od:0"
                                            label="OD"
                                        ></mb-input>
                                    </div>
                                    <div class="col">
                                        <div
                                            data-mdb-input-init
                                            class="form-outline"
                                            style="height:auto;font-weight:bold;"
                                        >
                                            <mb-input
                                                path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/dilated_fundus_examination:0/os:0"
                                                label="OS"
                                            ></mb-input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4" style="width:48%;">
                            <h2 class="collapsible active rounded-3 shadow-lg">
                                <span class="col-xs-4 text-left">Others</span>
                            </h2>
                            <div class="row mb-4">
                                <div class="col">
                                    <div
                                        data-mdb-input-init
                                        class="form-outline"
                                        style="height:auto;font-weight:bold;"
                                    >
                                        <mb-input
                                            path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/other:0/other:0"
                                            label="Other"
                                        ></mb-input>
                                    </div>
                                </div>
                                <mb-context
                                    path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/dilated_fundus_examination:0/time"
                                ></mb-context>

                                <mb-context
                                    path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/other:0/time"
                                ></mb-context>
                                <mb-context
                                    path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/subject"
                                ></mb-context>
                                <mb-context
                                    path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/language"
                                ></mb-context>
                                <mb-context
                                    path="ophthalmology_questionnaire/symptom_sign_screening_questionnaire/encoding"
                                ></mb-context>
                                <mb-context
                                    path="ophthalmology_questionnaire/composer"
                                ></mb-context>
                                <mb-context
                                    path="ophthalmology_questionnaire/language"
                                ></mb-context>
                                <mb-context
                                    path="ophthalmology_questionnaire/territory"
                                ></mb-context>
                            </div>
                        </div>
                        <br /><br />
                        <mb-submit>
                            <button class="btn custome-btn"> Submit </button>
                        </mb-submit>
                    </div>
                </div>
            </div>
        </div>
    </div></mb-form
>
