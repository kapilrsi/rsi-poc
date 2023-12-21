import axios from "axios"

// export const fhir =axios.create({ baseURL:"http://localhost:8090/fhir"});
// export const ehrbase =axios.create({ baseURL:"http://localhost:8080/ehrbase/rest/openehr/v1"});
// export const ehrscape =axios.create({ baseURL:"http://localhost:8080/ehrbase/rest/ecis/v1"});
// //export const extractSummary =axios.create({ baseURL:"http://10.131.85.60:5051/"});// origial
// export const extractSummary =axios.create({ baseURL:"http://10.131.85.60:5053/"});// new
// // export const extractSummary =axios.create({ baseURL:"http://10.131.85.60:5052/"});//MH
// export const keycloakurl = "http://10.131.85.60:8180/";

export const fhir =axios.create({ baseURL:"http://10.131.85.60:8090/fhir"});
export const ehrbase =axios.create({ baseURL:"http://10.131.85.60:8080/ehrbase/rest/openehr/v1"});
export const ehrscape =axios.create({ baseURL:"http://10.131.85.60:8080/ehrbase/rest/ecis/v1"});
//export const extractSummary =axios.create({ baseURL:"http://10.131.85.60:5051/"});// origial
export const extractSummary =axios.create({ baseURL:"http://10.131.85.60:5053/"});// new
// export const extractSummary =axios.create({ baseURL:"http://10.131.85.60:5052/"});//MH
export const keycloakurl = "http://10.131.85.60:8180/";
