<script lang="ts" context="module">
    import ProblemListV1 from "./ProblemListV1.svelte";
    import BasicQuestions from "./BasicQuestions.svelte";
    import EyesQuestions from "./EyesQuestions.svelte";
    export const forms: {
        name: string;
        id: string;
        component: any;
        opt: string;
    }[] = [
        {
            name: "Problem ListV1",
            id: "problem_listV1",
            component: ProblemListV1,
            opt: "problem_listV1.opt",
        },
        {
            name: "Basic Questions",
            id: "basic_questionnair",
            component: BasicQuestions,
            opt: "basic_questionnair.opt",
        },
        {
            name: "Opthal Questions",
            id: "Ophthalmology_Questionnaire",
            component: EyesQuestions,
            opt: "eyes_questionnair.opt",
        }
    ];


</script>

<!-- <div>
    
    {#each forms as form}
        <div class="bg-gray-100 flex p-3 m-3 border justify-between rounded-md">
            <Link class="font-medium" to={form.name.replaceAll(' ', '_')}>{form.name}</Link>
            <sl-tooltip content="Download Template">
                <sl-icon-button
                    download
                    href={`opts/${form.opt}`}
                    name="download"
                    label="Download"
                />
            </sl-tooltip>
        </div>
    {/each}
</div> -->
